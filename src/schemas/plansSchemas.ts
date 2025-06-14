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
