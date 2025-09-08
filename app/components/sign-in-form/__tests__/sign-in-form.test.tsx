import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SignInForm } from '../sign-in-form';
import { SIGN_IN_FORM_DATA } from '../sign-in-form.data';

beforeEach(() => {
  render(
    <MemoryRouter>
      <SignInForm />
    </MemoryRouter>
  );
});

describe('SignInForm', () => {
  it('renders form fields and submit button', () => {
    expect(
      screen.getByTestId(SIGN_IN_FORM_DATA.email['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_IN_FORM_DATA.password['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_IN_FORM_DATA.submit['data-testid'])
    ).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    fireEvent.click(
      screen.getByTestId(SIGN_IN_FORM_DATA.submit['data-testid'])
    );

    const emailInput = screen.getByTestId(
      SIGN_IN_FORM_DATA.email['data-testid']
    );
    const passwordInput = screen.getByTestId(
      SIGN_IN_FORM_DATA.password['data-testid']
    );

    const emailError = await screen.findByText((content, element) => {
      return !!(
        element &&
        element.tagName.toLowerCase() === 'p' &&
        element.parentElement?.contains(emailInput) &&
        content.trim() !== ''
      );
    });

    const passwordError = await screen.findByText((content, element) => {
      return !!(
        element &&
        element.tagName.toLowerCase() === 'p' &&
        element.parentElement?.contains(passwordInput) &&
        content.trim() !== ''
      );
    });

    expect(emailError).toBeTruthy();
    expect(emailError.textContent).not.toBe('');

    expect(passwordError).toBeTruthy();
    expect(passwordError.textContent).not.toBe('');
  });

  it('calls onSubmit with correct data', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    fireEvent.change(
      screen.getByTestId(SIGN_IN_FORM_DATA.email['data-testid']),
      {
        target: { value: 'test@example.com' },
      }
    );
    fireEvent.change(
      screen.getByTestId(SIGN_IN_FORM_DATA.password['data-testid']),
      {
        target: { value: 'password123' },
      }
    );

    fireEvent.click(
      screen.getByTestId(SIGN_IN_FORM_DATA.submit['data-testid'])
    );

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
        email: 'test@example.com',
        password: 'password123',
      })
    );

    consoleSpy.mockRestore();
  });
});
