import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private httpClient = inject(HttpClient);

  constructor() { }


  getBanners() {
    return this.httpClient.get<any>(`${Environment.base_url}/banner`);
  }

}
