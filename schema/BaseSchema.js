class BaseSchema {
    constructor(rootQuery, rootMutation) {
        this.rootQuery = rootQuery;
        this.rootMutation = rootMutation;
    }
}

module.exports = BaseSchema;
