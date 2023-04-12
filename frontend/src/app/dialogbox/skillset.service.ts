import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { skillsets } from './skillsets';

@Injectable({
  providedIn: 'root'
})
export class SkillsetService {

  constructor(private http:HttpClient) { }
  
  UpdateSkills(formdatas:skillsets):Observable<skillsets[]>{
      let url="https://localhost:7271/api/Skills/UpdateSetOfSkill";
      return this.http.put<skillsets[]>(url,formdatas);
    }

  }
