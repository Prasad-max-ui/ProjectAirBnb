const Joi = require("joi")

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
}).required();

const reviewSchema = Joi.object({
    reviews : Joi.object({
    rating : Joi.number().min(0).max(5).required(),
    comment : Joi.string().required()
    }).required()
}).required();

module.exports = listingSchema;
module.exports = reviewSchema;