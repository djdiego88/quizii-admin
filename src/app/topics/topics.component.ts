import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Topic } from './topic';
import { TopicsService } from './topics.service';
import { UtilitiesService } from './../utilities.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TopicDialogComponent } from './topic-dialog/topic-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface Backgrounds { full?: string; large?: string; medium?: string; }

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  displayedColumns: string[] = ['Name', 'Languages', 'Status', 'Actions'];
  dataSource = new MatTableDataSource<Topic>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  countries: any;

  constructor(
    private topicsService: TopicsService,
    public dialog: MatDialog,
    private utilities: UtilitiesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.topicsService.getTopics().subscribe(topics => {
      this.dataSource.data = topics;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        let nameFilter = false;
        if (data.name['en'] && data.name['en'].trim().toLowerCase().includes(filter)) {
          nameFilter = true;
        } else if (data.name['es'] && data.name['es'].trim().toLowerCase().includes(filter)) {
          nameFilter = true;
        } else if (data.name['it'] && data.name['it'].trim().toLowerCase().includes(filter)) {
          nameFilter = true;
        } else if (data.name['fr'] && data.name['fr'].trim().toLowerCase().includes(filter)) {
          nameFilter = true;
        } else if (data.name['de'] && data.name['de'].trim().toLowerCase().includes(filter)) {
          nameFilter = true;
        } else if (data.name['pt'] && data.name['pt'].trim().toLowerCase().includes(filter)) {
          nameFilter = true;
        }
        return (
          nameFilter ||
          data.status.trim().toLowerCase().includes(filter)
        );
       };
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  topicDialog(topicData?: Topic) {
    let dialogRef: MatDialogRef<TopicDialogComponent, any>;
    if (topicData) {
      dialogRef = this.dialog.open(TopicDialogComponent, {
        minHeight: 500,
        minWidth: 700,
        data: {title: 'Edit', topic: topicData}
      });
    } else {
      dialogRef = this.dialog.open(TopicDialogComponent, {
        minHeight: 500,
        minWidth: 700,
        data: {title: 'Add'}
      });
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const edited = (result === 'edited') ? 'Topic Edited!' : 'Topic Added!';
        this.snackBar.open(edited, null, {duration: 3000});
      }
    });
  }
  deleteTopic(topic: Topic) {
    if (window.confirm('Do you really want to delete this topic?')) {
      this.topicsService.deleteTopic(topic.id).then(() => {
        if (topic.image) {
          this.utilities.deleteImage(topic.image['mini']);
          this.utilities.deleteImage(topic.image['thumbnail']);
          this.utilities.deleteImage(topic.image['medium']);
          this.utilities.deleteImage(topic.image['full']);
        }
        this.snackBar.open('Topic Deleted!', null, {duration: 3000});
      }).catch((error) => {
        console.error('Error removing document: ', error);
      });
    }
  }
}
