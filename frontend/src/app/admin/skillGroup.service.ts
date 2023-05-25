import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skillGroupinterface } from './skillGroupinterface';

@Injectable({
  providedIn: 'root'
})
export class SGService {

  constructor(private http: HttpClient) { }
  getData(): Observable<skillGroupinterface[]> {
    let url = "https://localhost:7271/api/SkillSet/GetSkillGroup";
    return this.http.get<skillGroupinterface[]>(url);
  }
}
