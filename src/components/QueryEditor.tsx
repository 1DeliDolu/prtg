import defaults from 'lodash/defaults';

import React, { PureComponent, ChangeEvent } from 'react';
import {
  Input,
  FieldSet,
  CascaderOption,
  Label,
  Select,
  QueryField,
  TypeaheadInput,
  TypeaheadOutput,
  CompletionItemGroup,
  CompletionItem,
  SuggestionsState,
  Tooltip
} from '@grafana/ui';

import {
  QueryEditorProps,
  SelectableValue,
  DataSourceApi
} from '@grafana/data';
import { DataSource } from '../DataSource';
import {
  MyQuery,
  MyDataSourceOptions,
  methodList,
  tableOptions,
  defaultColumns,
  sensorColumns,
  deviceColumns,
  groupColumns,
  probeColumns,
  filterColumns
} from '../types';

//import selectEvent from 'react-select-event';

import { getDataSourceSrv } from '@grafana/runtime';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;
const getTargetDefaults = () => ({
  group: { name: "" },
  device: { name: "" },
  sensor: { name: "" },
  channel: { name: "" },
  host: { name: "" },
  raw: { uri: "", queryString: "" },
  functions: [],
  options: {
    mode: {
      name: "Metrics",
      value: 0,
      filterProperty: {},
      textValueFrom: {},
      textProperty: {}
    },
    includeSensorName: false,
    includeDeviceName: false
  },
 
});
interface State {
  method: string,
  tableOption: string,
  selectedGroup?: { label: string, id: string },
  historicDevice?: { label: string, id: string },
  historicSensor?: { label: string, id: string },
  historicChannelList?: SelectableValue[],
  historicInterval?: number,
  tableFilterItemList?: SelectableValue[],
  tableColumnItemList?: SelectableValue[],
  historichHostList?: SelectableValue[],
  rawURI?: string,
  rawQueryText?: string,
  host?: { label: string, id: string },
  metric: {
    propertyList: Array<{ name: string, visible_name: string }>;
    textValueFromList: Array<{ name: string, visible_name: string }>;
  };
  editorModes: {
    [key: number]: { name: string, value: number }
  };
  
}

export class QueryEditor extends PureComponent<Props, State> {
  historicGroupList: CompletionItem[] = [];
  historicDeviceList: CompletionItem[] = [];
  historicSensorList: CompletionItem[] = [];
  historicChannelList: SelectableValue[] = [];
  historichHostList: SelectableValue[] = [];
  hostList: SelectableValue[] = [];

  constructor(props: Props) {
    super(props);
    const query = defaults(this.props.query, getTargetDefaults());

    const methodCurrent = methodList.find(item => item.value === query.method);
    const tableOptionsCurrent = tableOptions.find(item => item.value === query.tableOption);
    const selectedGroupCurrent = query.selectedGroup;
    const historicDeviceCurrent = query.historicDevice;
    const historicSensorCurrent = query.historicSensor;
    const historicSelectedChannelList = query.historicChannelList;
    const historicIntervalCurrent = query.historicInterval;
    const tableFilterItems = query.tableFilterItemList;
    const tableColumnItems = query.tableColumnItemList;
    const rawURI = query.rawURI;
    const rawQueryText = query.rawQueryText;

    this.state = {
      method: methodCurrent?.value,
      tableOption: tableOptionsCurrent?.value,
      selectedGroup: selectedGroupCurrent,
      historicDevice: historicDeviceCurrent,
      historicSensor: historicSensorCurrent,
      historicChannelList: historicSelectedChannelList,
      historicInterval: historicIntervalCurrent,
      tableColumnItemList: tableColumnItems,
      tableFilterItemList: tableFilterItems,
      rawQueryText: rawQueryText,

      rawURI: rawURI,
      metric: {
        propertyList: [
          { name: "tags", visible_name: "Tags" },
          { name: "active", visible_name: "Active" },
          { name: "status", visible_name: "Status" },
          { name: "status_raw", visible_name: "Status (raw)" },
          { name: "message_raw", visible_name: "Message" },
          { name: "priority", visible_name: "Priority" }

        ],
        textValueFromList: [
          { name: "group", visible_name: "Group" },
          { name: "device", visible_name: "Device" },
          { name: "sensor", visible_name: "Sensor" },
          { name: "channel", visible_name: "Channel" },
          { name: "host", visible_name: "Host" }

        ]
      },
      editorModes: {
        1: { name: "Metrics", value: 1 },
        2: { name: "Text", value: 2 },
        3: { name: "Raw", value: 3 }
      }
    };
  }

