import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { employee } from './employee';
import { employeefilters } from './employeefilters';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }
  getData():Observable<employee[]>{
    let url="https://localhost:7271/api/EmployeeTask";
    return this.http.get<employee[]>(url);
  }
  // OnSubmit():Observable<employeefilters[]>{
  //    let url=this.signupForm.value("")
  // }
   OnSubmit(formdata:employeefilters):Observable<employeefilters[]>{
    let url="https://localhost:7271/api/Filters/GetFilteredEmployees";
    return this.http.post<employeefilters[]>(url,formdata);
   }
}
