const Joi = require("joi");

class ValidationSchemas {
  static newPost = Joi.object({
    content: Joi.string().required().not().empty(),
    images: Joi.array().items(Joi.string()).optional(),
    hashTags: Joi.array().items(Joi.string()).optional(),
  });

  static likePost = Joi.object({
    postID: Joi.string().required(),
    action: Joi.string().valid("like", "comment", "unlike", "share").required(),
  });

  static search = Joi.object({
    name: Joi.string().trim().min(1).required().messages({
      "string.empty": "Search name cannot be empty",
      "string.min": "Search name must be at least 1 character long",
      "any.required": "Search name is required",
    }),

    type: Joi.string().valid("artist", "track").required().messages({
      "string.empty": "Search type cannot be empty",
      "any.required": "Search type is required",
      "any.only": 'Search type must be either "artist" or "track"',
    }),
  });
}
module.exports = ValidationSchemas;
