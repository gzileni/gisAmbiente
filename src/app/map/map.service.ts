import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { GeoJSON } from 'ol/format';
import ZoomSlider from 'ol/control/ZoomSlider';
import { defaults as defaultControls } from 'ol/control';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
} from 'ol/style';
import { createXYZ } from 'ol/tilegrid';
import { tile } from 'ol/loadingstrategy';

import { EnvService } from '../env.service';

import 'ol/ol.css';

import _ from 'lodash-es';

export enum ServiceType {
  WFS,
  WMS,
  WMS_TIME
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _clicked = new Subject<any>();
  public clicked = this._clicked.asObservable();

  private extent: Array<number> = [13.686, 38.948, 20.353, 43.064];
  private center: Array<number> = [16.860542, 40.828257];
  private layers: Array<string> = ['stations']

  public map!: Map;
  public view!: View;
  private _srCode: number = 4326;

  private _stations!: any;
  private _layer_foto: any = null;
  public is_layer_foto: boolean = false;

  constructor(private env: EnvService) {
    this._layer_foto = new TileLayer({
      extent: this.extent,
      opacity: 0.7,
      source: new TileWMS({
        url: 'http://webapps.sit.puglia.it/arcgis/services/BaseMaps/Ortofoto2019/ImageServer/WMSServer',
        params: {'LAYERS': '0', 'TILED': true},
        serverType: 'geoserver',
        transition: 1
      })
    })
  }

  public get srCode(): number {
    return this._srCode;
  }

  public get epsg(): string {
    return `EPSG:${this.srCode}`
  }

  /**
   * OpenStreet Map Layer
   */
  public get OSM(): any {
    return new TileLayer({
      source: new OSM(),
    })
  }

  public get stations(): any {
    return this._stations
  }

  public get XYZ(): any {
    return new TileLayer({
      source: new XYZ({
        attributions:
        'Tiles courtesy of ' +
        '<a href="http://openstreetmap.org">' +
        'OpenStreetMap' +
        '</a>',
        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    })
  }

  /**
   *
   * @param layers
   * @returns
   */
  public get_url_wfs(layers: Array<string>): string {
    return `/geoserver/wfs?service=WFS&REQUEST=GetFeature&version=1.1.1&TYPENAME=${_.join(layers, ',')}&OUTPUTFORMAT=application/json&SRSNAME=${this.epsg}`;
  }

  /**
   *
   * @param element
   */
  public init(element: string): void {

    const url: string = this.get_url_wfs(this.layers)

    const stations_source: any = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return url;
      },
      strategy: tile(createXYZ({
        tileSize: 512
      })),
    });

    const marker: any = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: 'red'
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1,
        }),
      })
    });

    const stations: any = new VectorLayer({
      source: stations_source,
      style: marker
    });

    this.view = new View({
      projection: this.epsg,
      zoom: 8,
      center: this.center,
      extent: this.extent
    });

    this.map = new Map({
      view: this.view,
      layers: [
        this.OSM,
        this._layer_foto,
        new TileLayer({
          extent: this.env.gis.extent,
          source: new TileWMS({
            url: 'http://webapps.sit.puglia.it/arcgis/services/ServicesArcIMS/batimetria/MapServer/WMSServer',
            params: {'LAYERS': '0', 'TILED': true},
            serverType: 'geoserver',
            transition: 1
          })
        }),
        new TileLayer({
          extent: this.env.gis.extent,
          source: new TileWMS({
            url: 'http://webapps.sit.puglia.it/arcgis/services/Background/TNOInquadramento/MapServer/WMSServer',
            params: {'LAYERS': '6,5,3,4,59', 'TILED': true},
            serverType: 'geoserver',
            transition: 1
          })
        }),
        stations
      ],
      target: element,
      controls: defaultControls().extend([new ZoomSlider()])
    });

    this._layer_foto.setVisible(false);

    this.map.on('singleclick', (event: any) => {
      this._clicked.next({
        coordinates: event.coordinate,
        pixel: event.pixel
      });
    });

  }

  /**
   *
   */
  public add_layer_foto(): void {
    this.is_layer_foto = !this.is_layer_foto;

    if (this.is_layer_foto == true) {
      this._layer_foto.setVisible(true);
    } else {
     this._layer_foto.setVisible(false);
    }
  }

  /**
   *
   * @param coordinate
   * @param pixel
   * @param tollerance
   * @returns
   */
  public async getFeatureFromMap(pixel: Array<number>,
                                 tollerance?: number): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      let result: any;
      /** tollerance by pixel */
      const t: number = tollerance != null && tollerance != undefined ? tollerance : 5;

      /** load data about feature by coordinate */
      this.map.forEachFeatureAtPixel(pixel, (feature: any, layer: any) => {
        resolve(feature)
      },
      {
        layerFilter: (layer: any) => this._filterLayer(layer),
        hitTolerance: t,
      });
    })


  }

  /**
   *
   * @param layer
   * @returns
   */
  private _filterLayer(layer: string): boolean | any {
    return _.findIndex(this.env.gis.layers, (item:string) => {
      return item == layer
    })
  }

  /**
   *
   */
  public get_url(layers: Array<string>, filter?: string): string {
    const f: string = filter != null && filter != undefined ? filter : ''
    return `${this.get_url_wfs(layers)}${f}`
  }


}
