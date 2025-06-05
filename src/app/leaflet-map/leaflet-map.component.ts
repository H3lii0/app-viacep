import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.scss'
})
export class LeafletMapComponent implements OnInit {
  @Input() latitude: string = '';
  @Input() longitude: string = '';
  @Input() logadouro: string = '';
  map: L.Map | undefined;
  
  ngOnInit() {
    
  }

  initMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([parseFloat(this.latitude), parseFloat(this.longitude)], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.addMarker();
  }

  addMarker() {
    if (this.latitude && this.longitude && this.map) {
      const marker = L.marker([parseFloat(this.latitude), parseFloat(this.longitude)]).addTo(this.map);
      marker.bindPopup(this.logadouro).openPopup();
    }
  }
}
