import { Ajv } from 'ajv';
const ajv = require('ajv');
import ValidationSchemas from './../config/ValidationSchemas';

export default class Validator {
  private validator: Ajv;
  private schemaName: string;

  constructor(schemaName: string) {
    if (!(schemaName in ValidationSchemas)) {
      throw `${schemaName} not found`;
      return;
    }
    this.validator = ajv();
    this.validator.addSchema(ValidationSchemas[schemaName], schemaName);
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
