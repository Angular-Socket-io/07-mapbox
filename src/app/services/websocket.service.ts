import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor(
    private socket: Socket
  ) {
    this.checkStatus();
  }


  checkStatus(){
    this.socket.on('connect', () => {
      console.log('conectado al servidor');
      this.socketStatus = true;
    });

    this.socket.on('disconnect',()=>{
      console.log('desconectado del servidor');
      this.socketStatus = false;
    });

    this.socket.on("connect_error", (err:any) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  emit(evento:string, payload?:any,callback?: ()=>void){
    this.socket.emit( evento, payload, callback );
  }

  listen(evento:string){
    return this.socket.fromEvent(evento);
  }



}
