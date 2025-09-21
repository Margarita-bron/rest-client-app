import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import RequestPanel from '~/components/rest-client/request-panel/request-panel';
import { REST_CLIENT_IDS } from '~/components/rest-client/rest-client-test-ids';
import { renderWithProviders } from '~/utils/testing/test-render';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: () => (key: string) => {
    const translations: Record<string, string> = {
      placeholder: 'Enter URL here...',
      send: 'Send',
      loading: 'Loading...',
    };
    return translations[key as keyof typeof translations] || key;
  },
}));

describe('RequestPanel', () => {
  const availableMethods = ['GET', 'POST', 'PUT', 'DELETE'];

  it('renders select, input and button', () => {
    renderWithProviders(
      <RequestPanel
        selectedMethod="GET"
        setSelectedMethod={vi.fn()}
        url=""
        setUrl={vi.fn()}
        loading={false}
        onSend={vi.fn()}
      />
    );

    expect(
      screen.getByTestId(REST_CLIENT_IDS.requestPanel.methodSelect)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(REST_CLIENT_IDS.requestPanel.urlInput)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(REST_CLIENT_IDS.requestPanel.sendButton)
    ).toBeInTheDocument();
  });

  it('allows changing the selected method', () => {
    const setSelectedMethod = vi.fn();
    renderWithProviders(
      <RequestPanel
        selectedMethod="GET"
        setSelectedMethod={setSelectedMethod}
        url=""
        setUrl={vi.fn()}
        loading={false}
        onSend={vi.fn()}
      />
    );

    const select = screen.getByTestId(
      REST_CLIENT_IDS.requestPanel.methodSelect
    );
    fireEvent.change(select, { target: { value: 'POST' } });
    expect(setSelectedMethod).toHaveBeenCalledWith('POST');
  });

  it('allows changing the URL', () => {
    const setUrl = vi.fn();
    renderWithProviders(
      <RequestPanel
        selectedMethod="GET"
        setSelectedMethod={vi.fn()}
        url=""
        setUrl={setUrl}
        loading={false}
        onSend={vi.fn()}
      />
    );

    const input = screen.getByTestId(REST_CLIENT_IDS.requestPanel.urlInput);
    fireEvent.change(input, { target: { value: 'https://api.example.com' } });
    expect(setUrl).toHaveBeenCalledWith('https://api.example.com');
  });

  it('calls onSend when button is clicked', () => {
    const onSend = vi.fn();
    renderWithProviders(
      <RequestPanel
        selectedMethod="GET"
        setSelectedMethod={vi.fn()}
        url=""
        setUrl={vi.fn()}
        loading={false}
        onSend={onSend}
      />
    );

    const button = screen.getByTestId(REST_CLIENT_IDS.requestPanel.sendButton);
    fireEvent.click(button);
    expect(onSend).toHaveBeenCalled();
  });

  it('disables button when loading', () => {
    renderWithProviders(
      <RequestPanel
        selectedMethod="GET"
        setSelectedMethod={vi.fn()}
        url=""
        setUrl={vi.fn()}
        loading={true}
        onSend={vi.fn()}
      />
    );

    const button = screen.getByTestId(REST_CLIENT_IDS.requestPanel.sendButton);
    expect(button).toBeDisabled();
  });
});
