import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import HeadersEditor from '~/components/rest-client/headers-editor/headers-editor';
import { REST_CLIENT_IDS } from '~/components/rest-client/rest-client-test-ids';
import { renderWithProviders } from '~/utils/testing/test-render';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Headers',
      addButton: 'Add Header',
      removeButton: 'Remove',
      headerNamePlaceholder: 'Header Name',
      headerValuePlaceholder: 'Header Value',
    };
    return translations[key as keyof typeof translations] || key;
  },
}));

const mockHeaders = [
  { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
  { id: '2', key: 'Authorization', value: 'Bearer xyz', enabled: false },
];

describe('HeadersEditor', () => {
  it('renders headers and buttons', () => {
    renderWithProviders(
      <HeadersEditor
        headers={mockHeaders}
        addHeader={vi.fn()}
        updateHeader={vi.fn()}
        removeHeader={vi.fn()}
      />
    );

    expect(
      screen.getByTestId(REST_CLIENT_IDS.headersEditor.title)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(REST_CLIENT_IDS.headersEditor.addButton)
    ).toBeInTheDocument();

    mockHeaders.forEach((header) => {
      expect(
        screen.getByTestId(
          REST_CLIENT_IDS.headersEditor.headerKeyInput(header.id)
        )
      ).toHaveValue(header.key);
      expect(
        screen.getByTestId(
          REST_CLIENT_IDS.headersEditor.headerValueInput(header.id)
        )
      ).toHaveValue(header.value);

      const checkbox = screen.getByTestId(
        REST_CLIENT_IDS.headersEditor.headerEnabledCheckbox(header.id)
      );
      if (header.enabled) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }

      expect(
        screen.getByTestId(
          REST_CLIENT_IDS.headersEditor.removeButton(header.id)
        )
      ).toBeInTheDocument();
    });
  });

  it('calls addHeader when add button is clicked', () => {
    const addHeader = vi.fn();
    renderWithProviders(
      <HeadersEditor
        headers={[]}
        addHeader={addHeader}
        updateHeader={vi.fn()}
        removeHeader={vi.fn()}
      />
    );
    fireEvent.click(
      screen.getByTestId(REST_CLIENT_IDS.headersEditor.addButton)
    );
    expect(addHeader).toHaveBeenCalled();
  });

  it('calls updateHeader when inputs change', () => {
    const updateHeader = vi.fn();
    renderWithProviders(
      <HeadersEditor
        headers={mockHeaders}
        addHeader={vi.fn()}
        updateHeader={updateHeader}
        removeHeader={vi.fn()}
      />
    );

    const keyInput = screen.getByTestId(
      REST_CLIENT_IDS.headersEditor.headerKeyInput('1')
    );
    fireEvent.change(keyInput, { target: { value: 'Accept' } });
    expect(updateHeader).toHaveBeenCalledWith('1', 'key', 'Accept');

    const valueInput = screen.getByTestId(
      REST_CLIENT_IDS.headersEditor.headerValueInput('1')
    );
    fireEvent.change(valueInput, { target: { value: 'text/plain' } });
    expect(updateHeader).toHaveBeenCalledWith('1', 'value', 'text/plain');

    const checkbox = screen.getByTestId(
      REST_CLIENT_IDS.headersEditor.headerEnabledCheckbox('2')
    );
    fireEvent.click(checkbox);
    expect(updateHeader).toHaveBeenCalledWith('2', 'enabled', true);
  });

  it('calls removeHeader when remove button is clicked', () => {
    const removeHeader = vi.fn();
    renderWithProviders(
      <HeadersEditor
        headers={mockHeaders}
        addHeader={vi.fn()}
        updateHeader={vi.fn()}
        removeHeader={removeHeader}
      />
    );
    fireEvent.click(
      screen.getByTestId(REST_CLIENT_IDS.headersEditor.removeButton('1'))
    );
    expect(removeHeader).toHaveBeenCalledWith('1');
  });
});