  onComponentDidMount() { }

  onScenarioChange = (item: SelectableValue<string>) => {
    const { onRunQuery } = this.props;
    this.props.onChange({
      ...this.props.query,
      method: item.value!,
    });
    onRunQuery();

    this.setState({
      method: item.value!
    });
  };

  renderFormFields = () => {
    switch (this.state.method) {
      case "table":
        return this.renderTabledataEditor();
      case "historicdata":
        return this.renderHistorydataEditor();
      case "raw":
        return this.renderRawdataEditor();
      default:
        return (<div></div>);
    }
  }

  renderRawdataEditor = () => {
    return (
      <div style={{
        display: "flex",
        justifyContent: "column"
      }}>
        <Label>URI:</Label>
        <Input onChange={(e: ChangeEvent<HTMLInputElement>) => this.RawURIChange(e.target.value)} value={this.state.rawURI} />
        {/* burdan nasil ikinci satira ekleyebilirim */}
        
        <Label>Query Text:</Label>
        <Input onChange={(e: ChangeEvent<HTMLInputElement>) => this.RawQueryTextChange(e.target.value)} value={this.state.rawQueryText} />
      </div>
    );
  }

  RawURIChange = (input: string) => {
    this.props.query.rawURI = input;
    this.setState({
      rawURI: input
    });
  }

  RawQueryTextChange = (input: string) => {
    this.props.query.rawQueryText = input;
    this.setState({
      rawQueryText: input
    });
    this.props.onRunQuery();
  }

  renderTabledataEditor = () => {
    return (
      <div style={{
        display: "flex",
        justifyContent: "column"
      }}>
        <Label style={{ width: '20%' }}>Content:</Label>
        <Select options={tableOptions} value={tableOptions.find(item => item.value === this.props.query.tableOption)} onChange={(e) => this.tableOptionChanged(e)} />
        <Label style={{ width: '20%' }}>From:</Label>
        <div style={{ minWidth: "100px" }}>
          <QueryField
            query={this.state.selectedGroup ? this.state.selectedGroup.label.toString() : "choose a Group"}
            onTypeahead={(e) => this.onTypeahead(e, "group")}
            onChange={(e) => this.findItemFromCompletionList(e, "group")}
            portalOrigin="PRTG"
            onWillApplySuggestion={this.willApplySuggestion}
          />
        </div>
        <br />
        <Label style={{ width: '20%' }}>Filter:</Label>
        <Select isMulti={true} onChange={(e) => this.tableFilterOptionsChange(e)} options={this.getTableFilterItemsOptions()} value={this.props.query.tableFilterItemList} />
        <Label style={{ width: '20%' }}>Columns:</Label>
        <Select isMulti={true} onChange={(e) => this.tableColumnOptionsChange(e)} options={this.getTableColumnOptions()} value={this.props.query.tableColumnItemList} />
      </div>
    );
  }

  getTableColumnOptions = () => {
    let ColOpt: SelectableValue[] = defaultColumns;
    switch (this.state.tableOption) {
      case "sensor":
        ColOpt = [...ColOpt, ...sensorColumns];
        break;
      case "group":
        ColOpt = [...ColOpt, ...groupColumns];
        break;
      case "device":
        ColOpt = [...ColOpt, ...deviceColumns];
        break;
      case "probe":
        ColOpt = [...ColOpt, ...probeColumns];
        break;
      default:
        break;
    }
    return ColOpt;
  }

  tableOptionChanged = (input: SelectableValue<string>) => {
    this.props.query.tableOption = input.label;
    this.setState({
      tableOption: input.label!
    });
  }

