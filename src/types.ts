import { DataSourceJsonData, DataQueryResponse, SelectableValue } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
  method?: string;
  tableOption?: string;
  selectedGroup?: { label: string, id: string };
  historicDevice?: { label: string, id: string };
  historicSensor?: { label: string, id: string };
  historicChannelList?: SelectableValue[];
  historicInterval?: number;
  tableFilterItemList?: SelectableValue[];
  tableColumnItemList?: SelectableValue[];
  rawURI?: string,
  rawQueryText?: string,
}


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
  hostname?: string;
  username?: string;
  passhash?: string;

}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
  cache?: number;
  passhash?: string;
}


export interface HistoricDataResponse extends DataQueryResponse {
  histdata: any[];
}

export interface SensorDataResponse {
  sensordata: any;
  tzAutoAdjust: boolean;
}

export const methodList: SelectableValue[] =
  [
    {
      label: "table",
      value: "table"
    }, {
      label: "status",
      value: "status"
    }, {
      label: "historicdata",
      value: "historicdata"
    },
    {
      label: "raw",
      value: "raw"
    }
  ];

export const tableOptions: SelectableValue[] =
  [
    {
      label: "group",
      value: "group"
    }, {
      label: "device",
      value: "device"
    }, {
      label: "sensor",
      value: "sensor"
    }, {
      label: "message",
      value: "message"
    }
  ];

export interface PrtgDataSourceOptions extends DataSourceJsonData {
  hostname?: string;
  username?: string;
  passhash?: string;
}

export interface parameterOptions {
  content?: string,
  id?: string,
  parent?: string,
  columns?: string[],
  sdate?: string,
  edate?: string,
  avg?: number,
  filter_drel?: string,
  filter?: string,
  filter_name?: string,
  usecaption?: string
  filter_objid?: number
}

export interface monthsShort {
  MonthName: string,
  MonthIndex: string,
}

export const monthsShortList: monthsShort[] =
  [
    {
      MonthName: "Jan",
      MonthIndex: "01",
    },
    {
      MonthName: "Feb",
      MonthIndex: "02",
    },
    {
      MonthName: "Mar",
      MonthIndex: "03",
    },
    {
      MonthName: "Apr",
      MonthIndex: "04",
    },
    {
      MonthName: "May",
      MonthIndex: "05",
    },
    {
      MonthName: "Jun",
      MonthIndex: "06",
    },
    {
      MonthName: "Jul",
      MonthIndex: "07",
    },
    {
      MonthName: "Aug",
      MonthIndex: "08",
    },
    {
      MonthName: "Sep",
      MonthIndex: "09",
    },
    {
      MonthName: "Oct",
      MonthIndex: "10",
    },
    {
      MonthName: "Nov",
      MonthIndex: "11",
    },
    {
      MonthName: "Dec",
      MonthIndex: "12",
    }
  ]

export const messageFilterDrelList: SelectableValue[] = [
  {
    label: "today",
    value: "today"
  },
  {
    label: "yesterday",
    value: "yesterday"
  },
  {
    label: "7days",
    value: "7days"
  },
  {
    label: "30days",
    value: "30days"
  },
  {
    label: "6months",
    value: "6months"
  },
  {
    label: "12months",
    value: "12months"
  }
]

export const defaultColumns: SelectableValue[] = [
  {
    label: "objid",
    value: "objid"
  },
  {
    label: "type",
    value: "type"
  },
  {
    label: "active",
    value: "active"
  },
  {
    label: "tags",
    value: "tags"
  },
  {
    label: "probe",
    value: "probe"
  },
  {
    label: "notifiesx",
    value: "notifiesx"
  },
  {
    label: "intervalx",
    value: "intervalx"
  },
  {
    label: "status",
    value: "status"
  },
  {
    label: "message",
    value: "message_raw"
  },
  {
    label: "priority",
    value: "priority"
  },
  {
    label: "upsens",
    value: "upsens"
  },
  {
    label: "downsens",
    value: "downsens"
  },
  {
    label: "downacksens",
    value: "downacksens"
  },
  {
    label: "partialdownsens",
    value: "partialdownsens"
  },
  {
    label: "pausedsens",
    value: "pausedsens"
  },
  {
    label: "warnsens",
    value: "warnsens"
  },
  {
    label: "unusualsens",
    value: "unusualsens"
  },
  {
    label: "totalsens",
    value: "totalsens"
  },
  {
    label: "schedule",
    value: "schedule"
  },
  {
    label: "comments",
    value: "comments"
  },
  {
    label: "basetype",
    value: "basetype"
  },
  {
    label: "baselink",
    value: "baselink"
  },
  {
    label: "parentid",
    value: "parentid"
  },
  {
    label: "probegroupdevice",
    value: "probegroupdevice"
  }
]

