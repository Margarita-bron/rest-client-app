import { fireEvent, screen } from '@testing-library/react';
import { LanguageToggleButton } from '~/components/header/language-toggle-button';
import { renderWithProviders } from '~/utils/testing/test-render';
import { HEADER_TEST_IDS } from '~/components/header/header-test-ids';
import * as router from 'react-router';
import * as useToggleLanguageModule from '~/lib/i18n/hooks/use-toggle-language';
import { vi } from 'vitest';
import type { Location, Params } from 'react-router';

describe('LanguageToggleButton', () => {
  const navigateMock = vi.fn();
  const toggleMock = vi.fn();

  beforeEach(() => {
    navigateMock.mockClear();
    toggleMock.mockClear();

    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock);

    const locationMock: Location = {
      pathname: '/en/some-path',
      search: '',
      hash: '',
      state: null,
      key: 'test',
    };
    vi.spyOn(router, 'useLocation').mockReturnValue(locationMock);

    const paramsMock: Params<string> = { lang: 'en' };
    vi.spyOn(router, 'useParams').mockReturnValue(paramsMock);

    vi.spyOn(useToggleLanguageModule, 'useToggleLanguage').mockReturnValue({
      locale: 'en',
      toggleLanguage: toggleMock,
    });
  });

  it('highlights RU when locale is ru', () => {
    vi.spyOn(useToggleLanguageModule, 'useToggleLanguage').mockReturnValue({
      locale: 'ru',
      toggleLanguage: toggleMock,
    });

    renderWithProviders(<LanguageToggleButton />);

    const ruSpan = screen.getByText('RU');
    const enSpan = screen.getByText('EN');

    expect(ruSpan).toHaveClass('bg-indigo-500');
    expect(enSpan).not.toHaveClass('bg-indigo-500');
  });

  it('highlights EN when locale is en', () => {
    renderWithProviders(<LanguageToggleButton />);

    const ruSpan = screen.getByText('RU');
    const enSpan = screen.getByText('EN');

    expect(enSpan).toHaveClass('bg-indigo-500');
    expect(ruSpan).not.toHaveClass('bg-indigo-500');
  });

  it('toggles language and calls navigate with the new URL', () => {
    renderWithProviders(<LanguageToggleButton />);

    const toggleButton = screen.getByTestId(
      HEADER_TEST_IDS.langiageToggleButton
    );

    fireEvent.click(toggleButton);

    expect(toggleMock).toHaveBeenCalled();
  });

  it('adds a language to the path if missing', () => {
    const locationMock: Location = {
      pathname: '/some-path',
      search: '',
      hash: '',
      state: null,
      key: 'test',
    };
    vi.spyOn(router, 'useLocation').mockReturnValue(locationMock);

    const paramsMock: Params<string> = { lang: undefined };
    vi.spyOn(router, 'useParams').mockReturnValue(paramsMock);

    renderWithProviders(<LanguageToggleButton />);

    const toggleButton = screen.getByTestId(
      HEADER_TEST_IDS.langiageToggleButton
    );
    fireEvent.click(toggleButton);

    expect(toggleMock).toHaveBeenCalled();
  });
});
