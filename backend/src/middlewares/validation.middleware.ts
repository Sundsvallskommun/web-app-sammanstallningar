import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';

const getAllNestedErrors = (error: ValidationError): string | string[] | undefined => {
  if (error.constraints) {
    return Object.values(error.constraints);
  }
  return error.children?.map(getAllNestedErrors).join(',');
};

export const validationMiddleware = (
  type: any,
  value: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, _res, next) => {
    const payload = req[value] as unknown;
    const obj = plainToInstance(type, payload);
    validate(obj as object, { skipMissingProperties, whitelist, forbidNonWhitelisted }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map(getAllNestedErrors).join(', ');
          next(new HttpException(400, message));
        } else {
          next();
        }
      },
    );
  };
};
