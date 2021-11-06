import * as mapboxgl from 'mapbox-gl';
import { Component, OnInit } from '@angular/core';
import { Lugar } from '../../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/services/websocket.service';


interface RespMarcadores {
  [key: string]: Lugar
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit {
  constructor(private http:HttpClient,
              private wsService:WebsocketService) {}

  mapa!: mapboxgl.Map;

  lugares:RespMarcadores = {};
  markerMapbox: {[key:string]:mapboxgl.Marker} = {};

  ngOnInit(): void {
    this.http.get<RespMarcadores>('http://localhost:5000/mapa')
    .subscribe( (lugares) => {
      this.lugares = lugares
      this.crearMapa();
    } );

    this.escucharSockets();
  }

  escucharSockets(){
    // marcador-nuevo para
    this.wsService.listen('marcador-nuevo').subscribe( (marcador:any)=>{
      this.agregarMarcador(marcador);
    } )
    //marcador-mover
    this.wsService.listen('marcador-mover').subscribe( ( marcador:any)=>{
      this.markerMapbox[marcador.id].setLngLat([marcador.lng,marcador.lat]);
    } )

    //marcador-borrar
    this.wsService.listen('marcador-borrado').subscribe( (id:any)=>{
      this.markerMapbox[id].remove();
      delete this.markerMapbox[id];
    } )

  }

  crearMapa() {
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiamRhdmlkbWVuZGV6IiwiYSI6ImNrdHl6dTIyZTBjdXIydnBtNGlocmIzNjMifQ.Uf9oLy6DGKsRpgJaR3pHfg';
    this.mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-75.75512993582937, 45.349977429009954],
      zoom: 15.8,
    });

    for( const [key, marcador] of Object.entries(this.lugares)){
      this.agregarMarcador(marcador);
    }
  }

  agregarMarcador(marcador:Lugar){
    const html = `
      <h2>${ marcador.nombre }</h2>
      <br>
      <button>Borrar</button>
    `;
    const h2 = document.createElement('h2')
    h2.innerHTML = marcador.nombre;
    const btnBorrar = document.createElement('button');
    btnBorrar.innerText = 'Borrar'; //
    const div = document.createElement('div');
    div.append(h2,btnBorrar);

    const customPopUp = new mapboxgl.Popup({
      offset: 25,
      closeOnClick:false
    }).setDOMContent(div);

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: marcador.color,
    })
    .setLngLat([marcador.lng, marcador.lat])
    .setPopup( customPopUp )
    .addTo(this.mapa);

    marker.on('drag',()=>{
      const lnglat = marker.getLngLat();
      const nuevoMarcador = {
        id: marcador.id,
        lat: lnglat.lat,
        lng: lnglat.lng,
      }
      this.wsService.emit('marcador-mover',nuevoMarcador);
    })

    btnBorrar.addEventListener('click',()=>{
      marker.remove();
      this.wsService.emit('marcador-borrar',marcador.id);

    });

    this.markerMapbox[marcador.id] = marker;
  }

  crearMarcador(){
    const customMarker: Lugar = {
      id: new Date().toISOString(),
      lng: -75.75512993582937,
      lat:  45.349977429009954,
      nombre: 'prueba',
      color:'#' + Math.floor(Math.random() * 16777215).toString(16)
    }
    this.agregarMarcador(customMarker);

    //Emitir marcador-nuevo
    this.wsService.emit('marcador-nuevo', customMarker);
  }
}
