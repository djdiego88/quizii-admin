import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Title } from '../title';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { UtilitiesService } from './../../utilities.service';
import { TitlesService } from '../titles.service';
import { TopicsService } from './../../topics/topics.service';

export interface TitleDialog {
  title: string;
  titleData?: Title;
}
export interface Images { full?: string; medium?: string; large?: string; }

@Component({
  selector: 'app-title-dialog',
  templateUrl: './title-dialog.component.html',
  styleUrls: ['./title-dialog.component.scss'],
})
export class TitleDialogComponent implements OnInit {

  titleForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  children: any;

  validationMessages = {
    title: [
      { type: 'required', message: 'A title is required.' },
    ],
    topic: [
      { type: 'required', message: 'A Topic is required.' },
    ],
    level: [
      { type: 'required', message: 'An Level is required.' },
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<TitleDialogComponent>,
    private formBuilder: FormBuilder,
    private utilities: UtilitiesService,
    private titlesService: TitlesService,
    private topicsService: TopicsService,
    @Inject(MAT_DIALOG_DATA) public data?: TitleDialog
    ) { }

  ngOnInit(): void {
    this.topicsService.getParentTopics().subscribe((data) => {
      this.children = Object.keys(data).map(key => {
        let rObj = {};
        rObj['group'] = data[key].name[navigator.language.split('-')[0]];
        rObj['items'] = [];
        this.topicsService.getChildrenTopicsFromParent(data[key].id).subscribe((childrenData) => {
          childrenData.forEach(children => {
            let obj = {};
            obj['id'] = children.id;
            obj['name'] = children.name[navigator.language.split('-')[0]];
            rObj['items'].push(obj);
          });
        });
        return rObj;
      });
    });
    this.titleForm = this.formBuilder.group({
      title: new FormGroup({
        en: new FormControl(''),
        es: new FormControl(''),
        fr: new FormControl(''),
        pt: new FormControl(''),
        de: new FormControl(''),
        it: new FormControl(''),
      }, Validators.compose([
        Validators.required,
      ])),
      topic: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      level: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
    if (this.data.titleData) {
      this.titleForm.patchValue({
        title: this.data.titleData.title,
        topic: this.data.titleData.topic,
        level: this.data.titleData.level,
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  async addEditTitle(value: Title) {
    value.id = (this.data.titleData && this.data.titleData.id) ? this.data.titleData.id : this.utilities.randomId(30);
    value.availableLanguages = this.getAvailableLanguages(value);
    const edited = (this.data.titleData && this.data.titleData.id) ? 'edited' : 'added';
    console.log(value);
    await this.titlesService.createTitle(value).then(res => {
      this.dialogRef.close(edited);
    });
  }

  getAvailableLanguages(value: Title) {
    const availableLanguages = [];
    if (value.title.en) {
      availableLanguages.push('en');
    }
    if (value.title.es) {
      availableLanguages.push('es');
    }
    if (value.title.fr) {
      availableLanguages.push('fr');
    }
    if (value.title.pt) {
      availableLanguages.push('pt');
    }
    if (value.title.de) {
      availableLanguages.push('de');
    }
    if (value.title.it) {
      availableLanguages.push('it');
    }
    return availableLanguages;
  }
}
