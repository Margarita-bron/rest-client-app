import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as generatedCode from '~/lib/generated-code/generated-code';
import { GEN_LANGUAGES } from '~/constants/gen-languages';
import CodeGenerator from '../code-generator';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: () => (key: string) => {
    const dict: Record<string, string> = {
      content: 'Content',
      loading: 'Loading...',
      generate: 'Generate',
      copy: 'Copy',
      copied: 'Copied!',
    };
    return dict[key] ?? key;
  },
}));

vi.mock('./ui/copy-icon', () => ({
  CopyIcon: () => <svg data-testid="copy-icon" />,
}));

const dummyObj = {
  method: 'GET',
  url: 'https://example.com',
  headers: [
    { id: '1', key: 'Authorization', value: 'Bearer token', enabled: true },
  ],
  body: '',
};

describe('CodeGenerator Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('рендерит базовые элементы', () => {
    render(<CodeGenerator loading={false} obj={dummyObj} />);

    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue(GEN_LANGUAGES[0]);
    expect(screen.getByRole('button', { name: /generate/i })).toBeEnabled();
    expect(
      screen.getByText(/Generated code snippet will appear here./i)
    ).toBeInTheDocument();
  });

  it('позволяет выбрать язык и генерировать код', () => {
    const spyGenerateCurl = vi
      .spyOn(generatedCode, 'generateCurl')
      .mockReturnValue('curl code snippet');

    render(<CodeGenerator loading={false} obj={dummyObj} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'curl' },
    });
    expect(screen.getByRole('combobox')).toHaveValue('curl');
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    expect(spyGenerateCurl).toHaveBeenCalledWith(dummyObj);
    expect(screen.getByText('curl code snippet')).toBeInTheDocument();
  });

  it('отключает кнопку генерации при loading', () => {
    render(<CodeGenerator loading={true} obj={dummyObj} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/loading/i);
  });

  it('показывает кнопку копирования только при наличии кода', () => {
    render(<CodeGenerator loading={false} obj={dummyObj} />);
    expect(
      screen.queryByRole('button', { name: /copy/i })
    ).not.toBeInTheDocument();

    vi.spyOn(generatedCode, 'generateCurl').mockReturnValue('code to copy');

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'curl' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('копирует текст в clipboard и меняет текст копирования', async () => {
    vi.useFakeTimers();

    const spyClipboardWrite = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue();

    vi.spyOn(generatedCode, 'generateCurl').mockReturnValue('code to copy');

    render(<CodeGenerator loading={false} obj={dummyObj} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'curl' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    const copyBtn = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyBtn);

    expect(spyClipboardWrite).toHaveBeenCalledWith('code to copy');
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
