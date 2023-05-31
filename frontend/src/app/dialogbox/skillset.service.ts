import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { skillsets } from './skillsets';
import { CoreService } from '../core/core.service';

@Injectable({
  providedIn: 'root'
})
export class SkillsetService {

  constructor(private http: HttpClient, private _coreService: CoreService) { }

  UpdateSkills(formdatas: skillsets): Observable<skillsets[]> {
    let url = "https://localhost:7271/api/Skills/UpdateSetOfSkill";
    this._coreService.openSnackBar('Record Updated Successfully', 'done')
    return this.http.put<skillsets[]>(url, formdatas);
  }


}
