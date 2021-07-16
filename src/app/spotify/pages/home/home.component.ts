import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  artist: string = "";
  


  constructor(private spotifyService: SpotifyService) {

    // this.spotifyService.buscar('whitesnake')
    // .subscribe(res => {
    //   console.log(res.artists.items.images)
    // })    
   }

  ngOnInit(): void {
  }

  buscar(){
    this.spotifyService.buscar('whitesnake')
    .subscribe(res => {      
      console.log(res)
    })
  }

}
