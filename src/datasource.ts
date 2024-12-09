import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings, DataFrame, FieldType, SelectableValue } from '@grafana/data';
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { MetricFindValue } from '@grafana/data';
import { MyQuery, MyDataSourceOptions, parameterOptions, monthsShortList, ApiResponse } from './types';

var settingsData: any;

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    settingsData = instanceSettings.jsonData;
  }

  getGroups = (params: string) => {
    return this.apiRequest('table', params).then((response: any) => {
      const groupsData: any[] = [];
      Object.entries(response.data.groups).map((responseItem: any) => {
        groupsData.push({ item: responseItem[1].group, objid: responseItem[1].objid });
      });
      return groupsData;
    });
  };

  getDevices = (params: string) => {
    return this.apiRequest('table', params).then((response: any) => {
      let deviceData: any[] = [];
      Object.entries(response.data.devices).map((responseItem: any) => {
        deviceData.push({ item: responseItem[1].device, objid: responseItem[1].objid });
      });
      return deviceData;
    });
  };

  getSensors = (params: string) => {
    return this.apiRequest('table', params).then((response: any) => {
      let sensorData: any[] = [];
      Object.entries(response.data.sensors).map((responseItem: any) => {
        sensorData.push({ item: responseItem[1].sensor, objid: responseItem[1].objid });
      });
      return sensorData;
    });
  };

  getChannels = (params: string) => {
    return this.apiRequest('chartlegend', params).then((response: any) => {
      let channelData: any[] = [];
      Object.entries(response.data.items).map((responseItem: any) => {
        channelData.push({ item: responseItem[1].name, objid: responseItem[1].unit });
      });
      return channelData;
    });
  };

  getChildrenFrom = (parentId: string, type: string, verbose: boolean) => {
    let parameters: parameterOptions = {
      content: type + 's',
      columns: ['objid', type]
    };
    if (type === 'channel') {
      parameters = {};
    }
    if (verbose) {
      parameters.id = parentId;
    } else {
      parameters.parent = parentId;
      parameters.columns?.push('parentid');
    }
    return this.queryParameterBuilder(parameters);
  };

  queryParameterBuilder = (parameters: parameterOptions): string => {
    let query = '';
    Object.entries(parameters).map((param: any) => {
      switch (param[0]) {
        case 'sdate':
          query += `&sdate=${param[1]}`;
          break;
        case 'edate':
          query += `&edate=${param[1]}&usecaption=1`;
          break;
        case 'content':
          query += `&content=${param[1]}`;
          break;
        case 'id':
          query += `&id=${param[1]}`;
          break;
        case 'parent':
          query += `&filter_parentid=${param[1]}`;
          break;
        case 'avg':
          query += `&avg=${param[1]}`;
          break;
        case 'columns':
          query += '&columns=';
          param[1].map((col: string) => {
            query += `${col},`;
          });
          query = query.slice(0, -1);
          break;
        default:
          break;
      }
    });
    return query;
  };

  metricFindQueryHelper = (content: string, parent: string, verbose: boolean) => {
    switch (content) {
      case 'group':
        return this.getGroups(this.getChildrenFrom(parent, 'group', verbose));
      case 'device':
        return this.getDevices(this.getChildrenFrom(parent, 'device', verbose));
      case 'sensor':
        return this.getSensors(this.getChildrenFrom(parent, 'sensor', verbose));
      case 'channel':
        return this.getChannels(this.getChildrenFrom(parent, 'channel', verbose));
      case 'host':
        return this.getDevices(this.getChildrenFrom(parent, 'host', verbose));
      default:
        return this.getGroups('*');
    }
  };

  metricFindQuery(query: string, options: any) {
    let queryContent: string = query.split(':')[0];
    let queryParent: string = query.split(':')[1];
    if (queryParent === '*') {
      queryParent = '0';
    }
    if (queryParent.charAt(0) === '$') {
      queryParent = this.getCurrentVar(queryParent.substr(1)).value;
    }
    return new Promise<MetricFindValue[]>((resolve, reject) => {
      this.metricFindQueryHelper(queryContent, queryParent, true).then((responseItems: any) => {
        const children: any[] = [];
        Object.entries(responseItems).map((responseItem: any) => {
          children.push({
            text: responseItem[1].item,
            value: responseItem[1].objid
          });
        });
        resolve(children);
      });
    });
  }

  grafDateToPrtgDate = (grafdate: any) => {
    let grafSplitted: string[] = grafdate._d.toString().split(' ');
    let monthValue = monthsShortList.find(item => item.MonthName === grafSplitted[1]);
    let timeReplaced = grafSplitted[4].replace(':', '-');

    let prtgDate = `${grafSplitted[3]}-${monthValue?.MonthIndex}-${grafSplitted[2]}-${timeReplaced}`;
    return prtgDate;
  };

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    let dfs: DataFrame[] = [];
    let _this = this;

    let paramOptions: parameterOptions = {
      sdate: this.grafDateToPrtgDate(options.range?.from),
      edate: this.grafDateToPrtgDate(options.range?.to)
    };

    for (let i = 0; i < options.targets.length; i++) {
      switch (options.targets[i].method) {
        case 'table':
          let cols: string[] = ['name'];
          options.targets[i].tableColumnItemList?.map(function (colOption: SelectableValue) {
            cols.push(colOption.label!);
          });
          paramOptions = {
            content: options.targets[i].tableOption + 's',
            id: options.targets[i].selectedGroup?.id,
            columns: cols
          };
          var queryPar = this.queryParameterBuilder(paramOptions);
          const apiResTable = await _this.apiRequest(options.targets[i].method!, queryPar);

          var df = this.getTableDataframe(apiResTable, options.targets[i]);
          dfs.push(df);
          break;
        case 'historicdata':
          paramOptions.avg = options.targets[i].historicInterval;
          paramOptions.id = options.targets[i].historicSensor!.id;

          var queryPar = this.queryParameterBuilder(paramOptions);
          const apiRes = await _this.apiRequest(options.targets[i].method!, queryPar);

          var df = this.getHistoricDataframe(apiRes, options.targets[i]);
          dfs.push(df);
          break;
        case 'raw':
          const apiResRaw = await _this.apiRequestRaw(options.targets[i].rawURI!, options.targets[i].rawQueryText!);
          var df = this.getRawDataframe(apiResRaw, options.targets[i]);
          dfs.push(df);
          break;
        case 'status':
          const apiResStatus = await _this.apiRequestRaw('status.json', '');
          var df = this.getStatusDataframe(apiResStatus);
          dfs.push(df);
        default:
          break;
      }
    }
    return Promise.all(dfs).then(function (results) {
      return { data: dfs };
    });
  }

  getStatusDataframe = (apiResponse: any): DataFrame => {
    var fields = [
      {
        name: 'status',
        values: apiResponse.data,
        type: FieldType.other
      }
    ];
    return { fields } as DataFrame;
  };

  getRawDataframe = (apiResponse: any, target: any): DataFrame => {
    let fields = Object.entries(apiResponse.data).map(([name, value]: [string, any]) => ({
      name,
      values: [value],
      type: FieldType.other
    }));
    return { fields } as DataFrame;
  };

  getTableDataframe = (apiResponse: any, target: any): DataFrame => {
    let requestedFilterItems: string[] = [];
    let requestedData: any[] = [];

    target.tableFilterItemList.map(function (item: any) {
      requestedFilterItems.push(item.label);
    });

    apiResponse.data[target.tableOption + 's'].map((data: any) => {
      if (requestedFilterItems.includes(data.name)) {
        requestedData.push(data);
      }
    });

    let fields = [
      {
        name: target.tableOption + 's',
        values: requestedData,
        type: FieldType.other
      }
    ];
    return { fields } as DataFrame;
  };

  getHistoricDataframe = (apiResponse: any, target: any): DataFrame => {
    let requestedData: any = {};
    let timeList: number[] = [];

    let requestedChannelsObj = target.historicChannelList;
    requestedChannelsObj.map(function (requestedChannelsObjItem: any) {
      requestedData[requestedChannelsObjItem['label']] = [];
    });

    apiResponse.data.histdata.map((historicData: any) => {
      let apiDate = historicData.datetime.split(' - ')[0];
      let apiDateFlipped = `${apiDate.split('/')[1]}/${apiDate.split('/')[0]}/${apiDate.split('/')[2]}`;
      let correctDate = new Date(apiDateFlipped);
      timeList.push(correctDate.valueOf());

      requestedChannelsObj.map((obj: any) => {
        requestedData[obj.label].push(historicData[obj.label]);
      });
    });

    let fields = [
      {
        name: 'Time',
        values: timeList,
        type: FieldType.time
      }
    ];

    for (const [key] of Object.entries(requestedData)) {
      fields.push({
        name: `${key} ${requestedChannelsObj.find((item: any) => item.label === key).value}`,
        values: requestedData[key],
        type: FieldType.number
      });
    }
    return { fields } as DataFrame;
  };

//! TODO schau JSON format
async apiRequest(method: string, params: string): Promise < ApiResponse > {
  let apiUrl: string = `https://${settingsData.hostname}/api/${method}.json?username=${settingsData.username}&passhash=${settingsData.passhash}${params}`;
  const response = await getBackendSrv().fetch({ url: apiUrl, method: 'GET' });
  return response as unknown as ApiResponse;
}

async apiRequestRaw(method: string, params: string): Promise < ApiResponse > {
  let apiUrl: string = `https://${settingsData.hostname}/api/${method}?username=${settingsData.username}&passhash=${settingsData.passhash}${params}`;
  const response = await getBackendSrv().fetch({ url: apiUrl, method: 'GET' });
  return response as unknown as ApiResponse;
}
  getCurrentVar(varName: string) {
    let dataSource: any = getDataSourceSrv() as unknown as DataSourceApi;
    let curVar: any = {};
    dataSource.templateSrv.variables.map((variable: any) => {
      if (variable.name === varName) {
        curVar = variable.current;
      }
    });
    return curVar;
  }

  async testDatasource() {
    this.query(settingsData.path);
    return {
      status: 'success',
      message: 'Success'
    };
  }
}


