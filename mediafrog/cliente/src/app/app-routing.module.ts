import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { BuscadorComponent } from './componentes/buscador/buscador.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { PerfilComponent } from './componentes/perfil/perfil.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, ...canActivate(() => redirectUnauthorizedTo(['/registro']))},
  {path: 'buscador', component: BuscadorComponent, ...canActivate(() => redirectUnauthorizedTo(['/registro']))},
  {path: 'login', component: LoginComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'registro', component: RegistroComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'perfil', component: PerfilComponent, ...canActivate(() => redirectUnauthorizedTo(['/registro']))},
  // {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
