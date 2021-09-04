const _ = require('lodash');
const jwt = require('jsonwebtoken');

const {User} = require('../../db/models');
const config = require('../../config');

module.exports = async (req, res, next) => {
    req.isAuth = true
    let {authorization} = req.headers;
    jwt.verify(authorization, config.auth.local.key, async (err, decoded) => {
        if (err || _.isNil(decoded)) {
            req.isAuth = false
            return next();
        }
        try {
            const obj = decoded;
            if (_.isNil(obj.roles)) {
                req.isAuth = false
                return next();
            }
            const user = await User.getOne({id: obj.sub});
            if (_.isNil(user)) {
                req.isAuth = false
                return next();
            }
            req.user = user;
            req.user_id = String(user.id);
            next();
        } catch (e) {
            next(e);
        }

    });

};
