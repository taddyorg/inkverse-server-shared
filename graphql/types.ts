import type { GraphQLResolveInfo } from 'graphql';
import type { ComicSeriesModel, ComicIssueModel, ComicStoryModel, CreatorModel, CreatorContentModel } from '../database/types.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/**  Comic Issue Details  */
export type ComicIssue = {
  __typename?: 'ComicIssue';
  /**  Stringified JSON details for the banner art. Convert to JSON to use. */
  bannerImageAsString?: Maybe<Scalars['String']['output']>;
  /**  Details on the comic for which this issue belongs to  */
  comicSeries?: Maybe<ComicSeries>;
  /**  Short note from the creator for the issue  */
  creatorNote?: Maybe<Scalars['String']['output']>;
  /**  The date when the issue (exclusive content) becomes available through the scope (epoch time in seconds) */
  dateExclusiveContentAvailable?: Maybe<Scalars['Int']['output']>;
  /**  Date when the issue was published (Epoch time in seconds)  */
  datePublished?: Maybe<Scalars['Int']['output']>;
  /**  A different hash means that details for this issue have updated since the last hash  */
  hash?: Maybe<Scalars['String']['output']>;
  /**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
  isBlocked?: Maybe<Scalars['Boolean']['output']>;
  /**  If the issue has now been removed from the SSS Feed  */
  isRemoved?: Maybe<Scalars['Boolean']['output']>;
  /**  The name (title) of the issue  */
  name?: Maybe<Scalars['String']['output']>;
  /**  Next issue in the series  */
  nextIssue?: Maybe<ComicIssue>;
  /**  Position of the issue in the series  */
  position?: Maybe<Scalars['Int']['output']>;
  /**  Preview of the first 5 story image urls  */
  previewStoryImageUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /**  The scopes for the exclusive content - e.g. 'patreon'  */
  scopesForExclusiveContent?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /**  Unique identifier for a comic series this issue belongs to  */
  seriesUuid: Scalars['ID']['output'];
  /**  Details on all the stories that make up this issue  */
  stories?: Maybe<Array<Maybe<ComicStory>>>;
  /**  A different hash means that details for the stories that make up this issue have updated since the last hash  */
  storiesHash?: Maybe<Scalars['String']['output']>;
  /**  Stringified JSON details for the thumbnail art. Convert to JSON to use. */
  thumbnailImageAsString?: Maybe<Scalars['String']['output']>;
  /**  Unique identifier for a comic issue  */
  uuid: Scalars['ID']['output'];
};

/**  Comic Issue Details  */
export type ComicSeries = {
  __typename?: 'ComicSeries';
  /**  Stringified JSON details for the banner art. Convert to JSON to use.  */
  bannerImageAsString?: Maybe<Scalars['String']['output']>;
  /**  Rating of the comic series  */
  contentRating?: Maybe<ContentRating>;
  /**  Copyright details for this feed  */
  copyright?: Maybe<Scalars['String']['output']>;
  /**  Stringified JSON details for the cover art. Convert to JSON to use.  */
  coverImageAsString?: Maybe<Scalars['String']['output']>;
  /**  Creators of the comic series  */
  creators?: Maybe<Array<Maybe<Creator>>>;
  /**  Date when the comic series was published (Epoch time in seconds)  */
  datePublished?: Maybe<Scalars['Int']['output']>;
  /**  The description for a comic series  */
  description?: Maybe<Scalars['String']['output']>;
  /**  1st Genre for the comic series  */
  genre0?: Maybe<Genre>;
  /**  2nd Genre for the comic series  */
  genre1?: Maybe<Genre>;
  /**  3rd Genre for the comic series   */
  genre2?: Maybe<Genre>;
  /**  A hash of all comic details. It may be useful for you to save this property in your database and compare it to know if any comic details have updated since the last time you checked  */
  hash?: Maybe<Scalars['String']['output']>;
  /**  The UUID of the hosting provider for this comic series' SSS feed  */
  hostingProviderUuid?: Maybe<Scalars['ID']['output']>;
  /**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
  isBlocked?: Maybe<Scalars['Boolean']['output']>;
  /**  If the comic series is finished / complete  */
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  /**  Number of issues in a comic series  */
  issueCount?: Maybe<Scalars['Int']['output']>;
  /**  A list of issues for this comic series  */
  issues?: Maybe<Array<Maybe<ComicIssue>>>;
  /**  A hash of the details for all issues for this comic. It may be useful for you to save this property in your database and compare it to know if there are any new or updated issues since the last time you checked  */
  issuesHash?: Maybe<Scalars['String']['output']>;
  /**  The language the comic series is in  */
  language?: Maybe<Language>;
  /**  The name (title) for a comic series  */
  name?: Maybe<Scalars['String']['output']>;
  /**  The scopes for the exclusive content - e.g. 'patreon'  */
  scopesForExclusiveContent?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /**  Layout type of the comic series  */
  seriesType?: Maybe<ComicSeriesType>;
  /**  The unique url ending for a comic series  */
  shortUrl?: Maybe<Scalars['String']['output']>;
  /**  Name to use for contacting the owner of this feed  */
  sssOwnerName?: Maybe<Scalars['String']['output']>;
  /**  Email to use for contacting the owner of this feed  */
  sssOwnerPublicEmail?: Maybe<Scalars['String']['output']>;
  /**  Url for the comic series' SSS feed  */
  sssUrl?: Maybe<Scalars['String']['output']>;
  /**  Tags for the comic series  */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /**  Stringified JSON details for the thumbnail art. Convert to JSON to use.  */
  thumbnailImageAsString?: Maybe<Scalars['String']['output']>;
  /**  Unique identifier for this comic  */
  uuid: Scalars['ID']['output'];
};


