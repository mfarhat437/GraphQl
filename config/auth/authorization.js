const AccessControl = require('accesscontrol');
const RESOURCE_NAMES = require('./resource_names');
const {ROLES_NAMES} = require('./roles');
//uploadingFiles.personal_files
const grantsObject = {
    [ROLES_NAMES.ADMIN]: {},
    [ROLES_NAMES.CUSTOMER]: {
        [RESOURCE_NAMES.PRODUCT]: {
            'read:any': ['*'], 'create:any': ['*']
        },

    },

};
module.exports = new AccessControl(grantsObject);
