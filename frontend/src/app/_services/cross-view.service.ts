import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICommonReturnType } from '../_model/crossTabResult';
import { CrossDate } from '../_model/crossDates';

@Injectable({
  providedIn: 'root'
})
export class CrossViewService {

  constructor(private http: HttpClient) { }
  getCrossView(filterData:any): Observable<any> {
    let url = `${environment.apiUrl}/CrossView/CrossViewData`;
    return this.http.post<any>(url,filterData);
  }
  getDates(): Observable<CrossDate[]> {
    let url = `${environment.apiUrl}/CrossView/Dates`;
    return this.http.get<CrossDate[]>(url);
  }
  getWeeklyData(): Observable<any[]> {
    let url = `${environment.apiUrl}/CrossView/WeeklyCrossTab`;
    return this.http.get<any[]>(url);
  }
  getWeeks(): Observable<any> {
    let url = `${environment.apiUrl}/CrossView/Weeks`;
    return this.http.get<any>(url);
  }
  getMonthlyData(): Observable<any[]> {
    let url = `${environment.apiUrl}/CrossView/MonthlyCrossTab`;
    return this.http.get<any[]>(url);
  }
  getMonths(): Observable<any> {
    let url = `${environment.apiUrl}/CrossView/Months`;
    return this.http.get<any>(url);
  }
  getQuarterlyData(): Observable<any[]> {
    let url = `${environment.apiUrl}/CrossView/QuarterlyCrossTab`;
    return this.http.get<any[]>(url);
  }
  getQuarters(): Observable<any> {
    let url = `${environment.apiUrl}/CrossView/Quaters`;
    return this.http.get<any>(url);
  }
  getYearlyData(): Observable<any[]> {
    let url = `${environment.apiUrl}/CrossView/YearlyCrossTab`;
    return this.http.get<any[]>(url);
  }
  getYears(): Observable<any> {
    let url = `${environment.apiUrl}/CrossView/Years`;
    return this.http.get<any>(url);
  }
}
