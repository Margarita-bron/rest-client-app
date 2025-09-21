import React, { type PropsWithChildren } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '~/redux/store';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '~/lib/i18n';

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = '/',
    ...renderOptions
  }: { route?: string } & Omit<Parameters<typeof rtlRender>[1], 'wrapper'> = {}
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </I18nextProvider>
      </Provider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
