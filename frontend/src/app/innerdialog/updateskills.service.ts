import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Observable} from 'rxjs';
import { updateskill } from './updateskill';

@Injectable({
  providedIn: 'root'
})
export class UpdateskillsService {

  constructor(private http:HttpClient) { }
  UpdateSkill(formdata:updateskill):Observable<updateskill[]>{
    let url="https://localhost:7271/api/Skills/AddNewSkill";
    return this.http.put<updateskill[]>(url,formdata);
  }
  }
