const BaseService = require('../BaseService');
const {
    Product,
} = require("../../db/models/index");

class ProductService extends BaseService {


    async create(data) {
        try {
            return await Product.create(data)
        } catch (e) {
            throw e
        }
    }

    async getProducts(params, pagination = false) {

        let query = {}
        if (params.seller) {
            query.where = {seller: params.seller}
        }
        if (params.priceOrder) {
            query.order = [["price", params.priceOrder]]
        }
        let paginate = pagination

        const products = await Product.getAll(query, params, paginate)
        return products

    }

    async getProductById(productId) {
        const product = await Product.getOne({where: {id: productId}})
        if (!product)
            throw new this.NotFoundError(0, `product doesn't exist`)
        return product
    }

}

module.exports = new ProductService()