import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { Auth } from '~/routes/auth';
import {
  useTr,
  type TranslateFunc,
} from '~/lib/i18n/hooks/use-translate-custom';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: vi.fn(),
}));

vi.mock('~/components/buttons/sign-in-button/sign-in-button', () => ({
  SignInButton: () => <button>Sign In</button>,
}));
vi.mock('~/components/buttons/sign-up-button/sign-up-button', () => ({
  SignUpButton: () => <button>Sign Up</button>,
}));

const translations: Record<string, string> = {
  welcome: 'Welcome to Auth Page',
  'aboutProject.title': 'About the Project',
  'aboutProject.text': 'Project description text',
  'aboutProject.source': 'Source Code',
  'aboutCourse.title': 'About the Course',
  'aboutCourse.text': 'Course details here',
  'developers.title': 'Developers',
  'developers.dev1.github': 'dev1github',
  'developers.dev1.name': 'Developer One',
  'developers.dev2.github': 'dev2github',
  'developers.dev2.name': 'Developer Two',
  'developers.dev3.github': 'dev3github',
  'developers.dev3.name': 'Developer Three',
};

describe('Auth', () => {
  const useTrMock = vi.mocked(useTr);

  beforeEach(() => {
    vi.clearAllMocks();
    useTrMock.mockReturnValue(((key: string) => {
      return translations[key] ?? key;
    }) as TranslateFunc);
  });

  it('should render title and sections', () => {
    render(<Auth />);

    expect(screen.getByText(/Welcome to Auth Page/)).toBeInTheDocument();
    expect(screen.getByText(/About the Project/)).toBeInTheDocument();
    expect(screen.getByText(/Project description text/)).toBeInTheDocument();
    expect(screen.getByText(/About the Course/)).toBeInTheDocument();
    expect(screen.getByText(/Course details here/)).toBeInTheDocument();
  });

  it('should render developers with github links', () => {
    render(<Auth />);

    expect(
      screen.getByRole('link', { name: /Developer One$/ })
    ).toHaveAttribute('href', 'https://github.com/dev1github');
    expect(
      screen.getByRole('link', { name: /Developer Two$/ })
    ).toHaveAttribute('href', 'https://github.com/dev2github');
    expect(
      screen.getByRole('link', { name: /Developer Three$/ })
    ).toHaveAttribute('href', 'https://github.com/dev3github');
  });

  it('should render button SignInButton and SignUpButton', () => {
    render(<Auth />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
