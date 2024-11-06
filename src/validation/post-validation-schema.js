const Joi = require("joi");

class PostValidationSchema {
  static newPost = Joi.object({
    content: Joi.string().required().not().empty(),
    images: Joi.array().items(Joi.string()).optional(),
  });
}
module.exports = PostValidationSchema;
