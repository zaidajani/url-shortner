const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    }, 
    redirectId: {
        type: String,
        required: true,
        unique: true
    }
});

const Model = mongoose.model('redirects', schema);

function validate(data) {
    const schema = {
        url: Joi.string().required(),
        redirectId: Joi.string().required()
    }

    return Joi.validate(data, schema);
}

exports.schema = schema;
exports.Model = Model;
exports.validate = validate;