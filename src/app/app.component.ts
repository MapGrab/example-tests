import { AfterContentInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map, Popup } from 'maplibre-gl';
import { installMapGrab } from '@mapgrab-priv/map-interface';
import { point } from '@turf/turf';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterContentInit {
  private map?: Map;

  public ngAfterContentInit(): void {
    this.map = new Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 1,
    });

    const map = this.map;

    map.on('click', 'countries-label', (ev) => {
      const point = map.unproject(ev.point);
      new Popup({ className: 'info-popup__city' })
        .setText(ev.features![0]!.properties['NAME'])
        .setLngLat(point)
        .addTo(map);
    });

    installMapGrab(map, 'mainMap');
  }

  showDot(): void {
    const map = this.map!;
    const { lat, lng } = this.map!.getCenter();

    const circleC = point([lng, lat]);

    // Add the circle as a GeoJSON source
    map.addSource('center-dot', {
      type: 'geojson',
      data: circleC,
    });

    // Add a fill layer with some transparency
    map.addLayer({
      id: 'center-dot',
      type: 'circle',
      source: 'center-dot',
      paint: {
        'circle-radius': 20,
        'circle-color': 'red',
      },
    });
  }
}
