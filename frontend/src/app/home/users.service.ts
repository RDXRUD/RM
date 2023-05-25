import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { employeeDetails } from './employeeDetails';
import { employeeFilters } from './employeefilters';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }
  getData(): Observable<employeeDetails[]> {
    let url = "https://localhost:7271/api/EmployeeTask/GetEmployeesTask";
    return this.http.get<employeeDetails[]>(url);
  }

  OnSubmit(formdata: employeeFilters): Observable<employeeFilters[]> {
    let url = "https://localhost:7271/api/Filters/FilterEmployees";
    return this.http.post<employeeFilters[]>(url, formdata);
  }
}
