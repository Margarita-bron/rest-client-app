import { screen } from '@testing-library/react';
import { Footer } from '~/components/footer/footer';
import rsLogo from '~/assets/rss-logo.svg';
import githubLogo from '~/assets/github.svg';
import { renderWithProviders } from '~/utils/testing/test-render';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: () => (key: string) => key,
}));

describe('Footer', () => {
  beforeEach(() => {
    renderWithProviders(<Footer />);
  });

  it('renders GitHub link with logo and correct attributes', () => {
    const githubLink = screen.getByRole('link', { name: /source/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/Margarita-bron/rest-client-app'
    );

    const githubImg = screen.getByAltText('GitHub Logo');
    expect(githubImg).toBeInTheDocument();
    expect(githubImg).toHaveAttribute('src', githubLogo);
  });

  it('renders RS School link with logo and correct attributes', () => {
    const rsLink = screen.getByRole('link', { name: /course/i });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');

    const rsImg = screen.getByAltText('RS School Logo');
    expect(rsImg).toBeInTheDocument();
    expect(rsImg).toHaveAttribute('src', rsLogo);
  });

  it('renders the year text', () => {
    const yearText = screen.getByText('year');
    expect(yearText).toBeInTheDocument();
  });
});
