import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotiServiceService {

  private apiUrl: string = '';

  constructor(private http: HttpClient) { }

  buscar(artista: string): Observable<>{
    const url = `${this.apiUrl}/algo/${artista}`;
    return this.http.get(url)
  }


}
