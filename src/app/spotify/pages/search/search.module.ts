import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { NoimagePipe } from '../../pipes/noimage.pipe';
import { ComponentsModule } from '../../components/components.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';

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
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ]
})
export class SearchModule { }
