import {ValidationError} from 'sequelize';
import {map} from 'lodash';

const VALIDATION_ERROR = 'VALIDATION_ERROR';

export default function createErrorResponse(error) {
  if (error instanceof ValidationError) {
    return {
      statusCode: 422,
      data: {
        code: VALIDATION_ERROR,
        message: error.toString(),
        validationErrors: map(error.errors, 'path')
      }
    };
  }
  return error;
}
