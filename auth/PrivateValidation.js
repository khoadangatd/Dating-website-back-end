const Joi =require('@hapi/joi');
const privateValidation=function(data){
    const schema = Joi.object({
        name: Joi.string().required(),
        gender: Joi.string().required(),
        age: Joi.string().required(),
        phone: Joi.string().min(9).required(),
        passwordold: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    })
    return schema.validate(data);
}

module.exports.privateValidation=privateValidation;