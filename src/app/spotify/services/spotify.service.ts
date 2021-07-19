import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artists } from '../interfaces/artist.interface';
import { Albums } from '../interfaces/albums.interface';
import { Tracks } from '../interfaces/tracks.interface';
import { Token } from '../interfaces/token.interface';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  apiUrl: string = 'https://api.spotify.com/v1/';
  
  headers = new HttpHeaders({
    Authorization: 'Bearer BQB-o8MT_nhJ5ZK6bbkz3Lmb5Wj7W-DH4Nd8ViWK0o2N98z4tNM2UsBpO0HfzU1S4M0mUE3Y4gOs6eAog6c'
  })    

  constructor(private http: HttpClient) { }

  /**
   * Busca el nombre del artista y regresa el codigo spotify
   * @param termino {string} termino
   * @returns 
   */
  getArtista(termino: string): Observable<Artists>{
    const url = `${this.apiUrl}search?q=${termino}&type=artist&market=US&limit=1&offset=0`;
    return this.http.get<Artists>(url, { headers: this.headers })    
  }

  /**
   * Obtiene los albumes de un artista
   * @param artist {string} codigo del artista
   * @returns 
   */
  getAlbums(artist: string): Observable<Albums>{
    const url = `${this.apiUrl}artists/${artist}/albums?include_groups=album&market=US&limit=50`;
    return this.http.get<Albums>(url, { headers: this.headers })    
  }

  /**
   * Obtiene las canciones de todos los albumes. Como no existe un end-point que regrese todos los tracks de un artista
   * primero se obtienen los ids de los albumes y luego se recorren para generar un array de promesas que seran resueltas
   * en paralelo con promise.all
   * @param albums {array} ids de los albumes
   * @returns 
   */
  getPromises(albums: {id:string}[]) {
    
    let promiseArray: Promise<Tracks>[] = [];
    albums.forEach(el => {
      promiseArray.push(
        this.http.get<Tracks>(`${this.apiUrl}albums/${el.id}/tracks?market=US`, { headers: this.headers}).toPromise()
      )
    })

    return promiseArray;
  }

  /**
   * Refresca el access token generado por spotify. Una vez expira el token, la aplicación detecta el codigo 401 y 
   * genera un nuevo token para realizar nuevamente la búsqueda del artista
   * @returns 
   */
  refreshToken():Promise<void> {
    return new Promise<void>((resolve, reject) =>{
      const url = `http://pruebas.gcrisk.co:3000/spotify/388f0ac2065a4063a8367a3f99418077/f0f226193652406b9c9ad35c5dce3a85`;
      this.http.get<Token>(url).subscribe(res => {
        console.log(res)
        this.headers = new HttpHeaders({
          Authorization: `Bearer ${res.access_token}`
        });
        resolve()
      });
    })
  }


}
