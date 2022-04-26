import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GetShippmentStatusPipe} from './get-shippment-status.pipe';

@NgModule({
  declarations: [GetShippmentStatusPipe],
  imports: [
    CommonModule
  ],
  exports: [GetShippmentStatusPipe]
})
export class GetShippmentStatusPipeModule { }
