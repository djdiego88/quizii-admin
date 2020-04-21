import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from '../user';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { UtilitiesService } from './../../utilities.service';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import { UsersService } from '../users.service';



export interface UserDialog {
  title: string;
  user?: User;
}
export interface Avatars { full?: string; medium?: string; mini?: string; thumbnail?: string; }
export interface Backgrounds { full?: string; large?: string; medium?: string; }

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'x',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: navigator.language.split('-')[0]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class UserDialogComponent implements OnInit {

  userForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  uploadingAvatar = false;
  uploadingBackground = false;
  countries: any;
  avatarImg: any;
  avatars: Avatars = null;
  backgroundImg: any;
  backgrounds: Backgrounds = null;
  maxDate: Date;

  validationMessages = {
    firstName: [
      { type: 'required', message: 'A First Name is required.' },
    ],
    lastName: [
      { type: 'required', message: 'A Last Name is required.' },
    ],
    displayName: [
      { type: 'required', message: 'A Nickname or Display Name is required.' },
    ],
    country: [
      { type: 'required', message: 'A Country is required.' },
    ],
    language: [
      { type: 'required', message: 'A Language is required.' },
    ],
    status: [
      { type: 'required', message: 'A Status is required.' },
    ],
    level: [
      { type: 'required', message: 'A Level is required.' },
      { type: 'pattern', message: 'A Integer number is required for level.' },
    ],
    totalPoints: [
      { type: 'required', message: 'A Number of points is required.' },
      { type: 'pattern', message: 'A Integer number is required for Total Points.' },
    ],
  };

  languages = [
    {key: 'en', value: 'English'},
    {key: 'es', value: 'Spanish'},
    {key: 'it', value: 'Italian'},
    {key: 'fr', value: 'French'},
    {key: 'pt', value: 'Portuguese'},
    {key: 'de', value: 'German'},
  ];

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private formBuilder: FormBuilder,
    private utilities: UtilitiesService,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data?: UserDialog
    ) { }

  ngOnInit(): void {
    this.utilities.getCountryList().subscribe((data) => {
      this.countries = Object.keys(data).map(key => ({key, value: data[key]}));
    });
    this.maxDate = new Date();
    this.userForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      lastName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      displayName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      country: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      city: new FormControl(''),
      birthday: new FormControl(''),
      title: new FormControl(''),
      language: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      status: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      level: new FormControl(1, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]*'),
      ])),
      totalPoints: new FormControl(0, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]*'),
      ])),
      online: new FormControl(''),
      privateProfile: new FormControl(''),
      showAge: new FormControl(''),
    });
    if (this.data.user) {
      this.userForm.controls.firstName.setValue(this.data.user.name['firstName']);
      this.userForm.controls.lastName.setValue(this.data.user.name['lastName']);
      this.userForm.controls.displayName.setValue(this.data.user.displayName);
      this.userForm.controls.country.setValue(this.data.user.country);
      this.userForm.controls.city.setValue(this.data.user.city);
      this.userForm.controls.birthday.setValue(moment(this.data.user.birthday));
      this.userForm.controls.title.setValue(this.data.user.title);
      this.userForm.controls.language.setValue(this.data.user.language);
      this.userForm.controls.status.setValue(this.data.user.status);
      this.userForm.controls.level.setValue(this.data.user.level);
      this.userForm.controls.totalPoints.setValue(this.data.user.totalPoints);
      this.userForm.controls.online.setValue(this.data.user.online);
      this.userForm.controls.privateProfile.setValue(this.data.user.privateProfile);
      this.userForm.controls.showAge.setValue(this.data.user.showAge);
      this.avatarImg = (this.data.user.avatar) ? this.data.user.avatar['mini'] : false;
      this.backgroundImg = (this.data.user.bgImage) ? this.data.user.bgImage['medium'] : false;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  async addEditUser(value: User) {
    value.id = (this.data.user && this.data.user.id) ? this.data.user.id : this.utilities.randomId(30);
    if (!value.online) { value.online = false; }
    if (!value.privateProfile) { value.privateProfile = false; }
    if (!value.showAge) { value.showAge = false; }
    value.createdDate = (this.data.user && this.data.user.createdDate) ? this.data.user.createdDate : new Date().getTime();
    value.lastActiveDate = (this.data.user && this.data.user.lastActiveDate) ? this.data.user.lastActiveDate : new Date().getTime();
    value.avatar = (
        this.data.user && this.data.user.avatar &&
        !this.avatars
      ) ? this.data.user.avatar : this.avatars;
    value.bgImage = (
      this.data.user && this.data.user.bgImage &&
      !this.backgrounds
    ) ? this.data.user.bgImage : this.backgrounds;
    value.name = {firstName: value['firstName'], lastName: value['lastName']};
    delete value['firstName'];
    delete value['lastName'];
    value.birthday = (value.birthday) ? value.birthday._d.getTime() : null;
    const edited = (this.data.user && this.data.user.id) ? 'edited' : 'added';
    await this.usersService.createUser(value).then(res => {
      if (this.avatars && (this.data.user && this.data.user.avatar)) {
        this.utilities.deleteImage(this.data.user.avatar['mini']);
        this.utilities.deleteImage(this.data.user.avatar['thumbnail']);
        this.utilities.deleteImage(this.data.user.avatar['medium']);
        this.utilities.deleteImage(this.data.user.avatar['full']);
      }
      if (this.backgrounds && (this.data.user && this.data.user.bgImage)) {
        this.utilities.deleteImage(this.data.user.bgImage['medium']);
        this.utilities.deleteImage(this.data.user.bgImage['large']);
        this.utilities.deleteImage(this.data.user.bgImage['full']);
      }
      this.dialogRef.close(edited);
    });
  }

  async uploadAvatar(event) {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      alert('File is too big! Maximum is 1MB.');
      return;
    }
    this.loading = true;
    const extension = file.name.split('.').pop();
    const randomId = this.utilities.randomId(30);
    const avatarSizes = [
      {size: 'mini', width: 100, height: 100},
      {size: 'thumbnail', width: 150, height: 150},
      {size: 'medium', width: 300, height: 300},
      {size: 'full', width: null, height: null},
    ];

    const avatars: Avatars = {};
    this.uploadingAvatar = true;

    for (const elem of avatarSizes) {
        const url = await this.utilities.uploadImages(elem, 'users/avatars', randomId, extension, file);
        avatars[elem.size] = url;
    }
    this.loading = this.uploadingAvatar = false;
    this.avatarImg = avatars.mini;
    this.avatars = avatars;
  }

  async uploadBg(event) {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      alert('File is too big! Maximum is 1MB.');
      return;
    }
    this.loading = true;
    const extension = file.name.split('.').pop();
    const randomId = this.utilities.randomId(30);
    const bgSizes = [
      {size: 'medium', width: 400, height: 225},
      {size: 'large', width: 600, height: 337},
      {size: 'full', width: null, height: null},
    ];

    const backgrounds: Backgrounds = {};
    this.uploadingBackground = true;

    for (const elem of bgSizes) {
        const url = await this.utilities.uploadImages(elem, 'users/backgrounds', randomId, extension, file);
        backgrounds[elem.size] = url;
    }
    this.loading = this.uploadingBackground = false;
    this.backgroundImg = backgrounds.medium;
    this.backgrounds = backgrounds;
  }
}
