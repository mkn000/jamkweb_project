import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {LayoutModule} from '@angular/cdk/layout';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BoardComponent} from './board/board.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {InfoComponent} from './info/info.component';
import {UserComponent} from './user/user.component';
import {LoginComponent} from './login/login.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ScoreboardComponent,
    InfoComponent,
    UserComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
