import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { skillgroup } from '../_model/skillgroup';
import { skill } from '../_model/skill';
import { getSkill } from '../_model/getSkill';
import { skillgroupdata } from '../_model/skillgroupdata';
import { addSkillGroup } from '../_model/addSkillGroup';
import { addSkill } from '../_model/addSkill';
import { skillsetupdate } from '../_model/skillsetupdate';
import { SkillGroups } from '../_model/SkillGroups';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsetService {

  constructor(private http: HttpClient) { }

  getSkillGroups(): Observable<skillgroup[]> {
    let url = `${environment.apiUrl}/SkillSet/GetSkillGroup`;
    return this.http.get<skillgroup[]>(url);
  }
  getSkillAsPerSkillGroup(skillGroup: SkillGroups): Observable<getSkill[]> {
    let url = `${environment.apiUrl}/SkillSet/GetSkillAsPerSkillGroup`;
    return this.http.post<getSkill[]>(url, skillGroup);
  }
  getSkills(): Observable<skill[]> {
    let url = `${environment.apiUrl}/SkillSet/GetSkill`;
    return this.http.get<skill[]>(url);
  }
  getSkillSets(): Observable<skillgroupdata[]> {
    let url = `${environment.apiUrl}/SkillSet/GetSkillSet`;
    return this.http.get<skillgroupdata[]>(url);
  }
  AddSkillset(skilldata: addSkill): Observable<addSkill[]> {
    let url = `${environment.apiUrl}/SkillSet/AddSkillSet`;
    return this.http.post<addSkill[]>(url, skilldata);
  }
  AddSkillGroup(skillgroupdata: addSkillGroup): Observable<addSkillGroup[]> {
    let url = `${environment.apiUrl}/SkillSet/AddSkillGroup`;
    return this.http.post<addSkillGroup[]>(url, skillgroupdata);
  }
  DeleteSkillset(skillSetID: number) {
    console.warn(skillSetID);
    let url = `${environment.apiUrl}/SkillSet/DeleteSkillSet`;
    return this.http.delete(url, { body: { skillSetID: skillSetID } });
  }
  DeleteSkillGroup(skillGroupID: number) {
    console.warn(skillGroupID);
    let url = `${environment.apiUrl}/SkillSet/DeleteSkillGroup`;
    return this.http.delete(url, { body: { skillGroupID: skillGroupID } });
  }
  UpdateSkill(formdata: skillsetupdate): Observable<skillsetupdate[]> {
    let url = `${environment.apiUrl}/SkillSet/UpdateSkillSet`;
    return this.http.put<skillsetupdate[]>(url, formdata);
  }
}
