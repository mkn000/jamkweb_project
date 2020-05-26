import {Component, OnInit, OnDestroy} from '@angular/core';
import {ScoreService} from '../score.service';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit, OnDestroy {
  leaders: {name: string; score: string}[];
  sub: Subscription;
  subl: Subscription;
  pb: number;
  loggedin;

  constructor(public scores: ScoreService) {}

  ngOnInit(): void {
    /*this.scores.fetchLeaders().subscribe(data => {
      this.leaders = data;
    });*/
    const acctoken = sessionStorage['accesstoken'];
    if (acctoken) {
      this.loggedin = true;
      this.sub = this.scores.fetchScore().subscribe((res: {score: number}) => {
        this.pb = res.score;
      });
    } else {
      this.loggedin = false;
    }

    this.subl = this.scores
      .fetchLeaders()
      .subscribe((entries: {name: string; score: number}[]) => {
        const sorted = entries.sort((a, b) => b.score - a.score);
        this.leaders = sorted.map(e => {
          return {name: e.name, score: e.score.toString()};
        });
        //fill empty spots display 5 slots
        while (this.leaders.length < 5) {
          this.leaders.push({name: '-', score: '-'});
        }
      });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.subl.unsubscribe();
  }
}
