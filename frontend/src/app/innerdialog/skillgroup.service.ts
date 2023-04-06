import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { update } from './update';
import { updateskill } from './updateskill';
import { updateskillgroup } from './updateskillgroup';
import { skillgroup } from '../admin/skillgroup';
@Injectable({
  providedIn: 'root'
})
export class SkillgroupService {

  constructor(private http:HttpClient) { }
  getData():Observable<updateskillgroup[]>{
    let url="https://localhost:7271/api/SkillSet/GetSkillGroup";
    return this.http.get<updateskillgroup[]>(url);
  }
  getDatas():Observable<updateskill[]>{
    let url="https://localhost:7271/api/SkillSet/GetSkill";
    return this.http.get<updateskill[]>(url);
   }
  }
