import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

const headers = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'http://localhost:3000/';

  score: number = 0;
  leaders;
  constructor(public http: HttpClient) {}

  fetchLeaders() {
    return this.http.get(this.apiUrl + 'leaderboard');
  }

  fetchScore() {
    const acctoken = JSON.parse(sessionStorage['accesstoken']);
    const headers = {
      headers: new HttpHeaders({'x-access-token': acctoken.token})
    };
    return this.http.get(this.apiUrl + `users/score`, headers);
  }

  checkScore(newScore: number) {
    if (newScore > this.score) {
      this.score = newScore;
      const acctoken = JSON.parse(sessionStorage['accesstoken']);
      return this.http
        .put(
          this.apiUrl + `users/update/${newScore}`,
          {
            'token': acctoken.token
          },
          headers
        )
        .pipe(catchError(this.handleError));
    }
  }

  private handleError(err: any): Observable<any> {
    console.error(err);
    return err || err.message;
  }
}
