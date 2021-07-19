import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Artists, Item } from '../../interfaces/artist.interface';
import { Tracks } from '../../interfaces/tracks.interface';
import { SpotifyService } from '../../services/spotify.service';

export interface TrackInfo {
  name: string;
  duration: number;
  album: string;
}

export interface AlbumInfo {
  id: string;
  name: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit {

  artist = {} as Item;
  loading: boolean = false;
  alert: boolean = false;
  arrAlbums: AlbumInfo[] = [];
  tracksArr: TrackInfo[] = [];

  

  @ViewChild('termino') termino!: ElementRef<HTMLInputElement>;

  displayedColumns: string[] = ['name', 'duration', 'album'];

  constructor(private spotify: SpotifyService) { }

  ngOnInit(): void {
  }

  buscar(){

    const termino = this.termino.nativeElement.value;

    if(termino.trim().length === 0){
      return;
    }

    this.loading = true;

    this.spotify.getArtista(termino)
                  .subscribe( data => {
                    console.log(data)

                    if(data.artists.items.length > 0){
                      this.artist = data.artists.items[0];

                      this.spotify.getAlbums(data.artists.items[0].id)
                                    .subscribe( albums => {
                                      console.log(albums)
                                      this.loading = false;

                                      /** asigna la informacion de los albumes */
                                      this.arrAlbums = this._filterAlbumInfo(albums.items);

                                      /** recibe array de promesas de los tracks por album */
                                      let promises = this.spotify.getPromises(this.arrAlbums);

                                      /** resuelve todas las promesas en paralelo */
                                      Promise.all(promises).then(values => {
                                        this._getTracks(values)
                                      })
                                    })

                    }else{
                      this.alert = data.artists.total == 0 ? true : false;
                    }


                  }, ( errorService ) => {
                      console.log(errorService)
                  })
  }

  private _filterAlbumInfo(albums: any ){
    return albums.map((elm:any) => ({ id: elm.id, name: elm.name }))    
  }

  private _getAlbumInfo(albumUrl: string){
    let parts = albumUrl.split('/');
    return this.arrAlbums.filter(el => el.id === parts[5])[0].name;
  }

  private _getTracks(tracksByAlmbum: any[]){
console.log(tracksByAlmbum)

    tracksByAlmbum.forEach(album => {
      
      album.items.forEach((track: any) => {
        this.tracksArr.push({
          name: track.name,
          duration: track.duration_ms,
          album: this._getAlbumInfo(album.href)
        })
      });

    });

    this.tracksArr.sort((a, b) => (a.name > b.name) ? 1 : -1)

    console.log(this.tracksArr)
  }


}
