import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artists } from '../interfaces/artist.interface';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {


  apiUrl: string = 'https://api.spotify.com/v1/search?q=';
  
  headers = new HttpHeaders({
    Authorization: 'Bearer BQCNWJAMe0JZ9VhfKtvp5QK0GqC7eH5ErcjEzuI__U6dsErPklIDRysoVDicVt3Jn_346USOzbL6CTcw62k'
  })    

  constructor(private http: HttpClient) { }



  buscar(artista: string): Observable<Artists>{
    const url = `${this.apiUrl}${artista}&type=artist&market=US&limit=1&offset=0`;
    return this.http.get<Artists>(url, { headers: this.headers })
  }

  getArtista(termino: string): Observable<Artists>{
    const url = `${this.apiUrl}${termino}&type=artist&market=US&limit=1&offset=0`;
    return this.http.get<Artists>(url, { headers: this.headers })    
  }

}
