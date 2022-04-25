import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** services */
import { MapService } from '@map/map.service';
/** Components */
import { MapComponent } from '@map/map.component';

@NgModule({
  declarations: [
    MapComponent
  ],
  exports: [
    MapComponent
  ],
  providers: [
    MapService
  ],
  imports: [
    CommonModule
  ]
})
export class MapModule { }
