import { Component } from '@angular/core';
//import { AngularFirestore } from '@angular/fire/firestore';
//import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /*title = 'quizzi-admin';
  users: Observable<any[]>;*/
  constructor(
    /*private firestore: AngularFirestore,*/
    private router: Router,
    public auth: AngularFireAuth
    ) {
    /*this.users = firestore.collection('users').valueChanges();
    console.info(this.users);*/
    //his.initializeApp();
  }

  /*ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }*/

  initializeApp() {
    this.auth.user.subscribe(user => {
      if(user){
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    }, err => {
      this.router.navigate(['/login']);
    });
  }
}
