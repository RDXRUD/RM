import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Observable} from 'rxjs';
import { skill } from './skill';
import { skillgroup } from './skillgroup';
import { file } from './file';
import { HttpHeaders } from '@angular/common/http';
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
     let url="https://localhost:7271/api/File/GetFileData";
    return this.http.post<file[]>(url,formdata,{headers:{'Content-Type':'multipart/form-data'},});//, {headers: myheader)});
  }
 }
