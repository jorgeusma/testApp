import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'search', loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule) },
  { path: '**', pathMatch: 'full', redirectTo: 'search' },
]

@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SpotifyModule { }
