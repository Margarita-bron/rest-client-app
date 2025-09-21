import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import RequestBodyEditor from '~/components/rest-client/request-body-editor/request-body-editor';
import { REST_CLIENT_IDS } from '~/components/rest-client/rest-client-test-ids';
import { renderWithProviders } from '~/utils/testing/test-render';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Request Body',
      placeholder: 'Enter request body here...',
    };
    return translations[key as keyof typeof translations] || key;
  },
}));

describe('RequestBodyEditor', () => {
  it('renders title and textarea', () => {
    renderWithProviders(
      <RequestBodyEditor requestBody="" setRequestBody={vi.fn()} />
    );

    expect(
      screen.getByTestId(REST_CLIENT_IDS.requestBodyEditor.title)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(REST_CLIENT_IDS.requestBodyEditor.textarea)
    ).toBeInTheDocument();
  });

  it('displays initial request body', () => {
    renderWithProviders(
      <RequestBodyEditor requestBody="initial body" setRequestBody={vi.fn()} />
    );

    const textarea = screen.getByTestId(
      REST_CLIENT_IDS.requestBodyEditor.textarea
    );
    expect(textarea).toHaveValue('initial body');
  });

  it('calls setRequestBody on textarea change', () => {
    const setRequestBody = vi.fn();
    renderWithProviders(
      <RequestBodyEditor requestBody="" setRequestBody={setRequestBody} />
    );

    const textarea = screen.getByTestId(
      REST_CLIENT_IDS.requestBodyEditor.textarea
    );
    fireEvent.change(textarea, { target: { value: 'new body content' } });
    expect(setRequestBody).toHaveBeenCalledWith('new body content');
  });
});
