import React, { ChangeEvent } from 'react';
import { InlineField, Input, SecretInput} from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from '../types';
import "../css/ConfigEditor.css"

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> { }

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const { jsonData, secureJsonFields, secureJsonData } = options;

  const onPathChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        path: event.target.value,
      },
    });
  };

  // Secure field (only sent to the backend)
  const onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiKey: event.target.value,
      },
    });
  };

  const onResetAPIKey = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiKey: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiKey: '',
      },
    });
  };

  return (
    <>
      <div className='config-editor-div'>
        <div>
          <InlineField label="Path" labelWidth={20} interactive tooltip={'Json field returned to frontend'}>
            <Input
              id="config-editor-path"
              onChange={onPathChange}
              value={jsonData.path}
              placeholder="Enter the path, e.g. /api/v1"
              width={40}
            />
          </InlineField>
        </div>
        <div>
          <InlineField label="Benutzername" labelWidth={20} interactive tooltip={'Bitte geben Sie Ihren Benutzernamen ein'}>
            <Input
              id="config-editor-benutzer"
              onChange={onPathChange}
              value={jsonData.user}
              placeholder="Benutzername"
              width={40}
            />
          </InlineField>
        </div>
        <div>
        <InlineField label="Password" labelWidth={20} interactive tooltip={'Bitte geben Sie Ihr Password ein'}>
          <Input
            id="config-editor-password"
            onChange={onPathChange}
            value={jsonData.user}
            placeholder="Password"
            width={40}
          />
        </InlineField>
      </div>
      <div >
        <InlineField label="API Key" labelWidth={20} interactive tooltip={'Secure json field (backend only)'}>
          <SecretInput
            required
            id="config-editor-api-key"
            isConfigured={secureJsonFields.apiKey}
            value={secureJsonData?.apiKey}
            placeholder="Enter your API key"
            width={40}
            onReset={onResetAPIKey}
            onChange={onAPIKeyChange}
          />
        </InlineField>
      </div>
    </div >
    </>
  );
}
