import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skillset } from '../_model/skillset';
import { SkillsofEmp } from '../_model/empSkills';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor(private http: HttpClient) { }
  getSkill(emailID: any): Observable<skillset[]> {
    let url = `${environment.apiUrl}/Skills/SkillByEmail`;
    return this.http.post<skillset[]>(url, emailID);
  }
  AddEmpSkill(empSkills:SkillsofEmp):Observable<SkillsofEmp[]>{
   let url = `${environment.apiUrl}/Skills/AddSkillToSkillGroup`;
    return this.http.post<SkillsofEmp[]>(url, empSkills);
  };
  UpdateSkills(formdatas: skillset): Observable<skillset[]> {
    let url = `${environment.apiUrl}/Skills/UpdateSetOfSkill`;
    return this.http.post<skillset[]>(url, formdatas);
  }
}

