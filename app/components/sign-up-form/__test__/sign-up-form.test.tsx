import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SignUpForm } from '../sign-up-form';
import { SIGN_UP_FORM } from '../sign-up-form.data';

beforeEach(() => {
  render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>
  );
});

describe('SignUpForm', () => {
  it('renders form fields and submit button', () => {
    expect(
      screen.getByTestId(SIGN_UP_FORM.email['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_UP_FORM.password['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_UP_FORM.submit['data-testid'])
    ).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));

    const emailInput = screen.getByTestId(SIGN_UP_FORM.email['data-testid']);
    const passwordInput = screen.getByTestId(
      SIGN_UP_FORM.password['data-testid']
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

    fireEvent.change(screen.getByTestId(SIGN_UP_FORM.email['data-testid']), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByTestId(SIGN_UP_FORM.password['data-testid']), {
      target: { value: 'Abc123$%' },
    });

    fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
        email: 'test@example.com',
        password: 'Abc123$%',
      })
    );

    consoleSpy.mockRestore();
  });

  it('shows password validation messages for invalid passwords', async () => {
    const passwordInput = screen.getByTestId(
      SIGN_UP_FORM.password['data-testid']
    );

    fireEvent.change(passwordInput, { target: { value: 'Ab1$' } });
    fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));
    expect(
      await screen.findByText('Password must be at least 8 characters long')
    ).toBeTruthy();

    fireEvent.change(passwordInput, { target: { value: '12345678$' } });
    fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));
    expect(
      await screen.findByText('Password must include at least one letter')
    ).toBeTruthy();

    fireEvent.change(passwordInput, { target: { value: 'Abcdefg$' } });
    fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));
    expect(
      await screen.findByText('Password must include at least one digit')
    ).toBeTruthy();

    fireEvent.change(passwordInput, { target: { value: 'Abc12345' } });
    fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));
    expect(
      await screen.findByText(
        'Password must include at least one special character'
      )
    ).toBeTruthy();
  });
});