/**  Comic Issue Details  */
export type ComicSeriesIssuesArgs = {
  includeRemovedIssues?: InputMaybe<Scalars['Boolean']['input']>;
  limitPerPage?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
};

/**  Type of comic series (just webtoon for now)  */
export enum ComicSeriesType {
  Webtoon = 'WEBTOON'
}

/**  Comic Story Details  */
export type ComicStory = {
  __typename?: 'ComicStory';
  /**  Details on the comic issue that this story belongs to  */
  comicIssue?: Maybe<ComicIssue>;
  /**  Details on the comic series that this story belongs to  */
  comicSeries?: Maybe<ComicSeries>;
  /**  A different hash means that details for this story have updated since the last hash  */
  hash?: Maybe<Scalars['String']['output']>;
  /**  Height of the story image  */
  height?: Maybe<Scalars['Int']['output']>;
  /**  If the story has now been removed from the SSS Feed  */
  isRemoved?: Maybe<Scalars['Boolean']['output']>;
  /**  Unique identifier for a comic issue this story belongs to  */
  issueUuid: Scalars['ID']['output'];
  /**  Unique identifier for a comic series this story belongs to  */
  seriesUuid: Scalars['ID']['output'];
  /**  Stringified JSON details for the story art. Convert to JSON to use. */
  storyImageAsString?: Maybe<Scalars['String']['output']>;
  /**  Unique identifier for a comic story  */
  uuid: Scalars['ID']['output'];
  /**  Width of the story image  */
  width?: Maybe<Scalars['Int']['output']>;
};

/**  Content rating for different media types. Follows format: TYPE_RATING  */
export enum ContentRating {
  ComicseriesAdults = 'COMICSERIES_ADULTS',
  ComicseriesBaby = 'COMICSERIES_BABY',
  ComicseriesKids = 'COMICSERIES_KIDS',
  ComicseriesMatureTeens = 'COMICSERIES_MATURE_TEENS',
  ComicseriesPornography = 'COMICSERIES_PORNOGRAPHY',
  ComicseriesTeens = 'COMICSERIES_TEENS'
}

/**  Content roles for different media types. Follows format: TYPE_ROLE_SUBROLE  */
export enum ContentRole {
  ComicseriesArtist = 'COMICSERIES_ARTIST',
  ComicseriesArtistColorist = 'COMICSERIES_ARTIST_COLORIST',
  ComicseriesArtistInker = 'COMICSERIES_ARTIST_INKER',
  ComicseriesArtistLetterer = 'COMICSERIES_ARTIST_LETTERER',
  ComicseriesArtistPenciler = 'COMICSERIES_ARTIST_PENCILER',
  ComicseriesEditor = 'COMICSERIES_EDITOR',
  ComicseriesProducer = 'COMICSERIES_PRODUCER',
  ComicseriesTranslator = 'COMICSERIES_TRANSLATOR',
  ComicseriesWriter = 'COMICSERIES_WRITER'
}

