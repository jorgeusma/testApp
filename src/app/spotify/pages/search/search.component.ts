import { Component, OnInit } from '@angular/core';
import { Artists } from '../../interfaces/artist.interface';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit {

  artist = {};

  constructor(private spotify: SpotifyService) { }

  ngOnInit(): void {
  }

  buscar(termino: string){
    this.spotify.getArtista(termino)
    .subscribe( data => {
      console.log(data)
      this.artist = data.artists.items[0];
    })
  }


}
