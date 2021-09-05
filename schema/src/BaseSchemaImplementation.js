class BaseSchemaImplementation {
    constructor() {
        this.rootQuery();
        this.rootMutation();
    }

    async rootQuery() {
        throw 'should implement this first';
    }
    async rootMutation() {
        throw 'should implement this first';
    }
}

module.exports =  BaseSchemaImplementation;
