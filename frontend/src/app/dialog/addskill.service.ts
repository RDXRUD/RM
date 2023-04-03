import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skillgroup } from './skillgroup';
import { skill } from './skill';

@Injectable({
  providedIn: 'root'
})
export class AddskillService {

  constructor(private http:HttpClient) { }
  getData():Observable<skillgroup[]>{
    let url="https://localhost:7271/api/SkillSet/GetSkillGroup";
    return this.http.get<skillgroup[]>(url);
  }
  getDatas():Observable<skill[]>{
    let url="https://localhost:7271/api/SkillSet/GetSkill";
    return this.http.get<skill[]>(url);
  }
}