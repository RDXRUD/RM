import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Observable} from 'rxjs';
import { update } from './update';

@Injectable({
  providedIn: 'root'
})
export class UpdateskillsService {
  constructor(private http:HttpClient) { }
  UpdateSkill(formdata:update):Observable<update[]>{
    let url="https://localhost:7271/api/Skills/AddNewSkill";
    return this.http.put<update[]>(url,formdata);
  }
  }
