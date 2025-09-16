import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SignInButton } from '../sign-in-button';

describe('SignInButton', () => {
  it('renders the button with correct text', () => {
    render(
      <MemoryRouter>
        <SignInButton />
      </MemoryRouter>
    );

    const button = screen.getByText('Sign In');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('rounded-lg');
    expect(button.getAttribute('href')).toBe('/sign-in');
  });
});
