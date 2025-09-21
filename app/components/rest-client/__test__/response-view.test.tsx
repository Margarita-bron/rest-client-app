import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import ResponseView from '~/components/rest-client/response-view/response-view';
import { REST_CLIENT_IDS } from '~/components/rest-client/rest-client-test-ids';
import { renderWithProviders } from '~/utils/testing/test-render';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: () => (key: string, opts?: { message?: string }) => {
    const translations: Record<string, string> = {
      title: 'Response',
      showRaw: 'Show Raw',
      showJson: 'Show JSON',
      showHeaders: 'Show Headers',
      hideHeaders: 'Hide Headers',
      headersTitle: 'Headers',
      sendRequestToSeeResponse: 'Send request to see response',
      error: opts?.message || 'Error occurred',
    };
    return translations[key as keyof typeof translations] || key;
  },
}));

describe('ResponseView', () => {
  const mockResponseData = { message: 'ok' };
  const mockResponseRaw = '{"message":"ok"}';
  const mockHeaders = { 'Content-Type': 'application/json' };

  it('renders empty state when no response and not loading', () => {
    renderWithProviders(
      <ResponseView
        loading={false}
        error={null}
        responseData={null}
        responseRaw=""
        responseHeaders={{}}
        responseSize={undefined}
        statusCode={undefined}
        showRaw={false}
        setShowRaw={vi.fn()}
        showHeaders={false}
        setShowHeaders={vi.fn()}
      />
    );

    const body = screen.getByTestId(REST_CLIENT_IDS.responseView.responseBody);
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent('Send request to see response');
  });

  it('renders loader when loading', () => {
    renderWithProviders(
      <ResponseView
        loading={true}
        error={null}
        responseData={null}
        responseRaw=""
        responseHeaders={{}}
        responseSize={undefined}
        statusCode={undefined}
        showRaw={false}
        setShowRaw={vi.fn()}
        showHeaders={false}
        setShowHeaders={vi.fn()}
      />
    );

    const body = screen.getByTestId(REST_CLIENT_IDS.responseView.responseBody);
    expect(body.querySelector('div')).toBeInTheDocument();
  });

  it('renders responseData as JSON when showRaw is false', () => {
    renderWithProviders(
      <ResponseView
        loading={false}
        error={null}
        responseData={mockResponseData}
        responseRaw={mockResponseRaw}
        responseHeaders={mockHeaders}
        responseSize={123}
        statusCode={200}
        showRaw={false}
        setShowRaw={vi.fn()}
        showHeaders={false}
        setShowHeaders={vi.fn()}
      />
    );

    const body = screen.getByTestId(REST_CLIENT_IDS.responseView.responseBody);
    expect(body.textContent).toContain('"message": "ok"');
  });

  it('renders responseRaw when showRaw is true', () => {
    renderWithProviders(
      <ResponseView
        loading={false}
        error={null}
        responseData={mockResponseData}
        responseRaw={mockResponseRaw}
        responseHeaders={mockHeaders}
        responseSize={123}
        statusCode={200}
        showRaw={true}
        setShowRaw={vi.fn()}
        showHeaders={false}
        setShowHeaders={vi.fn()}
      />
    );

    const body = screen.getByTestId(REST_CLIENT_IDS.responseView.responseBody);
    expect(body).toHaveTextContent(mockResponseRaw);
  });

  it('renders headers when showHeaders is true', () => {
    renderWithProviders(
      <ResponseView
        loading={false}
        error={null}
        responseData={mockResponseData}
        responseRaw={mockResponseRaw}
        responseHeaders={mockHeaders}
        responseSize={123}
        statusCode={200}
        showRaw={false}
        setShowRaw={vi.fn()}
        showHeaders={true}
        setShowHeaders={vi.fn()}
      />
    );

    const headers = screen.getByTestId(
      REST_CLIENT_IDS.responseView.responseHeaders
    );
    expect(headers).toHaveTextContent('Content-Type: application/json');
  });

  it('calls setShowRaw and setShowHeaders when toggle buttons are clicked', () => {
    const setShowRaw = vi.fn();
    const setShowHeaders = vi.fn();

    renderWithProviders(
      <ResponseView
        loading={false}
        error={null}
        responseData={mockResponseData}
        responseRaw={mockResponseRaw}
        responseHeaders={mockHeaders}
        responseSize={123}
        statusCode={200}
        showRaw={false}
        setShowRaw={setShowRaw}
        showHeaders={false}
        setShowHeaders={setShowHeaders}
      />
    );

    fireEvent.click(
      screen.getByTestId(REST_CLIENT_IDS.responseView.toggleRawButton)
    );
    expect(setShowRaw).toHaveBeenCalledWith(true);

    fireEvent.click(
      screen.getByTestId(REST_CLIENT_IDS.responseView.toggleHeadersButton)
    );
    expect(setShowHeaders).toHaveBeenCalledWith(true);
  });

  it('renders error message when error is provided', () => {
    const errorMsg = 'Network error';
    renderWithProviders(
      <ResponseView
        loading={false}
        error={errorMsg}
        responseData={null}
        responseRaw=""
        responseHeaders={{}}
        responseSize={undefined}
        statusCode={undefined}
        showRaw={false}
        setShowRaw={vi.fn()}
        showHeaders={false}
        setShowHeaders={vi.fn()}
      />
    );

    const error = screen.getByTestId(REST_CLIENT_IDS.responseView.errorMessage);
    expect(error).toHaveTextContent(errorMsg);
  });
});