export const sensorColumns: SelectableValue[] = [
  {
    label: "downtime",
    value: "downtime"
  },
  {
    label: "downtimesince",
    value: "downtimesince"
  },
  {
    label: "downtimetime",
    value: "downtimetime"
  },
  {
    label: "uptime",
    value: "uptime"
  },
  {
    label: "uptimesince",
    value: "uptimesince"
  },
  {
    label: "knowntime",
    value: "kwowntime"
  },
  {
    label: "cumtime",
    value: "cumtime"
  },
  {
    label: "sensor",
    value: "sensor"
  },
  {
    label: "interval",
    value: "interval"
  },
  {
    label: "lastcheck",
    value: "lastcheck"
  },
  {
    label: "lastup",
    value: "lastup"
  },
  {
    label: "lastdown",
    value: "lastdown"
  },
  {
    label: "device",
    value: "device"
  },
  {
    label: "group",
    value: "group"
  },
  {
    label: "grpdev",
    value: "grpdev"
  },
  {
    label: "lastvalue",
    value: "lastvalue"
  },
  {
    label: "size",
    value: "size"
  }
]

export const deviceColumns: SelectableValue[] = [
  {
    label: "device",
    value: "device"
  },
  {
    label: "group",
    value: "group"
  },
  {
    label: "host",
    value: "host"
  },
  {
    label: "icon",
    value: "icon"
  },
]

export const groupColumns: SelectableValue[] = [
  {
    label: "group",
    value: "group"
  },
  {
    label: "condition",
    value: "condition"
  },
  {
    label: "groupnum",
    value: "groupnum"
  },
  {
    label: "devicenum",
    value: "devicenum"
  },
]

export const probeColumns: SelectableValue[] = [
  {
    label: "condition",
    value: "condition"
  },
  {
    label: "groupnum",
    value: "groupnum"
  },
  {
    label: "devicenum",
    value: "devicenum"
  },
]

export const messageColumns: SelectableValue[] = [
  {
    label: "status",
    value: "status"
  },
  {
    label: "message",
    value: "message_raw"
  },
  {
    label: "priority",
    value: "priority"
  },
  {
    label: "parent",
    value: "parent"
  },
  {
    label: "timeonly",
    value: "timeonly"
  },
  {
    label: "dateonly",
    value: "dateonly"
  },
  {
    label: "datetime",
    value: "datetime"
  },
  {
    label: "objid",
    value: "objid_raw"
  },
  {
    label: "type",
    value: "type"
  },
  {
    label: "active",
    value: "active"
  },
  {
    label: "tags",
    value: "tags"
  }
]

export const filterColumns: SelectableValue[] = [
  {
    label: "Tags",
    value: "tags"
  },
  {
    label: "Status",
    value: "status"
  },
  {
    label: "Priority",
    value: "priority"
  },
  {
    label: "Mesage",
    value: "message"
  },
  {
    label: "active",
    value: "active"
  }
]
/*! TODO PRTG Server
2. Gerät der Cluster - Probe
3. PRTG Core Server
4. AP - EINGANG(AP - HKMS.Eingang)(172.18.2.81)
5. AP - HALLE(AP - HKMS.Halle)(172.18.2.82)
6. AP - HKMS.Regie(AP - HKMS.Regie)(172.18.2.83)
7. UPS.Frauenbergstr.35 1.OG(172.18.2.178)
*/
export const hostColumns: SelectableValue[] = [
  {
    label: "PRTG Server",
    value: "PRTG Server"
  },
  {
    label: "Gerät der Cluster - Probe",
    value: "Gerät der Cluster - Probe"
  },
  {
    label: "PRTG Core Server",
    value: "PRTG Core Server"
  },
  {
    label: "AP - EINGANG(AP - HKMS.Eingang)(172.18.2.81)",
    value: "AP - EINGANG(AP - HKMS.Eingang)(172.18.2.81)"
  },
  {
    label: "AP - HALLE(AP - HKMS.Halle)(172.18.2.82)",
    value: "AP - HALLE(AP - HKMS.Halle)(172.18.2.82)"
  },
  {
    label: "AP - HKMS.Regie(AP - HKMS.Regie)(172.18.2.83)",
    value: "AP - HKMS.Regie(AP - HKMS.Regie)(172.18.2.83)"
  },
  {
    label: "UPS.Frauenbergstr.35 1.OG(172.18.2.178)",
    value: "UPS.Frauenbergstr.35 1.OG(172.18.2.178)"
  }

]

