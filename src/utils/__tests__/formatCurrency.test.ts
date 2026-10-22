import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats Vietnamese đồng without runtime-dependent currency symbols', () => {
    expect(formatCurrency(1500000)).toBe('1.500.000 đ');
  });

  it('rounds fractional values to whole đồng', () => {
    expect(formatCurrency(1250.7)).toBe('1.251 đ');
  });
});