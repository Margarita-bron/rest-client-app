export const REST_CLIENT_IDS = {
  headersEditor: {
    title: 'headers-editor-title',
    addButton: 'headers-editor-add-button',
    headerKeyInput: (id: string) => `header-key-${id}`,
    headerValueInput: (id: string) => `header-value-${id}`,
    headerEnabledCheckbox: (id: string) => `header-enabled-${id}`,
    removeButton: (id: string) => `header-remove-${id}`,
  },
  requestBodyEditor: {
    title: 'request-body-editor-title',
    textarea: 'request-body-editor-textarea',
  },
  requestPanel: {
    methodSelect: 'request-panel-method-select',
    urlInput: 'request-panel-url-input',
    sendButton: 'request-panel-send-button',
  },
  responseView: {
    title: 'response-view-title',
    toggleRawButton: 'response-view-toggle-raw-button',
    toggleHeadersButton: 'response-view-toggle-headers-button',
    responseBody: 'response-view-body',
    responseHeaders: 'response-view-headers',
    errorMessage: 'response-view-error',
  },
};