//! TODO END OF COLUMNS
export interface PrtgQuery extends DataQuery {
  queryMethod: SelectableValue;
  selectedGroup: SelectableValue;
  selectedDevice: SelectableValue;
  selectedSensor: SelectableValue;
  tableOption: SelectableValue;
  selectedChannel: SelectableValue;
  messageFilterDrel?: SelectableValue;
  tableColumnItems?: SelectableValue[];
  rawURI: string,
  rawQuerytext: string,
};


export const groupList: SelectableValue[] = [
  {
    label: "Hauptgruppe",
    value: "Hauptgruppe"
  },
  {
    label: "USV",
    value: "USV"
  },
  {
    label: "Wireless",
    value: "Wireless"
  },
  {
    label: "Oberstadt",
    value: "Oberstadt"
  },
  {
    label: "Barfüßer Tor",
    value: "Barfüßer Tor"
  },
  {
    label: "Friedrichstraße",
    value: "Friedrichstraße"
  },
  {
    label: "Am Krekel",
    value: "Am Krekel"
  }
]


export const sensorList: SelectableValue[] = [
  {
    label: "Clusterzustand",
    value: "Clusterzustand"
  },
  {
    label: "Sondenzustand",
    value: "Sondenzustand"
  },
  {
    label: "Arbeitsspeicher",
    value: "Arbeitsspeicher"
  },
  {
    label: "Laufwerk",
    value: "Laufwerk"
  },
  {
    label: "Serverzustand (Autonom)",
    value: "Serverzustand (Autonom)"
  },
  {
    label: "Ping",
    value: "Ping"
  },
  {
    label: "Batterie - Kapazität",
    value: "Batterie - Kapazität"
  }
]

/*! TODO valueFrom 

*/
export const valueFromList: SelectableValue[] = [
  {
    label: "Group",
    value: "Group"
  },
  {
    label: "Device",
    value: "Device"
  },
  {
    label: "Sensor",
    value: "Sensor"
  },
  {
    label: "Channel",
    value: "Channel"
  }
]



export const defaultPrtgQuery: Partial<PrtgQuery> = {
  queryMethod: methodList[0],
  tableOption: tableOptions[0],
  selectedGroup: { label: "Choose Group", value: "0" },
  selectedDevice: { label: "Choose Device", value: "0" },
  selectedSensor: { label: "Choose Sensor", value: "0" },
  selectedChannel: { label: "Choose Channel", value: "0" },
  messageFilterDrel: messageFilterDrelList[0],
  rawURI: "",
  rawQuerytext: "",
}

export interface State {
  method: string,
  tableOption: string,
  selectedGroup?: { label: string, id: string },
  historicDevice?: { label: string, id: string },
  historicSensor?: { label: string, id: string },
  historicChannelList?: SelectableValue[],
  historicInterval?: number,
  tableFilterItemList?: SelectableValue[],
  tableColumnItemList?: SelectableValue[],
  rawURI?: string,
  rawQueryText?: string,
}

export interface ApiResponse {
  data: {
    groups?: Array<{ group: string; objid: string }>;
    devices?: Array<{ device: string; objid: string }>;
    sensors?: Array<{ sensor: string; objid: string }>;
    items?: Array<{ name: string; unit: string }>;
    hosts?: Array<{ host: string; objid: string }>;
    histdata?: Array<{ datetime: string;[key: string]: any }>;
  };
}