import {Component, OnInit, OnDestroy} from '@angular/core';
import {Enemy, Missile} from '../entities';
import {Subscription, interval, Subject} from 'rxjs';
import {ScoreService} from '../score.service';
import {rngInRange, distance} from '../morefunctions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  BOARDHEIGHT: number = 750;
  gameStatus: boolean;
  buttons = new Array(7);
  enemies: Enemy[];
  missiles: Missile[];
  gameLoop: Subscription;
  scoreCheck: Subscription;
  prevSpawnTime: number;
  prevShotTime: number;
  prevCannon: number;
  score: number;
  terminator = new Subject();
  wall;
  ranOnce: boolean;

  constructor(public scores: ScoreService) {}

  ngOnInit(): void {
    this.ranOnce = false;
    this.prevSpawnTime = Date.now();
    this.prevShotTime = Date.now();
    this.gameStatus = false;
    this.wall = {hp: 4};
  }

  ngOnDestroy(): void {
    if (this.ranOnce) {
      this.gameLoop.unsubscribe();
      this.scoreCheck.unsubscribe();
      //delete references to enemies
      for (let i = 0, L = this.enemies.length; i < L; i++) {
        if (this.enemies[i]) {
          this.enemies[i].terminate();
          //this.enemies[i].status.unsubscribe();
          delete this.enemies[i];
        }
      }
      //delete references to missiles
      for (let i = 0, L = this.missiles.length; i < L; i++) {
        this.missiles[i].terminate();
        delete this.missiles[i];
      }
    }
  }

  newGame() {
    this.ranOnce = true;
    this.gameStatus = true;
    this.score = 0;
    //this.buttons = new Array(7);
    this.enemies = [];
    this.missiles = [];
    this.prevCannon = null;
    this.wall = {hp: 4};
    this.gameLoop = interval(100).subscribe(_ => {
      this.score += 10;
      let now = Date.now();
      //remove nulls
      this.enemies = this.enemies.filter(_ => {
        return true;
      });
      this.missiles = this.missiles.filter(_ => {
        return true;
      });
      //spawn enemies every 2 seconds
      if (Math.abs(this.prevSpawnTime - now) > 2000) {
        this.spawnEnemy();
      }

      if (this.wall.hp < 0) {
        this.scoreCheck = this.scores.checkScore(this.score).subscribe(res => {
          console.log(res);
          this.gameOver();
        });
      }
    });
  }

  gameOver() {
    this.gameStatus = false;
    //unsubscribe observables
    this.ngOnDestroy();
  }

  spawnEnemy(): void {
    this.prevSpawnTime = Date.now();
    const rng = rngInRange(0, 6);
    let e = new Enemy(rng * 70 + 35, 0);
    let s = e.status.subscribe((e: Enemy) => {
      if (
        e.curPos.y > this.BOARDHEIGHT ||
        e.curPos.y > this.BOARDHEIGHT - this.wall.hp * 10
      ) {
        this.wall.hp -= 1;
        e.terminate();
        delete this.enemies[this.enemies.indexOf(e)];
      }
    });
    e.subs.push(s);
    this.enemies.push(e);
  }

  buttonClick(i: number): void {
    if (
      (i === this.prevCannon &&
        Math.abs(this.prevShotTime - Date.now()) > 2000) ||
      (i !== this.prevCannon && Math.abs(this.prevShotTime - Date.now()) > 1000)
    ) {
      this.prevCannon = i;
      this.prevShotTime = Date.now();
      let m = new Missile(i * 70 + 35, this.BOARDHEIGHT);
      let s = m.status.subscribe((m: Missile) => {
        //destroy on hit
        for (let i = 0, L = this.enemies.length; i < L; i++) {
          if (
            this.enemies[i] &&
            distance(m.curPos, this.enemies[i].curPos) < 40
          ) {
            //destroy on impact
            this.enemies[i].terminate();
            m.terminate();
            setTimeout(_ => {
              delete this.enemies[i];
              delete this.missiles[this.missiles.indexOf(m)];
            }, 16);
          } else if (m.curPos.y < 1) {
            //destroy on border
            m.terminate();
            setTimeout(_ => {
              delete this.missiles[this.missiles.indexOf(m)];
            }, 16);
          }
        }
      });
      m.subs.push(s);
      this.missiles.push(m);
    }
  }

  entityStyle(e: Enemy | Missile) {
    if (e) {
      const style = {
        'position': 'absolute',
        'top': e.pos.y + 'px',
        'left': e.pos.x + 'px'
      };
      return style;
    }
  }

  wallStyle() {
    let style;
    if (this.wall.hp >= 0) {
      style = {
        'height': this.wall.hp * 10 + 'px'
      };
    } else {
      style = {'height': 0 + 'px'};
    }
    return style;
  }
}
