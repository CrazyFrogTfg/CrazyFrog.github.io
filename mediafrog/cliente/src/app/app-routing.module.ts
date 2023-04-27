import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { BuscadorComponent } from './componentes/buscador/buscador.component';
import { LoginComponent } from './componentes/login/login.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'buscador', component: BuscadorComponent},
  {path:'login', component: LoginComponent}
  // {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
