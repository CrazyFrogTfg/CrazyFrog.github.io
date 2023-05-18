import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaPlaylistComponent } from './tarjeta-playlist.component';

describe('TarjetaPlaylistComponent', () => {
  let component: TarjetaPlaylistComponent;
  let fixture: ComponentFixture<TarjetaPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaPlaylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
