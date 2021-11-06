import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mapbox';

  constructor(
    private http: HttpClient,public wsService:WebsocketService
  ){

    this.escucharSocket();
  }



  escucharSocket() {

  }
}
