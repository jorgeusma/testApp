import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artists } from '../interfaces/artist.interface';
import { Albums } from '../interfaces/albums.interface';
import { Tracks } from '../interfaces/tracks.interface';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  apiUrl: string = 'https://api.spotify.com/v1/';
  
  headers = new HttpHeaders({
    Authorization: 'Bearer BQCHWslhve25P7g7Fzlvlrc_Zybr5MsMvYemw_nNGtwLadgHQI0XWAr5uP2j9oe0pkpGymsm3UP3cMLd3XU'
  })    

  constructor(private http: HttpClient) { }

  getArtista(termino: string): Observable<Artists>{
    const url = `${this.apiUrl}search?q=${termino}&type=artist&market=US&limit=1&offset=0`;
    return this.http.get<Artists>(url, { headers: this.headers })    
  }

  getAlbums(artist: string): Observable<Albums>{
    const url = `${this.apiUrl}artists/${artist}/albums?include_groups=album&market=US&limit=50`;
    return this.http.get<Albums>(url, { headers: this.headers })    
  }


  getPromises(albums: any[]) {
    
    let promiseArray: any[] = [];
    albums.forEach(el => {
      promiseArray.push(
        this.http.get<Tracks>(`${this.apiUrl}albums/${el.id}/tracks?market=US`, { headers: this.headers}).toPromise()
      )
    })

    return promiseArray;
  }


}
