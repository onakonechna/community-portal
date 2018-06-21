export default interface ResourceInterface {

   create(data: any): Promise<Object>;
   get(data: any): Promise<Object>;
   getById(data: any): Promise<Object>;
   update(data: any): Promise<Object>;
   delete(data: any): Promise<Object>;

}
