import {Component, OnInit} from '@angular/core';
import {ScoreService} from '../score.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  leaders;

  constructor(public scores: ScoreService) {}

  ngOnInit(): void {
    this.scores.fetchLeaders().subscribe(data => {
      this.leaders = data;
    });
  }
}
