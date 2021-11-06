import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapaComponent } from './components/mapa/mapa.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

const config: SocketIoConfig = { url: environment.wsUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
