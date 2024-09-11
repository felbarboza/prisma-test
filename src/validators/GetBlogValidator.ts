import Joi from "joi";

export const getBlogBySlugSchema = Joi.object({
  slug: Joi.string()
    .regex(/^[a-z](-?[a-z])*$/)
    .max(255)
    .required(),
  includePosts: Joi.boolean().optional(),
});

export const getBlogByIdSchema = Joi.object({
  id: Joi.number().required(),
  includePosts: Joi.boolean().optional(),
});
