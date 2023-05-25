import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skill } from './skill';
import { skillgroup } from './skillgroup';
import { file } from './file';
import { user } from './user';
import { userform } from './userform';
import { addSkill } from './addSkill';
import { users } from './users';
import { addSkillGroup } from './addSkillGroup';
import { employee } from './employee';
import { addEmployee } from './addEmployee';
import { CoreService } from '../core/core.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient, private _coreService: CoreService) { }
  getData(): Observable<skill[]> {
    let url = "https://localhost:7271/api/Employees/GetEmployees";
    return this.http.get<skill[]>(url);
  }
  getDataOfEmployee(): Observable<employee[]> {
    let url = "https://localhost:7271/api/EmployeeTask/GetEmployeesTask";
    return this.http.get<employee[]>(url);
  }
  getDetails(): Observable<skillgroup[]> {
    let url = "https://localhost:7271/api/SkillSet/GetSkillSet";
    return this.http.get<skillgroup[]>(url);
  }
  getUsers(): Observable<user[]> {
    let url = "https://localhost:7271/AllUser";
    return this.http.get<user[]>(url);
  }
  getSkillGroup(): Observable<users[]> {
    let url = "https://localhost:7271/api/SkillSet/GetSkillGroup";
    return this.http.get<users[]>(url);
  }
  OnFile(formdata: file): Observable<file[]> {
    const formValues = new FormData();
    formValues.append('userName', formdata.userName);
    formValues.append('planFile', formdata.planFile);
    let url = "https://localhost:7271/api/File/LoadFileData";
    this._coreService.openSnackBar('File Loaded Successfully', 'done')
    return this.http.post<any>(url, formValues, { headers: { 'Content-Disposition': 'multipart/form-data' }, });
  }
  OnUser(formdatas: userform): Observable<userform[]> {
    let url = "https://localhost:7271/AddUser";
    this._coreService.openSnackBar('Added User Successfully', 'done')
    return this.http.post<userform[]>(url, formdatas);
  }
  AddSkill(skilldata: addSkill): Observable<addSkill[]> {
    let url = "https://localhost:7271/api/SkillSet/AddSkillSet";
    this._coreService.openSnackBar('Record Added Successfully', 'done')
    return this.http.post<addSkill[]>(url, skilldata);
  }
  AddSkillGroup(skillgroupdata: addSkillGroup): Observable<addSkillGroup[]> {
    let url = "https://localhost:7271/api/SkillSet/AddSkillGroup";
    this._coreService.openSnackBar('Record Added Successfully', 'done')
    this.getSkillGroup();
    return this.http.post<addSkillGroup[]>(url, skillgroupdata);
  
  }
  AddEmpDetails(AddEmpDetails: addEmployee): Observable<addEmployee[]> {
    let url = "https://localhost:7271/api/EmployeeTask/AddEmployeesTask";
    this._coreService.openSnackBar('Record Added Successfully', 'done')
    return this.http.post<addEmployee[]>(url, AddEmpDetails);
  }
  deleteUser(UserID: number) {
    console.warn(UserID);
    let url = "https://localhost:7271/DeleteUser";
    this._coreService.openSnackBar('Record Deleted Successfully', 'done')
    return this.http.delete(url, { body: { userId: UserID } });
  }
  Delete(skillSetID: number) {
    console.warn(skillSetID);
    let url = "https://localhost:7271/api/SkillSet/DeleteSkillSet";
    this._coreService.openSnackBar('"This field is used in another process you cant delete it"', 'done')
    return this.http.delete(url, { body: { skillSetID: skillSetID } });
  }
  DeleteSkillGroup(skillGroupID: number) {
    console.warn(skillGroupID);
    let url = "https://localhost:7271/api/SkillSet/DeleteSkillGroup";
    this._coreService.openSnackBar('Record Deleted Successfully', 'done')
    return this.http.delete(url, { body: { skillGroupID: skillGroupID } });
    
  }
}

