import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Artists, Item  } from '../../interfaces/artist.interface';
import { Tracks } from '../../interfaces/tracks.interface';
import { SpotifyService } from '../../services/spotify.service';

interface TrackInfo {
  name: string;
  duration: number;
  album: string;
}

interface AlbumInfo {
  id: string;
  name: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit, AfterViewInit {

  /** Almacena la informacion del artista (resultado de) */
  artist: undefined | Item;

  /** Controla el icono de carga de las peticiones http */
  loading: boolean = false;

  /** Controla el mensaje de alerta cuando no se encuentran resultados */
  alert: boolean = false;

  /** Almacena los ids de los albumes encontrados de un artista */
  arrAlbums: AlbumInfo[] = [];

  /** Almacena los tracks de cada album encontrado de un artista */
  tracksArr: TrackInfo[] = [];
 
  /** Termino de busqueda */
  @ViewChild('termino') termino!: ElementRef<HTMLInputElement>;
  
  /**
   * Configuracion de los componentes de Angular Material
   */
  dataSource: any;
  displayedColumns: string[] = ['name', 'album'];
  pageSize: number = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }    
  }

   
  constructor(private spotify: SpotifyService) { }

  ngAfterViewInit() {}
  ngOnInit(): void {}

  /**
   * Busca la informacion de un
   */
  buscar(){
    const termino = this.termino.nativeElement.value;
    
    /** Solo realiza la busqueda si se envia un string diferente de vacio */
    if(termino.trim().length === 0){
      return;
    }
        
    this.loading = true;
    
    this.execute(termino);
  }


  /**
   * Obtiene la informacion del artista, si el artista existe entonces se buscan los albumes de este y luego se
   * procede a buscar los tracks de cada album.
   */
  private execute(termino: string){

    /** llama el servicio para buscar la informacion del artista */
    this.spotify.getArtista(termino)
    .subscribe( data => {
      
      setTimeout(() => {

        this.alert = false;
      
        /** Valida si se encontró informacion de un artista */
        if(data.artists.items.length > 0){
          this.artist = data.artists.items[0];
          
          /** Si se encontro el artista, llama el servicio para buscar los albumes */
          this.spotify.getAlbums(data.artists.items[0].id)
          .subscribe( albums => {
            
            /** asigna la informacion de los albumes */
            this.arrAlbums = this._filterAlbumInfo(albums.items);
            
            /** recibe array de promesas de los tracks por album */
            let promises = this.spotify.getPromises(this.arrAlbums);
            
            /** resuelve todas las promesas en paralelo */
            Promise.all(promises).then(values => {
                                            this.loading = false;
                                            this._getTracks(values)                                          
                                        })
                                      })
  
        }else{
          this.loading = false;
          this.artist = undefined;
          this.alert = data.artists.total == 0 ? true : false;
        }        

      }, 3000);

    }, async( errorService ) => {
      console.log(errorService)
        /**
         * Si el token expiró se refresca y se vuelve a ejecutar la búsqueda
         */
        if(errorService.status === 401){
          await this.spotify.refreshToken();
          
          /** Ejecuta nuevamente la búsqueda */
          this.execute(termino)
          
        }
    })
  }

  /**
   * De toda la información que regresan los albumes de un artista, se mapea la data y se extrae solo el id y el name de cada album
   * @param albums 
   */
  private _filterAlbumInfo(albums: any ){
    return albums.map((elm:any) => ({ id: elm.id, name: elm.name }))    
  }

  /**
   * Genera un array de objetos que contiene la informacion básica de los tracks obtenidos de cada album
   * @param tracksByAlmbum 
   */
  private _getTracks(tracksByAlmbum: any[]){

    this.tracksArr = [];
    
    tracksByAlmbum.forEach(album => {
      
      album.items.forEach((track: any) => {
        this.tracksArr.push({
          name: track.name,
          duration: track.duration_ms,
          album: this._getAlbumInfo(album.href)
        })
      });

    });

    /** Se ordenan los tracks y actualiza la referencia del array de los tracks para que el componente de la tabla detecte el cambio de estado 
     * de la propiedad this.tracksArr muestre los resultados 
     */
    this.tracksArr = [...this.tracksArr.sort((a, b) => (a.name > b.name) ? 1 : -1)]

    /** Angular Materia Components */
    this.dataSource = new MatTableDataSource(this.tracksArr);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;    
  }

  /**
   * De la url del album se extrae su id para poder extraer la informacion de los albumes previamente almacenada en la propiedad this.arrAlbums
   * @param albumUrl 
   * @returns 
   */
   private _getAlbumInfo(albumUrl: string){
    let parts = albumUrl.split('/');
    return this.arrAlbums.filter(el => el.id === parts[5])[0].name;
  }



}
