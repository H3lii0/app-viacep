import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ViacepApiService {

  private readonly baseUrl: string = 'https://viacep.com.br/ws/';
  private readonly format: string = 'json';

  constructor(
    private http: HttpClient
  ) { }

  public getCep(cep: string) {
   return this.http.get(`${this.baseUrl}${cep}/${this.format}`).pipe(
    delay(1000)
   )
  }
}
