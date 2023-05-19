import { ByNamePipe } from './byName.pipe';

describe('NameAlbumPipe', () => {
  it('create an instance', () => {
    const pipe = new ByNamePipe();
    expect(pipe).toBeTruthy();
  });
});
