module.exports = {
    app: {
        ios_version: 1,
        android_version: 1,
        version: '0.0.0',
        version_code: 0,
        is_mandatory: true,
        name: 'graphql',
    },
    port: 3000,
    // db: {
    //     url: `bxxseoanrltzr83nwtti-mysql.services.clever-cloud.com`, //
    //     db_name:"bxxseoanrltzr83nwtti",
    //     username:"uflykyd4llkkylup",
    //     password:"fuRvJOwJBkemNj893r5Q"
    //
    // },
    db: {
        url: `remotemysql.com`, //
        db_name: "bBBoL3liGa",
        username: "bBBoL3liGa",
        password: "7JRddqsvyG"

    },


    auth: {
        local: {
            key: 'ZAZDp1IxnPigN9gX4VgiuFl5hSlqSpFaa103S4JsWPGhIKzkMh6vmEiDUbolPeEcVYpN0tN1zkdRE2S3GeOd'
        }
    },
    NODE_ENV: 'development',
}