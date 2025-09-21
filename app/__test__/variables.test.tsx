import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import * as useVariablesHook from '~/hooks/use-variables';
import * as i18nHook from '~/lib/i18n/hooks/use-translate-custom';
import Variables from '~/routes/variables';

describe('Variables component', () => {
  const mockAdd = vi.fn();
  const mockUpdate = vi.fn();
  const mockRemove = vi.fn();
  const mockVariables = [{ id: '1', key: 'foo', value: 'bar', enabled: true }];
  const mockT = vi.fn((key: string) => key);

  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(useVariablesHook, 'useVariables').mockReturnValue({
      variables: mockVariables,
      addVariable: mockAdd,
      updateVariable: mockUpdate,
      removeVariable: mockRemove,
      setVariables: vi.fn(),
      replaceVariablesInString: vi.fn(),
    });

    vi.spyOn(i18nHook, 'useTr').mockReturnValue(
      mockT as unknown as ReturnType<typeof i18nHook.useTr>
    );
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn() },
    } as unknown as Navigator);
  });

  it('renders title and description', () => {
    render(<Variables />);
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('renders variable row', () => {
    render(<Variables />);
    expect(screen.getByDisplayValue('foo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('bar')).toBeInTheDocument();
  });

  it('calls addVariable when add button clicked', () => {
    render(<Variables />);
    fireEvent.click(screen.getByText('+ add'));
    expect(mockAdd).toHaveBeenCalled();
  });

  it('updates variable key/value/enabled', () => {
    render(<Variables />);

    fireEvent.change(screen.getByDisplayValue('foo'), {
      target: { value: 'newKey' },
    });
    expect(mockUpdate).toHaveBeenCalledWith('1', 'key', 'newKey');

    fireEvent.change(screen.getByDisplayValue('bar'), {
      target: { value: 'newValue' },
    });
    expect(mockUpdate).toHaveBeenCalledWith('1', 'value', 'newValue');

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockUpdate).toHaveBeenCalledWith('1', 'enabled', false);
  });

  it('removes variable', () => {
    render(<Variables />);
    fireEvent.click(screen.getByText('delete'));
    expect(mockRemove).toHaveBeenCalledWith('1');
  });

  it('copies value to clipboard', async () => {
    const writeTextMock = vi.fn();
    navigator.clipboard.writeText = writeTextMock;

    render(<Variables />);
    await act(async () => {
      fireEvent.click(screen.getByText('copy'));
    });

    expect(writeTextMock).toHaveBeenCalledWith('bar');
    expect(screen.getByText('copied')).toBeInTheDocument();
  });
});
