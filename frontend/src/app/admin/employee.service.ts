import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Observable} from 'rxjs';
import { skill } from './skill';
import { skillgroup } from './skillgroup';
import { file } from './file';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }
   getData():Observable<skill[]>{
     let url="https://localhost:7271/api/Employees";
     return this.http.get<skill[]>(url);
  }
  getDetails():Observable<skillgroup[]>{
    let url="https://localhost:7271/api/SkillSet";
    return this.http.get<skillgroup[]>(url);
  }
  OnFile(formdata:file):Observable<file[]>{
    //  let headers=new HttpHeaders();
    //  headers=headers.append('Content-Type','multipart/form-data');
    //  headers=headers.append('enctype','multipart/form-data');
    const formValues = new FormData();
    formValues.append('userName', formdata.userName);
    formValues.append('planFile', formdata.planFile);
     let url="https://localhost:7271/api/File/LoadFileData";
    return this.http.post<any>(url,formValues,{headers:{'Content-Disposition':'multipart/form-data'},});//, {headers: myheader)});
  }
 }
