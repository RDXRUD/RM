import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Observable} from 'rxjs';
import { skill } from './skill';
import { skillgroup } from './skillgroup';
import { file } from './file';
import { user } from './user';
import { userform } from './userform';
import { addskills } from './addskills';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  constructor(private http:HttpClient) { }
   getData():Observable<skill[]>{
     let url="https://localhost:7271/api/Employees/GetEmployees";
     return this.http.get<skill[]>(url);
  }
  getDetails():Observable<skillgroup[]>{
    let url="https://localhost:7271/api/SkillSet/GetSkillSet";
    return this.http.get<skillgroup[]>(url);
  }
  getUsers():Observable<user[]>{
    let url="https://localhost:7271/AllUser";
    return this.http.get<user[]>(url);
  }
  OnFile(formdata:file):Observable<file[]>{
    const formValues = new FormData();
    formValues.append('userName', formdata.userName);
    formValues.append('planFile', formdata.planFile);
     let url="https://localhost:7271/api/File/LoadFileData";
    return this.http.post<any>(url,formValues,{headers:{'Content-Disposition':'multipart/form-data'},});
  }
  OnUser(formdatas:userform):Observable<userform[]>{
    let url="https://localhost:7271/AddUser";
    return this.http.post<userform[]>(url,formdatas);
  }
  AddSkill(skilldata:addskills):Observable<addskills[]>{
    let url="https://localhost:7271/api/SkillSet/AddSkillSet";
    return this.http.post<addskills[]>(url,skilldata);
  }
  del(UserID:number){
    console.warn(UserID);
    let url="https://localhost:7271/DeleteUser";
    return this.http.delete(url, {body: {userId: UserID}});
  }
  Delete(id:number){
  console.warn(id);
  let url="https://localhost:7271/api/SkillSet/DeleteSkillSet";
  return this.http.delete(url,{body:{id:id}});
  }
 }

