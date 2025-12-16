// Common data types for authentication screens

export interface Language {
  id: string;
  name: string;
  flag: string;
}

export interface Studio {
  id: string;
  name: string;
}

export interface SelectableItem {
  id: string;
  name: string;
}

export const LANGUAGES: Language[] = [
  { id: 'en-GB', name: 'English', flag: '🇬🇧' },
  { id: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { id: 'de', name: 'German', flag: '🇩🇪' },
  { id: 'ua', name: 'Ukrainian', flag: '🇺🇦' },
];

export const STUDIOS: Studio[] = [
  { id: '1', name: 'UN1T London Bridge' },
  { id: '2', name: 'UN1T Holborn' },
  { id: '3', name: 'UN1T Munich' },
  { id: '4', name: 'UN1T Dubai' },
  { id: '5', name: 'UN1T Qatar' },
  { id: '6', name: 'UN1T Kuwait' },
];
