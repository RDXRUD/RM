import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { update } from './update';
import { CoreService } from '../core/core.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateskillsService {
  constructor(private http: HttpClient, private _coreService: CoreService) { }
  UpdateSkill(formdata: update): Observable<update[]> {
    let url = "https://localhost:7271/api/SkillSet/UpdateSkillSet";
    this._coreService.openSnackBar('Record Updated Successfully', 'done')
    return this.http.put<update[]>(url, formdata);
  }
}
