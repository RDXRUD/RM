import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skillset } from '../_model/skillset';
import { addskillgroupdata } from '../_model/addskillgroupdata';
import { CoreService } from '../_services/core.service';
import { empSkills } from '../_model/empSkills';
import { SkillGroups } from '../_model/SkillGroups';
import { skill } from '../_model/skill';
import { getSkill } from '../_model/getSkill';
@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor(private http: HttpClient, private _coreService: CoreService) { }
  getSkill(emailID: any): Observable<skillset[]> {
    let url = 'https://localhost:7271/api/Skills/SkillByEmail';
    return this.http.post<skillset[]>(url, emailID);
  }
  AddSkills(formdatas: addskillgroupdata): Observable<addskillgroupdata[]> {
    let url = "https://localhost:7271/api/Skills/AddNewSkill";
    this._coreService.openSnackBar('Record Added', 'done')
    return this.http.put<addskillgroupdata[]>(url, formdatas);
  }
  AddEmpSkill(empSkills:empSkills):Observable<empSkills[]>{
    let url = "https://localhost:7271/api/Skills/AddNewSkill";
    this._coreService.openSnackBar('Record Added', 'done')
    return this.http.put<addskillgroupdata[]>(url, empSkills);
  };
  UpdateSkills(formdatas: skillset): Observable<skillset[]> {
    let url = "https://localhost:7271/api/Skills/UpdateSetOfSkill";
    this._coreService.openSnackBar('Record Updated Successfully', 'done')
    return this.http.put<skillset[]>(url, formdatas);
  }
  getSkillAsPerSkillGroup(skillGroup: SkillGroups): Observable<SkillGroups[]> {
    let url = "https://localhost:7271/api/Skills/GetSkillAsPerSkillGroup";
    return this.http.post<SkillGroups[]>(url, skillGroup);
  }
}

