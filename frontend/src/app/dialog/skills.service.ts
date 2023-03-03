import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Observable} from 'rxjs';
import { skillset } from './skillset';
@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor(private http:HttpClient) {}
  getSkill(emailID:any):Observable<skillset[]>{
    let url='https://localhost:7271/api/Skills/GetSkillByEmail';
    return this.http.post<skillset[]>(url,emailID);
  }
}

