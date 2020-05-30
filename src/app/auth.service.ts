import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt'; // kirjasto jwt:n käsittelyyn
import {Observable} from 'rxjs';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class AuthService {
  private apiUrl = '/api/users'; // autentikaatiopalvelun osoite
  public token: string;
  private jwtHelp = new JwtHelperService(); // helpperipalvelu jolla dekoodataan token
  private subject = new Subject<any>(); // subjectilla viesti navbariin että token on tullut

  constructor(private http: HttpClient) {
    // Jos token on jo sessionStoragessa, otetaan se sieltä muistiin
    const currentUser = JSON.parse(sessionStorage.getItem('accesstoken'));
    this.token = currentUser && currentUser.token;
  }

  //register new user
  register(username: string, password: string): Observable<Object> {
    return this.http
      .post(`${this.apiUrl}/register`, {
        username: username,
        password: password
      })
      .pipe(
        map((res: {success: boolean; message: string; token?: string}) => {
          if (res.success) {
            //check token just in case
            const payload = this.jwtHelp.decodeToken(res.token);
            if (payload.username === username) {
              // token sessionStorageen
              sessionStorage.setItem(
                'accesstoken',
                JSON.stringify({
                  username: username,
                  token: res.token,
                  dbid: payload.dbid
                })
              );
              this.token = res.token;
            }
          }
          return res;
        })
      );
  }

  login(username: string, password: string): Observable<boolean> {
    // tässä ei käytetä JSON.stringify -metodia lähtevälle tiedolle
    return this.http
      .post(`${this.apiUrl}/login`, {username: username, password: password})
      .pipe(
        map(res => {
          //console.log(res); // loggaa alla olevan tyylisen vastauksen
          /*
        {success: true, message:
          "Tässä on valmis Token!",
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…zNzV9.x1gWEg9DtoPtEUUHlR8aDgpuzG6NBNJpa2L-MEhyraQ"}
        */
          const token = res['token']; // otetaan vastauksesta token
          if (token) {
            this.token = token;
            /* Tässä tutkitaan onko tokenin payloadin sisältö oikea.
             Jos on, laitetaan token sessionStorageen ja palautetaan true
             jolloin käyttäjä pääsee Admin-sivulle
          */
            try {
              // dekoodataan token
              const payload = this.jwtHelp.decodeToken(token);
              // Tässä voidaan tarkistaa tokenin oikeellisuus
              if (payload.username === username) {
                // token sessionStorageen
                sessionStorage.setItem(
                  'accesstoken',
                  JSON.stringify({
                    username: username,
                    token: token,
                    dbid: payload.dbid
                  })
                );
                //this.loginTrue(); // lähetetään viesti navbariin että vaihdetaan login:true -tilaan
                console.log('login onnistui');
                return true; // saatiin token
              } else {
                console.log('login epäonnistui');
                return false; // ei saatu tokenia
              }
            } catch (err) {
              return false;
            }
          } else {
            console.log('tokenia ei ole');
            return false;
          }
        })
      );
  }

  loginTrue(): Observable<any> {
    this.subject.next(true);
    return this.subject.asObservable();
  }

  // logout poistaa tokenin sessionStoragesta
  logout(): void {
    this.token = null;
    sessionStorage.removeItem('accesstoken');
  }

  delete(): Observable<any> {
    const headers = {
      headers: new HttpHeaders({'x-access-token': this.token})
    };
    return this.http.delete(this.apiUrl, headers);
  }
}
