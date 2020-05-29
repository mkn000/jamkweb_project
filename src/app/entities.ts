import {Subject, interval, Subscription, Observable, of} from 'rxjs';
import {rngInRange} from './morefunctions';

class Chara {
  icon: string;
  hp: number;
  pos: {x: number; y: number};

  constructor() {}

  get curPos(): {x: number; y: number} {
    return {x: this.pos.x, y: this.pos.y};
  }
}

export class Enemy extends Chara {
  subs: Array<Subscription>;
  status = new Subject();
  updatePos: Subscription;
  xOffset: number;
  moveset = {
    //linear
    linear: (A: number) => {
      this.pos.y += A;
    },
    sine: (A: number) => {
      this.pos.y += 1;
      this.pos.x =
        this.xOffset + A * Math.sin(this.pos.y * ((2 * Math.PI) / 96));
    }
  };

  constructor(private B: number) {
    super();
    //spawnpoint is directly on top of one the buttons
    const posrng = rngInRange(0, 6);
    const _x = B * (posrng + 0.5);
    this.pos = {x: _x, y: 0};
    this.subs = [];
    this.xOffset = _x;
    const moverng = rngInRange(0, 1);
    let A;
    switch (moverng) {
      case 0:
        //move speed
        A = Math.random() < 0.7 ? 1 : 2;
        this.Move = this.moveset.linear;
        break;
      case 1:
        //additional check, sine can't be spawned too close to borders
        if (_x > B / 2 && _x < 6.5 * B) {
          //sine amplitude
          const Amax = Math.min(_x, Math.abs(6 * B - _x));
          A = rngInRange(B / 2, Amax);
          this.Move = this.moveset.sine;
          break;
        }
      default:
        A = Math.random() < 0.1 ? 1 : 2;
        this.Move = this.moveset.linear;
    }
    this.subs[0] = interval(17).subscribe(_ => {
      this.Move(A);
      this.status.next(this);
    });
  }

  Move(p?: any): void {}

  terminate() {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
  }
}

export class Missile extends Chara {
  subs: Array<Subscription>;
  status = new Subject(); //send hp to logic
  updatePos: Subscription;

  constructor(private _x: number, _y: number) {
    super();
    this.pos = {x: _x, y: _y};
    this.subs = [];
    this.subs[0] = interval(17).subscribe(_ => {
      this.Move();
      this.status.next(this);
    });
  }

  Move() {
    this.pos.y -= 2;
  }

  terminate() {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
  }
}
