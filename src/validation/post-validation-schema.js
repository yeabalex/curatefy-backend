const Joi = require("joi");

class PostValidationSchema {
  static newPost = Joi.object({
    content: Joi.string().required().not().empty(),
    images: Joi.array().items(Joi.string()).optional(),
    hashTags: Joi.array().items(Joi.string()).optional(),
  });

  static likePost = Joi.object({
    postID: Joi.string().required(),
    action: Joi.string().valid("like", "comment", "unlike", "share").required(),
  });
}
module.exports = PostValidationSchema;
