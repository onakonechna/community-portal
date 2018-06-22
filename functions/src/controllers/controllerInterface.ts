interface ControllerInterface {
  validate(data: any, schemaName: string): boolean;
}

interface ControllerHandlers {
  resolve: (result: any) => {status: number, payload: any};
  reject: (error: Error) => {status: number, payload: any};
}

export {
  ControllerInterface,
  ControllerHandlers,
}
