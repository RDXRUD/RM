import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { file } from '../_model/file';
import { user } from '../_model/user';
import { userform } from '../_model/userform';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }
  
  getUsers(): Observable<user[]> {
    let url = `${environment.apiUrl}/AllUser`;
    return this.http.get<user[]>(url);
  }
  loadFile(formdata: file): Observable<file[]> {
    const formValues = new FormData();
    formValues.append('planFile', formdata.planFile);
    let url = `${environment.apiUrl}/File/LoadFileData`;
    return this.http.post<any>(url, formValues, { headers: { 'Content-Disposition': 'multipart/form-data' }, });
  }

  addUser(formdatas: userform): Observable<userform[]> {
    let url = `${environment.apiUrl}/AddUser`;
    return this.http.post<userform[]>(url, formdatas);
  }
  deleteUser(userID: number): Observable<any> {
    console.warn(userID);
    let url = `${environment.apiUrl}/DeleteUser`;
    return this.http.delete(url, { body: { userId: userID } });
  }
}
