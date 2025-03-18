export interface WeatherApiResponse {
  days: {
    datetime: string;
    datetimeEpoch: number;
    hours: {
      datetime: string;
      datetimeEpoch: number;
      temp: number;
      feelslike: number;
      humidity: number;
      precip: number;
      precipprob: number;
      snow: number;
      snowdepth: number;
      windspeed: number;
      windgust: number;
      winddir: number;
      pressure: number;
      visibility: number;
      cloudcover: number;
      uvindex: number;
      conditions: string;
      icon: string;
    }[];
    temp: number;
    feelslike: number;
    humidity: number;
    precip: number;
    precipprob: number;
    snow: number;
    snowdepth: number;
    windspeed: number;
    windgust: number;
    winddir: number;
    pressure: number;
    visibility: number;
    cloudcover: number;
    uvindex: number;
    conditions: string;
    icon: string;
  }[];
  resolvedAddress: string;
  timezone: string;
}
