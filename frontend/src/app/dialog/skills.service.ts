import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skillset } from './skillset';
import { addskillgroup } from './addskillgroup';
import { CoreService } from '../core/core.service';
import { empSkills } from './empSkills';
@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor(private http: HttpClient, private _coreService: CoreService) { }
  getSkill(emailID: any): Observable<skillset[]> {
    let url = 'https://localhost:7271/api/Skills/SkillByEmail';
    return this.http.post<skillset[]>(url, emailID);
  }
  AddSkills(formdatas: addskillgroup): Observable<addskillgroup[]> {
    let url = "https://localhost:7271/api/Skills/AddNewSkill";
    this._coreService.openSnackBar('Record Added', 'done')
    return this.http.put<addskillgroup[]>(url, formdatas);
  }
  AddEmpSkill(empSkills:empSkills):Observable<empSkills[]>{
    let url = "https://localhost:7271/api/Skills/AddNewSkill";
    this._coreService.openSnackBar('Record Added', 'done')
    return this.http.put<addskillgroup[]>(url, empSkills);
  };
}

