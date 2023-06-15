import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { SearchComponent } from './components/pages/search/search.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { LandingComponent } from './components/pages/landing/landing.component';
import { Error404Component } from './components/shared/error404/error404.component';
import { NewPlaylistComponent } from './components/forms/new-playlist/new-playlist.component';
import { UsersListComponent } from './components/admin/users-list/users-list.component';
import { ArtistDetailComponent } from './components/pages/artist-detail/artist-detail.component';
import { NewArtistComponent } from './components/forms/new-artist/new-artist.component';
import { NewAlbumComponent } from './components/forms/new-album/new-album.component';
import { AlbumDetailComponent } from './components/pages/album-detail/album-detail.component';
import { NewSongComponent } from './components/forms/new-song/new-song.component';
import { PlaylistDetailComponent } from './components/pages/playlist-detail/playlist-detail.component';


const routes: Routes = [
  {path: '', redirectTo: '/landing', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'buscador', component: SearchComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'login', component: LoginComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'registro', component: RegisterComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'perfil', component: ProfileComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'landing', component: LandingComponent, ...canActivate(() => redirectLoggedInTo(['/home']))},
  {path: 'newplaylist', component: NewPlaylistComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'newalbum', component: NewAlbumComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'newartist', component: NewArtistComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'newsong', component: NewSongComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'users', component: UsersListComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'artista', component: ArtistDetailComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'album', component: AlbumDetailComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'playlist', component: PlaylistDetailComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
