import Joi from "joi";

export const createBlogValidator = Joi.object({
  name: Joi.string().max(255).required(),
  slug: Joi.string()
    .regex(/^[a-z](-?[a-z])*$/)
    .max(255)
    .required(),
  posts: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().max(255).optional(),
        content: Joi.string().max(5000).required(),
      }),
    )
    .optional(),
});
