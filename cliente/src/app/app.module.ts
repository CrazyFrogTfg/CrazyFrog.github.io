import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SearchComponent } from './components/pages/search/search.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { LandingComponent } from './components/pages/landing/landing.component';
import { NavbarLandingComponent } from './components/shared/navbar-landing/navbar-landing.component';
import { Error404Component } from './components/shared/error404/error404.component';
import { ArtistCardComponent } from './components/cards/artist-card/artist-card.component';
import { ReproductorComponent } from './components/shared/reproductor/reproductor.component';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { NewPlaylistComponent } from './components/forms/new-playlist/new-playlist.component';
import { UsersListComponent } from './components/admin/users-list/users-list.component';
import { ArtistDetailComponent } from './components/pages/artist-detail/artist-detail.component';
import { NewArtistComponent } from './components/forms/new-artist/new-artist.component';
import { PlaylistCardComponent } from './components/cards/playlist-card/playlist-card.component';
import { AlbumCardComponent } from './components/cards/album-card/album-card.component';
import { NewAlbumComponent } from './components/forms/new-album/new-album.component';
import { AlbumDetailComponent } from './components/pages/album-detail/album-detail.component';
import { SongCardComponent } from './components/cards/song-card/song-card.component';
import { NewSongComponent } from './components/forms/new-song/new-song.component';
import { LyricsComponent } from './components/shared/lyrics/lyrics.component';
import { ByNamePipe } from './filters/by-name.pipe';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { PlaylistDetailComponent } from './components/pages/playlist-detail/playlist-detail.component';
import { FavCardComponent } from './components/cards/fav-card/fav-card.component';
import { TimePipe } from './filters/time.pipe';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

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
    ResetPasswordComponent,
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
