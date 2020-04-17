import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from '../user';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';

export interface UserDialog {
  title: string;
  user?: User;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  userForm: FormGroup;
  errorMessage: string = '';

  validationMessages = {
    displayName: [
      { type: 'required', message: 'Email is required.' },
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: UserDialog
    ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      displayName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  addEditUser(value: User) {
    console.log(value);
    this.dialogRef.close(value);
  }
}
