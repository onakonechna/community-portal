export default interface ResourceInterface {

   create(data: any): Promise<any>;
   get(data: any): Promise<any>;
   getById(data: any): Promise<any>;
   update(data: any): Promise<any>;
   delete(data: any): Promise<any>;

}
