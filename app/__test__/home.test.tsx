import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it } from 'vitest';
import { Auth } from '~/routes/auth';
import Home from '~/routes/home';

describe('Home', () => {
  it('should render Auth', () => {
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/guestPage.welcome/i, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/guestPage.aboutProject.title/i, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/guestPage.aboutProject.text/i, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/guestPage.aboutProject.source/i, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/guestPage.aboutCourse.title/, { exact: false })
    ).toBeInTheDocument();
  });
});
