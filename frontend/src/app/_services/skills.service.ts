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
  getSkillReport(): Observable<any[]> {
    let url = `${environment.apiUrl}/Skills/SkillReport`;
    return this.http.get<any[]>(url);
  }
  AddEmpSkill(empSkills:SkillsofEmp,id:number):Observable<SkillsofEmp[]>{
   let url = `${environment.apiUrl}/Skills/AddSkillToSkillGroup/${id}`;
    return this.http.post<SkillsofEmp[]>(url, empSkills);
  };
  UpdateSkills(formdatas: skillset,id:number): Observable<skillset[]> {
    let url = `${environment.apiUrl}/Skills/UpdateSetOfSkill/${id}`;
    return this.http.put<skillset[]>(url, formdatas);
  }
  FilterResource(filter: resFilter): Observable<ResourceWithSkillCount[]> {
    let url = `${environment.apiUrl}/Filters/FilterResource`;
    return this.http.post<ResourceWithSkillCount[]>(url, filter);
  }
  DeleteResourceSkill(id: number) {
    let url = `${environment.apiUrl}/Skills/DeleteResourceSkill/${id}`;
    return this.http.delete(url);
  }
}