type RequestBodyEditorProps = {
  requestBody: string;
  setRequestBody: (body: string) => void;
}

const RequestBodyEditor = ({ requestBody, setRequestBody }: RequestBodyEditorProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-white">Request Body</h3>
      <textarea
        value={requestBody}
        onChange={(e) => setRequestBody(e.target.value)}
        placeholder='{"key": "value"}'
        rows={6}
        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
      />
    </div>
  );
};

export default RequestBodyEditor;