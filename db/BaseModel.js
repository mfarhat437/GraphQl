/* eslint-disable max-len */

const _ = require('lodash');

class BaseModel {
    constructor(model) {
        this.model = model;
    }


    async getDocumentsCount() {
        return this.model.findAndCountAll();
    }

    async getCount(query, options) {
        try {
            return this.model.findAndCountAll(query, options);
        } catch (err) {
            throw err;
        }
    }

    async create(data, transaction) {
        const q = this.model.create(data, transaction || {});
        return q
    }

    async update(data, query, transaction) {
        const q = this.model.update(data, query, transaction);
        return q
    }


    async getAll(query, params = {}, paginate = true) {
        try {
            const {page, limit, sort} = params;
            let queryWithPagination = query

            if (paginate) {
                queryWithPagination = query
                let pageCount = page ? parseInt(page) - 1 : 0;
                queryWithPagination.offset = ((parseInt(limit) * parseInt(pageCount)));
                queryWithPagination.limit = (parseInt(limit));
            }
            let result = await this.model.findAll(queryWithPagination || {});
            if (paginate) {
                let count;
                if (_.isEmpty(query)) {
                    count = await this.getDocumentsCount();
                } else {
                    count = await this.getCount(query || {});
                }

                const pagesCount = Math.ceil(count / limit) || 1;
                result = {
                    data: result,
                    page: parseInt(page),
                    pages: pagesCount,
                    length: count,
                };
            }

            return result;
        } catch (err) {
            throw err;
        }
    }


    async getOne(query, params) {
        const q = this.model.findOne(query || {});
        return q
    }

    async decrement(key, query, transaction) {
        const q = this.model.decrement(key, query, transaction);
        return q
    }


}

module.exports = BaseModel;
