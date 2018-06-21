export default interface ResourceInterface {

   create(data: any): Object;
   get(data: any): Object;
   getById(data: any): Object;
   update(data: any): Object;
   delete(data: any): Object;

}
