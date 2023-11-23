export interface ICommonReturnType {
  // Define common properties or methods here
}
export class CrossTabResult implements ICommonReturnType {
    res_name!: string;
    res_email_id!:string;
    allocationData!: { [key: string]: number };
  }