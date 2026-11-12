import { CopPipe, KmPipe } from './cop.pipe';

describe('CopPipe', () => {
  const pipe = new CopPipe();

  it('formats Colombian pesos without decimals', () => {
    const text = pipe.transform(1_500_000);
    expect(text).toContain('1.500.000');
    expect(text).toContain('$');
  });

  it('renders an em dash for empty values', () => {
    expect(pipe.transform(null)).toBe('—');
    expect(pipe.transform(undefined)).toBe('—');
  });
});

describe('KmPipe', () => {
  it('formats kilometers with thousands separator', () => {
    expect(new KmPipe().transform(60_450)).toBe('60.450 km');
  });
});
