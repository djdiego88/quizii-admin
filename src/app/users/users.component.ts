import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from './user';
import { UsersService } from './users.service';
import { UtilitiesService } from './../utilities.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  countries: any;

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private utilities: UtilitiesService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.utilities.getCountryList().subscribe((data) => {
      this.countries = data;
    });
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

  userDialog(userData?: User) {
    let dialogRef: MatDialogRef<UserDialogComponent, any>;
    if (userData) {
      dialogRef = this.dialog.open(UserDialogComponent, {
        minHeight: 500,
        minWidth: 700,
        data: {title: 'Edit', user: userData}
      });
    } else {
      dialogRef = this.dialog.open(UserDialogComponent, {
        minHeight: 500,
        minWidth: 700,
        data: {title: 'Add'}
      });
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const edited = (result === 'edited') ? 'User Edited!' : 'User Added!';
        this._snackBar.open(edited, null, {duration: 3000});
      }
    });
  }
  deleteUser(user: User) {
    if (window.confirm('Do you really want to delete this user?')) {
      this.usersService.deleteUser(user.id).then(() => {
        if (user.avatar) {
          this.utilities.deleteImage(user.avatar['mini']);
          this.utilities.deleteImage(user.avatar['thumbnail']);
          this.utilities.deleteImage(user.avatar['medium']);
          this.utilities.deleteImage(user.avatar['full']);
        }
        if (user.bgImage) {
          this.utilities.deleteImage(user.bgImage['medium']);
          this.utilities.deleteImage(user.bgImage['large']);
          this.utilities.deleteImage(user.bgImage['full']);
        }
        this._snackBar.open('User Deleted!', null, {duration: 3000});
      }).catch((error) => {
        console.error('Error removing document: ', error);
      });
    }
  }
}
