import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePlaylistComponent } from './detalle-playlist.component';

describe('DetallePlaylistComponent', () => {
  let component: DetallePlaylistComponent;
  let fixture: ComponentFixture<DetallePlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePlaylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
