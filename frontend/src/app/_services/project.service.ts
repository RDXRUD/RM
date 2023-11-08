import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { projectMaster } from '../_model/projectMaster';
import { projectDetails } from '../_model/projectDetails';
import { projectManager } from '../_model/projectManager';
import { projectStatus } from '../_model/projectStatus';
import { projectType } from '../_model/projectType';
import { projectResAllocation } from '../_model/projectResAllocation';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getProjectMangers():Observable<projectManager[]> {
    let url = `${environment.apiUrl}/Project/ProjectManagers`;
    return this.http.get<projectManager[]>(url);
  }

  getProjects(id:number): Observable<projectDetails[]> {
    let url = `${environment.apiUrl}/Project/ClientProjects/${id}`;
    return this.http.get<projectDetails[]>(url);
  }
  
  getAllProjects(): Observable<projectMaster[]> {
    let url = `${environment.apiUrl}/Project/Projects`;
    return this.http.get<projectMaster[]>(url);
  }

  getProjectStatus(): Observable<projectStatus[]> {
    let url = `${environment.apiUrl}/Project/GetProjectStatus`;
    return this.http.get<projectStatus[]>(url);
  }

  getProjectType(): Observable<projectType[]> {
    let url = `${environment.apiUrl}/Project/GetProjectType`;
    return this.http.get<projectType[]>(url);
  }
  getAllocatedResources(id:number):Observable<projectResAllocation[]> {
    let url = `${environment.apiUrl}/Project/GetAllocatedResource/${id}`;
    return this.http.get<projectResAllocation[]>(url);
  }

  AddProject(AddProject: projectMaster): Observable<projectMaster[]> {
    let url = `${environment.apiUrl}/Project/AddProject`;
    return this.http.post<projectMaster[]>(url, AddProject);
  }
  AddResource (AddResource: projectMaster): Observable<projectResAllocation[]> {
    let url = `${environment.apiUrl}/Project/AllocateResource`;
    return this.http.post<projectResAllocation[]>(url, AddResource);
  }

  UpdateProject(id: number, formdata: projectMaster): Observable<any> {
    let url = `${environment.apiUrl}/Project/UpdateProject/${id}`;
    return this.http.put(url, formdata).pipe(
      // Handle response or error as needed
    );
  }
  UpdateResource(id: number, formdata: projectResAllocation): Observable<any> {
    let url = `${environment.apiUrl}/Project/UpdateAllocatedResource/${id}`;
    return this.http.put(url, formdata).pipe(
      // Handle response or error as needed
    );
  }
  DeleteResource(id: number) {
    console.warn(id);
    let url = `${environment.apiUrl}/Project/DeleteResource/${id}`;
    return this.http.delete(url);
  }
}