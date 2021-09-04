const {NOTIFICATION_TYPES} = require('../config/constants/notification');
const {RESERVATION_STATUS_ENUM} = require('../config/constants/reservation');
const {CATEGORY_TYPES_ENUM} = require('../config/constants/category');
const {RATE_TYPES_ENUM} = require('../config/constants/rate');
const {ROLE_NAMES_ENUM, ROLES_NAMES} = require('../config/auth/roles');
const Joi = require('joi')

module.exports = {
    orderSchema: Joi.object().keys({
        guests: Joi.number().default(1),
        type: Joi.number().valid(1, 2).required(),
        branch_id: Joi.string().required(),
        kitchen_notes: Joi.string(),
        table_id: Joi.when('type', {
            is: Joi.number().valid(1),
            then: Joi.string().required()
        }),
        reservation_id: Joi.when('type', {
            is: Joi.number().valid(1),
            then: Joi.string().required()
        }),
        kitchen_notes: Joi.string(),
        due_at: Joi.when('type', {
            is: Joi.number().valid(2),
            then: Joi.string().pattern(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/).required()
        }),
        customer_notes: Joi.string(),
        customer_address_id: Joi.string(),
        customer_id: Joi.string(),
        products: Joi.array().items(
            Joi.object().keys({
                product_id: Joi.string().required(),
                quantity: Joi.number().min(1).required(),
                unit_price: Joi.number().required(),
                total_price: Joi.number().required(),
                discount_id: Joi.string(),
                discount_amount: Joi.number(),
                discount_type: Joi.number(),
                kitchen_notes: Joi.string().max(74),
                options: Joi.array().items(
                    Joi.object().keys({
                        modifier_option_id: Joi.string().required(),
                        quantity: Joi.number().required(),
                        unit_price: Joi.number().required(),
                        total_price: Joi.number().required(),
                        taxes: Joi.array().items(
                            Joi.object().keys({
                                id: Joi.string().required(),
                                amount: Joi.number().required(),
                                rate: Joi.number().required(),
                            }),
                        ).required(),

                    }),
                ),
                taxes: Joi.array().items(
                    Joi.object().keys({
                        id: Joi.string().required(),
                        amount: Joi.number().required(),
                        rate: Joi.number().required(),
                    }),
                ),
            })
        ).required(),
        tax: Joi.object().keys({
            rate: Joi.number(),
            amount: Joi.number(),
            name: Joi.string(),
            name_localized: Joi.string(),
            rate: Joi.number()
        }),
        // payments: Joi.array().items(
        //     Joi.object().keys({
        //         amount: Joi.number(),
        //         tendered: Joi.number(),
        //         payment_method_id: Joi.string().required(), //cash
        //         tips: Joi.number().default(0)
        //     })
        // ).required(),
        subtotal_price: Joi.number(),
        discount_amount: Joi.number(),
        discount_type: Joi.number(),
        rounding_amount: Joi.number(),
        total_price: Joi.number()
    }).options({stripUnknown: true}),
    orderPriceCalculatorSchema: Joi.object().keys({
        type: Joi.number().valid(1, 2).required(),
        branch_id: Joi.string(),
        table_id: Joi.string(),
        kitchen_notes: Joi.string(),
        products: Joi.array().items(
            Joi.object().keys({
                product_id: Joi.string().required(),
                quantity: Joi.number().min(1).required(),
                kitchen_notes: Joi.string(),
                options: Joi.array().items(
                    Joi.object().keys({
                        modifier_option_id: Joi.string().required(),
                        quantity: Joi.number().min(1).required(),
                        unit_price: Joi.number().min(0).required(),
                    }),
                ),
            })
        ).required(),
    }).options({stripUnknown: true}),
    registrationSchema: Joi.object().keys({
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        password: Joi.string().min(8).required(),
        password_confirm: Joi.string().min(8).required(),
        email: Joi.string().email(),

    }).options({stripUnknown: true}),
    verifySchema: Joi.object().keys({
        mobile: Joi.string().required(),
        mobile_token: Joi.string().required(),

    }).options({stripUnknown: true}),
    resendCodeSchema: Joi.object().keys({
        mobile: Joi.string().required(),
    }).options({stripUnknown: true}),
    loginSchema: Joi.object().keys({
        mobile: Joi.string().required(),
        password: Joi.string().required(),
        fcm_token: Joi.string(),

    }).options({stripUnknown: true}),
    reservationsSchema: Joi.object().keys({
        guests: Joi.number().min(1).required(),
        branch_id: Joi.string().required(),
        kitchen_notes: Joi.string(),
        due_at: Joi.string().pattern(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/),
        table_id: Joi.string().required(),
        customer_notes: Joi.string(),
        total_price: Joi.number(),
    }).options({stripUnknown: true}),
    changePasswordSchema: Joi.object().keys({
        old_password: Joi.string().min(8).required()
        //     .error(errors => {
        //     errors.forEach(err=>{
        //         err.message='invalid old pass';
        //         err.message_ar='الرقم السري القديم غير صالح';
        //     })
        //     return errors
        // })
        ,
        new_password: Joi.string().min(8).required(),
        new_password_confirm: Joi.string().min(8).required(),
    }).options({stripUnknown: true}),
    idSchema: Joi.object().keys({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    }).options({stripUnknown: true}),
    updateProfileSchema: Joi.object().keys({
        name: Joi.string(),
        mobile: Joi.string(),
        email: Joi.string().email(),
        gender: Joi.string().valid('male', 'female'),
        language: Joi.string().valid('ar', 'en'),
        profile_image: Joi.string(),
        birth_date: Joi.string().regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/),
        fcm_token: Joi.string(),
        allow_offers_news: Joi.boolean(),
        allow_text_messages: Joi.boolean(),
        allow_phone_calls: Joi.boolean(),
        allow_notifications: Joi.boolean(),
        fcm_tokens: Joi.array().items(Joi.string())
    }).options({stripUnknown: true}),
    twitterRegistrationSchema: Joi.object().keys({
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        twitterId: Joi.string().required(),
        email: Joi.string().email(),
        profile_image: Joi.string().uri(),

    }).options({stripUnknown: true}),
    snapchatRegistrationSchema: Joi.object().keys({
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        snapchatId: Joi.string().required(),
        email: Joi.string().email(),
        profile_image: Joi.string().uri(),

    }).options({stripUnknown: true}),
    instagramRegistrationSchema: Joi.object().keys({
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        instagramId: Joi.string().required(),
        email: Joi.string().email(),
        profile_image: Joi.string().uri(),

    }).options({stripUnknown: true}),
    forgetPasswordSchema: Joi.object().keys({
        mobile: Joi.string().required(),
    }).options({stripUnknown: true}),

    resetPasswordSchema: Joi.object().keys({
        new_password: Joi.string().min(8).required(),
        new_password_confirm: Joi.string().min(8).required(),
    }).options({stripUnknown: true}),
    configurationSchema: Joi.object().keys({
        food_preperation_time_in_minutes: Joi.number().min(1),
        drinks_preperation_time_in_minutes: Joi.number().min(1),
        waiting_time_in_minutes: Joi.number().min(1),
        reservation_start_time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        reservation_end_time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        reservation_time_slots_difference_in_minutes: Joi.number().min(15),
        contact_email: Joi.string().email(),
        contact_mobile: Joi.string(),
        contact_whatsapp: Joi.string(),
        notify_message_for_closing_slot: Joi.string().trim().min(3),
        default_category_preparation_time: Joi.number().min(1),
        max_pending_pickup_orders: Joi.number().min(1),
        min_time_in_minutes_before_cancelling_reservation: Joi.number().min(1),
        translation: Joi.object().keys({
            ar: Joi.object().keys({
                notify_message_for_closing_slot: Joi.string().trim().min(3),
            })
        }),
        pickup_calculations: Joi.object().keys({
            orders_capacity: Joi.number().min(1),
            buffer_time_in_minutes: Joi.number().min(1),
            time_to_calculate_capacity_in_minutes: Joi.number().min(1)
        }),
        loyalty_configuration: Joi.object().keys({
            min_points_to_redeem: Joi.number().min(1),
            redeem_points_converting_to_one_currency: Joi.number().integer().min(1),
            earning_currencies_converting_to_one_point: Joi.number().integer().min(1),
            days_to_redeem_expiry: Joi.number().integer().min(0)
        })

    }).options({stripUnknown: true}),
    addressSchema: Joi.object().keys({
        address: Joi.string().min(4).required(),
        default: Joi.boolean(),
    }).options({stripUnknown: true}),
    reservationSchema: Joi.object().keys({
        date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
        time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        seats: Joi.number().min(1).required(),
        branchId: Joi.string().required(),
        comment: Joi.string().trim(),
    }).options({stripUnknown: true}),
    reservationTimeSlotsQuerySchema: Joi.object().keys({
        date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
    }).options({stripUnknown: true}),
    testNotificationSchema: Joi.object().keys({
        title: Joi.string().required(),
        message: Joi.string().required(),
        fcm_token: Joi.string().required(),
    }).options({stripUnknown: true}),
    contactUsSchema: Joi.object().keys({
        subject: Joi.string().trim().min(3).required(),
        message: Joi.string().trim().min(3).max(500).required(),
        user_name: Joi.string().trim().min(3).required(),
        user_mobile: Joi.string().required(),
    }).options({stripUnknown: true}),
    issueReportingSchema: Joi.object().keys({
        message: Joi.string().trim().min(3).max(500).required(),
        user_name: Joi.string().trim().min(3).required(),
        user_mobile: Joi.string().required(),
    }).options({stripUnknown: true}),
    frequentlyQuestionSchema: Joi.object().keys({
        question: Joi.string().trim().min(3).max(500).required(),
        answer: Joi.string().trim().min(3).max(500).required(),
        translation: Joi.object().keys({
                ar: Joi.object().keys({
                    question: Joi.string().trim().min(3).max(500).required(),
                    answer: Joi.string().trim().min(3).max(500).required(),
                })
            }
        )
    }).options({stripUnknown: true}),
    branchConfigurationSchema: Joi.object().keys({
        reservation_start_time: Joi.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        reservation_end_time: Joi.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        seats_number_per_slot: Joi.number().min(1).required(),
        reservation_time_slot_in_minutes: Joi.number().min(1).required(),
        max_days_for_upcomming_reservations: Joi.number().min(1).required(),
        reservation_cancellation_time_slot_in_minutes: Joi.number().min(1).required(),
        min_time_in_minutes_before_making_reservation: Joi.number().min(1).required(),
        address: Joi.string().min(1).required(),
    }).options({stripUnknown: true}),
    dateConfigurationSchema: Joi.object().keys({
        date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
        reservation_start_time: Joi.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        reservation_end_time: Joi.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        seats_number_per_slot: Joi.number().min(1),
        reservation_time_slot_in_minutes: Joi.number().min(1),
        reservation_cancellation_time_slot_in_minutes: Joi.number().min(1),
        min_time_in_minutes_before_making_reservation: Joi.number().min(1),
        max_days_for_upcomming_reservations: Joi.number().min(1),
        closed_slots: Joi.array().items(Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/))
    }).options({stripUnknown: true}),
    closeOrOpenTimeSlotSchema: Joi.object().keys({
        date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
        time: Joi.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        type: Joi.string().valid('open', 'close').required(),
    }).options({stripUnknown: true}),
    reservationTimeSlotsForDaysQuerySchema: Joi.object().keys({
        dates: Joi.array().items(Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required()).required(),
    }).options({stripUnknown: true}),
    verifyReservationSchema: Joi.object().keys({
        mobile_token: Joi.string().required(),

    }).options({stripUnknown: true}),
    addFcmTokenSchema: Joi.object().keys({
        fcm_token: Joi.string().min(1).required(),
        userId: Joi.string(),
        uuid: Joi.string().required(),
        type: Joi.string(),

    }).options({stripUnknown: true}),
    updateReservationStatus: Joi.object().keys({
        status: Joi.string().valid(...RESERVATION_STATUS_ENUM).required(),
        seats: Joi.number().min(1),

    }).options({stripUnknown: true}),
    tableFilterSchema: Joi.object().keys({
        name: Joi.string().min(1).required(),

    }).options({stripUnknown: true}),
    pickupConfirmationTimeSchema: Joi.object().keys({
        branch_id: Joi.string(),
        categoriesIds: Joi.array().items(
            Joi.string()
        ).required(),
        due_at: Joi.string().pattern(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/).required(),

    }).options({stripUnknown: true}),
    categoryTypeSchema: Joi.object().keys({
        type: Joi.string().valid(...CATEGORY_TYPES_ENUM).required(),

    }).options({stripUnknown: true}),
    favoriteSchema: Joi.object().keys({
        productId: Joi.string().required(),
        type: Joi.string().valid('add', 'remove').required()

    }).options({stripUnknown: true}),
    cancelOrderSchema: Joi.object().keys({
        canceling_reason: Joi.string(),

    }).options({stripUnknown: true}),
    cartSyncSchema: Joi.object().keys({
        productIds: Joi.array().items(Joi.string().required()).required(),

    }).options({stripUnknown: true}),
    sendNotificationSchema: Joi.object().keys({
        type: Joi.string().valid(NOTIFICATION_TYPES.NEW_OFFER, NOTIFICATION_TYPES.GENERAL).required(),
        title: Joi.string().trim().min(1).required(),
        message: Joi.string().trim().min(1).required(),
        users: Joi.array().items(Joi.string()),
        image: Joi.array().items(Joi.string())

    }).options({stripUnknown: true}),

    checkSocialMediaIdSchema: Joi.object().keys({
        socialId: Joi.string().required(),
        socialType: Joi.string().required(),

    }).options({stripUnknown: true}),
    rateSchema: Joi.object().keys({
        rates: Joi.array().items(Joi.object().keys({
            rate: Joi.number().min(1).max(5).required(),
            comment: Joi.string().min(3),
            rated: Joi.string().required(),
            type: Joi.string().valid(...RATE_TYPES_ENUM).required(),

        }).options({stripUnknown: true})).required()
    }),
    createRewardSchema: Joi.object().keys({
        points: Joi.number().min(1).required(),
    }).options({stripUnknown: true}),
    checkRewardSchema: Joi.object().keys({
        customer_mobile_number: Joi.string().trim().required(),
        mobile_country_code: Joi.string().trim().required(),
        customer_mobile_number: Joi.string().trim().min(1).required(),
        business_reference: Joi.string().trim().required(),
    }).options({stripUnknown: true}),
    confirmRedeemSchema: Joi.object().keys({
        branch_id: Joi.string().trim().required(),
        order_id: Joi.string().trim().required(),
        discount_amount: Joi.number().min(1).required(),
        customer_mobile_number: Joi.string().trim().required(),
        mobile_country_code: Joi.string().trim().required(),
        customer_mobile_number: Joi.string().trim().min(1).required(),
        business_reference: Joi.string().trim().required(),
    }).options({stripUnknown: true}),
    createUserSchema: Joi.object().keys({
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        type: Joi.string().valid(...ROLE_NAMES_ENUM).required(),
        password: Joi.string().min(8).required(),
        password_confirm: Joi.string().min(8).required(),
        branches: Joi.when('type', {
            is: Joi.number().valid(ROLES_NAMES.BRANCH_MANAGER),
            then: Joi.array().items(Joi.string()).unique().required()
        }),

    }).options({stripUnknown: true}),
    reportQuerySchema: Joi.object().keys({
        date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
        start_date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
        end_date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
    }).options({stripUnknown: true}),

};
