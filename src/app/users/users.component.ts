import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { User } from './user';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { UtilitiesService } from './../utilities.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

export interface Avatars { full?: string; medium?: string; mini?: string; thumbnail?: string; }
export interface Backgrounds { full?: string; large?: string; medium?: string; }

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // currentUser: any;
  displayedColumns: string[] = ['Full Name', 'Display Name', 'Country', 'City', 'Status', 'Actions'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  uploadAvatarPercent: Observable<number>;
  downloadAvatarURL: Observable<string>;
  uploadBgPercent: Observable<number>;
  downloadBgURL: Observable<string>;
  thumbnailImg: any;

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private utilities: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return (
          data.name['firstName'].trim().toLowerCase().includes(filter) ||
          data.name['lastName'].trim().toLowerCase().includes(filter) ||
          data.displayName.trim().toLowerCase().includes(filter) ||
          data.city.trim().toLowerCase().includes(filter) ||
          data.status.trim().toLowerCase().includes(filter)
        );
       };
    });
    /*this.auth.user.subscribe(user => {
      this.currentUser = user;
    });*/
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async userDialog(userData?: User) {
    let dialogRef: MatDialogRef<UserDialogComponent, any>;
    if (userData) {
      dialogRef = this.dialog.open(UserDialogComponent, {
        minHeight: 400,
        minWidth: 600,
        data: {title: 'Edit', user: userData}
      });
    } else {
      dialogRef = this.dialog.open(UserDialogComponent, {
        minHeight: 400,
        minWidth: 600,
        data: {title: 'Add'}
      });
    }
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  async uploadAvatar(event) {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      alert('File is too big! Maximum is 1MB.');
      return;
    }
    const extension = file.name.split('.').pop();
    const randomId = this.utilities.randomId(30);
    const avatarSizes = [
      {size: 'mini', width: 100, height: 100},
      {size: 'thumbnail', width: 150, height: 150},
      {size: 'medium', width: 300, height: 300},
      {size: 'full', width: null, height: null},
    ];

    const avatars: Avatars = {};

    for (const elem of avatarSizes) {
        const url = await this.utilities.uploadImages(elem, 'users/avatars', randomId, extension, file);
        avatars[elem.size] = url;
    }
  }

  async uploadBg(event) {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      alert('File is too big! Maximum is 1MB.');
      return;
    }
    const extension = file.name.split('.').pop();
    const randomId = this.utilities.randomId(30);
    const bgSizes = [
      {size: 'medium', width: 400, height: 225},
      {size: 'large', width: 600, height: 337},
      {size: 'full', width: null, height: null},
    ];

    const bgs: Backgrounds = {};

    for (const elem of bgSizes) {
        const url = await this.utilities.uploadImages(elem, 'users/backgrounds', randomId, extension, file);
        bgs[elem.size] = url;
    }
  }
}
