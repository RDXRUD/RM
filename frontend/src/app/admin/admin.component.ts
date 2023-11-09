import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { EditResSkillDialogComponent } from '../_shared/edit-res-skill-dialog/edit-res-skill-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { userform } from '../_model/userform';
import { addSkill } from '../_model/addSkill';
import { addSkillGroup } from '../_model/addSkillGroup';
import { EditSkillDialogComponent } from '../_shared/edit-skill-dialog/edit-skill-dialog.component';
import { addEmployee } from '../_model/addEmployee';
import { CoreService } from '../_services/core.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SkillsetService } from '../_services/skillset.service';
import { ResourcesService } from '../_services/resources.service';
import { addNewResource } from '../_model/addNewResource';
import { EditResDailogComponent } from '../_shared/edit-res-dailog/edit-res-dailog.component';
import { resFilter } from '../_model/resFilter';
import { SkillsService } from '../_services/skills.service';
import { skillgroup } from '../_model/skillgroup';
import { skillSetFilter } from '../_model/skillSetFilter';
import { ClientService } from '../_services/client.service';
import { Client } from '../_model/client';
import { EditClientDialogComponent } from '../_shared/edit-client-dialog/edit-client-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProjectService } from '../_services/project.service';
import { AddProjectDialogComponent } from '../_shared/add-project-dialog/add-project-dialog.component';
import { AddResourceProjectDialogComponent } from '../_shared/add-resource-project-dialog/add-resource-project-dialog.component';
import { EditProjectDialogComponent } from '../_shared/edit-project-dialog/edit-project-dialog.component';
import { EditProjectResourceDialogComponent } from '../_shared/edit-project-resource-dialog/edit-project-resource-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.215, 0.610, 0.355, 1.000)')),
    ]),
  ],
})


export class AdminComponent implements OnInit, AfterViewInit {
  apiData!: any[];
  api!: skillgroup[];
  userForm: FormGroup;
  formdatas!: userform;
  addskill: FormGroup;
  addSkillgroup: FormGroup;
  skilldata!: addSkill;
  skillgroupdata!: addSkillGroup;
  data: any;
  datas: any;
  resourcesWithSkillCount: any;
  skgroups: any;
  displayedResourceColumns: string[] = ['res_id', 'res_name', 'res_user_id', 'res_email_id', 'location', 'res_create_date', 'res_last_modified', 'role_name', 'edit', 'disable'];
  displayedColumns: string[] = ['res_id', 'res_name', 'res_email_id', 'skill_count', 'details'];
  dsp: string[] = ['skillSetID', 'skillGroup', 'skill', 'description', 'status', 'edit', 'disable'];
  dc: string[] = ['empID', 'resourceName', 'emailID', 'taskName', 'start', 'finish', 'edit'];
  displayedColumnss: string[] = ['userName', 'fullName', 'delete'];
  displayedColumnsto: string[] = ['skillGroupID', 'skillGroup', 'description', 'status', 'action_dis'];
  displayedColumnsOfemp: string[] = ['empID', 'resourceName', 'emailID', 'taskName', 'start', 'finish'];
  displayedColumnsOfLists: string[] = ['columnLists', 'selectors'];
  displayedClientColumns: string[] = ['client_id', 'client_name', 'partner_incharge', 'status', 'edit', 'action_dis'];
  displayedClientExtensionColumns: string[] = ['client_id', 'client_name', 'expand'];
  displayedProjectExpansionColumns: string[] = ['project_id', 'project_name', 'res_name', 'start_date', 'end_date', 'type', 'status', 'edit', 'inner_expand']
  displayedProjectResourceExpansionColumns: string[] = ['client_id', 'client_name', 'partner_incharge', 'start_date', 'end_date', 'edit'];
  displayedAllocatedResourceExpansionColumns: string[] = ['res_name', 'skill', 'allocation_perc', 'start_date', 'end_date', 'edit', 'delete'];

