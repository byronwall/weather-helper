export interface BaseReading {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  dew: number;
  precip: number;
  precipprob: number;
  snow: number;
  snowdepth: number;
  preciptype?: string[];
  windgust: number;
  windspeed: number;
  winddir: number;
  pressure: number;
  visibility: number;
  cloudcover: number;
  solarradiation: number;
  solarenergy: number;
  uvindex: number;
  conditions: string;
  icon: string;
  stations?: string[];
  source: string;
  /**
   * Only some readings have a 'severerisk'.
   * Add an optional field if you want it in all derived interfaces.
   */
  severerisk?: number;
}

export interface DayReading extends BaseReading {
  tempmax: number;
  tempmin: number;
  feelslikemax: number;
  feelslikemin: number;
  precipcover: number;
  sunrise: string;
  sunriseEpoch: number;
  sunset: string;
  sunsetEpoch: number;
  moonphase: number;
  description: string;
  hours: HourReading[];
}

export interface HourReading extends BaseReading {
  // Hourly data doesn’t usually have a separate severerisk or day-based coverage
  // But it can inherit them if you plan to use them
}

export interface CurrentConditionsReading extends BaseReading {
  sunrise: string;
  sunriseEpoch: number;
  sunset: string;
  sunsetEpoch: number;
  moonphase: number;
  /**
   * If the current conditions do not include this or if it's
   * handled differently, you can remove it.
   */
}

export interface Station {
  distance: number;
  latitude: number;
  longitude: number;
  useCount: number;
  id: string;
  name: string;
  quality: number;
  contribution: number;
}

export interface WeatherResp {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  description: string;
  days: DayReading[];
  alerts: any[]; // Could refine to more specific alert types
  stations: Record<string, Station>;
  currentConditions: CurrentConditionsReading;
}