/**  Countries (ISO 3166-1 https://en.wikipedia.org/wiki/ISO_3166-1)  */
export enum Country {
  Afghanistan = 'AFGHANISTAN',
  AlandIslands = 'ALAND_ISLANDS',
  Albania = 'ALBANIA',
  Algeria = 'ALGERIA',
  AmericanSamoa = 'AMERICAN_SAMOA',
  Andorra = 'ANDORRA',
  Angola = 'ANGOLA',
  Anguilla = 'ANGUILLA',
  Antarctica = 'ANTARCTICA',
  AntiguaAndBarbuda = 'ANTIGUA_AND_BARBUDA',
  Argentina = 'ARGENTINA',
  Armenia = 'ARMENIA',
  Aruba = 'ARUBA',
  Australia = 'AUSTRALIA',
  Austria = 'AUSTRIA',
  Azerbaijan = 'AZERBAIJAN',
  Bahamas = 'BAHAMAS',
  Bahrain = 'BAHRAIN',
  Bangladesh = 'BANGLADESH',
  Barbados = 'BARBADOS',
  Belarus = 'BELARUS',
  Belgium = 'BELGIUM',
  Belize = 'BELIZE',
  Benin = 'BENIN',
  Bermuda = 'BERMUDA',
  Bhutan = 'BHUTAN',
  BoliviaPlurinationalStateOf = 'BOLIVIA_PLURINATIONAL_STATE_OF',
  BonaireSintEustatiusAndSaba = 'BONAIRE_SINT_EUSTATIUS_AND_SABA',
  BosniaAndHerzegovina = 'BOSNIA_AND_HERZEGOVINA',
  Botswana = 'BOTSWANA',
  BouvetIsland = 'BOUVET_ISLAND',
  Brazil = 'BRAZIL',
  BritishIndianOceanTerritoryThe = 'BRITISH_INDIAN_OCEAN_TERRITORY_THE',
  BruneiDarussalam = 'BRUNEI_DARUSSALAM',
  Bulgaria = 'BULGARIA',
  BurkinaFaso = 'BURKINA_FASO',
  Burundi = 'BURUNDI',
  CaboVerde = 'CABO_VERDE',
  Cambodia = 'CAMBODIA',
  Cameroon = 'CAMEROON',
  Canada = 'CANADA',
  CaymanIslands = 'CAYMAN_ISLANDS',
  CentralAfricanRepublic = 'CENTRAL_AFRICAN_REPUBLIC',
  Chad = 'CHAD',
  Chile = 'CHILE',
  China = 'CHINA',
  ChristmasIsland = 'CHRISTMAS_ISLAND',
  CocosKeelingIslands = 'COCOS_KEELING_ISLANDS',
  Colombia = 'COLOMBIA',
  Comoros = 'COMOROS',
  Congo = 'CONGO',
  CongoTheDemocraticRepublicOf = 'CONGO_THE_DEMOCRATIC_REPUBLIC_OF',
  CookIslands = 'COOK_ISLANDS',
  CostaRica = 'COSTA_RICA',
  CoteDIvoire = 'COTE_D_IVOIRE',
  Croatia = 'CROATIA',
  Cuba = 'CUBA',
  Curacao = 'CURACAO',
  Cyprus = 'CYPRUS',
  Czechia = 'CZECHIA',
  Denmark = 'DENMARK',
  Djibouti = 'DJIBOUTI',
  Dominica = 'DOMINICA',
  DominicanRepublic = 'DOMINICAN_REPUBLIC',
  Ecuador = 'ECUADOR',
  Egypt = 'EGYPT',
  ElSalvador = 'EL_SALVADOR',
  EquatorialGuinea = 'EQUATORIAL_GUINEA',
  Eritrea = 'ERITREA',
  Estonia = 'ESTONIA',
  Eswatini = 'ESWATINI',
  Ethiopia = 'ETHIOPIA',
  FalklandIslandsTheMalvinas = 'FALKLAND_ISLANDS_THE_MALVINAS',
  FaroeIslands = 'FAROE_ISLANDS',
  Fiji = 'FIJI',
  Finland = 'FINLAND',
  France = 'FRANCE',
  FrenchGuiana = 'FRENCH_GUIANA',
  FrenchPolynesia = 'FRENCH_POLYNESIA',
  FrenchSouthernTerritories = 'FRENCH_SOUTHERN_TERRITORIES',
  Gabon = 'GABON',
  Gambia = 'GAMBIA',
  Georgia = 'GEORGIA',
  Germany = 'GERMANY',
  Ghana = 'GHANA',
  Gibraltar = 'GIBRALTAR',
  Greece = 'GREECE',
  Greenland = 'GREENLAND',
  Grenada = 'GRENADA',
  Guadeloupe = 'GUADELOUPE',
  Guam = 'GUAM',
  Guatemala = 'GUATEMALA',
  Guernsey = 'GUERNSEY',
  Guinea = 'GUINEA',
  GuineaBissau = 'GUINEA_BISSAU',
  Guyana = 'GUYANA',
  Haiti = 'HAITI',
  HeardIslandAndMcdonaldIslands = 'HEARD_ISLAND_AND_MCDONALD_ISLANDS',
  HolySee = 'HOLY_SEE',
  Honduras = 'HONDURAS',
  HongKong = 'HONG_KONG',
  Hungary = 'HUNGARY',
  Iceland = 'ICELAND',
  India = 'INDIA',
  Indonesia = 'INDONESIA',
  Iran = 'IRAN',
  Iraq = 'IRAQ',
  Ireland = 'IRELAND',
  IsleOfMan = 'ISLE_OF_MAN',
  Israel = 'ISRAEL',
  Italy = 'ITALY',
  Jamaica = 'JAMAICA',
  Japan = 'JAPAN',
  Jersey = 'JERSEY',
  Jordan = 'JORDAN',
  Kazakhstan = 'KAZAKHSTAN',
  Kenya = 'KENYA',
  Kiribati = 'KIRIBATI',
  KoreaNorth = 'KOREA_NORTH',
  KoreaSouth = 'KOREA_SOUTH',
  Kuwait = 'KUWAIT',
  Kyrgyzstan = 'KYRGYZSTAN',
  LaoPeoplesDemocraticRepublicThe = 'LAO_PEOPLES_DEMOCRATIC_REPUBLIC_THE',
  Latvia = 'LATVIA',
  Lebanon = 'LEBANON',
  Lesotho = 'LESOTHO',
  Liberia = 'LIBERIA',
  Libya = 'LIBYA',
  Liechtenstein = 'LIECHTENSTEIN',
  Lithuania = 'LITHUANIA',
  Luxembourg = 'LUXEMBOURG',
  Macao = 'MACAO',
  Madagascar = 'MADAGASCAR',
  Malawi = 'MALAWI',
  Malaysia = 'MALAYSIA',
  Maldives = 'MALDIVES',
  Mali = 'MALI',
  Malta = 'MALTA',
  MarshallIslands = 'MARSHALL_ISLANDS',
  Martinique = 'MARTINIQUE',
  Mauritania = 'MAURITANIA',
  Mauritius = 'MAURITIUS',
  Mayotte = 'MAYOTTE',
  Mexico = 'MEXICO',
  MicronesiaFederatedStates = 'MICRONESIA_FEDERATED_STATES',
  MinorOutlyingIslandsUs = 'MINOR_OUTLYING_ISLANDS_US',
  MoldovaTheRepublic = 'MOLDOVA_THE_REPUBLIC',
  Monaco = 'MONACO',
  Mongolia = 'MONGOLIA',
  Montenegro = 'MONTENEGRO',
  Montserrat = 'MONTSERRAT',
  Morocco = 'MOROCCO',
  Mozambique = 'MOZAMBIQUE',
  Myanmar = 'MYANMAR',
  Namibia = 'NAMIBIA',
  Nauru = 'NAURU',
  Nepal = 'NEPAL',
  Netherlands = 'NETHERLANDS',
  NewCaledonia = 'NEW_CALEDONIA',
  NewZealand = 'NEW_ZEALAND',
  Nicaragua = 'NICARAGUA',
  Niger = 'NIGER',
  Nigeria = 'NIGERIA',
  Niue = 'NIUE',
  NorfolkIsland = 'NORFOLK_ISLAND',
  NorthernMarianaIslands = 'NORTHERN_MARIANA_ISLANDS',
  NorthMacedonia = 'NORTH_MACEDONIA',
  Norway = 'NORWAY',
  Oman = 'OMAN',
  Pakistan = 'PAKISTAN',
  Palau = 'PALAU',
  PalestineState = 'PALESTINE_STATE',
  Panama = 'PANAMA',
  PapuaNewGuinea = 'PAPUA_NEW_GUINEA',
  Paraguay = 'PARAGUAY',
  Peru = 'PERU',
  Philippines = 'PHILIPPINES',
  Pitcairn = 'PITCAIRN',
  Poland = 'POLAND',
  Portugal = 'PORTUGAL',
  PuertoRico = 'PUERTO_RICO',
  Qatar = 'QATAR',
  Reunion = 'REUNION',
  Romania = 'ROMANIA',
  Russia = 'RUSSIA',
  Rwanda = 'RWANDA',
  SaintBarthelemy = 'SAINT_BARTHELEMY',
  SaintHelenaAscensionAndTristanDaCunha = 'SAINT_HELENA_ASCENSION_AND_TRISTAN_DA_CUNHA',
  SaintKittsAndNevis = 'SAINT_KITTS_AND_NEVIS',
  SaintLucia = 'SAINT_LUCIA',
  SaintMartinFrenchPart = 'SAINT_MARTIN_FRENCH_PART',
  SaintPierreAndMiquelon = 'SAINT_PIERRE_AND_MIQUELON',
  SaintVincentAndTheGrenadines = 'SAINT_VINCENT_AND_THE_GRENADINES',
  Samoa = 'SAMOA',
  SanMarino = 'SAN_MARINO',
  SaoTomeAndPrincipe = 'SAO_TOME_AND_PRINCIPE',
  SaudiArabia = 'SAUDI_ARABIA',
  Senegal = 'SENEGAL',
  Serbia = 'SERBIA',
  Seychelles = 'SEYCHELLES',
  SierraLeone = 'SIERRA_LEONE',
  Singapore = 'SINGAPORE',
  SintMaartenDutchPart = 'SINT_MAARTEN_DUTCH_PART',
  Slovakia = 'SLOVAKIA',
  Slovenia = 'SLOVENIA',
  SolomonIslands = 'SOLOMON_ISLANDS',
  Somalia = 'SOMALIA',
  SouthAfrica = 'SOUTH_AFRICA',
  SouthGeorgiaAndTheSouthSandwichIslands = 'SOUTH_GEORGIA_AND_THE_SOUTH_SANDWICH_ISLANDS',
  SouthSudan = 'SOUTH_SUDAN',
  Spain = 'SPAIN',
  SriLanka = 'SRI_LANKA',
  Sudan = 'SUDAN',
  Suriname = 'SURINAME',
  SvalbardAndJanMayen = 'SVALBARD_AND_JAN_MAYEN',
  Sweden = 'SWEDEN',
  Switzerland = 'SWITZERLAND',
  Syria = 'SYRIA',
  Taiwan = 'TAIWAN',
  Tajikistan = 'TAJIKISTAN',
  Tanzania = 'TANZANIA',
  Thailand = 'THAILAND',
  TimorLeste = 'TIMOR_LESTE',
  Togo = 'TOGO',
  Tokelau = 'TOKELAU',
  Tonga = 'TONGA',
  TrinidadAndTobago = 'TRINIDAD_AND_TOBAGO',
  Tunisia = 'TUNISIA',
  Turkey = 'TURKEY',
  Turkmenistan = 'TURKMENISTAN',
  TurksAndCaicosIslands = 'TURKS_AND_CAICOS_ISLANDS',
  Tuvalu = 'TUVALU',
  Uganda = 'UGANDA',
  Ukraine = 'UKRAINE',
  UnitedArabEmirates = 'UNITED_ARAB_EMIRATES',
  UnitedKingdom = 'UNITED_KINGDOM',
  UnitedStatesOfAmerica = 'UNITED_STATES_OF_AMERICA',
  Uruguay = 'URUGUAY',
  Uzbekistan = 'UZBEKISTAN',
  Vanuatu = 'VANUATU',
  Venezuela = 'VENEZUELA',
  Vietnam = 'VIETNAM',
  VirginIslandsBritish = 'VIRGIN_ISLANDS_BRITISH',
  VirginIslandsUs = 'VIRGIN_ISLANDS_US',
  WallisAndFutuna = 'WALLIS_AND_FUTUNA',
  WesternSahara = 'WESTERN_SAHARA',
  Yemen = 'YEMEN',
  Zambia = 'ZAMBIA',
  Zimbabwe = 'ZIMBABWE'
}

