// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

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

// Helper Types for creating new records
export type CreateArtikelEinstellen = ArtikelEinstellen['fields'];