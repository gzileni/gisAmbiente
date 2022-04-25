import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

/** Main Component */
import { AppComponent } from './app.component';

/** UI */
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularSplitModule } from 'angular-split';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

/** Material Design */

import { MaterialModule } from './material/material.module';
import { MapModule } from '@map/map.module';
import { SearchModule } from '@search/search.module';
import { AmbienteModule } from '@ambiente/ambiente.module';
import { EnvService } from './env.service'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularSplitModule,
    BrowserAnimationsModule,
    SearchModule,
    MapModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    AmbienteModule
  ],
  providers: [
    EnvService,
    {
      provide: APP_INITIALIZER,
      useFactory: (env: EnvService) => () => env.load(environment),
      deps: [EnvService],
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
