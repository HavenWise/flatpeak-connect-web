// All currencies from countries list (countries.ts) with exponent greater than 0
export const CURRENCY_MINOR_DATA: Record<
  string,
  { symbol: string; exponent: number }
> = {
  AED: { symbol: 'fils', exponent: 2 }, // United Arab Emirates
  AFN: { symbol: 'pul', exponent: 2 }, // Afghanistan
  ALL: { symbol: 'qdr', exponent: 2 }, // Albania
  AMD: { symbol: 'lum', exponent: 2 }, // Armenia
  ANG: { symbol: 'cent', exponent: 2 },
  AOA: { symbol: 'ctm', exponent: 2 }, // Angola
  ARS: { symbol: '¢', exponent: 2 }, // Argentina
  AUD: { symbol: '¢', exponent: 2 }, // Australia, Tuvalu, Kiribati, Nauru
  AWG: { symbol: 'cent', exponent: 2 },
  AZN: { symbol: 'qep', exponent: 2 }, // Azerbaijan
  BAM: { symbol: 'fng', exponent: 2 }, // Bosnia and Herzegovina
  BBD: { symbol: '¢', exponent: 2 }, // Barbados
  BDT: { symbol: 'poi', exponent: 2 }, // Bangladesh
  BGN: { symbol: 'st.', exponent: 2 }, // Bulgaria
  BHD: { symbol: 'fils', exponent: 3 }, // Bahrain
  BMD: { symbol: '¢', exponent: 2 },
  BND: { symbol: 'sen', exponent: 2 }, // Brunei Darussalam
  BOB: { symbol: 'ctv', exponent: 2 }, // Bolivia
  BRL: { symbol: '¢', exponent: 2 }, // Brazil
  BSD: { symbol: '¢', exponent: 2 }, // Bahamas
  BTN: { symbol: 'chtm', exponent: 2 }, // Bhutan
  BWP: { symbol: 'thb', exponent: 2 }, // Botswana
  BYN: { symbol: 'kop', exponent: 2 }, // Belarus
  BZD: { symbol: '¢', exponent: 2 }, // Belize
  CAD: { symbol: '¢', exponent: 2 }, // Canada
  CDF: { symbol: 'ctm', exponent: 2 }, // Congo, Democratic Republic of the
  CHF: { symbol: 'Rp.', exponent: 2 }, // Switzerland, Liechtenstein
  CNY: { symbol: 'fen', exponent: 2 }, // China
  COP: { symbol: '¢', exponent: 2 }, // Colombia
  CRC: { symbol: 'ctm', exponent: 2 }, // Costa Rica
  CUP: { symbol: 'ctv', exponent: 2 }, // Cuba
  CVE: { symbol: 'ctv', exponent: 2 },
  CZK: { symbol: 'h', exponent: 2 }, // Czech Republic
  DKK: { symbol: 'øre', exponent: 2 }, // Denmark, Faroe Islands, Greenland
  DOP: { symbol: 'ctv', exponent: 2 }, // Dominican Republic
  DZD: { symbol: 'sntm', exponent: 2 }, // Algeria
  EGP: { symbol: 'pt', exponent: 2 },
  ERN: { symbol: 'ct', exponent: 2 }, // Eritrea
  ETB: { symbol: 'snt', exponent: 2 }, // Ethiopia
  EUR: { symbol: 'c', exponent: 2 }, // Andorra, Austria and 29 more
  FJD: { symbol: '¢', exponent: 2 }, // Fiji
  FKP: { symbol: 'p', exponent: 2 }, // Falkland Islands
  GBP: { symbol: 'p', exponent: 2 }, // United Kingdom
  GEL: { symbol: 'tet', exponent: 2 }, // Georgia
  GHS: { symbol: 'psw', exponent: 2 }, // Ghana
  GIP: { symbol: 'p', exponent: 2 },
  GMD: { symbol: 'but', exponent: 2 },
  GTQ: { symbol: 'ctv', exponent: 2 }, // Guatemala
  GYD: { symbol: '¢', exponent: 2 }, // Guyana
  HKD: { symbol: '¢', exponent: 2 }, // Hong Kong
  HNL: { symbol: 'ctv', exponent: 2 }, // Honduras
  HTG: { symbol: 'ctm', exponent: 2 }, // Haiti
  HUF: { symbol: 'flr', exponent: 2 },
  IDR: { symbol: 'sen', exponent: 2 }, // Indonesia
  ILS: { symbol: 'agr', exponent: 2 }, // Israel, Palestine
  INR: { symbol: 'p', exponent: 2 }, // India
  IQD: { symbol: 'fils', exponent: 3 }, // Iraq
  IRR: { symbol: 'dinar', exponent: 2 }, // Iran
  JMD: { symbol: '¢', exponent: 2 }, // Jamaica
  JOD: { symbol: 'fils', exponent: 3 }, // Jordan
  KES: { symbol: 'cent', exponent: 2 }, // Kenya
  KGS: { symbol: 'tyn', exponent: 2 }, // Kyrgyzstan
  KHR: { symbol: 'sen', exponent: 2 }, // Cambodia
  KPW: { symbol: 'chon', exponent: 2 }, // North Korea
  KWD: { symbol: 'fils', exponent: 3 }, // Kuwait
  KYD: { symbol: '¢', exponent: 2 },
  KZT: { symbol: 'tiyn', exponent: 2 }, // Kazakhstan
  LAK: { symbol: 'att', exponent: 2 }, // Laos
  LBP: { symbol: 'pt', exponent: 2 }, // Lebanon
  LKR: { symbol: 'cent', exponent: 2 }, // Sri Lanka
  LRD: { symbol: '¢', exponent: 2 },
  LSL: { symbol: 'snt', exponent: 2 },
  LYD: { symbol: 'dh', exponent: 3 }, // Libya
  MAD: { symbol: 'ctm', exponent: 2 }, // Morocco, Western Sahara
  MDL: { symbol: 'ban', exponent: 2 }, // Moldova
  MGA: { symbol: 'irb', exponent: 2 }, // Madagascar
  MKD: { symbol: 'deni', exponent: 2 }, // North Macedonia
  MMK: { symbol: 'pya', exponent: 2 }, // Burma
  MNT: { symbol: 'mng', exponent: 2 }, // Mongolia
  MOP: { symbol: 'avo', exponent: 2 },
  MRU: { symbol: 'khm', exponent: 5 }, // Mauritania
  MUR: { symbol: 'ct', exponent: 2 }, // Mauritius
  MVR: { symbol: 'lar', exponent: 2 }, // Maldives
  MWK: { symbol: 'tmb', exponent: 2 }, // Malawi
  MXN: { symbol: '¢', exponent: 2 }, // Mexico
  MYR: { symbol: 'sen', exponent: 2 }, // Malaysia
  MZN: { symbol: 'ctv', exponent: 2 }, // Mozambique
  NAD: { symbol: '¢', exponent: 2 },
  NGN: { symbol: 'kobo', exponent: 2 }, // Nigeria
  NIO: { symbol: 'ctv', exponent: 2 }, // Nicaragua
  NOK: { symbol: 'øre', exponent: 2 }, // Norway
  NPR: { symbol: 'psa', exponent: 2 }, // Nepal
  NZD: { symbol: '¢', exponent: 2 }, // New Zealand, Niue, Cook Islands
  OMR: { symbol: 'bsa', exponent: 3 }, // Oman
  PAB: { symbol: 'cts', exponent: 2 }, // Panama
  PEN: { symbol: '¢', exponent: 2 }, // Peru
  PGK: { symbol: 'toea', exponent: 2 }, // Papua New Guinea
  PHP: { symbol: 'stm', exponent: 2 }, // Philippines
  PKR: { symbol: 'psa', exponent: 2 }, // Pakistan
  PLN: { symbol: 'gr', exponent: 2 }, // Poland
  QAR: { symbol: 'dh', exponent: 2 }, // Qatar
  RON: { symbol: 'bani', exponent: 2 }, // Romania
  RSD: { symbol: 'para', exponent: 2 }, // Serbia
  RUB: { symbol: 'kop', exponent: 2 }, // Russia
  SAR: { symbol: 'hl', exponent: 2 }, // Saudi Arabia
  SBD: { symbol: '¢', exponent: 2 }, // Solomon Islands
  SCR: { symbol: 'ct', exponent: 2 }, // Seychelles
  SDG: { symbol: 'pt', exponent: 2 }, // Sudan
  SEK: { symbol: 'öre', exponent: 2 }, // Sweden
  SGD: { symbol: '¢', exponent: 2 }, // Singapore
  SHP: { symbol: 'p', exponent: 2 },
  SLL: { symbol: 'ct', exponent: 2 },
  SOS: { symbol: 'ct', exponent: 2 }, // Somalia
  SRD: { symbol: 'ct', exponent: 2 }, // Suriname
  SSP: { symbol: 'pt', exponent: 2 }, // South Sudan
  STN: { symbol: 'ctm', exponent: 2 }, // Sao Tome and Principe
  SYP: { symbol: 'pt', exponent: 2 }, // Syria
  SZL: { symbol: 'ct', exponent: 2 }, // Swaziland
  THB: { symbol: 'stg', exponent: 2 }, // Thailand
  TJS: { symbol: 'drm', exponent: 2 }, // Tajikistan
  TMT: { symbol: 'tng', exponent: 2 }, // Turkmenistan
  TND: { symbol: 'mll', exponent: 3 }, // Tunisia
  TOP: { symbol: 'snt', exponent: 2 }, // Tonga
  TRY: { symbol: 'krs', exponent: 2 }, // Turkey
  TTD: { symbol: '¢', exponent: 2 }, // Trinidad and Tobago
  TWD: { symbol: 'fen', exponent: 2 }, // Taiwan
  TZS: { symbol: 'ct', exponent: 2 }, // Tanzania
  UAH: { symbol: 'kop', exponent: 2 }, // Ukraine
  USD: { symbol: '¢', exponent: 2 }, // United States, Ecuador, El Salvador, Palau, Federated States of Micronesia, Marshall Islands
  UYU: { symbol: 'cts', exponent: 2 }, // Uruguay (Peso Uruguayo)
  UZS: { symbol: 'tyn', exponent: 2 }, // Uzbekistan
  VES: { symbol: 'ctm', exponent: 2 }, // Venezuela
  WST: { symbol: 'sene', exponent: 2 }, // Samoa
  XCD: { symbol: '¢', exponent: 2 }, // Antigua and Barbuda, Dominica, Grenada, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the Grenadines
  YER: { symbol: 'fils', exponent: 2 }, // Yemen
  ZAR: { symbol: 'c', exponent: 2 }, // South Africa, Lesotho, Namibia
  ZMW: { symbol: 'ngw', exponent: 2 }, // Zambia
  ZWL: { symbol: 'ct', exponent: 2 } // Zimbabwe
};
