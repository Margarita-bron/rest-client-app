import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignOutButton } from '../sign-out-button';
import * as firebaseModule from '~/utils/firebase/firebase';
import { ROUTES } from '~/routes-path';

vi.mock('~/utils/firebase/firebase', () => ({
  logout: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignOutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the button with correct text', () => {
    render(
      <MemoryRouter>
        <SignOutButton />
      </MemoryRouter>
    );

    const button = screen.getByText('Sign out');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-indigo-500');
  });

  it('calls logout and navigates home on click', () => {
    render(
      <MemoryRouter>
        <SignOutButton />
      </MemoryRouter>
    );

    const button = screen.getByText('Sign out');
    fireEvent.click(button);

    expect(firebaseModule.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.home);
  });
});
