import {Subject, interval, Subscription, Observable, of} from 'rxjs';
import {rngInRange} from './morefunctions';

class Chara {
  icon: string;
  hp: number;
  pos: {x: number; y: number};

  constructor(x, y) {
    this.pos = {x, y};
  }

  takeDamage(dmg: number) {}

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

  constructor(x, y) {
    super(x, y);
    this.subs = [];
    this.xOffset = x;
    const rng = rngInRange(0, 1);
    let A;
    switch (rng) {
      case 0:
        A = Math.random() < 0.7 ? 1 : 2;
        this.Move = this.moveset.linear;
        break;
      case 1:
        //additional check, sine can't be spawned too close to borders
        if (x > 35 && x < 455) {
          const Amax = Math.min(Math.abs(0 - x), Math.abs(490 - x));
          A = rngInRange(35, Amax);
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

export class Player extends Chara {
  userActions: number;
  coolDown: boolean;
  giveColDmg = 2;

  constructor(pos) {
    super(5, 'P');
    this.coolDown = false;
    this.pos = pos;
    this.userActions = 3;
  }

  action() {
    this.userActions -= 1;
    if (this.userActions === 0) {
      console.log('Cooldown start!');
      this.coolDown = true;
      setTimeout(_ => {
        console.log('Cooldown end!');
        this.userActions = 3;
        this.coolDown = false;
      }, 2500);
    }
  }

  takeDamage(dmg: number) {
    this.hp -= dmg;
  }
}

export class Missile extends Chara {
  subs: Array<Subscription>;
  status = new Subject(); //send hp to logic
  updatePos: Subscription;

  constructor(x, y) {
    super(x, y);
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

export class Wall {
  hp: number = 4;
  constructor() {}
}
