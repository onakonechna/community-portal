interface ResourceInterface {
  validate(data: any, schemaName: string): boolean;
}

interface ControllerHandlers {
  resolve: (request: Promise<any>) => {status: number, payload: any};
  reject: (request: Promise<any>) => {status: number, payload: any};
}

export {
  ResourceInterface,
  ControllerHandlers,
}
