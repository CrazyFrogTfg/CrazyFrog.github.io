import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './componentes/shared/navbar/navbar.component';
import { HomeComponent } from './componentes/home/home.component';
import { BuscadorComponent } from './componentes/buscador/buscador.component';
import { LoginComponent } from './componentes/usuarios/login/login.component';
import { RegistroComponent } from './componentes/usuarios/registro/registro.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilComponent } from './componentes/usuarios/perfil/perfil.component';
import { FooterComponent } from './componentes/shared/footer/footer.component';
import { LandingComponent } from './componentes/landing/landing.component';
import { NavbarLandingComponent } from './componentes/shared/navbar-landing/navbar-landing.component';
import { Error404Component } from './componentes/shared/error404/error404.component';
import { ArtistaComponent } from './componentes/pages/artista/artista.component';
import { ReproductorComponent } from './componentes/reproductor/reproductor.component';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { NamePlaylistPipe } from './filtros/name-playlist.pipe';



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
    ArtistaComponent,
    ReproductorComponent,
    NamePlaylistPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
