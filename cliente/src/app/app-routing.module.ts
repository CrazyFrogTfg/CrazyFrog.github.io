import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/pages/home/home.component';
import { BuscadorComponent } from './componentes/pages/buscador/buscador.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { RegistroComponent } from './componentes/auth/registro/registro.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { PerfilComponent } from './componentes/auth/perfil/perfil.component';
import { LandingComponent } from './componentes/pages/landing/landing.component';
import { Error404Component } from './componentes/shared/error404/error404.component';
import { NewPlaylistComponent } from './componentes/forms/new-playlist/new-playlist.component';
import { UsersListComponent } from './componentes/admin/users-list/users-list.component';
import { DetalleArtistaComponent } from './componentes/pages/detalle-artista/detalle-artista.component';
import { NewArtistComponent } from './componentes/forms/new-artist/new-artist.component';
import { NewAlbumComponent } from './componentes/forms/new-album/new-album.component';
import { DetalleAlbumComponent } from './componentes/pages/detalle-album/detalle-album.component';
import { NewSongComponent } from './componentes/forms/new-song/new-song.component';


const routes: Routes = [
  {path: '', redirectTo: '/landing', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'buscador', component: BuscadorComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'login', component: LoginComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'registro', component: RegistroComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'perfil', component: PerfilComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'landing', component: LandingComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'newplaylist', component: NewPlaylistComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'newalbum', component: NewAlbumComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'newartist', component: NewArtistComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'newsong', component: NewSongComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'users', component: UsersListComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'artista', component: DetalleArtistaComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'album', component: DetalleAlbumComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
