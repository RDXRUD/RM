import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { SG } from './SG';

@Injectable({
  providedIn: 'root'
})
export class SGService {

  constructor(private http:HttpClient) { }
  getData():Observable<SG[]>{
    let url="https://localhost:7271/api/SkillSet/GetSkillGroup";
    return this.http.get<SG[]>(url);
  }
}
