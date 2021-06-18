const Joi =require('@hapi/joi');
const registerValidation=function(data){
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email().min(6),
        picture:Joi.object(),
        password: Joi.string().min(6),
        age:Joi.string(),
        city:Joi.string(),
        gender:Joi.string(),
        phone:  Joi.string().min(9),
        setting:Joi.object(),
        authMail:Joi.boolean(),
    })
    return schema.validate(data);
}

module.exports.registerValidation=registerValidation;