  expandedElement!: null;
  subExpandedElement!: null;
  addResource!: FormGroup;
  addRes!: addNewResource;
  addCli!: Client;
  locations!: any[];
  roles!: any[];
  hide = true;
  filterResource!: FormGroup;
  filterSkills!: FormGroup;
  filterProject!: FormGroup;
  addClient!: FormGroup;
  addProject!: FormGroup;
  addProjectResource!: FormGroup;
  filterData!: resFilter;
  filterSkillData!: skillSetFilter;
  dataSource!: MatTableDataSource<any>;
  skillData!: any[];
  Status: string[] = ["ACTIVE", "INACTIVE"];
  dataOfClient: any;
  clientExtensionData!: any[];
  resexpansionid: any;
  dataProject!: any[];
  dataOfProjects!: any[];
  allocatedResources!: any;


  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  project_manager = new FormControl();
  resourceExtensionData!: any[];
  filteredResOptions!: any;
  dataOfRes!: MatTableDataSource<any>;
  @ViewChild('sortRes') sortRes!: MatSort;
  dataOfResskill!: MatTableDataSource<any>;
  @ViewChild('rescoskill') rescoskill!: MatSort;
  dataOfempSkill!: MatTableDataSource<any>;
  @ViewChild('sort') sort!: MatSort;
  dataOfResources!: MatTableDataSource<any>;
  @ViewChild('sorted') sorted!: MatSort
  dataOfSkills!: MatTableDataSource<any>;
  @ViewChild('sortedData') sortedData!: MatSort;
  dataOfSkillList!: MatTableDataSource<any>;
  @ViewChild('sortedSkillData') sortedSkillData!: MatSort;
  skillGroups!: MatTableDataSource<any>;
  @ViewChild('matSorted') matSorted!: MatSort;
  clientData!: MatTableDataSource<any>;
  @ViewChild('sortedClientData') sortedClientData!: MatSort;

