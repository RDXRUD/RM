import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { file } from '../_model/file';
import { user } from '../_model/user';
import { userform } from '../_model/userform';
import { CoreService } from './core.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private _coreService: CoreService) { }
  
  getUsers(): Observable<user[]> {
    let url = "https://localhost:7271/AllUser";
    return this.http.get<user[]>(url);
  }

  loadFile(formdata: file): Observable<file[]> {
    const formValues = new FormData();
    // formValues.append('userName', formdata.userName);
    formValues.append('planFile', formdata.planFile);
    let url = `${environment.apiUrl}/File/LoadFileData`;
    return this.http.post<any>(url, formValues, { headers: { 'Content-Disposition': 'multipart/form-data' }, });
  }

  addUser(formdatas: userform): Observable<userform[]> {
    let url = "https://localhost:7271/AddUser";
    this._coreService.openSnackBar('Added User Successfully', 'done')
    return this.http.post<userform[]>(url, formdatas);
  }
  deleteUser(UserID: number) {
    console.warn(UserID);
    let url = "https://localhost:7271/DeleteUser";
    this._coreService.openSnackBar('Record Deleted Successfully', 'done')
    return this.http.delete(url, { body: { userId: UserID } });
  }
}
