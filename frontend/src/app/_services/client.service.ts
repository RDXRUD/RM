import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../_model/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }
  getClients(): Observable<Client[]> {
    let url = `${environment.apiUrl}/Client/Clients`;
    return this.http.get<Client[]>(url);
  }
  getActiveClients(): Observable<Client[]> {
    let url = `${environment.apiUrl}/Client/ActiveClients`;
    return this.http.get<Client[]>(url);
  }


  AddClient(AddClient: Client): Observable<Client[]> {
    let url = `${environment.apiUrl}/Client/AddClient`;
    return this.http.post<Client[]>(url, AddClient);
  }

  UpdateClient(id: number, formdata: Client): Observable<any> {
    let url = `${environment.apiUrl}/Client/UpdateClient/${id}`;
    return this.http.put(url, formdata).pipe(
      // Handle response or error as needed
    );
  }
  UpdateClientStatus(id: number): Observable<any> {
    let url = `${environment.apiUrl}/Client/UpdateStatus/${id}`;
    return this.http.put(url,id).pipe(
      // Handle response or error as needed
    );
  }
}