  element: any;
  constructor(
    private resources_Service: ResourcesService,
    frmbuilder: FormBuilder,
    private _coreService: CoreService,
    private dialog: MatDialog,
    private skillSetService: SkillsetService,
    private skillService: SkillsService,
    private clientService: ClientService,
    private projectService: ProjectService
  ) {
    this.addResource = frmbuilder.group({
      res_name: new FormControl(),
      res_email_id: new FormControl(),
      res_user_id: new FormControl(),
      sso_flag: new FormControl(),
      location: new FormControl(),
      password: new FormControl(),
      role_name: new FormControl()
    })
    this.userForm = frmbuilder.group({
      userName: new FormControl(),
      fullName: new FormControl(),
      password: new FormControl(),
    })
    this.addskill = frmbuilder.group({
      skillGroupID: new FormControl(),
      skill: new FormControl(),
      description: new FormControl()
    })
    this.addSkillgroup = frmbuilder.group({
      skillGroup: new FormControl(),
      description: new FormControl()
    })

    this.filterResource = frmbuilder.group({
      res_name: new FormControl(),
      res_email_id: new FormControl(),
      skill_count: new FormControl()
    });
    this.filterSkills = frmbuilder.group({
      skill: new FormControl(),
      skillGroup: new FormControl(),
      skillDescription: new FormControl(),
      skillStatus: new FormControl(),
    });
    this.addClient = frmbuilder.group({
      client_name: new FormControl(),
      partner_incharge: new FormControl(),
    });
    this.addProject = frmbuilder.group({
      project_id: new FormControl(),
      client_name: new FormControl(),
      project_name: new FormControl(),
      project_manager: new FormControl,
      start_date: new FormControl(),
      end_date: new FormControl(),
      project_type: new FormControl(),
      project_status: new FormControl()
    })
    this.filteredResOptions = this.resourceExtensionData;
    this.addProjectResource = frmbuilder.group({
      res_name: new FormControl(),
      res_skill_set: new FormControl(),
      project_name: new FormControl(),
      allocation: new FormControl(),
      start_date: new FormControl(),
      end_date: new FormControl(),
    })
    this.filterProject = frmbuilder.group({
      client_name: new FormControl(),
      project_name: new FormControl(),
    });
  }
  ngAfterViewInit(): void {
  }
  ngOnInit() {
    this.resources_Service.getResources().subscribe(data => {
      this.data = data;
      this.resourceExtensionData = data.sort((a, b) => a.res_name.toLowerCase().localeCompare(b.res_name.toLowerCase()));
      this.dataOfRes = new MatTableDataSource(this.data);
      this.dataOfRes.sort = this.sortRes;
    })
    this.resources_Service.GetLocations().subscribe(data => {
      this.locations = data;
    })
    this.skillSetService.getSkillGroups().subscribe(sg => {
      this.apiData = sg;
    })
    this.skillSetService.getSkillSets().subscribe(datas => {
      this.datas = datas;
      this.dataOfempSkill = new MatTableDataSource(this.datas);
      this.dataOfempSkill.sort = this.sort;
    })
    this.skillSetService.getResourcesWithSkillCount().subscribe((data) => {
      this.resourcesWithSkillCount = data;
      this.dataOfResskill = new MatTableDataSource(this.resourcesWithSkillCount);
      this.dataOfResskill.sort = this.rescoskill;
    });
    this.skillSetService.getSkillGroup().subscribe(skgroups => {
      this.skgroups = skgroups;
      this.skillGroups = new MatTableDataSource(this.skgroups);
      this.skillGroups.sort = this.matSorted;
    })
    this.resources_Service.GetRoles().subscribe(data => {
      this.roles = data;
    })
    this.skillSetService.getSkills().subscribe(dataOfSkill => {
      this.skillData = dataOfSkill;
    });
    this.clientService.getClients().subscribe(data => {
      this.clientExtensionData = data;
      this.dataOfClient = data;
      this.dataOfClient = new MatTableDataSource(this.dataOfClient);
      this.dataOfClient.sort = this.sortedClientData;
    });
    this.projectService.getAllProjects().subscribe(data =>{
      this.dataProject = data;
    });
  }
  AddSkill() {
    this.skilldata = this.addskill.value;
    this.skillSetService.AddSkillset(this.skilldata).subscribe(res => {
      this._coreService.openSnackBar('Record Added Successfully', 'done')
      this.addskill.reset();
      this.ngOnInit();
    }, (error: HttpErrorResponse) => {
      if (error.status === 501) {
        this._coreService.openSnackBar("Skill Group or Skill can't be null!");
      }
      else if (error.status === 502) {
        this._coreService.openSnackBar("Skill already exist in the given skill group!");
      }
    })
  }
  AddSkillGroup() {
    this.skillgroupdata = this.addSkillgroup.value;
    this.skillSetService.AddSkillGroup(this.skillgroupdata).subscribe(() => {
      this._coreService.openSnackBar('Record Added Successfully', 'done')
      this.addSkillgroup.reset();
      this.ngOnInit();
    }, (error: HttpErrorResponse) => {
      if (error.status === 501) {
        this._coreService.openSnackBar("Skill Group can't be null!");
      }
      else if (error.status === 500) {
        this._coreService.openSnackBar("Skill Group already exist!");
      }
    })
  }
  getResourceSkills(emailID: string) {
    const dialogRef = this.dialog.open(EditResSkillDialogComponent, {
      data: { emailID }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  Edit(element: any) {
    const dialogRef = this.dialog.open(EditSkillDialogComponent, {
      data: { element }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.ngOnInit();
      }
    },
      (error: HttpErrorResponse) => {
        if (error.status === 501) {
          this._coreService.openSnackBar("Can't edit INACTIVE skill");
        }
      });
  }
  EditResource(element: any) {
    const dialogRef = this.dialog.open(EditResDailogComponent, {
      width: '600px',
      height: '380px',
      data: { element }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.ngOnInit();
      }
    });
  }
  EditStatus(res_id: number): void {
    const confirmation = confirm("Are you sure you want to disable?");
    if (confirmation) {
      this.resources_Service.EditStatus(res_id).subscribe(
        () => {
          this._coreService.openSnackBar('Resource Disabled Successfully', 'Done')
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this._coreService.openSnackBar("Can't Disable!");
          }
        }
      );
    }
  }
  EditSkillStatus(id: number) {
    const confirmation = confirm("Are you sure you want to update status?");
    if (confirmation) {
      this.skillSetService.UpdateSkillSetStatus(id).subscribe(
        () => {
          this._coreService.openSnackBar(' Updated Successfully', 'Done')
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this._coreService.openSnackBar("Can't Update!");
          }
          else if (error.status === 502) {
            this._coreService.openSnackBar("Skill is in use!");
          }
        }
      );
    }
  }
  DeleteSkillset(skillSetID: number) {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
      this.skillSetService.DeleteSkillset(skillSetID).subscribe(
        () => {
          this._coreService.openSnackBar('Record Deleted Successfully', 'done')
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this._coreService.openSnackBar("This field is used in another process, you can't delete it");
          }
        }
      );
    }
  }
  updateSkillGroupStatus(skillGroupID: number) {
    const confirmation = confirm("Are you sure you want to update status?");
    if (confirmation) {
      this.skillSetService.UpdateSkillGroupStatus(skillGroupID).subscribe(() => {
        this._coreService.openSnackBar('Status Updated Successfully', 'done')
        this.ngOnInit();
      },
        (error: HttpErrorResponse) => {
          if (error.status == 502) {
            this._coreService.openSnackBar('Skill Group is in use', 'ok');
          }
        }
      );
    }
  }

  AddResource() {
    this.addRes = this.addResource.value;
    this.resources_Service.AddResource(this.addRes).subscribe(() => {
      this._coreService.openSnackBar('Record Added Successfully ', 'done');
      this.addResource.reset();
      this.ngOnInit();
    })
  }
  OnReset() {
    this.filterResource.reset();

  }
  OnResetSkill() {
    this.filterSkills.reset();
  }
  OnSubmit() {
    this.filterData = this.filterResource.value;
    this.skillService.FilterResource(this.filterData).subscribe(data => {
      this.resourcesWithSkillCount = data;
      this.dataOfResskill = new MatTableDataSource(this.resourcesWithSkillCount);
      this.dataOfResskill.sort = this.rescoskill;
      this.applySortToDataSource();
    });
  }
  OnSubmitSkill() {
    this.filterSkillData = this.filterSkills.value;
    this.filterSkillData.skill = Array.isArray(this.filterSkillData.skill) ? this.filterSkillData.skill.join(',') : this.filterSkillData.skill;
    this.filterSkillData.skillGroup = Array.isArray(this.filterSkillData.skillGroup) ? this.filterSkillData.skillGroup.join(',') : this.filterSkillData.skillGroup;
    this.skillSetService.FilterSkillSet(this.filterSkillData).subscribe(data => {
      this.datas = data;
      this.dataOfempSkill = new MatTableDataSource(this.datas);
      this.dataOfempSkill.sort = this.sort;
    });
  }
  applySortToDataSource() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
  getData() {
    this.skillSetService.getSkillGroups().subscribe((data: skillgroup[]) => {
      this.api = data;
    });
  }

  AddClient() {
    this.addCli = this.addClient.value;
    this.clientService.AddClient(this.addCli).subscribe(() => {
      this._coreService.openSnackBar('Client Added Successfully ', 'done');
      this.addClient.reset();
      this.ngOnInit();
    },(error: HttpErrorResponse) => {
      if (error.status == 501) {
        this._coreService.openSnackBar('Client Name already exist', 'ok');
      }
    }
    )
  }
  UpdateClient(element: any) {
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      width: '500px',
      height: '300px',
      data: { element }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.ngOnInit();
      }
    });
  }
  UpdateClientStatus(id: number) {
    const confirmation = confirm("Are you sure you want to update status?");
    if (confirmation) {
      this.clientService.UpdateClientStatus(id).subscribe(() => {
        this._coreService.openSnackBar('Status Updated Successfully', 'done')
        this.ngOnInit();
      });
    }
  }
  UpdateProject(element: any) {
    const dialogRef = this.dialog.open(EditProjectDialogComponent, {
      width: '600px',
      height: '550px',
      data: { element }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.ngOnInit();
      }
    });
  }
  UpdateAllocatedResource(element: any) {
    const dialogRef = this.dialog.open(EditProjectResourceDialogComponent, {
      width: '600px',
      height: '500px',
      data: { element }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.ngOnInit();
      }
    });
  }

  AddProject(dataOfClient: any) {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '600px',
      height: '550px',
      data: { dataOfClient, }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.ngOnInit();
      }
    });
  }
  AddProjectResource(dataOfProjects: any) {
    const dialogRef = this.dialog.open(AddResourceProjectDialogComponent, {
      width: '600px',
      height: '550px',
      data: { dataOfProjects, }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.ngOnInit();
      }
    });
  }
  getProjects(id: number) {
    this.projectService.getProjects(id).subscribe(data => {
      this.dataOfProjects = data;
    })
  }
  getAllocatedResources(id: number) {
    this.projectService.getAllocatedResources(id).subscribe(data => {
      this.allocatedResources = data;
    })
  }
  filterRes(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredResOptions = this.resourceExtensionData.filter(o => o.res_name.toLowerCase().includes(filterValue));
    this.resexpansionid = this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined'

  }
  DeleteResource(element: any) {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
      this.projectService.DeleteResource(element.id).subscribe(() => {
        this._coreService.openSnackBar(" Record deleted", "Ok")
        this.ngOnInit();
      });
    }
  }
}