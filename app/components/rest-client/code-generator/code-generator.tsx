import { useState } from 'react';
import { GEN_LANGUAGES } from '~/constants/gen-languages';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { CopyIcon } from './ui/copy-icon';
import {
  generateCSharpHttpClient,
  generateCurl,
  generateFetch,
  generateGo,
  generateJavaOkHttp,
  generateNodeAxios,
  generatePythonRequests,
  generateXHR,
  type codeGenProps,
} from '~/lib/generated-code/generated-code';

type CodeGeneratorProps = { loading: boolean; obj: codeGenProps };
const CodeGenerator = ({ loading, obj }: CodeGeneratorProps) => {
  const t = useTr('codeGenerator');
  const [selectedLang, setSelectedLang] = useState<string>(GEN_LANGUAGES[0]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCode = (lang: string) => {
    switch (lang) {
      case 'curl':
        return generateCurl({ ...obj });
      case 'JavaScript (Fetch API)':
        return generateFetch({ ...obj });
      case 'JavaScript (XHR)':
        return generateXHR({ ...obj });
      case 'NodeJS (axios)':
        return generateNodeAxios({ ...obj });
      case 'Python (requests)':
        return generatePythonRequests({ ...obj });
      case 'Java (OkHttp)':
        return generateJavaOkHttp({ ...obj });
      case 'C# (HttpClient)':
        return generateCSharpHttpClient({ ...obj });
      case 'Go (net/http)':
        return generateGo({ ...obj });
      default:
        return;
    }
  };

  const onGenerateClick = () => {
    const code = generateCode(selectedLang) || '';
    setGeneratedCode(code);
  };
  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5 justify-between mt-3">
      <div className="flex flex-wrap items-center gap-2">
        {' '}
        <label htmlFor="language-select">{t('content')}</label>
        <select
          id="language-select"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {GEN_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <button
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors cursor-pointer"
        onClick={onGenerateClick}
        style={{ marginLeft: 15, padding: '5px 15px' }}
      >
        {loading ? t('loading') : t('generate')}
      </button>

      <pre className="w-full h-[20%] px-3 py-2 text-left border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm relative">
        {generatedCode.trim() || 'Generated code snippet will appear here.'}

        {generatedCode && (
          <button
            onClick={copyToClipboard}
            disabled={loading}
            data-testid="copy-button"
            className="absolute top-2 right-2 flex items-center gap-2 rounded cursor-pointer hover:bg-gray-700 disabled:cursor-not-allowed"
            style={{ zIndex: 10 }}
          >
            <CopyIcon />
            {copied ? t('copied') : t('copy')}
          </button>
        )}
      </pre>
    </div>
  );
};

export default CodeGenerator;
