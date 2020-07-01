import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeToyNewRoutingModule } from './home-toy-new-routing.module';
import { RouterModule } from '@angular/router';
import { HomeToyNewComponent } from './home-toy-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [HomeToyNewComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HomeToyNewRoutingModule,
    RouterModule.forChild([{ path: '', component: HomeToyNewComponent }]),
  ]
})
export class HomeToyNewModule { }
