const Joi=require('joi');

module.exports.discussionSchema=Joi.object({
    discussion:Joi.object({
        title:Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.replySchema=Joi.object({
    reply:Joi.object({
        body:Joi.string().required()
    })
}).required()

