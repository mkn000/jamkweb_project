import {Component, OnInit, OnDestroy} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {Enemy, Missile} from '../entities';
import {Subscription, interval, Subject} from 'rxjs';
import {UserService} from '../user.service';
import {rngInRange, distance} from '../morefunctions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css', '../app.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  BUTTONWIDTH: number;
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

  constructor(
    public scores: UserService,
    public bpObserver: BreakpointObserver
  ) {
    //observe media query breakpoints to keep game board logic in check
    this.bpObserver
      .observe([
        '(max-width:420px)',
        '(max-width:490px)',
        '(max-width:700px)',
        '(min-width:700px)'
      ])
      .subscribe((result: BreakpointState) => {
        if (
          result.breakpoints['(max-width:700px)'] ||
          result.breakpoints['(min-width:700px)']
        ) {
          this.BUTTONWIDTH = 70;
          this.BOARDHEIGHT = 700;
        }
        if (result.breakpoints['(max-width:490px)']) {
          this.BUTTONWIDTH = 60;
          this.BOARDHEIGHT = 600;
        }
        if (result.breakpoints['(max-width:420px)']) {
          console.log('pieni');
          this.BUTTONWIDTH = 50;
          this.BOARDHEIGHT = 500;
        }
      });
  }

  ngOnInit(): void {
    this.prevSpawnTime = Date.now();
    this.prevShotTime = Date.now();
    this.gameStatus = false;
    this.wall = {hp: 4};
  }

  ngOnDestroy(): void {
    this.bpObserver.ngOnDestroy();
    //score over 0 means the game has progressed atleast one loop
    if (this.score > 0) {
      this.gameLoop.unsubscribe();
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
        if (this.missiles[i]) {
          this.missiles[i].terminate();
          delete this.missiles[i];
        }
      }
    }
  }

  newGame() {
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
      //spawn enemies every 1.5 seconds
      if (Math.abs(this.prevSpawnTime - now) > 1500) {
        this.spawnEnemy();
      }

      if (this.wall.hp < 0) {
        this.gameOver();
        //personal best score and leaderboard admittance are on backend
        this.scoreCheck = this.scores.checkScore(this.score).subscribe(res => {
          console.log(res);
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
    let e = new Enemy(this.BUTTONWIDTH);
    let s = e.status.subscribe((e: Enemy) => {
      if (
        e.curPos.y > this.BOARDHEIGHT ||
        e.curPos.y > this.BOARDHEIGHT - this.wall.hp * 12
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
      let m = new Missile(this.BUTTONWIDTH * (i + 0.5), this.BOARDHEIGHT);
      let s = m.status.subscribe((m: Missile) => {
        //destroy on hit
        for (let i = 0, L = this.enemies.length; i < L; i++) {
          if (
            this.enemies[i] &&
            distance(m.curPos, this.enemies[i].curPos) < 25
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