/**  Creator Details  */
export type Creator = {
  __typename?: 'Creator';
  /**  Stringified JSON details for the avatar image. Convert to JSON to use. */
  avatarImageAsString?: Maybe<Scalars['String']['output']>;
  /**  A short bio on the creator  */
  bio?: Maybe<Scalars['String']['output']>;
  /**  A list of content for this creator  */
  content?: Maybe<Array<Maybe<CreatorContent>>>;
  /**  A hash of the details for all different content a creator makes. It may be useful for you to save this property in your database and compare it to know if there are any new or updated content since the last time you checked  */
  contentHash?: Maybe<Scalars['String']['output']>;
  /**  Copyright details for this feed  */
  copyright?: Maybe<Scalars['String']['output']>;
  /**  The country in which the creator is resides in or is from  */
  country?: Maybe<Country>;
  /**  Date when the creator feed was published (Epoch time in seconds)  */
  datePublished?: Maybe<Scalars['Int']['output']>;
  /**  A hash of all creator details. It may be useful for you to save this property in your database and compare it to know if any details have updated since the last time you checked  */
  hash?: Maybe<Scalars['String']['output']>;
  /**  If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates  */
  isBlocked?: Maybe<Scalars['Boolean']['output']>;
  /**  Links to creator's website, email, or social media  */
  links?: Maybe<Array<Maybe<LinkDetails>>>;
  /**  The name of the creator  */
  name?: Maybe<Scalars['String']['output']>;
  /**  The unqiue url ending for a comic  */
  shortUrl?: Maybe<Scalars['String']['output']>;
  /**  Name to use for contacting the owner of this feed  */
  sssOwnerName?: Maybe<Scalars['String']['output']>;
  /**  Email to use for contacting the owner of this feed  */
  sssOwnerPublicEmail?: Maybe<Scalars['String']['output']>;
  /**  Url for the creator's SSS feed  */
  sssUrl?: Maybe<Scalars['String']['output']>;
  /**  Tags for the creator  */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /**  Unique identifier for this creator  */
  uuid?: Maybe<Scalars['ID']['output']>;
};


