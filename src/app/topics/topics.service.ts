import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Topic } from './topic';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  private topicsCollection: AngularFirestoreCollection<Topic>;

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.topicsCollection = firestore.collection<Topic>('topics');
   }

  getTopics() {
    return this.topicsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Topic;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getParentTopics() {
    return this.firestore.collection<Topic>(
      'topics',
      ref => ref.where('parent', '==', 'none').orderBy('createdDate', 'asc')
      ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Topic;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async createTopic(topic: Topic) {
    const topicId = topic.id;
    delete topic.id;
    return await this.topicsCollection.doc(topicId).set(topic);
  }

  /*createOther(other: Other) {
    const otherId = this.firestore.createId();
    return this.othersCollection.doc(otherId).set(other);
  }*/

  getTopic(topicId: string) {
    return this.topicsCollection.doc(topicId).snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as Topic;
        const id = actions.payload.id;
        return { id, ...data };
      })
    );
   }

  async updateTopic(topic: Topic) {
    const topicId = topic.id;
    delete topic.id;
    return await this.topicsCollection.doc(topicId).set(topic, { merge: true });
  }

  async deleteTopic(topicId: string) {
    return await this.topicsCollection.doc(topicId).delete();
  }
}
