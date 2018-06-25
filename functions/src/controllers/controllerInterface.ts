interface ControllerInterface {
  validate(data: any, schemaName: string): boolean;
}

interface ControllerHandlers {
  transform: (result: any) => any;
  terminate: (error: Error) => {status: number, payload: any};
}

export {
  ControllerInterface,
  ControllerHandlers,
}