/**  Creator Details  */
export type CreatorContentArgs = {
  limitPerPage?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
};

/**  CreatorContent Details  */
export type CreatorContent = {
  __typename?: 'CreatorContent';
  /**  If content is a comic - Details for the content  */
  comicseries?: Maybe<ComicSeries>;
  /**  Position on the content feed  */
  contentPosition?: Maybe<Scalars['Int']['output']>;
  /**  Content type  */
  contentType?: Maybe<TaddyType>;
  /**  Unique identifier for the content  */
  contentUuid?: Maybe<Scalars['ID']['output']>;
  /**  Unique identifier for the creator  */
  creatorUuid?: Maybe<Scalars['ID']['output']>;
  /**  A hash of all creatorcontent details  */
  hash?: Maybe<Scalars['String']['output']>;
  /**  (Old) Unique identifier for this creatorcontent  */
  id?: Maybe<Scalars['ID']['output']>;
  /**  Unique identifier for this creatorcontent  */
  mergedUuid?: Maybe<Scalars['ID']['output']>;
  /**  Position on the creator feed  */
  position?: Maybe<Scalars['Int']['output']>;
  /**  Roles for the creator for this content  */
  roles?: Maybe<Array<Maybe<ContentRole>>>;
};

/**  Link Details  */
export type CreatorLinkDetails = {
  __typename?: 'CreatorLinkDetails';
  /**  The uuid of the creator  */
  creatorUuid: Scalars['ID']['output'];
  /**  The type of link  */
  type?: Maybe<LinkType>;
  /**  The url for the link  */
  url?: Maybe<Scalars['String']['output']>;
};

/**  Genres for different media types. Follows format: TYPE_GENRE_SUBGENRE  */
export enum Genre {
  ComicseriesAction = 'COMICSERIES_ACTION',
  ComicseriesAnimals = 'COMICSERIES_ANIMALS',
  ComicseriesBl = 'COMICSERIES_BL',
  ComicseriesComedy = 'COMICSERIES_COMEDY',
  ComicseriesCrime = 'COMICSERIES_CRIME',
  ComicseriesDrama = 'COMICSERIES_DRAMA',
  ComicseriesDystopia = 'COMICSERIES_DYSTOPIA',
  ComicseriesEducational = 'COMICSERIES_EDUCATIONAL',
  ComicseriesFantasy = 'COMICSERIES_FANTASY',
  ComicseriesGaming = 'COMICSERIES_GAMING',
  ComicseriesGl = 'COMICSERIES_GL',
  ComicseriesHarem = 'COMICSERIES_HAREM',
  ComicseriesHighSchool = 'COMICSERIES_HIGH_SCHOOL',
  ComicseriesHistorical = 'COMICSERIES_HISTORICAL',
  ComicseriesHorror = 'COMICSERIES_HORROR',
  ComicseriesIsekai = 'COMICSERIES_ISEKAI',
  ComicseriesLgbtq = 'COMICSERIES_LGBTQ',
  ComicseriesMystery = 'COMICSERIES_MYSTERY',
  ComicseriesPostApocalyptic = 'COMICSERIES_POST_APOCALYPTIC',
  ComicseriesRomance = 'COMICSERIES_ROMANCE',
  ComicseriesSciFi = 'COMICSERIES_SCI_FI',
  ComicseriesSliceOfLife = 'COMICSERIES_SLICE_OF_LIFE',
  ComicseriesSports = 'COMICSERIES_SPORTS',
  ComicseriesSuperhero = 'COMICSERIES_SUPERHERO',
  ComicseriesSupernatural = 'COMICSERIES_SUPERNATURAL',
  ComicseriesThriller = 'COMICSERIES_THRILLER',
  ComicseriesZombies = 'COMICSERIES_ZOMBIES'
}

