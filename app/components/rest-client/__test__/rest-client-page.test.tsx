import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import RestClientPage from '~/components/rest-client/rest-client-page';
import { renderWithProviders } from '~/utils/testing/test-render';
import { REST_CLIENT_IDS } from '~/components/rest-client/rest-client-test-ids';
import userEvent from '@testing-library/user-event';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: () => (key: string) => key,
}));

vi.mock('~/lib/firebase/firebase', () => ({
  auth: {},
  saveUserRequestHistory: vi.fn(),
}));

const sendRequestMock = vi.fn().mockResolvedValue({
  data: { message: 'ok' },
  error: null,
  duration: 123,
  statusCode: 200,
  responseSize: 15,
});

vi.mock('~/components/rest-client/hooks/use-send-request', () => ({
  useSendRequest: () => ({
    sendRequest: sendRequestMock,
    loading: false,
    error: null,
    responseData: { message: 'ok' },
    responseRaw: '{"message":"ok"}',
    responseHeaders: { 'Content-Type': 'application/json' },
  }),
}));

vi.mock('~/hooks/use-variables', () => ({
  useVariables: () => ({
    variables: [],
  }),
}));

vi.mock('~/lib/routing/navigation', () => ({
  useRouter: () => ({ navigate: vi.fn() }),
}));

vi.mock('~/components/rest-client/replaceVariablesInRequest', () => ({
  replaceVariablesInRequest: (url: string, body: string, headers: unknown) => ({
    url,
    body,
    headers,
  }),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [{ uid: 'uidname', email: 'emal' }, false, null],
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react-router');
  return {
    ...actual,
    MemoryRouter: actual.MemoryRouter,
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams()],
  };
});

describe('RestClientPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all main components', () => {
    renderWithProviders(<RestClientPage />);
    expect(
      screen.getByTestId(REST_CLIENT_IDS.requestPanel.methodSelect)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(REST_CLIENT_IDS.requestPanel.urlInput)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(REST_CLIENT_IDS.requestPanel.sendButton)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(REST_CLIENT_IDS.headersEditor.title)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(REST_CLIENT_IDS.responseView.title)
    ).toBeInTheDocument();
  });

  it('allows adding, updating and removing headers', () => {
    renderWithProviders(<RestClientPage />);
    fireEvent.click(
      screen.getByTestId(REST_CLIENT_IDS.headersEditor.addButton)
    );
    const newHeaderKeyInput = screen.getAllByPlaceholderText(
      'headerNamePlaceholder'
    )[1];
    fireEvent.change(newHeaderKeyInput, { target: { value: 'Authorization' } });
    expect(newHeaderKeyInput).toHaveValue('Authorization');

    const removeButtons = screen.getAllByText('removeButton');
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByDisplayValue('Content-Type')).toBeNull();
  });

  it('toggles raw and headers in ResponseView', () => {
    renderWithProviders(<RestClientPage />);
    const toggleRaw = screen.getByTestId(
      REST_CLIENT_IDS.responseView.toggleRawButton
    );
    fireEvent.click(toggleRaw);

    const toggleHeaders = screen.getByTestId(
      REST_CLIENT_IDS.responseView.toggleHeadersButton
    );
    fireEvent.click(toggleHeaders);
  });

  it('calls sendRequest on send button click', async () => {
    renderWithProviders(<RestClientPage />);
    const urlInput = screen.getByTestId(
      REST_CLIENT_IDS.requestPanel.urlInput
    ) as HTMLInputElement;

    await userEvent.type(urlInput, 'https://pokeapi.co/api/v2/pokemon');

    const sendButton = screen.getByTestId(
      REST_CLIENT_IDS.requestPanel.sendButton
    );

    await userEvent.click(sendButton);

    expect(sendRequestMock).toHaveBeenCalled();
  });
});
