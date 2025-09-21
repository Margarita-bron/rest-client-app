import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import Reset from '~/routes/reset';
import { renderWithProviders } from '~/utils/testing/test-render';

describe('Reset', () => {
  it('should render reset form', () => {
    renderWithProviders(<Reset />);
    expect(
      screen.getByRole('heading', { name: /reset password/i })
    ).toBeInTheDocument();
  });
});