/**  Languages (ISO 639-2 https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes)  */
export enum Language {
  Abkhazian = 'ABKHAZIAN',
  Afar = 'AFAR',
  Afrikaans = 'AFRIKAANS',
  Akan = 'AKAN',
  Albanian = 'ALBANIAN',
  Amharic = 'AMHARIC',
  Arabic = 'ARABIC',
  Aragonese = 'ARAGONESE',
  Armenian = 'ARMENIAN',
  Assamese = 'ASSAMESE',
  Avaric = 'AVARIC',
  Avestan = 'AVESTAN',
  Aymara = 'AYMARA',
  Azerbaijani = 'AZERBAIJANI',
  Bambara = 'BAMBARA',
  Bashkir = 'BASHKIR',
  Basque = 'BASQUE',
  Belarusian = 'BELARUSIAN',
  Bengali = 'BENGALI',
  BihariLanguages = 'BIHARI_LANGUAGES',
  Bislama = 'BISLAMA',
  Bosnian = 'BOSNIAN',
  Breton = 'BRETON',
  Bulgarian = 'BULGARIAN',
  Burmese = 'BURMESE',
  CentralKhmer = 'CENTRAL_KHMER',
  Chamorro = 'CHAMORRO',
  Chechen = 'CHECHEN',
  ChichewaChewaNyanja = 'CHICHEWA_CHEWA_NYANJA',
  Chinese = 'CHINESE',
  ChurchSlavonic = 'CHURCH_SLAVONIC',
  Chuvash = 'CHUVASH',
  Cornish = 'CORNISH',
  Corsican = 'CORSICAN',
  Cree = 'CREE',
  Croatian = 'CROATIAN',
  Czech = 'CZECH',
  Danish = 'DANISH',
  DhivehiMaldivian = 'DHIVEHI_MALDIVIAN',
  DutchFlemish = 'DUTCH_FLEMISH',
  Dzongkha = 'DZONGKHA',
  English = 'ENGLISH',
  Esperanto = 'ESPERANTO',
  Estonian = 'ESTONIAN',
  Ewe = 'EWE',
  Faroese = 'FAROESE',
  Farsi = 'FARSI',
  Fijian = 'FIJIAN',
  Finnish = 'FINNISH',
  French = 'FRENCH',
  Fulah = 'FULAH',
  Gaelic = 'GAELIC',
  Galician = 'GALICIAN',
  Ganda = 'GANDA',
  Georgian = 'GEORGIAN',
  German = 'GERMAN',
  Gikuyu = 'GIKUYU',
  Greek = 'GREEK',
  Guarani = 'GUARANI',
  Gujarati = 'GUJARATI',
  HaitianCreole = 'HAITIAN_CREOLE',
  Hausa = 'HAUSA',
  Hebrew = 'HEBREW',
  Herero = 'HERERO',
  Hindi = 'HINDI',
  HiriMotu = 'HIRI_MOTU',
  Hungarian = 'HUNGARIAN',
  Icelandic = 'ICELANDIC',
  Ido = 'IDO',
  Igbo = 'IGBO',
  Indonesian = 'INDONESIAN',
  Interlingua = 'INTERLINGUA',
  InterlingueOccidental = 'INTERLINGUE_OCCIDENTAL',
  Inuktitut = 'INUKTITUT',
  Inupiaq = 'INUPIAQ',
  Irish = 'IRISH',
  Italian = 'ITALIAN',
  Japanese = 'JAPANESE',
  Javanese = 'JAVANESE',
  KalaallisutGreenlandic = 'KALAALLISUT_GREENLANDIC',
  Kannada = 'KANNADA',
  Kanuri = 'KANURI',
  Kashmiri = 'KASHMIRI',
  Kazakh = 'KAZAKH',
  Kinyarwanda = 'KINYARWANDA',
  Komi = 'KOMI',
  Kongo = 'KONGO',
  Korean = 'KOREAN',
  Kurdish = 'KURDISH',
  Kwanyama = 'KWANYAMA',
  Kyrgyz = 'KYRGYZ',
  Lao = 'LAO',
  Latin = 'LATIN',
  Latvian = 'LATVIAN',
  Letzeburgesch = 'LETZEBURGESCH',
  Limburgish = 'LIMBURGISH',
  Lingala = 'LINGALA',
  Lithuanian = 'LITHUANIAN',
  LubaKatanga = 'LUBA_KATANGA',
  Macedonian = 'MACEDONIAN',
  Malagasy = 'MALAGASY',
  Malay = 'MALAY',
  Malayalam = 'MALAYALAM',
  Maltese = 'MALTESE',
  Manx = 'MANX',
  Maori = 'MAORI',
  Marathi = 'MARATHI',
  Marshallese = 'MARSHALLESE',
  Mongolian = 'MONGOLIAN',
  Nauru = 'NAURU',
  Navajo = 'NAVAJO',
  Ndonga = 'NDONGA',
  Nepali = 'NEPALI',
  NorthernSami = 'NORTHERN_SAMI',
  NorthNdebele = 'NORTH_NDEBELE',
  Norwegian = 'NORWEGIAN',
  NorwegianBokmal = 'NORWEGIAN_BOKMAL',
  NorwegianNynorsk = 'NORWEGIAN_NYNORSK',
  NuosuSichuanYi = 'NUOSU_SICHUAN_YI',
  Occitan = 'OCCITAN',
  Ojibwa = 'OJIBWA',
  Oriya = 'ORIYA',
  Oromo = 'OROMO',
  Ossetian = 'OSSETIAN',
  Pali = 'PALI',
  Pashto = 'PASHTO',
  Polish = 'POLISH',
  Portuguese = 'PORTUGUESE',
  Punjabi = 'PUNJABI',
  Quechua = 'QUECHUA',
  RomanianMoldovan = 'ROMANIAN_MOLDOVAN',
  Romansh = 'ROMANSH',
  Rundi = 'RUNDI',
  Russian = 'RUSSIAN',
  Samoan = 'SAMOAN',
  Sango = 'SANGO',
  Sanskrit = 'SANSKRIT',
  Sardinian = 'SARDINIAN',
  Serbian = 'SERBIAN',
  Shona = 'SHONA',
  Sindhi = 'SINDHI',
  Sinhala = 'SINHALA',
  Slovak = 'SLOVAK',
  Slovenian = 'SLOVENIAN',
  Somali = 'SOMALI',
  Sotho = 'SOTHO',
  SouthNdebele = 'SOUTH_NDEBELE',
  Spanish = 'SPANISH',
  Sundanese = 'SUNDANESE',
  Swahili = 'SWAHILI',
  Swati = 'SWATI',
  Swedish = 'SWEDISH',
  Tagalog = 'TAGALOG',
  Tahitian = 'TAHITIAN',
  Tajik = 'TAJIK',
  Tamil = 'TAMIL',
  Tatar = 'TATAR',
  Telugu = 'TELUGU',
  Thai = 'THAI',
  Tibetan = 'TIBETAN',
  Tigrinya = 'TIGRINYA',
  Tonga = 'TONGA',
  Tsonga = 'TSONGA',
  Tswana = 'TSWANA',
  Turkish = 'TURKISH',
  Turkmen = 'TURKMEN',
  Twi = 'TWI',
  Ukrainian = 'UKRAINIAN',
  Urdu = 'URDU',
  Uyghur = 'UYGHUR',
  Uzbek = 'UZBEK',
  ValencianCatalan = 'VALENCIAN_CATALAN',
  Venda = 'VENDA',
  Vietnamese = 'VIETNAMESE',
  Volapuk = 'VOLAPUK',
  Walloon = 'WALLOON',
  Welsh = 'WELSH',
  WesternFrisian = 'WESTERN_FRISIAN',
  Wolof = 'WOLOF',
  Xhosa = 'XHOSA',
  Yiddish = 'YIDDISH',
  Yoruba = 'YORUBA',
  Zhuang = 'ZHUANG',
  Zulu = 'ZULU'
}

