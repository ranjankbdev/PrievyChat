import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';

const validateSchema = (schema) => {
  return (req, res, next) => {
    const data = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    };
    const { error } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(',');
      throw new ExpressError(StatusCodes.BAD_REQUEST, errMsg);
    }
    next();
  };
};
export { validateSchema };
