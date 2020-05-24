import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  score: number;
  leaders;
  constructor(public http: HttpClient) {
    this.score = 0;
  }

  addScore(x: number) {
    this.score += x;
  }

  fetchLeaders() {
    return this.http.get('api/leaders');
  }

  checkScore(newScore: number) {
    this.score = newScore > this.score ? newScore : this.score;
  }
}
