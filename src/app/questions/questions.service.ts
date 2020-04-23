import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Question } from './question';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private questionsCollection: AngularFirestoreCollection<Question>;

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.questionsCollection = firestore.collection<Question>('questions');
   }

  getQuestions() {
    return this.questionsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Question;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async createQuestion(question: Question) {
    const questionId = question.id;
    delete question.id;
    return await this.questionsCollection.doc(questionId).set(question);
  }

  /*createOther(other: Other) {
    const otherId = this.firestore.createId();
    return this.othersCollection.doc(otherId).set(other);
  }*/

  getQuestion(questionId: string) {
    return this.questionsCollection.doc(questionId).snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as Question;
        const id = actions.payload.id;
        return { id, ...data };
      })
    );
   }

  async updateQuestion(question: Question) {
    const questionId = question.id;
    delete question.id;
    return await this.questionsCollection.doc(questionId).set(question, { merge: true });
  }

  async deleteQuestion(questionId: string) {
    return await this.questionsCollection.doc(questionId).delete();
  }
}
