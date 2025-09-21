import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import SignIn from '~/routes/sign-in';
import SignUp from '~/routes/sign-up';

vi.mock('~/components/auth-forms/sign-in-form/sign-in-form', () => ({
  SignInForm: () => <div data-testid="sign-in-form">SignInForm</div>,
}));

vi.mock('~/components/auth-forms/sign-up-form/sign-up-form', () => ({
  SignUpForm: () => <div data-testid="sign-up-form">SignUpForm</div>,
}));

describe('Auth pages', () => {
  it('SignIn renders SignInForm', () => {
    render(<SignIn />);
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    expect(screen.getByText('SignInForm')).toBeInTheDocument();
  });

  it('SignUp renders SignUpForm', () => {
    render(<SignUp />);
    expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
    expect(screen.getByText('SignUpForm')).toBeInTheDocument();
  });
});
