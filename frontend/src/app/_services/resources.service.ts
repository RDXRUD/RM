import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { addResource } from '../_model/addResource';
import { resource } from '../_model/resource';
import { addNewResource } from '../_model/addNewResource';
import { locations } from '../_model/locations';
import { editResource } from '../_model/editResource';
import { roles } from '../_model/roles';
import { reset } from '../_model/reset';
@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  constructor(private http: HttpClient) { }
  getResources(): Observable<resource[]> {
    let url = `${environment.apiUrl}/Resources/GetResources`;
    return this.http.get<resource[]>(url);
  }
  GetResource(userID: number): Observable<resource[]> {
    let url = `${environment.apiUrl}/Resources/GetResource/${userID}`;
    return this.http.get<resource[]>(url);
  }
  GetLocations(): Observable<locations[]> {
    let url = `${environment.apiUrl}/Resources/GetLocations`;
    return this.http.get<locations[]>(url);
  }
  GetRoles(): Observable<roles[]> {
    let url = `${environment.apiUrl}/Resources/GetRoles`;
    return this.http.get<roles[]>(url);
  }
  AddResource(addRes: addNewResource): Observable<addNewResource[]> {
    let url = `${environment.apiUrl}/Resources/AddResource`;
    return this.http.post<addNewResource[]>(url, addRes);
  }
  EditStatus(id: number): Observable<any> {
    let url = `${environment.apiUrl}/Resources/EditStatus/${id}`;
    return this.http.put(url, {}).pipe(
      // Handle response or error as needed
    );
  }
  UpdateResource(id: number, formdata: editResource): Observable<any> {
    let url = `${environment.apiUrl}/Resources/EditResource/${id}`;
    return this.http.put(url, formdata).pipe(
      // Handle response or error as needed
    );
  }
  ResetPassword(userID: string,formdata: reset): Observable<any> {
    let url = `${environment.apiUrl}/Resources/ResetPassword/${userID}`;
    return this.http.put(url,formdata).pipe(
      // Handle response or error as needed
    );
  }
}
