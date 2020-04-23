import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Title } from './title';

@Injectable({
  providedIn: 'root'
})
export class TitlesService {

  private titlesCollection: AngularFirestoreCollection<Title>;

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.titlesCollection = firestore.collection<Title>('titles');
   }

  getTitles() {
    return this.titlesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Title;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async createTitle(title: Title) {
    const titleId = title.id;
    delete title.id;
    return await this.titlesCollection.doc(titleId).set(title);
  }

  /*createOther(other: Other) {
    const otherId = this.firestore.createId();
    return this.othersCollection.doc(otherId).set(other);
  }*/

  getTitle(titleId: string) {
    return this.titlesCollection.doc(titleId).snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as Title;
        const id = actions.payload.id;
        return { id, ...data };
      })
    );
   }

  async updateTitle(title: Title) {
    const titleId = title.id;
    delete title.id;
    return await this.titlesCollection.doc(titleId).set(title, { merge: true });
  }

  async deleteTitle(titleId: string) {
    return await this.titlesCollection.doc(titleId).delete();
  }
}
