import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { BuscadorComponent } from './componentes/buscador/buscador.component';
import { LoginComponent } from './componentes/usuarios/login/login.component';
import { RegistroComponent } from './componentes/usuarios/registro/registro.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { PerfilComponent } from './componentes/usuarios/perfil/perfil.component';
import { LandingComponent } from './componentes/landing/landing.component';
import { Error404Component } from './componentes/shared/error404/error404.component';

const routes: Routes = [
  {path: '', redirectTo: '/landing', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, ...canActivate(() => redirectUnauthorizedTo(['/registro']))},
  {path: 'buscador', component: BuscadorComponent, ...canActivate(() => redirectUnauthorizedTo(['/registro']))},
  {path: 'login', component: LoginComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'registro', component: RegistroComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'perfil', component: PerfilComponent, ...canActivate(() => redirectUnauthorizedTo(['/registro']))},
  {path: 'landing', component: LandingComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
