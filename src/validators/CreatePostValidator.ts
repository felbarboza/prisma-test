import Joi from "joi";

export const createPostValidator = Joi.object({
  title: Joi.string().max(255).optional(),
  content: Joi.string().max(255).required(),
  blogId: Joi.number().required(),
});
