import { DataSourceJsonData, DataQueryResponse } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
  queryText?: string;
  constant: number;
  chart_type: string;
  query_mode?: string;
  group_name?: string;
  device_name?: string;
  sensor_id?: number;
  channel_name?: string | any;
  filter_property?: string;
  date_format?: string;
  date: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
  sensordata: any;
  
 
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  constant: 6.5,
};

export interface DataPoint {
  Time: number;
  Value: number;
}

export interface DataSourceResponse {
  datapoints: DataPoint[];
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
  user?: string;
  password?: string;
  date_format?: string;
  cache?: number;
  api_token?: string;


  
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
  cache?: number;
}


export interface HistoricDataResponse extends DataQueryResponse {
  histdata: any[];
}

export interface SensorDataResponse {
  sensordata: any;
}