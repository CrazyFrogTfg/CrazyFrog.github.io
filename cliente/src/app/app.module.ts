import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './componentes/shared/navbar/navbar.component';
import { HomeComponent } from './componentes/pages/home/home.component';
import { BuscadorComponent } from './componentes/pages/buscador/buscador.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { RegistroComponent } from './componentes/auth/registro/registro.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilComponent } from './componentes/auth/perfil/perfil.component';
import { FooterComponent } from './componentes/shared/footer/footer.component';
import { LandingComponent } from './componentes/pages/landing/landing.component';
import { NavbarLandingComponent } from './componentes/shared/navbar-landing/navbar-landing.component';
import { Error404Component } from './componentes/shared/error404/error404.component';
import { TarjetaArtistaComponent } from './componentes/pages/buscador/tarjeta-artista/tarjeta-artista.component';
import { ReproductorComponent } from './componentes/shared/reproductor/reproductor.component';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { NewPlaylistComponent } from './componentes/forms/new-playlist/new-playlist.component';
import { UsersListComponent } from './componentes/admin/users-list/users-list.component';
import { DetalleArtistaComponent } from './componentes/pages/detalle-artista/detalle-artista.component';
import { NewArtistComponent } from './componentes/forms/new-artist/new-artist.component';
import { TarjetaPlaylistComponent } from './componentes/pages/home/tarjeta-playlist/tarjeta-playlist.component';
import { TarjetaAlbumComponent } from './componentes/pages/detalle-artista/tarjeta-album/tarjeta-album.component';
import { NewAlbumComponent } from './componentes/forms/new-album/new-album.component';
import { DetalleAlbumComponent } from './componentes/pages/detalle-album/detalle-album.component';
import { TarjetaCancionComponent } from './componentes/pages/detalle-album/tarjeta-cancion/tarjeta-cancion.component';
import { NewSongComponent } from './componentes/forms/new-song/new-song.component';
import { LyricsComponent } from './componentes/pages/detalle-album/lyrics/lyrics.component';
import { ByNamePipe } from './filtros/by-name.pipe';
import { SpinnerComponent } from './componentes/shared/spinner/spinner.component';
import { DetallePlaylistComponent } from './componentes/pages/detalle-playlist/detalle-playlist.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    BuscadorComponent,
    LoginComponent,
    RegistroComponent,
    PerfilComponent,
    FooterComponent,
    LandingComponent,
    NavbarLandingComponent,
    Error404Component,
    TarjetaArtistaComponent,
    ReproductorComponent,
    NewPlaylistComponent,
    UsersListComponent,
    DetalleArtistaComponent,
    NewArtistComponent,
    TarjetaPlaylistComponent,
    TarjetaAlbumComponent,
    ByNamePipe,
    NewAlbumComponent,
    DetalleAlbumComponent,
    TarjetaCancionComponent,
    NewSongComponent,
    LyricsComponent,
    SpinnerComponent,
    DetallePlaylistComponent,
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
