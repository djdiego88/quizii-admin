import { Component } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    public auth: AngularFireAuth
    ) {
  }

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
