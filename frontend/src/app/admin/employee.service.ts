import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Observable} from 'rxjs';
import { skill } from './skill';
import { skillgroup } from './skillgroup';
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
 }