  renderHistorydataEditor = () => {
    return (
      <div style={{
        display: "flex",
        justifyContent: "column"
      }}>
        <Label style={{ width: '20%' }}>Group:</Label>
        <div style={{ minWidth: "100px" }}>
          <QueryField
            query={this.state.selectedGroup ? this.state.selectedGroup.label.toString() : "choose a Group"}
            onTypeahead={(e) => this.onTypeahead(e, "group")}
            onChange={(e) => this.findItemFromCompletionList(e, "group")}
            portalOrigin="PRTG"
            onWillApplySuggestion={this.willApplySuggestion}
          />
        </div>
        <Label style={{ width: '20%' }}>Device:</Label>
        <div style={{ minWidth: "100px" }}>
          <QueryField
            query={this.state.historicDevice ? this.state.historicDevice.label.toString() : "choose a Device"}
            onTypeahead={(e) => this.onTypeahead(e, "device")}
            onChange={(e) => this.findItemFromCompletionList(e, "device")}
            portalOrigin="PRTG"
            onWillApplySuggestion={this.willApplySuggestion}
          />
        </div>
        <Label style={{ width: '20%' }}>Sensor:</Label>
        <div style={{ minWidth: "100px" }}>
          <QueryField
            query={this.state.historicSensor ? this.state.historicSensor.label.toString() : "choose a Sensor"}
            onTypeahead={(e) => this.onTypeahead(e, "sensor")}
            onChange={(e) => this.findItemFromCompletionList(e, "sensor")}
            portalOrigin="PRTG"
            onWillApplySuggestion={this.willApplySuggestion}
          />
        </div>
        <Label style={{ width: '20%' }}>Channels:</Label>
        <div style={{ minWidth: "100px" }}>
          <Select value={this.state.historicChannelList} isMulti={true} options={this.getHistoricChannelOptions()} onChange={(e) => this.historicChannelChange(e)} />
        </div>
        <div>
          <Tooltip content="in minutes (all values = 0)">
            <div>
              <Label>Interval:</Label>
              <Input value={this.state.historicInterval} onChange={(e: ChangeEvent<HTMLInputElement>) => this.historicIntervalChange(e.target.value)} />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }

  historicIntervalChange = (interval: string) => {
    try {
      const intervalnr = Number(interval);
      this.setState({
        historicInterval: intervalnr
      });
      this.props.query.historicInterval = intervalnr;
      this.props.onRunQuery();
    } catch (error) {
      alert(error);
    }
  }

  getHistoricChannelOptions = () => {
    let ChannelSelectableValues: SelectableValue[] = [];
    this.historicChannelList = [];
    let sensorId = this.state.historicSensor ? this.state.historicSensor.id : "0";
    this.props.datasource.metricFindQueryHelper("channel", sensorId, true).then((response: any) => {
      Object.entries(response).map((responseItem: any) => {
        ChannelSelectableValues.push({
          label: responseItem[1].item,
          value: responseItem[1].objid,
        });
      });
    });
    return ChannelSelectableValues;
  }

  getTableFilterItemsOptions = () => {
    let filterSelectableValues: SelectableValue[] = [];
    try {
      let content = this.state.tableOption!;
      let fromItem = this.state.selectedGroup?.id!;
      this.props.datasource.metricFindQueryHelper(content, fromItem, true).then((response: any) => {
        Object.entries(response).map((responseItem: any) => {
          filterSelectableValues.push({
            label: responseItem[1].item,
            value: responseItem[1].objid,
          });
        });
      });
    } catch (error) {

    }
    return filterSelectableValues;
  }

  tableFilterOptionsChange = (input: SelectableValue) => {
    let filterItems: SelectableValue[] = [];
    try {
      input.map((inputObj: SelectableValue) => {
        filterItems.push(inputObj);
      });
    } catch (error) {

    }
    this.setState({
      tableFilterItemList: filterItems
    });
    this.props.query.tableFilterItemList = filterItems;
  }

  tableColumnOptionsChange = (input: SelectableValue) => {
    let columnItems: SelectableValue[] = [];
    try {
      input.map((inputObj: SelectableValue) => {
        columnItems.push(inputObj);
      });
    } catch (error) {

    }
    this.setState({
      tableColumnItemList: columnItems
    });
    this.props.query.tableColumnItemList = columnItems;
    this.props.onRunQuery();
  }

  historicChannelChange = (input: SelectableValue) => {
    let inputList: SelectableValue[] = [];
    // inputvalue can be null (if no channels are selected)
    try {
      Object.entries(input).map((inputItem: any) => {
        inputList.push(inputItem[1]);
      });
    } catch (error) {

    }
    this.setState({
      historicChannelList: inputList
    });
    this.props.query.historicChannelList = inputList;
    this.props.onRunQuery();
  }

  willApplySuggestion = (suggestion: string, { typeaheadContext, typeaheadText }: SuggestionsState): string => {
    return suggestion + " ";
  }

  findItemFromCompletionList(label: string, content: string) {
    label = label.substring(0, label.length - 1);
    let item;
    switch (content) {
      case "group":
        item = this.historicGroupList.find(item => item.label === label);
        break;
      case "device":
        item = this.historicDeviceList.find(item => item.label === label);
        break;
      case "sensor":
        item = this.historicSensorList.find(item => item.label === label);
      default:
        break;
    }

    if (item) {
      switch (content) {
        case "group":
          this.setState({
            selectedGroup: { label: item?.label!, id: item?.detail! }
          });
          this.props.query.selectedGroup = { label: item?.label!, id: item?.detail! };
          break;
        case "device":
          this.setState({
            historicDevice: { label: item?.label!, id: item?.detail! }
          });
          this.props.query.historicDevice = { label: item?.label!, id: item?.detail! };
          break;
        case "sensor":
          this.setState({
            historicSensor: { label: item?.label!, id: item?.detail! }
          });
          this.props.query.historicSensor = { label: item?.label!, id: item?.detail! };
          this.getHistoricChannelOptions();
        default:
          break;
      }
    }
  }

  onTypeahead = async (typeahead: TypeaheadInput, content: string): Promise<TypeaheadOutput> => {
    let completionItemList: CompletionItem[] = [];

    let parentId = "0";
    switch (content) {
      case "device":
        parentId = this.state.selectedGroup?.id!;
        break;
      case "sensor":
        parentId = this.state.historicDevice?.id!;
        break;
      default:
        break;
    }

    let datasourceReponse = await this.props.datasource.metricFindQueryHelper(content, parentId, true);
    Object.entries(datasourceReponse).map((response: any) => {
      completionItemList.push({
        label: response[1].item,
        detail: response[1].objid,
      });
    });

    // Adding GrafanaVars as options
    let dataSource: any = getDataSourceSrv() as unknown as DataSourceApi;
    Object.entries(dataSource.templateSrv.variables).map((vari: any) => {
      completionItemList.push({
        detail: vari[1].current.value,
        label: vari[1].label
      });
    });


    let completionItemGroup: CompletionItemGroup = { label: content, items: completionItemList };

    switch (content) {
      case "group":
        this.historicGroupList = completionItemList;
        break;
      case "device":
        this.historicDeviceList = completionItemList;
        break;
      case "sensor":
        this.historicSensorList = completionItemList;
        break;
      case "channel":
        this.historicChannelList = completionItemList;
        break;
      case "host":
        this.hostList = completionItemList;
      default:
        break;
    }

    return {
      suggestions: [completionItemGroup]
    };
  };

  getCascaderVars = (content: string, parent: string) => {
    let variables: CascaderOption[] = [];
    this.props.datasource.metricFindQueryHelper(content, parent, true).then((responses: any) => {
      Object.entries(responses).map((response: any) => {
        variables.push({
          value: response[1].objid,
          label: response[1].item
        });
      });
    });
    let dataSource: any = getDataSourceSrv() as unknown as DataSourceApi;
    Object.entries(dataSource.templateSrv.variables).map((vari: any) => {
      variables.push({
        value: vari[1].current.value,
        label: vari[1].label
      });
    });
    return variables;
  }
  // Neue Methoden
  renderMetricsTable = () => {
    return (
      <div className="gf-form-group">
        <h5>Metrics Options</h5>
        <table className="filter-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.metric.propertyList.map((prop, index) => (
              <tr key={index}>
                <td>{prop.visible_name}</td>
                <td>
                  <Select
                    value={{ label: prop.visible_name, value: prop.name }}
                    options={this.getPropertyOptions()}
                    onChange={(e) => this.onPropertyChange(index, e)}
                  />
                </td>
                <td>
                  <button className="btn btn-danger btn-small" onClick={() => this.state.method === 'metrics' && this.renderMetricsTable()}>
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  getPropertyOptions = () => {
    return this.state.metric.propertyList.map(p => ({
      label: p.visible_name,
      value: p.name
    }));
  };

  onPropertyChange = (index: number, option: SelectableValue) => {
    const propertyList = [...this.state.metric.propertyList];
    propertyList[index] = {
      name: option.value as string,
      visible_name: option.label as string
    };
    this.setState({
      metric: {
        ...this.state.metric,
        propertyList
      }
    });
  };
  render = () => {
    const query = defaults(this.props.query);
    const methodCurrent = methodList.find(item => item.value === query.method);

    return (
      <>
        <div className="gf-form"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
          <div>
            <Select
            label="Method"
          size={"sm"}
          options={methodList}
          value={methodCurrent}
          onChange={this.onScenarioChange}
          />
          </div>
          <div>
        <FieldSet>
          {this.renderFormFields()}
        </FieldSet>
        {this.state.method === 'metrics' && this.renderMetricsTable()}
        
        </div>
        </div>
      </>
    );
  }
}
