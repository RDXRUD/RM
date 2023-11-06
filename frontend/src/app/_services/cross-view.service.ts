import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CrossTabResult } from '../_model/crossTabResult';
import { CrossDate } from '../_model/crossDates';

@Injectable({
  providedIn: 'root'
})
export class CrossViewService {

  constructor(private http: HttpClient) { }
  getCrossView(filterData:any): Observable<CrossTabResult[]> {
    let url = `${environment.apiUrl}/CrossView/CrossViewData`;
    return this.http.post<CrossTabResult[]>(url,filterData);
  }
  getDates(): Observable<CrossDate[]> {
    let url = `${environment.apiUrl}/CrossView/Dates`;
    return this.http.get<CrossDate[]>(url);
  }
}
