import { useVariables } from '~/hooks/use-variables';

const Variables = () => {
  const { variables, addVariable, updateVariable, removeVariable } =
    useVariables();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Variables</h1>
        <p className="text-gray-300">
          Define variables that can be used in your requests using the format{' '}
          {'{{variableName}}'}
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Variable List</h2>
          <button
            onClick={addVariable}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Variable
          </button>
        </div>

        {variables.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No variables defined yet.</p>
            <p className="text-sm mt-2">
              Click "Add Variable" to create your first variable.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {variables.map((variable) => (
              <div key={variable.id} className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-1">
                    <label className="flex items-center">
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
                        className="mr-2"
                      />
                      <span className="text-sm">Enabled</span>
                    </label>
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      placeholder="Variable name (e.g., baseUrl)"
                      value={variable.key}
                      onChange={(e) =>
                        updateVariable(variable.id, 'key', e.target.value)
                      }
                      className="w-full bg-gray-600 text-white px-3 py-2 rounded-md border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <input
                      type="text"
                      placeholder="Variable value (e.g., https://api.example.com)"
                      value={variable.value}
                      onChange={(e) =>
                        updateVariable(variable.id, 'value', e.target.value)
                      }
                      className="w-full bg-gray-600 text-white px-3 py-2 rounded-md border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button
                      onClick={() => removeVariable(variable.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {variable.key && variable.value && (
                  <div className="mt-2 text-sm text-gray-400">
                    <span>Usage: </span>
                    <code className="bg-gray-600 px-2 py-1 rounded">
                      {'{{'}
                      {variable.key}
                      {'}}'}
                    </code>
                    <span className="ml-2">→</span>
                    <code className="bg-gray-600 px-2 py-1 rounded ml-2">
                      {variable.value}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">How to use variables</h3>
        <ul className="text-sm space-y-1 text-gray-300">
          <li>
            • Use the format {'{{variableName}}'} in your request URL, headers,
            or body
          </li>
          <li>• Variables are case-sensitive</li>
          <li>• Disabled variables will not be replaced</li>
          <li>• Variables are replaced when you send a request</li>
        </ul>
      </div>
    </div>
  );
};

export default Variables;
