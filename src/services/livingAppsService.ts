// AUTOMATICALLY GENERATED SERVICE
import { APP_IDS } from '@/types/app';
import type { ArtikelEinstellen } from '@/types/app';

// Base Configuration
const API_BASE_URL = 'https://my.living-apps.de/rest';

// --- HELPER FUNCTIONS ---
export function extractRecordId(url: string | null | undefined): string | null {
  if (!url) return null;
  // Extrahiere die letzten 24 Hex-Zeichen mit Regex
  const match = url.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : null;
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `https://my.living-apps.de/rest/apps/${appId}/records/${recordId}`;
}

async function callApi(method: string, endpoint: string, data?: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Nutze Session Cookies für Auth
    body: data ? JSON.stringify(data) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  // DELETE returns often empty body or simple status
  if (method === 'DELETE') return true;
  return response.json();
}

// AI Image Analysis Response Type
export interface ImageAnalysisResult {
  hersteller: string;
  modell: string;
  farbe: string;
  groesse: string;
}

export class LivingAppsService {
  // --- AI IMAGE ANALYSIS ---
  static async analyzeImage(imageBase64: string): Promise<ImageAnalysisResult> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: `Analyze this product image and extract the following information. Return ONLY a valid JSON object with these exact keys, no markdown or explanation:
{
  "hersteller": "brand/manufacturer name or empty string if unknown",
  "modell": "product model/name or empty string if unknown",
  "farbe": "main color in German or empty string if unknown",
  "groesse": "size if visible or empty string if unknown"
}

Be concise. For farbe, use German color names like Schwarz, Weiß, Blau, Rot, Grün, Grau, Braun, etc.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Bildanalyse fehlgeschlagen');
    }

    const data = await response.json();
    const textContent = data.content?.[0]?.text || '{}';

    // Parse the JSON response
    try {
      const parsed = JSON.parse(textContent);
      return {
        hersteller: parsed.hersteller || '',
        modell: parsed.modell || '',
        farbe: parsed.farbe || '',
        groesse: parsed.groesse || '',
      };
    } catch {
      return { hersteller: '', modell: '', farbe: '', groesse: '' };
    }
  }

  // --- ARTIKEL_EINSTELLEN ---
  static async getArtikelEinstellen(): Promise<ArtikelEinstellen[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.ARTIKEL_EINSTELLEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getArtikelEinstellenEntry(id: string): Promise<ArtikelEinstellen | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.ARTIKEL_EINSTELLEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createArtikelEinstellenEntry(fields: ArtikelEinstellen['fields']) {
    return callApi('POST', `/apps/${APP_IDS.ARTIKEL_EINSTELLEN}/records`, { fields });
  }
  static async updateArtikelEinstellenEntry(id: string, fields: Partial<ArtikelEinstellen['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.ARTIKEL_EINSTELLEN}/records/${id}`, { fields });
  }
  static async deleteArtikelEinstellenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.ARTIKEL_EINSTELLEN}/records/${id}`);
  }

}