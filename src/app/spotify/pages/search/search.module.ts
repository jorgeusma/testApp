import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { NoimagePipe } from '../../pipes/noimage.pipe';


const routes: Routes = [
  { path: '', component: SearchComponent }
];

@NgModule({
  declarations: [
    SearchComponent,
    NoimagePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    RouterModule.forChild(routes)
  ]
})
export class SearchModule { }