/**  Link Details  */
export type LinkDetails = {
  __typename?: 'LinkDetails';
  /**  The type of link  */
  type?: Maybe<LinkType>;
  /**  The url for the link  */
  url?: Maybe<Scalars['String']['output']>;
};

export enum LinkType {
  Bandcamp = 'BANDCAMP',
  Discord = 'DISCORD',
  Email = 'EMAIL',
  Etsy = 'ETSY',
  Facebook = 'FACEBOOK',
  Instagram = 'INSTAGRAM',
  KoFi = 'KO_FI',
  Linktree = 'LINKTREE',
  Mastodon = 'MASTODON',
  MerchStore = 'MERCH_STORE',
  Patreon = 'PATREON',
  Pinterest = 'PINTEREST',
  Reddit = 'REDDIT',
  Snapchat = 'SNAPCHAT',
  Soundcloud = 'SOUNDCLOUD',
  Spotify = 'SPOTIFY',
  Telegram = 'TELEGRAM',
  Tiktok = 'TIKTOK',
  Tumblr = 'TUMBLR',
  Twitch = 'TWITCH',
  Twitter = 'TWITTER',
  Vimeo = 'VIMEO',
  Website = 'WEBSITE',
  Wechat = 'WECHAT',
  Whatsapp = 'WHATSAPP',
  Youtube = 'YOUTUBE'
}

export type Query = {
  __typename?: 'Query';
  /**  Get details on a comic issue */
  getComicIssue?: Maybe<ComicIssue>;
  /**  Get details on a Comic Series  */
  getComicSeries?: Maybe<ComicSeries>;
  /**  Get details on a comic story */
  getComicStory?: Maybe<ComicStory>;
  /**  Get details on a Creator  */
  getCreator?: Maybe<Creator>;
  /**  Get details on a Creator  */
  getCreatorContent?: Maybe<CreatorContent>;
  /**  Get efficient links for creators of content  */
  getCreatorLinksForSeries?: Maybe<Array<Maybe<CreatorLinkDetails>>>;
  /**  Get multiple issues for a comic series  */
  getIssuesForComicSeries: Array<Maybe<ComicIssue>>;
};


