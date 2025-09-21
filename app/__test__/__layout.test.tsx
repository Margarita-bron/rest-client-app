import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import Layout from '~/routes/__layout';
import { store } from '~/redux/store';

describe('Layout', () => {
  it('should render Header and Footer', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render Outlet with content', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/child']}>
          <Routes>
            <Route path="*" element={<Layout />}>
              <Route path="child" element={<div>dverfesafsr</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('dverfesafsr')).toBeInTheDocument();
  });
});
