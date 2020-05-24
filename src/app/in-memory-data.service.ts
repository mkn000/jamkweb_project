import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const leaders = [
      {
        name: 'keijo',
        score: 150000
      },
      {
        name: 'hessu',
        score: 120000
      },
      {
        name: 'markku',
        score: 110000
      },
      {
        name: 'esa',
        score: 100000
      },
      {
        name: 'slayer',
        score: 50000
      }
    ];
    return {leaders};
  }
}
