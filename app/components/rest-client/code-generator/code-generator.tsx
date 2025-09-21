import { useEffect, useState } from 'react';
import {
  fetchLanguages,
  generateCode,
  type Language,
  type Variant,
} from '~/lib/generated-code/generated-code';
import sdk from 'postman-collection';

const CodeGenerator = () => {
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [langs, setLangs] = useState<Language[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');

  useEffect(() => {
    async function loadLangs() {
      try {
        const languages = await fetchLanguages();
        setLangs(languages);
        if (languages.length > 0) {
          setSelectedLang(languages[0].key);
          setVariants(languages[0].variant);
          if (languages[0].variant.length > 0) {
            setSelectedVariant(languages[0].variant[0].key);
          }
        }
      } catch (err: unknown) {
        throw new Error('Error while uploading languages: ');
      }
    }
    loadLangs();
  }, []);

  const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = langs.find((l) => l.key === e.target.value);
    setSelectedLang(e.target.value);
    if (lang) {
      setVariants(lang.variant);
      if (lang.variant.length > 0) setSelectedVariant(lang.variant[0].key);
    }
  };

  const onVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariant(e.target.value);
  };

  const handleGenerate = async () => {
    const request = new sdk.Request({
      url: 'https://postman-echo.com/get',
      method: 'GET',
    });
    const sdkOptions = {
      returnMethod: 'Promise',
      outputType: 'String',
    };
    try {
      const snippet = await generateCode(
        request,
        selectedLang,
        selectedVariant,
        sdkOptions
      );
      setCodeSnippet(snippet);
    } catch (err) {
      setCodeSnippet(`Error: ${err}`);
    }
  };

  return (
    <div className="p-4 text-white">
      <label htmlFor="language-select" className="block mb-2">
        Select language and variant
      </label>
      <select
        id="language-select"
        className="text-black p-2 rounded"
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
      >
        {langs.map((item) => (
          <>
            {item.variant.map((variant) => (
              <option key={item.key} value={item.label}>
                {item.key}
                {item.label}
                {item.syntax_mode}
                {variant.key}
              </option>
            ))}
          </>
        ))}
      </select>
    </div>
  );
};
export default CodeGenerator;
