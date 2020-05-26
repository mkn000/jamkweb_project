import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BoardComponent} from './board/board.component';
import {InfoComponent} from './info/info.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {UserComponent} from './user/user.component';
import {UserGuard} from './user.guard';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: '', component: BoardComponent},
  {path: 'info', component: InfoComponent},
  {path: 'scores', component: ScoreboardComponent},
  {path: 'user', component: UserComponent, canActivate: [UserGuard]},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
