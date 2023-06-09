import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CoreService } from './core.service';
import { skillgroup } from '../_model/skillgroup';
import { skill } from '../_model/skill';
import { skillgroupdata } from '../_model/skillgroupdata';
import { addSkillGroup } from '../_model/addSkillGroup';
import { addSkill } from '../_model/addSkill';
import { skillsetupdate } from '../_model/skillsetupdate';

@Injectable({
  providedIn: 'root'
})
export class SkillsetService {

  constructor(private http: HttpClient, private _coreService: CoreService) { }

  getSkillGroups(): Observable<skillgroup[]> {
    let url = "https://localhost:7271/api/SkillSet/GetSkillGroup";
    return this.http.get<skillgroup[]>(url);
  }
  getSkills(): Observable<skill[]> {
    let url = "https://localhost:7271/api/SkillSet/GetSkill";
    return this.http.get<skill[]>(url);
  }
  getSkillSets(): Observable<skillgroupdata[]> {
    let url = "https://localhost:7271/api/SkillSet/GetSkillSet";
    return this.http.get<skillgroupdata[]>(url);
  }
  AddSkillset(skilldata: addSkill): Observable<addSkill[]> {
    let url = "https://localhost:7271/api/SkillSet/AddSkillSet";
    this._coreService.openSnackBar('Record Added Successfully', 'done')
    return this.http.post<addSkill[]>(url, skilldata);
  }
  AddSkillGroup(skillgroupdata: addSkillGroup): Observable<addSkillGroup[]> {
    let url = "https://localhost:7271/api/SkillSet/AddSkillGroup";
    this._coreService.openSnackBar('Record Added Successfully', 'done')
    return this.http.post<addSkillGroup[]>(url, skillgroupdata);
  }
  DeleteSkillset(skillSetID: number) {
    console.warn(skillSetID);
    let url = "https://localhost:7271/api/SkillSet/DeleteSkillSet";
    this._coreService.openSnackBar('Record Deleted Successfully', 'done')
    return this.http.delete(url, { body: { skillSetID: skillSetID } });
  }
  DeleteSkillGroup(skillGroupID: number) {
    console.warn(skillGroupID);
    let url = "https://localhost:7271/api/SkillSet/DeleteSkillGroup";
    this._coreService.openSnackBar('Record Deleted Successfully', 'done')
    return this.http.delete(url, { body: { skillGroupID: skillGroupID } });
  }
  UpdateSkill(formdata: skillsetupdate): Observable<skillsetupdate[]> {
    let url = "https://localhost:7271/api/SkillSet/UpdateSkillSet";
    this._coreService.openSnackBar('Record Updated Successfully', 'done')
    return this.http.put<skillsetupdate[]>(url, formdata);
  }
}
