export default interface AdapterInterface {

  create(tableName: string, data: any): Promise<any>;
  get(
     tableName: string,
     key: string,
     value: string|number,
     indexName?: string,
     ascending?: boolean,
     limit?: number,
     projectionExpression?: string,
   ): Promise<any>;
  getById(tableName: string, identifier: any): Promise<any>;
  update(tableName: string, identifier: any, data: any): Promise<any>;
  add(tableName: string, identifier: any, field: string, increment: number): Promise<any>;
  delete(tableName: string, identifier: any): Promise<any>;

}
