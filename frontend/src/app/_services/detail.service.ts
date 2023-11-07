import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { detailView } from '../_model/detailView';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor(private http: HttpClient) { }

  getDetailView(filterData:any): Observable<detailView[]> {
    let url = `${environment.apiUrl}/Detail/DetailView`;
    return this.http.post<detailView[]>(url,filterData);
  }
}
