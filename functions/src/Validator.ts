import { Ajv } from 'ajv';
const ajv = require('ajv');
import validationSchemas from './../config/validationSchemas';

export default class Validator {
  private validator: Ajv;
  private schemaName: string;

  constructor(schemaName: string) {
    if (!(schemaName in validationSchemas)) {
      throw `${schemaName} not found`;
      return;
    }
    this.validator = ajv();
    this.validator.addSchema(validationSchemas[schemaName], schemaName);
    this.schemaName = schemaName;
  }

  validate(data: Object) {
    return this.validator.validate(this.schemaName, data);
  }

  errors() {
    return this.validator.errors;
  }

  getErrorResponse() {
    return {
      status: 400,
      payload: { errors: this.errors() },
    };
  }
}
