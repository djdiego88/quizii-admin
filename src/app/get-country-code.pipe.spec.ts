import { GetCountryCodePipe } from './get-country-code.pipe';

describe('GetCountryCodePipe', () => {
  it('create an instance', () => {
    const pipe = new GetCountryCodePipe();
    expect(pipe).toBeTruthy();
  });
});
