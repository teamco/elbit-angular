import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashComponent} from './dash/dash.component';
import {RuntimeComponent} from './runtime/runtime.component';

const routes: Routes = [
  {path: '', component: DashComponent},
  {path: 'configuration', component: DashComponent},
  {path: 'runtime', component: RuntimeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
