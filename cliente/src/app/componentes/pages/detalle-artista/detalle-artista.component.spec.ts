import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleArtistaComponent } from './detalle-artista.component';

describe('DetalleArtistaComponent', () => {
  let component: DetalleArtistaComponent;
  let fixture: ComponentFixture<DetalleArtistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleArtistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleArtistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
