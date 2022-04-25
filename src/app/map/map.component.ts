import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MapService } from 'src/app/map/map.service';
import { EnvService } from '../env.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {

  constructor(private map: MapService,
              private env: EnvService) {}

  ngOnInit() {

    this.env.configured.subscribe(() => {
      console.log(JSON.stringify(this.env.gis));
    });

    this.map.init('map');

  }

}
