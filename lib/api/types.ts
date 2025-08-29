// SpaceX API Types with strict typing
export interface Launch {
  id: string;
  flight_number: number;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  date_precision: "half" | "quarter" | "year" | "month" | "day" | "hour";
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
  tbd: boolean;
  net: boolean;
  window: number | null;
  rocket: string;
  success: boolean | null;
  failures: Failure[];
  upcoming: boolean;
  details: string | null;
  fairings: Fairings | null;
  crew: string[];
  ships: string[];
  capsules: string[];
  payloads: string[];
  launchpad: string;
  cores: Core[];
  links: Links;
  auto_update: boolean;
}

export interface Failure {
  time: number;
  altitude: number | null;
  reason: string;
}

export interface Fairings {
  reused: boolean | null;
  recovery_attempt: boolean | null;
  recovered: boolean | null;
  ships: string[];
}

export interface Core {
  core: string | null;
  flight: number | null;
  gridfins: boolean | null;
  legs: boolean | null;
  reused: boolean | null;
  landing_attempt: boolean | null;
  landing_success: boolean | null;
  landing_type: string | null;
  landpad: string | null;
}

export interface Links {
  patch: {
    small: string | null;
    large: string | null;
  };
  reddit: {
    campaign: string | null;
    launch: string | null;
    media: string | null;
    recovery: string | null;
  };
  flickr: {
    small: string[];
    original: string[];
  };
  presskit: string | null;
  webcast: string | null;
  youtube_id: string | null;
  article: string | null;
  wikipedia: string | null;
}

export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: Dimension;
  diameter: Dimension;
  mass: Mass;
  payload_weights: PayloadWeight[];
  first_stage: FirstStage;
  second_stage: SecondStage;
  engines: Engines;
  landing_legs: LandingLegs;
  flickr_images: string[];
  wikipedia: string;
  description: string;
}

export interface Dimension {
  meters: number;
  feet: number;
}

export interface Mass {
  kg: number;
  lb: number;
}

export interface PayloadWeight {
  id: string;
  name: string;
  kg: number;
  lb: number;
}

export interface FirstStage {
  reusable: boolean;
  engines: number;
  fuel_amount_tons: number;
  burn_time_sec: number | null;
  thrust_sea_level: Thrust;
  thrust_vacuum: Thrust;
}

export interface SecondStage {
  reusable: boolean;
  engines: number;
  fuel_amount_tons: number;
  burn_time_sec: number | null;
  thrust: Thrust;
  payloads: {
    option_1: string;
    composite_fairing: CompositeFairing;
  };
}

export interface Thrust {
  kN: number;
  lbf: number;
}

export interface CompositeFairing {
  height: Dimension;
  diameter: Dimension;
}

export interface Engines {
  number: number;
  type: string;
  version: string;
  layout: string | null;
  engine_loss_max: number | null;
  propellant_1: string;
  propellant_2: string;
  thrust_sea_level: Thrust;
  thrust_vacuum: Thrust;
  thrust_to_weight: number;
}

export interface LandingLegs {
  number: number;
  material: string | null;
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  status: string;
  locality: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  rockets: string[];
  launches: string[];
}

export interface LaunchQuery {
  query?: {
    upcoming?: boolean;
    success?: boolean;
    date_utc?: {
      $gte?: string;
      $lte?: string;
    };
    name?: {
      $regex?: string;
      $options?: string;
    };
  };
  options?: {
    limit?: number;
    offset?: number;
    sort?: Record<string, 1 | -1>;
    populate?: string[];
  };
}

export interface LaunchQueryResponse {
  docs: Launch[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface LaunchResponse {
  docs: Launch[];
  totalDocs: number;
  limit: number;
  offset: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export type Filters = {
  upcoming?: boolean;
  success?: boolean;
  dateRange?: { start?: Date; end?: Date };
  search?: string;
  sortBy: "date" | "name";
  sortOrder: "asc" | "desc";
  limit: number;
  offset?: number;
};

export interface YearlyStats {
  year: number;
  total: number;
  success: number;
  failure: number;
}

export interface SuccessRateStats {
  year: number;
  rate: number;
  launches: number;
}

export interface RocketStats {
  name: string;
  count: number;
  success: number;
  failure: number;
  successRate: number;
}
export interface PieStats {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyStats {
  month: string;
  launches: number;
}
