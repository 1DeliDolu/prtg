import React, { PureComponent, ChangeEvent } from 'react';
import { Field, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> { }

interface State { }

export class ConfigEditor extends PureComponent<Props, State> {
  onPathChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      path: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onHostnameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      hostname: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  }

  onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      username: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  }

  onPassHashChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      passhash: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  }

  render() {
    const { options } = this.props;
    const { jsonData } = options;
    return (
      <div className="gf-form-group">
        <Field
          label="Path"
          description="JSON field returned to frontend"
        >
          <Input
            onChange={this.onPathChange}
            value={jsonData.path || ''}
            placeholder="Enter the path, e.g. /api/v1"
            width={40}
          />
        </Field>
        <Field
          label="Hostname"
          description="JSON field returned to frontend"
        >
          <Input
            onChange={this.onHostnameChange}
            value={jsonData.hostname || ''}
            placeholder="Enter the hostname"
            width={40}
          />
        </Field>
        <Field
          label="Username"
          description="JSON field returned to frontend"
        >
          <Input
            onChange={this.onUsernameChange}
            value={jsonData.username || ''}
            placeholder="Enter the username"
            width={40}
          />
        </Field>
        <Field
          label="Passhash"
          description="JSON field returned to frontend"
        >
          <Input
            onChange={this.onPassHashChange}
            value={jsonData.passhash || ''}
            placeholder="Enter the passhash"
            width={40}
          />
        </Field>
      </div>
    );
  }
}
