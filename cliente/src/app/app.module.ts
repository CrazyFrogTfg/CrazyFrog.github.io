import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './componentes/shared/navbar/navbar.component';
import { HomeComponent } from './componentes/pages/home/home.component';
import { SearchComponent } from './componentes/pages/search/search.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { RegisterComponent } from './componentes/auth/register/register.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './componentes/auth/profile/profile.component';
import { FooterComponent } from './componentes/shared/footer/footer.component';
import { LandingComponent } from './componentes/pages/landing/landing.component';
import { NavbarLandingComponent } from './componentes/shared/navbar-landing/navbar-landing.component';
import { Error404Component } from './componentes/shared/error404/error404.component';
import { ArtistCardComponent } from './componentes/cards/artist-card/artist-card.component';
import { ReproductorComponent } from './componentes/shared/reproductor/reproductor.component';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { NewPlaylistComponent } from './componentes/forms/new-playlist/new-playlist.component';
import { UsersListComponent } from './componentes/admin/users-list/users-list.component';
import { ArtistDetailComponent } from './componentes/pages/artist-detail/artist-detail.component';
import { NewArtistComponent } from './componentes/forms/new-artist/new-artist.component';
import { PlaylistCardComponent } from './componentes/cards/playlist-card/playlist-card.component';
import { AlbumCardComponent } from './componentes/cards/album-card/album-card.component';
import { NewAlbumComponent } from './componentes/forms/new-album/new-album.component';
import { AlbumDetailComponent } from './componentes/pages/album-detail/album-detail.component';
import { SongCardComponent } from './componentes/cards/song-card/song-card.component';
import { NewSongComponent } from './componentes/forms/new-song/new-song.component';
import { LyricsComponent } from './componentes/shared/lyrics/lyrics.component';
import { ByNamePipe } from './filtros/by-name.pipe';
import { SpinnerComponent } from './componentes/shared/spinner/spinner.component';
import { PlaylistDetailComponent } from './componentes/pages/playlist-detail/playlist-detail.component';
import { FavCardComponent } from './componentes/cards/fav-card/fav-card.component';
import { TimePipe } from './filtros/time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SearchComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    FooterComponent,
    LandingComponent,
    NavbarLandingComponent,
    Error404Component,
    ArtistCardComponent,
    ReproductorComponent,
    NewPlaylistComponent,
    UsersListComponent,
    ArtistDetailComponent,
    NewArtistComponent,
    PlaylistCardComponent,
    AlbumCardComponent,
    ByNamePipe,
    NewAlbumComponent,
    AlbumDetailComponent,
    SongCardComponent,
    NewSongComponent,
    LyricsComponent,
    SpinnerComponent,
    PlaylistDetailComponent,
    FavCardComponent,
    TimePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
