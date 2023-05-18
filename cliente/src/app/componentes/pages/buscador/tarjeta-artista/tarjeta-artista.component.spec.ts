import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaArtistaComponent } from './tarjeta-artista.component';

describe('ArtistaComponent', () => {
  let component: TarjetaArtistaComponent;
  let fixture: ComponentFixture<TarjetaArtistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaArtistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaArtistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
