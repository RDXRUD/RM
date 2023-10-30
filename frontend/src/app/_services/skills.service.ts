import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skillset } from '../_model/skillset';
import { SkillsofEmp } from '../_model/empSkills';
import { environment } from 'src/environments/environment';
import { resFilter } from '../_model/resFilter';
import { ResourceWithSkillCount } from '../_model/ResourceWithSkillCount';
@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  constructor(private http: HttpClient) { }
  getSkill(emailID: string): Observable<skillset[]> {
    let url = `${environment.apiUrl}/Skills/SkillByEmail/${emailID}`;
    return this.http.get<skillset[]>(url);
  }
  AddEmpSkill(empSkills:SkillsofEmp):Observable<SkillsofEmp[]>{
   let url = `${environment.apiUrl}/Skills/AddSkillToSkillGroup`;
    return this.http.post<SkillsofEmp[]>(url, empSkills);
  };
  UpdateSkills(formdatas: skillset): Observable<skillset[]> {
    let url = `${environment.apiUrl}/Skills/UpdateSetOfSkill`;
    return this.http.put<skillset[]>(url, formdatas);
  }
  FilterResource(filter: resFilter): Observable<ResourceWithSkillCount[]> {
    let url = `${environment.apiUrl}/Filters/FilterResource`;
    return this.http.post<ResourceWithSkillCount[]>(url, filter);
  }
  DeleteResourceSkill(id: number) {
    console.warn(id);
    let url = `${environment.apiUrl}/Skills/DeleteResourceSkill/${id}`;
    return this.http.delete(url);
  }
}