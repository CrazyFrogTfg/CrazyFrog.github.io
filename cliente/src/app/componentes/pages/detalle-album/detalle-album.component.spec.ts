import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAlbumComponent } from './detalle-album.component';

describe('DetalleAlbumComponent', () => {
  let component: DetalleAlbumComponent;
  let fixture: ComponentFixture<DetalleAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleAlbumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