export type QueryGetComicIssueArgs = {
  uuid?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetComicSeriesArgs = {
  shortUrl?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetComicStoryArgs = {
  uuid?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetCreatorArgs = {
  shortUrl?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetCreatorContentArgs = {
  mergedUuid?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetCreatorLinksForSeriesArgs = {
  contentType: TaddyType;
  contentUuid: Scalars['ID']['input'];
};


export type QueryGetIssuesForComicSeriesArgs = {
  includeRemovedIssues?: InputMaybe<Scalars['Boolean']['input']>;
  limitPerPage: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  seriesUuid: Scalars['ID']['input'];
  sortOrder?: InputMaybe<SortOrder>;
};

/**  Status of Series  */
export enum SeriesStatus {
  Announced = 'ANNOUNCED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Hiatus = 'HIATUS',
  Ongoing = 'ONGOING',
  UnderRevision = 'UNDER_REVISION'
}

/**  Different Sort orders  */
export enum SortOrder {
  Latest = 'LATEST',
  Oldest = 'OLDEST',
  Search = 'SEARCH'
}

/**  Types of media available on Taddy  */
export enum TaddyType {
  Comicissue = 'COMICISSUE',
  Comicseries = 'COMICSERIES',
  Creator = 'CREATOR'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ComicIssue: ResolverTypeWrapper<ComicIssueModel>;
  ComicSeries: ResolverTypeWrapper<ComicSeriesModel>;
  ComicSeriesType: ComicSeriesType;
  ComicStory: ResolverTypeWrapper<ComicStoryModel>;
  ContentRating: ContentRating;
  ContentRole: ContentRole;
  Country: Country;
  Creator: ResolverTypeWrapper<CreatorModel>;
  CreatorContent: ResolverTypeWrapper<CreatorContentModel>;
  CreatorLinkDetails: ResolverTypeWrapper<CreatorLinkDetails>;
  Genre: Genre;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Language: Language;
  LinkDetails: ResolverTypeWrapper<LinkDetails>;
  LinkType: LinkType;
  Query: ResolverTypeWrapper<{}>;
  SeriesStatus: SeriesStatus;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TaddyType: TaddyType;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  ComicIssue: ComicIssueModel;
  ComicSeries: ComicSeriesModel;
  ComicStory: ComicStoryModel;
  Creator: CreatorModel;
  CreatorContent: CreatorContentModel;
  CreatorLinkDetails: CreatorLinkDetails;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LinkDetails: LinkDetails;
  Query: {};
  String: Scalars['String']['output'];
}>;

export type ComicIssueResolvers<ContextType = any, ParentType extends ResolversParentTypes['ComicIssue'] = ResolversParentTypes['ComicIssue']> = ResolversObject<{
  bannerImageAsString?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comicSeries?: Resolver<Maybe<ResolversTypes['ComicSeries']>, ParentType, ContextType>;
  creatorNote?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateExclusiveContentAvailable?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  datePublished?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isBlocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isRemoved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nextIssue?: Resolver<Maybe<ResolversTypes['ComicIssue']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  previewStoryImageUrls?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  scopesForExclusiveContent?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  seriesUuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  stories?: Resolver<Maybe<Array<Maybe<ResolversTypes['ComicStory']>>>, ParentType, ContextType>;
  storiesHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnailImageAsString?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ComicSeriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ComicSeries'] = ResolversParentTypes['ComicSeries']> = ResolversObject<{
  bannerImageAsString?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contentRating?: Resolver<Maybe<ResolversTypes['ContentRating']>, ParentType, ContextType>;
  copyright?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverImageAsString?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creators?: Resolver<Maybe<Array<Maybe<ResolversTypes['Creator']>>>, ParentType, ContextType>;
  datePublished?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  genre0?: Resolver<Maybe<ResolversTypes['Genre']>, ParentType, ContextType>;
  genre1?: Resolver<Maybe<ResolversTypes['Genre']>, ParentType, ContextType>;
  genre2?: Resolver<Maybe<ResolversTypes['Genre']>, ParentType, ContextType>;
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hostingProviderUuid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  isBlocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isCompleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  issueCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  issues?: Resolver<Maybe<Array<Maybe<ResolversTypes['ComicIssue']>>>, ParentType, ContextType, Partial<ComicSeriesIssuesArgs>>;
  issuesHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scopesForExclusiveContent?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  seriesType?: Resolver<Maybe<ResolversTypes['ComicSeriesType']>, ParentType, ContextType>;
  shortUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sssOwnerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sssOwnerPublicEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sssUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  thumbnailImageAsString?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ComicStoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ComicStory'] = ResolversParentTypes['ComicStory']> = ResolversObject<{
  comicIssue?: Resolver<Maybe<ResolversTypes['ComicIssue']>, ParentType, ContextType>;
  comicSeries?: Resolver<Maybe<ResolversTypes['ComicSeries']>, ParentType, ContextType>;
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isRemoved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  issueUuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  seriesUuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  storyImageAsString?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Creator'] = ResolversParentTypes['Creator']> = ResolversObject<{
  avatarImageAsString?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<Maybe<Array<Maybe<ResolversTypes['CreatorContent']>>>, ParentType, ContextType, Partial<CreatorContentArgs>>;
  contentHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  copyright?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType>;
  datePublished?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isBlocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  links?: Resolver<Maybe<Array<Maybe<ResolversTypes['LinkDetails']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sssOwnerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sssOwnerPublicEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sssUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatorContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatorContent'] = ResolversParentTypes['CreatorContent']> = ResolversObject<{
  comicseries?: Resolver<Maybe<ResolversTypes['ComicSeries']>, ParentType, ContextType>;
  contentPosition?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  contentType?: Resolver<Maybe<ResolversTypes['TaddyType']>, ParentType, ContextType>;
  contentUuid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  creatorUuid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  mergedUuid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<Maybe<ResolversTypes['ContentRole']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatorLinkDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatorLinkDetails'] = ResolversParentTypes['CreatorLinkDetails']> = ResolversObject<{
  creatorUuid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['LinkType']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LinkDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['LinkDetails'] = ResolversParentTypes['LinkDetails']> = ResolversObject<{
  type?: Resolver<Maybe<ResolversTypes['LinkType']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getComicIssue?: Resolver<Maybe<ResolversTypes['ComicIssue']>, ParentType, ContextType, Partial<QueryGetComicIssueArgs>>;
  getComicSeries?: Resolver<Maybe<ResolversTypes['ComicSeries']>, ParentType, ContextType, Partial<QueryGetComicSeriesArgs>>;
  getComicStory?: Resolver<Maybe<ResolversTypes['ComicStory']>, ParentType, ContextType, Partial<QueryGetComicStoryArgs>>;
  getCreator?: Resolver<Maybe<ResolversTypes['Creator']>, ParentType, ContextType, Partial<QueryGetCreatorArgs>>;
  getCreatorContent?: Resolver<Maybe<ResolversTypes['CreatorContent']>, ParentType, ContextType, Partial<QueryGetCreatorContentArgs>>;
  getCreatorLinksForSeries?: Resolver<Maybe<Array<Maybe<ResolversTypes['CreatorLinkDetails']>>>, ParentType, ContextType, RequireFields<QueryGetCreatorLinksForSeriesArgs, 'contentType' | 'contentUuid'>>;
  getIssuesForComicSeries?: Resolver<Array<Maybe<ResolversTypes['ComicIssue']>>, ParentType, ContextType, RequireFields<QueryGetIssuesForComicSeriesArgs, 'limitPerPage' | 'page' | 'seriesUuid'>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  ComicIssue?: ComicIssueResolvers<ContextType>;
  ComicSeries?: ComicSeriesResolvers<ContextType>;
  ComicStory?: ComicStoryResolvers<ContextType>;
  Creator?: CreatorResolvers<ContextType>;
  CreatorContent?: CreatorContentResolvers<ContextType>;
  CreatorLinkDetails?: CreatorLinkDetailsResolvers<ContextType>;
  LinkDetails?: LinkDetailsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

