import { useVariables } from '~/hooks/use-variables';
import { useState } from 'react';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

const Variables = () => {
  const { variables, addVariable, updateVariable, removeVariable } =
    useVariables();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = useTr('variables');

  const handleCopy = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="my-10 w-full max-w-6xl mx-auto p-8 text-gray-200 border-1 border-gray-800 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-300">
          {t('description')}{' '}
          <code className="bg-gray-700 px-2 py-1 rounded text-sm">
            {'{{variableName}}'}
          </code>
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('variableList')}</h2>
          <button
            onClick={addVariable}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
          >
            + {t('add')}
          </button>
        </div>

        {variables.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>{t('emptyMessage')}</p>
            <p className="text-sm mt-2">
              {t('emptyHint1')}{' '}
              <span className="font-semibold">{t('add')}</span>{' '}
              {t('emptyHint2')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3">{t('enabled')}</th>
                  <th className="px-4 py-3">{t('name')}</th>
                  <th className="px-4 py-3">{t('value')}</th>
                  <th className="px-4 py-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {variables.map((variable) => (
                  <tr key={variable.id} className="border-t border-gray-600">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={variable.enabled}
                        onChange={(e) =>
                          updateVariable(
                            variable.id,
                            'enabled',
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder={t('namePlaceholder')}
                        value={variable.key}
                        onChange={(e) =>
                          updateVariable(variable.id, 'key', e.target.value)
                        }
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded-md border border-gray-500 focus:border-blue-500 focus:outline-none text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder={t('valuePlaceholder')}
                        value={variable.value}
                        onChange={(e) =>
                          updateVariable(variable.id, 'value', e.target.value)
                        }
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded-md border border-gray-500 focus:border-blue-500 focus:outline-none text-center"
                      />
                    </td>
                    <td className="px-4 py-3 space-x-2 flex justify-center">
                      <button
                        onClick={() => handleCopy(variable.value, variable.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md transition-colors cursor-pointer min-w-[76px]"
                      >
                        {copiedId === variable.id ? t('copied') : t('copy')}
                      </button>
                      <button
                        onClick={() => removeVariable(variable.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors cursor-pointer min-w-[76px]"
                      >
                        {t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 bg-indigo-900 bg-opacity-20 border border-indigo-600 rounded-md p-4">
        <h3 className="text-base font-semibold mb-2">{t('howToUseTitle')}</h3>
        <div className="text-sm space-y-1 text-gray-300 leading-relaxed">
          <p>
            {t('howToUseTextBeforeCode')}{' '}
            <code className="bg-gray-700 px-2 py-0.5 rounded text-sm">
              {'{{variableName}}'}
            </code>{' '}
            {t('howToUseTextAfterCode')}
          </p>
          <p>{t('howToUseAdditional')}</p>
        </div>

        <div className="mt-3">
          <p className="text-gray-200 font-semibold mb-1">{t('example')}</p>
          <pre className="bg-gray-800 p-3 rounded-md text-sm overflow-x-auto">
            {`URL: https://www.npmjs.com/{{packageName}}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Variables;
