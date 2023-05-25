import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { employeeUpdate } from './employeeUpdate';

@Injectable({
  providedIn: 'root'
})
export class EmployeeUpdateService {

  constructor(private http: HttpClient) { }
  OnUpdate(empData: employeeUpdate): Observable<employeeUpdate[]> {
    let url = "https://localhost:7271/api/EmployeeTask/UpdateEmployeeTask";
    return this.http.put<employeeUpdate[]>(url, empData);
  }
  getData(): Observable<employeeUpdate[]> {
    let url = "https://localhost:7271/api/EmployeeTask/GetEmployeesTask";
    return this.http.get<employeeUpdate[]>(url);
  }
}
