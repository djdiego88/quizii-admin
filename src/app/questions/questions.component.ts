import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Question } from './question';
import { QuestionsService } from './questions.service';
import { UtilitiesService } from './../utilities.service';
import { TopicsService } from './../topics/topics.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuestionDialogComponent } from './question-dialog/question-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface Backgrounds { full?: string; large?: string; medium?: string; }

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  displayedColumns: string[] = ['Question', 'Topic', 'Languages', 'Status', 'Actions'];
  dataSource = new MatTableDataSource<Question>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  topics: any;

  constructor(
    private questionsService: QuestionsService,
    private topicsService: TopicsService,
    public dialog: MatDialog,
    private utilities: UtilitiesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.topicsService.getTopics().subscribe((data) => {
      this.topics = Object.keys(data).map(key => ({key: data[key].id, value: data[key].name[navigator.language.split('-')[0]]}));
    });
    this.questionsService.getQuestions().subscribe(questions => {
      this.dataSource.data = questions;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        let questionFilter = false;
        if (data.question.en && data.question.en.trim().toLowerCase().includes(filter)) {
          questionFilter = true;
        } else if (data.question.es && data.question.es.trim().toLowerCase().includes(filter)) {
          questionFilter = true;
        } else if (data.question.it && data.question.it.trim().toLowerCase().includes(filter)) {
          questionFilter = true;
        } else if (data.question.fr && data.question.fr.trim().toLowerCase().includes(filter)) {
          questionFilter = true;
        } else if (data.question.de && data.question.de.trim().toLowerCase().includes(filter)) {
          questionFilter = true;
        } else if (data.question.pt && data.question.pt.trim().toLowerCase().includes(filter)) {
          questionFilter = true;
        }
        return (
          questionFilter ||
          data.status.trim().toLowerCase().includes(filter)
        );
       };
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  questionDialog(questionData?: Question) {
    let dialogRef: MatDialogRef<QuestionDialogComponent, any>;
    if (questionData) {
      dialogRef = this.dialog.open(QuestionDialogComponent, {
        minHeight: 500,
        minWidth: 700,
        data: {title: 'Edit', question: questionData}
      });
    } else {
      dialogRef = this.dialog.open(QuestionDialogComponent, {
        minHeight: 500,
        minWidth: 700,
        data: {title: 'Add'}
      });
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const edited = (result === 'edited') ? 'Question Edited!' : 'Question Added!';
        this.snackBar.open(edited, null, {duration: 3000});
      }
    });
  }
  deleteQuestion(question: Question) {
    if (window.confirm('Do you really want to delete this question?')) {
      this.questionsService.deleteQuestion(question.id).then(() => {
        if (question.image) {
          this.utilities.deleteImage(question.image['medium']);
          this.utilities.deleteImage(question.image['large']);
          this.utilities.deleteImage(question.image['full']);
        }
        this.snackBar.open('Question Deleted!', null, {duration: 3000});
      }).catch((error) => {
        console.error('Error removing document: ', error);
      });
    }
  }
}
