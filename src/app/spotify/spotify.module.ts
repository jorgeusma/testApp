import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SpotifyModule { }
