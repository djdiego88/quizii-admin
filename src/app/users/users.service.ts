import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.usersCollection = firestore.collection<User>('users');
   }

  getUsers() {
    return this.usersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async createUser(user: User) {
    const userId = user.id;
    delete user.id;
    return await this.usersCollection.doc(userId).set(user);
  }

  /*createOther(other: Other) {
    const otherId = this.firestore.createId();
    return this.othersCollection.doc(otherId).set(other);
  }*/

  getUser(userId: string) {
    return this.usersCollection.doc(userId).snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as User;
        const id = actions.payload.id;
        return { id, ...data };
      })
    );
   }

  updateUser(user: User) {
    const userId = user.id;
    delete user.id;
    return this.usersCollection.doc(userId).set(user, { merge: true });
  }

  async deleteUser(userId: string) {
    return await this.usersCollection.doc(userId).delete();
  }
}
