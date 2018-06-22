import ResourceFactory from './../resources/ResourceFactory';
import Validator from './Validator';

export default class ControllerBase {
  protected resourceFactory: ResourceFactory;
  protected validatonErrors: any;

  constructor(resourceFactory: ResourceFactory) {
    this.resourceFactory = resourceFactory;
  }

  validate(data: any, schemaName: string) {
    const validator = new Validator(schemaName);
    const valid = validator.validate(data);
    if (!valid) {
      this.validationErrors = validator.errors;
    }
    return valid;
  }
}
