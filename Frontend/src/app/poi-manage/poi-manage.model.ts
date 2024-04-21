export interface ManageablePoi {
  id?: number;
  name: string;
  description: string;
  modified?: string;
  businessHoursPageUrl?: string;
  businessHoursPageXPath?: string;
  businessHoursPageModified?: string;
  holidaysPageUrl?: string;
  holidaysPageXPath?: string;
  holidaysPageModified?: string;
  preferredSightseeingTime: string;
  preferredWmoCodes: number[];
  entrances: ManageablePoiEntrance[];
  images: ManageablePoiImage[];
  businessTimes: ManageablePoiBusinessTime[];
}

export interface ManageablePoiEntrance {
  osmNodeId: number;
  name: string;
  description: string;
}

export interface ManageablePoiImage {
  fullSrc: string;
  iconSrc?: string;
  attribution: string;
}

export interface ManageablePoiBusinessTime {
  effectiveFrom: string;
  effectiveTo: string;
  effectiveDays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
  timeFrom: string;
  timeTo: string;
  state: 0 | 1;
}
