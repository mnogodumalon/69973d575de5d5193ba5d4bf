// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export type LookupValue = { key: string; label: string };
export type GeoLocation = { lat: number; long: number; info?: string };

export interface ArtikelEinstellen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    foto?: string;
    hersteller?: string;
    modell?: string;
    farbe?: string;
    groesse?: string;
  };
}

export const APP_IDS = {
  ARTIKEL_EINSTELLEN: '69973d478f87c3d22d5c7258',
} as const;


export const LOOKUP_OPTIONS: Record<string, Record<string, {key: string, label: string}[]>> = {};

export const FIELD_TYPES: Record<string, Record<string, string>> = {
  'artikel_einstellen': {
    'foto': 'file',
    'hersteller': 'string/text',
    'modell': 'string/text',
    'farbe': 'string/text',
    'groesse': 'string/text',
  },
};

type StripLookup<T> = {
  [K in keyof T]: T[K] extends LookupValue | undefined ? string | undefined
    : T[K] extends LookupValue[] | undefined ? string[] | undefined
    : T[K];
};

// Helper Types for creating new records (lookup fields as plain strings for API)
export type CreateArtikelEinstellen = StripLookup<ArtikelEinstellen['fields']>;