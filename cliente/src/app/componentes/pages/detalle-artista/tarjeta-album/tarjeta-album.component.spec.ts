import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaAlbumComponent } from './tarjeta-album.component';

describe('TarjetaAlbumComponent', () => {
  let component: TarjetaAlbumComponent;
  let fixture: ComponentFixture<TarjetaAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaAlbumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
