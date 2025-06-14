import Joi from "joi";

export const fileUploadSchema = Joi.object({
  file: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string().required(),
    buffer: Joi.binary().required(),
    size: Joi.number().required(),
  })
    .required()
    .unknown(),
});

export const planSchema = Joi.object({
  title: Joi.string().required(),
  subject: Joi.string().required(),
  grade: Joi.string().required(),
  duration: Joi.string().required(),
  objectives: Joi.string().required(),
  activities: Joi.string().required(),
  resources: Joi.string().required(),
  evaluation: Joi.string().required(),
  homework: Joi.string().allow(null, ""),
  notes: Joi.string().allow(null, ""),
  file: Joi.object().optional(),
});
