import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

const headers = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/';

  pb: number = 0;
  leaders;
  constructor(public http: HttpClient) {}

  fetchLeaders(): Observable<any> {
    return this.http.get(this.apiUrl + 'leaderboard');
    //.pipe(catchError(this.handleError));
  }

  fetchUser(): Observable<Object> {
    const acctoken = JSON.parse(sessionStorage['accesstoken']);
    const headers = {
      headers: new HttpHeaders({'x-access-token': acctoken.token})
    };
    return this.http.get(this.apiUrl + `users/me`, headers).pipe(
      map((res: {score: number}) => {
        this.pb = res.score;
        return res;
      })
    );
  }

  /**send score to backend to see if its personal best or good enough to enter
   * the leaderboard
   */

  checkScore(newScore: number) {
    try {
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
    } catch {
      return of({message: 'Not logged in'});
    }
  }

  private handleError(err: any): Observable<any> {
    console.error(err);
    return of(err || err.message);
  }
}
