import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaCancionComponent } from './tarjeta-cancion.component';

describe('TarjetaCancionComponent', () => {
  let component: TarjetaCancionComponent;
  let fixture: ComponentFixture<TarjetaCancionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaCancionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaCancionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
