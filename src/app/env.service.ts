import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  private _configured = new Subject<void>();
  public configured = this._configured.asObservable();


  public gis: any = {};

/*
   * Methods
   */
  constructor() {}

  /**
   *
   * @param enviroments
   */
  public load(enviroments: any): void {
    /** set verbose comment */
    this.gis = !enviroments?.gis;

    this._configured.next();
  }

}
