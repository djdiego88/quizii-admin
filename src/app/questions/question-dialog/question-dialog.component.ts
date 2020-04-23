import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Question } from '../question';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { UtilitiesService } from './../../utilities.service';
import { QuestionsService } from '../questions.service';
import { TopicsService } from './../../topics/topics.service';

export interface QuestionDialog {
  title: string;
  question?: Question;
}
export interface Images { full?: string; medium?: string; large?: string; }

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss'],
})
export class QuestionDialogComponent implements OnInit {

  questionForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  uploadingImage = false;
  children: any;
  imageImg: any;
  images: Images = null;

  validationMessages = {
    question: [
      { type: 'required', message: 'A question is required.' },
    ],
    optionA: [
      { type: 'required', message: 'An Option A is required.' },
    ],
    optionB: [
      { type: 'required', message: 'An Option B is required.' },
    ],
    optionC: [
      { type: 'required', message: 'An Option C is required.' },
    ],
    optionD: [
      { type: 'required', message: 'An Option D is required.' },
    ],
    rightAnswer: [
      { type: 'required', message: 'An Answer is required.' },
    ],
    topic: [
      { type: 'required', message: 'A Topic is required.' },
    ],
    status: [
      { type: 'required', message: 'A Status is required.' },
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    private formBuilder: FormBuilder,
    private utilities: UtilitiesService,
    private questionsService: QuestionsService,
    private topicsService: TopicsService,
    @Inject(MAT_DIALOG_DATA) public data?: QuestionDialog
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
    this.questionForm = this.formBuilder.group({
      question: new FormGroup({
        en: new FormControl(''),
        es: new FormControl(''),
        fr: new FormControl(''),
        pt: new FormControl(''),
        de: new FormControl(''),
        it: new FormControl(''),
      }, Validators.compose([
        Validators.required,
      ])),
      optionA: new FormGroup({
        en: new FormControl(''),
        es: new FormControl(''),
        fr: new FormControl(''),
        pt: new FormControl(''),
        de: new FormControl(''),
        it: new FormControl(''),
      }, Validators.compose([
        Validators.required,
      ])),
      optionB: new FormGroup({
        en: new FormControl(''),
        es: new FormControl(''),
        fr: new FormControl(''),
        pt: new FormControl(''),
        de: new FormControl(''),
        it: new FormControl(''),
      }, Validators.compose([
        Validators.required,
      ])),
      optionC: new FormGroup({
        en: new FormControl(''),
        es: new FormControl(''),
        fr: new FormControl(''),
        pt: new FormControl(''),
        de: new FormControl(''),
        it: new FormControl(''),
      }, Validators.compose([
        Validators.required,
      ])),
      optionD: new FormGroup({
        en: new FormControl(''),
        es: new FormControl(''),
        fr: new FormControl(''),
        pt: new FormControl(''),
        de: new FormControl(''),
        it: new FormControl(''),
      }, Validators.compose([
        Validators.required,
      ])),
      rightAnswer: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      topic: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      status: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
    if (this.data.question) {
      this.questionForm.patchValue({
        question: this.data.question.question,
        optionA: this.data.question.optionA,
        optionB: this.data.question.optionB,
        optionC: this.data.question.optionC,
        optionD: this.data.question.optionD,
        rightAnswer: this.data.question.rightAnswer,
        topic: this.data.question.topic,
        status: this.data.question.status,
      });
      this.imageImg = (this.data.question.image) ? this.data.question.image['medium'] : false;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  async addEditQuestion(value: Question) {
    value.id = (this.data.question && this.data.question.id) ? this.data.question.id : this.utilities.randomId(30);
    value.image = (
        this.data.question && this.data.question.image &&
        !this.images
      ) ? this.data.question.image : this.images;
    value.availableLanguages = this.getAvailableLanguages(value);
    value.createdDate = (this.data.question && this.data.question.createdDate) ? this.data.question.createdDate : new Date().getTime();
    const edited = (this.data.question && this.data.question.id) ? 'edited' : 'added';
    console.log(value);
    await this.questionsService.createQuestion(value).then(res => {
      if (this.images && (this.data.question && this.data.question.image)) {
        this.utilities.deleteImage(this.data.question.image['medium']);
        this.utilities.deleteImage(this.data.question.image['large']);
        this.utilities.deleteImage(this.data.question.image['full']);
      }
      this.dialogRef.close(edited);
    });
  }

  getAvailableLanguages(value: Question) {
    const availableLanguages = [];
    if (value.question.en && value.optionA.en && value.optionB.en && value.optionC.en && value.optionD.en) {
      availableLanguages.push('en');
    }
    if (value.question.es && value.optionA.es && value.optionB.es && value.optionC.es && value.optionD.es) {
      availableLanguages.push('es');
    }
    if (value.question.fr && value.optionA.fr && value.optionB.fr && value.optionC.fr && value.optionD.fr) {
      availableLanguages.push('fr');
    }
    if (value.question.pt && value.optionA.pt && value.optionB.pt && value.optionC.pt && value.optionD.pt) {
      availableLanguages.push('pt');
    }
    if (value.question.de && value.optionA.de && value.optionB.de && value.optionC.de && value.optionD.de) {
      availableLanguages.push('de');
    }
    if (value.question.it && value.optionA.it && value.optionB.it && value.optionC.it && value.optionD.it) {
      availableLanguages.push('it');
    }
    return availableLanguages;
  }

  async uploadImage(event) {
    const file = event.target.files[0];
    if (file.size > 2097152) {
      alert('File is too big! Maximum is 2MB.');
      return;
    }
    this.loading = true;
    const extension = file.name.split('.').pop();
    const randomId = this.utilities.randomId(30);
    const imageSizes = [
      {size: 'medium', width: 400, height: 300},
      {size: 'large', width: 600, height: 450},
      {size: 'full', width: null, height: null},
    ];

    const images: Images = {};
    this.uploadingImage = true;

    for (const elem of imageSizes) {
        const url = await this.utilities.uploadImages(elem, 'questions/images', randomId, extension, file);
        images[elem.size] = url;
    }
    this.loading = this.uploadingImage = false;
    this.imageImg = images.medium;
    this.images = images;
  }
}
