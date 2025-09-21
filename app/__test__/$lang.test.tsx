import { render, screen } from '@testing-library/react';
import {
  MemoryRouter,
  Routes,
  Route,
  useParams,
  type Params,
} from 'react-router';
import { describe, it, vi, beforeEach } from 'vitest';
import { i18n } from '~/lib/i18n';

vi.mock('~/routes/not-found', () => ({
  default: () => <div>NotFound</div>,
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: vi.fn() as unknown as () => Params<string>,
  };
});

import LangLayout from '~/routes/$lang';
const useParamsMock = vi.mocked(useParams);

describe('LangLayout', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    i18n.changeLanguage = vi.fn();
    i18n.language = 'en';
  });

  it('renders NotFound if no lang param', () => {
    useParamsMock.mockReturnValue({ lang: undefined });
    render(
      <MemoryRouter>
        <LangLayout />
      </MemoryRouter>
    );
    expect(screen.getByText('NotFound')).toBeInTheDocument();
  });

  it('renders NotFound if lang param invalid', () => {
    useParamsMock.mockReturnValue({ lang: 'fr' });
    render(
      <MemoryRouter>
        <LangLayout />
      </MemoryRouter>
    );
    expect(screen.getByText('NotFound')).toBeInTheDocument();
  });

  it('calls i18n.changeLanguage if lang differs', () => {
    useParamsMock.mockReturnValue({ lang: 'ru' });
    i18n.language = 'en';
    render(
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<LangLayout />}>
            <Route path="*" element={<div>OutletChild</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(i18n.changeLanguage).toHaveBeenCalledWith('ru');
  });

  it('renders Outlet when lang is valid', () => {
    useParamsMock.mockReturnValue({ lang: 'en' });
    i18n.language = 'en';
    render(
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<LangLayout />}>
            <Route path="*" element={<div>OutletChild</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('OutletChild')).toBeInTheDocument();
  });
});
