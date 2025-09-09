import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../footer';

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders GitHub link correctly', () => {
    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink).toBeTruthy();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/Margarita-bron/rest-client-appp'
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders course link correctly', () => {
    const courseLink = screen.getByText('Course').closest('a');
    expect(courseLink).toBeTruthy();
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );

    const logo = screen.getByAltText('RSS Logo') as HTMLImageElement;
    expect(logo).toBeTruthy();
  });

  it('renders copyright text', () => {
    expect(screen.getByText('© 2025 MVA Project')).toBeTruthy();
  });
});
