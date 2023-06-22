import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { resourceSkill } from '../_model/resourceskill';
import { employee } from '../_model/employee';
import { addEmployee } from '../_model/addEmployee';
import { employeeFilters } from '../_model/employeefilters';
import { tasks } from '../_model/tasks';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient ) { }
  getEmployees(): Observable<resourceSkill[]> {
    let url = "https://localhost:7271/api/Employees/GetEmployees";
    return this.http.get<resourceSkill[]>(url);
  }
  getDataOfEmployee(): Observable<employee[]> {
    let url = "https://localhost:7271/api/EmployeeTask/GetEmployeesTask";
    return this.http.get<employee[]>(url);
  }
  AddEmpDetails(AddEmpDetails: addEmployee): Observable<addEmployee[]> {
    let url = "https://localhost:7271/api/EmployeeTask/AddEmployeesTask";
    return this.http.post<addEmployee[]>(url, AddEmpDetails);
  }
  FilterEmp(formdata: employeeFilters): Observable<employeeFilters[]> {
    let url = "https://localhost:7271/api/Filters/FilterEmployees";
    return this.http.post<employeeFilters[]>(url, formdata);
  }
  getDetailsofEmp():Observable<employee[]>{
    let url="https://localhost:7271/api/EmployeeTask/GetEmployeesTask";
    return this.http.get<employee[]>(url);
  }
  getTasksByEmpID(empID: number): Observable<tasks[]> {
    let url = 'https://localhost:7271/api/EmployeeTask/TaskNameByEmpId';
    return this.http.post<tasks[]>(url, { EmpID: empID });
  }
}

