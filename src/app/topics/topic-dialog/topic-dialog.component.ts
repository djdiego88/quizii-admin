import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Topic } from '../topic';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { UtilitiesService } from './../../utilities.service';
import { TopicsService } from '../topics.service';

export interface TopicDialog {
  title: string;
  topic?: Topic;
}
export interface Images { full?: string; medium?: string; mini?: string; thumbnail?: string; }

@Component({
  selector: 'app-topic-dialog',
  templateUrl: './topic-dialog.component.html',
  styleUrls: ['./topic-dialog.component.scss'],
})
export class TopicDialogComponent implements OnInit {

  topicForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  uploadingImage = false;
  topics: any;
  imageImg: any;
  images: Images = null;

  validationMessages = {
    name: [
      { type: 'required', message: 'A Name is required.' },
    ],
    description: [
      { type: 'required', message: 'A Description is required.' },
    ],
    status: [
      { type: 'required', message: 'A Status is required.' },
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<TopicDialogComponent>,
    private formBuilder: FormBuilder,
    private utilities: UtilitiesService,
    private topicsService: TopicsService,
    @Inject(MAT_DIALOG_DATA) public data?: TopicDialog
    ) { }

  ngOnInit(): void {
    this.topicsService.getParentTopics().subscribe((data) => {
      this.topics = Object.keys(data).map(key => ({key: data[key].id, value: data[key].name[navigator.language.split('-')[0]]}));
    });
    this.topicForm = this.formBuilder.group({
      name: new FormGroup({
        en: new FormControl(''),
        es: new FormControl(''),
        fr: new FormControl(''),
        pt: new FormControl(''),
        de: new FormControl(''),
        it: new FormControl(''),
      }, Validators.compose([
        Validators.required,
      ])),
      description: new FormGroup({
        en: new FormControl(''),
        es: new FormControl(''),
        fr: new FormControl(''),
        pt: new FormControl(''),
        de: new FormControl(''),
        it: new FormControl(''),
      }, Validators.compose([
        Validators.required,
      ])),
      parent: new FormControl('none'),
      status: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
    if (this.data.topic) {
      this.topicForm.patchValue({
        name: this.data.topic.name,
        description: this.data.topic.description,
        parent: this.data.topic.parent,
        status: this.data.topic.status,
      });
      this.imageImg = (this.data.topic.image) ? this.data.topic.image['mini'] : false;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  async addEditTopic(value: Topic) {
    value.id = (this.data.topic && this.data.topic.id) ? this.data.topic.id : this.utilities.randomId(30);
    value.image = (
        this.data.topic && this.data.topic.image &&
        !this.images
      ) ? this.data.topic.image : this.images;
    value.availableLanguages = this.getAvailableLanguages(value);
    value.createdDate = (this.data.topic && this.data.topic.createdDate) ? this.data.topic.createdDate : new Date().getTime();
    const edited = (this.data.topic && this.data.topic.id) ? 'edited' : 'added';
    console.log(value);
    await this.topicsService.createTopic(value).then(res => {
      if (this.images && (this.data.topic && this.data.topic.image)) {
        this.utilities.deleteImage(this.data.topic.image['mini']);
        this.utilities.deleteImage(this.data.topic.image['thumbnail']);
        this.utilities.deleteImage(this.data.topic.image['medium']);
        this.utilities.deleteImage(this.data.topic.image['full']);
      }
      this.dialogRef.close(edited);
    });
  }

  getAvailableLanguages(value: Topic) {
    const availableLanguages = [];
    if (value.name['en'] && value.description['en']) {
      availableLanguages.push('en');
    }
    if (value.name['es'] && value.description['es']) {
      availableLanguages.push('es');
    }
    if (value.name['fr'] && value.description['fr']) {
      availableLanguages.push('fr');
    }
    if (value.name['pt'] && value.description['pt']) {
      availableLanguages.push('pt');
    }
    if (value.name['de'] && value.description['de']) {
      availableLanguages.push('de');
    }
    if (value.name['it'] && value.description['it']) {
      availableLanguages.push('it');
    }
    return availableLanguages;
  }

  async uploadImage(event) {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      alert('File is too big! Maximum is 1MB.');
      return;
    }
    this.loading = true;
    const extension = file.name.split('.').pop();
    const randomId = this.utilities.randomId(30);
    const imageSizes = [
      {size: 'mini', width: 100, height: 100},
      {size: 'thumbnail', width: 150, height: 150},
      {size: 'medium', width: 300, height: 300},
      {size: 'full', width: null, height: null},
    ];

    const images: Images = {};
    this.uploadingImage = true;

    for (const elem of imageSizes) {
        const url = await this.utilities.uploadImages(elem, 'topics/images', randomId, extension, file);
        images[elem.size] = url;
    }
    this.loading = this.uploadingImage = false;
    this.imageImg = images.mini;
    this.images = images;
  }
}
