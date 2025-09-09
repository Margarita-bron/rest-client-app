import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignUpButton } from '../sign-up-button';
import { ROUTES } from '~/routes-path';
import { SIGN_UP_BUTTON_DATA } from '~/components/sign-up-button/sign-up-button-data';

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    Link: (props: any) => <a {...props}>{props.children}</a>,
  };
});

describe('SignUpButton', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<SignUpButton />);
  });

  it('renders the Sign Up button', () => {
    const link = screen.getByTestId(SIGN_UP_BUTTON_DATA['data-testid']);
    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('Sign Up');
  });

  it('points to the correct route', () => {
    const link = screen.getByTestId(SIGN_UP_BUTTON_DATA['data-testid']);
    expect(link.getAttribute('to') || link.getAttribute('href')).toBe(
      ROUTES.signUp
    );
  });

  it('calls console.log on click', () => {
    const link = screen.getByTestId(SIGN_UP_BUTTON_DATA['data-testid']);
    fireEvent.click(link);
    expect(consoleSpy).toHaveBeenCalledWith('Sign Up clicked');
    consoleSpy.mockRestore();
  });
});
