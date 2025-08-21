import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [],
  imports: [MemberRoutingModule,
    CommonModule,MatNativeDateModule  
  ]
})
export class MemberModule { }
