export interface User {
  id?:string;
  email:string;
  password:string;
  username:string;
  imageProfile:string;
  admin?:boolean;
  news:boolean;
  securityQuestion?:string;
}
