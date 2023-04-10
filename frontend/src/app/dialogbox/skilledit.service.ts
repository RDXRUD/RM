import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { skillsets } from './skillsets';
import { skillGroupInterface } from './skillGroupInteface';


@Injectable({
  providedIn: 'root'
})
export class SkilleditService {

  constructor(private http:HttpClient) { }
  getData():Observable<skillGroupInterface[]>{
    let url="https://localhost:7271/api/SkillSet/GetSkillGroup";
    return this.http.get<skillGroupInterface[]>(url);
  }
  getDatas():Observable<skillsets[]>{
    let url="https://localhost:7271/api/SkillSet/GetSkillSet";
    return this.http.get<skillsets[]>(url);
  }
}
