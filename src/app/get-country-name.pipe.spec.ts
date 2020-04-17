import { GetCountryNamePipe } from './get-country-name.pipe';

describe('GetCountryNamePipe', () => {
  it('create an instance', () => {
    const pipe = new GetCountryNamePipe();
    expect(pipe).toBeTruthy();
  });
});
