import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import RestClient from '~/routes/rest-client';

vi.mock('~/components/rest-client/rest-client-page', () => ({
  default: () => <div data-testid="rest-client-page">RestClientPage</div>,
}));

describe('RestClient page', () => {
  it('renders RestClientPage component', () => {
    render(<RestClient />);
    expect(screen.getByTestId('rest-client-page')).toBeInTheDocument();
    expect(screen.getByText('RestClientPage')).toBeInTheDocument();
  });
});
