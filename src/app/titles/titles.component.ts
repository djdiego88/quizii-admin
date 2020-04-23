import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Title } from './title';
import { TitlesService } from './titles.service';
import { UtilitiesService } from './../utilities.service';
import { TopicsService } from './../topics/topics.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TitleDialogComponent } from './title-dialog/title-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.scss']
})
export class TitlesComponent implements OnInit {

  displayedColumns: string[] = ['Title', 'Topic', 'Level', 'Languages', 'Actions'];
  dataSource = new MatTableDataSource<Title>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  topics: any;

  constructor(
    private titlesService: TitlesService,
    private topicsService: TopicsService,
    public dialog: MatDialog,
    private utilities: UtilitiesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.topicsService.getTopics().subscribe((data) => {
      this.topics = Object.keys(data).map(key => ({key: data[key].id, value: data[key].name[navigator.language.split('-')[0]]}));
    });
    this.titlesService.getTitles().subscribe(titles => {
      this.dataSource.data = titles;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        let titleFilter = false;
        if (data.title.en && data.title.en.trim().toLowerCase().includes(filter)) {
          titleFilter = true;
        } else if (data.title.es && data.title.es.trim().toLowerCase().includes(filter)) {
          titleFilter = true;
        } else if (data.title.it && data.title.it.trim().toLowerCase().includes(filter)) {
          titleFilter = true;
        } else if (data.title.fr && data.title.fr.trim().toLowerCase().includes(filter)) {
          titleFilter = true;
        } else if (data.title.de && data.title.de.trim().toLowerCase().includes(filter)) {
          titleFilter = true;
        } else if (data.title.pt && data.title.pt.trim().toLowerCase().includes(filter)) {
          titleFilter = true;
        }
        return (
          titleFilter
        );
       };
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  titleDialog(titleData?: Title) {
    let dialogRef: MatDialogRef<TitleDialogComponent, any>;
    if (titleData) {
      dialogRef = this.dialog.open(TitleDialogComponent, {
        minHeight: 500,
        minWidth: 700,
        data: {title: 'Edit', titleData: titleData}
      });
    } else {
      dialogRef = this.dialog.open(TitleDialogComponent, {
        minHeight: 500,
        minWidth: 700,
        data: {title: 'Add'}
      });
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const edited = (result === 'edited') ? 'Title Edited!' : 'Title Added!';
        this.snackBar.open(edited, null, {duration: 3000});
      }
    });
  }
  deleteTitle(title: Title) {
    if (window.confirm('Do you really want to delete this title?')) {
      this.titlesService.deleteTitle(title.id).then(() => {
        this.snackBar.open('Title Deleted!', null, {duration: 3000});
      }).catch((error) => {
        console.error('Error removing document: ', error);
      });
    }
  }
}
