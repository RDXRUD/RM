import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { updateskill } from './updateskill';
import { UpdateskillsService } from './updateskills.service';
import { updateskillgroup } from './updateskillgroup';
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
