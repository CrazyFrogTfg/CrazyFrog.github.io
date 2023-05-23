import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFavComponent } from './tarjeta-fav.component';

describe('TarjetaFavComponent', () => {
  let component: TarjetaFavComponent;
  let fixture: ComponentFixture<TarjetaFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaFavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
