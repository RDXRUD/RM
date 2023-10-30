import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { resourceSkill } from '../_model/resourceskill';
import { employee } from '../_model/employee';
import { addEmployee } from '../_model/addEmployee';
import { employeeFilters } from '../_model/employeefilters';
import { tasks } from '../_model/tasks';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  editResource(resdata: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient ) { }
  getEmployees(): Observable<resourceSkill[]> {
    let url = `${environment.apiUrl}/Employees/GetEmployees`;
    return this.http.get<resourceSkill[]>(url);
  }
  getEmployeesPlan(): Observable<employee[]> {
    let url = `${environment.apiUrl}/EmployeeTask/GetEmployeePlanTasks`;
    return this.http.get<employee[]>(url);
  }
  getDataOfEmployee(): Observable<employee[]> {
    let url = `${environment.apiUrl}/EmployeeTask/GetEmployeesTask`;
    return this.http.get<employee[]>(url);
  }
  AddEmpDetails(AddEmpDetails: addEmployee): Observable<addEmployee[]> {
    let url = `${environment.apiUrl}/EmployeeTask/AddEmployeesTask`;
    return this.http.post<addEmployee[]>(url, AddEmpDetails);
  }
  FilterEmp(formdata: employeeFilters): Observable<employeeFilters[]> {
    let url = `${environment.apiUrl}/Filters/FilterEmployees`;
    return this.http.post<employeeFilters[]>(url, formdata);
  }
  getDetailsofEmp():Observable<employee[]>{
    let url = `${environment.apiUrl}/EmployeeTask/GetEmployeesTask`;
    return this.http.get<employee[]>(url);
  }
  getTasksByEmpID(empID: number): Observable<tasks[]> {
    let url = `${environment.apiUrl}/EmployeeTask/TaskNameByEmpId`;
    return this.http.post<tasks[]>(url, { EmpID: empID });
  }
}
