const { Schema, model } = require('mongoose');
const Joi = require('joi');

const categorySchema = Schema({
    category: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    income: {
        type: Boolean,
        default: true,
    }
});

const joiCategorySchema = Joi.object({
    category: Joi.string().required(),
    alias: Joi.string().required(),
    icon: Joi.string().required(),
});

const Category = model('category', categorySchema);

module.exports = {
    Category,
    joiCategorySchema
};