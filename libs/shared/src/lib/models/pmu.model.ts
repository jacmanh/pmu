import { SurfaceType } from './race.model';

export type PmuModel = {
  programme: Programme;
  timestampPMU: TimestampPMU;
};

export type Programme = {
  cached: boolean;
  date: number;
  dateProgrammeActif: number;
  timezoneOffset: number;
  reunions: Reunion[];
  prochainesCoursesAPartir: ProchainesCoursesAPartir[];
  datesProgrammesDisponibles: string[];
};

export type ProchainesCoursesAPartir = {
  numReunion: number;
  numCourse: number;
};

export type Reunion = {
  cached: boolean;
  timezoneOffset: number;
  dateReunion: number;
  numOfficiel: number;
  numOfficielReunionPrecedente: number | null;
  numOfficielReunionSuivante: number | null;
  numExterne: number;
  nature: string;
  hippodrome: ReunionHippodrome;
  pays: Pays;
  courses: CourseElement[];
  audience: Audience;
  statut: string;
  disciplinesMere: string[];
  specialites: Discipline[];
  derniereReunion: boolean;
  prochaineCourse?: number;
  parisEvenement: ParisEvenement[];
  meteo: Meteo;
  offresInternet: boolean;
  cagnottes: Cagnotte[];
  reportPlusFpaMax?: number;
  regionHippique?: string;
};

export enum Audience {
  National = 'NATIONAL',
}

export type Cagnotte = {
  numCourse: number;
  typePari: string;
  montant: number;
  cagnotteInternet: boolean;
  typeCagnotte?: string;
};

export type CourseElement = {
  cached: boolean;
  arriveeDefinitive?: boolean;
  departImminent: boolean;
  timezoneOffset: number;
  numReunion: number;
  numExterneReunion: number;
  numOrdre: number;
  numExterne: number;
  heureDepart: number;
  libelle: string;
  libelleCourt: string;
  montantPrix: number;
  parcours: Parcours;
  distance: number;
  distanceUnit: DistanceUnit;
  discipline: Discipline;
  specialite: Discipline;
  categorieParticularite: string;
  conditionAge?: ConditionAge;
  conditionSexe: ConditionSexe;
  nombreDeclaresPartants: number;
  grandPrixNationalTrot: boolean;
  numSocieteMere: number;
  pariMultiCourses: boolean;
  pariSpecial: boolean;
  montantTotalOffert: number;
  montantOffert1er: number;
  montantOffert2eme: number;
  montantOffert3eme: number;
  montantOffert4eme: number;
  montantOffert5eme: number;
  conditions: string;
  numCourseDedoublee: number;
  paris: Paris[];
  typePiste?: SurfaceType;
  statut: Statut;
  categorieStatut: CategorieStatut;
  dureeCourse?: number;
  participants: any[];
  ecuries: any[];
  penetrometre?: Penetrometre;
  rapportsDefinitifsDisponibles: boolean;
  isArriveeDefinitive?: boolean;
  isDepartImminent: boolean;
  isDepartAJPlusUn: boolean;
  cagnottes: Cagnotte[];
  pronosticsExpires: boolean;
  replayDisponible: boolean;
  hippodrome: CourseHippodrome;
  epcPourTousParis: boolean;
  courseTrackee: boolean;
  courseExclusiveInternet: boolean;
  formuleChampLibreIndisponible: boolean;
  hasEParis: boolean;
  ordreArrivee?: Array<number[]>;
  poolIds?: PoolID[];
  numQuestion?: number[];
  corde?: Corde;
  incidents?: Incident[];
  indicateurEvenementArriveeProvisoire?: string;
  detailsIndicateurEvenementArriveeProvisoire?: string;
};

export enum CategorieStatut {
  APartir = 'A_PARTIR',
  Arrivee = 'ARRIVEE',
}

export enum ConditionAge {
  CinqAnsEtPlus = 'CINQ_ANS_ET_PLUS',
  DeuxAns = 'DEUX_ANS',
  QuatreAnsEtPlus = 'QUATRE_ANS_ET_PLUS',
  TroisAns = 'TROIS_ANS',
  TroisAnsEtPlus = 'TROIS_ANS_ET_PLUS',
}

export enum ConditionSexe {
  Femelles = 'FEMELLES',
  FemellesEtMales = 'FEMELLES_ET_MALES',
  MalesEtHongres = 'MALES_ET_HONGRES',
  TousChevaux = 'TOUS_CHEVAUX',
}

export enum Corde {
  CordeDroite = 'CORDE_DROITE',
  CordeGauche = 'CORDE_GAUCHE',
}

export enum Discipline {
  Attele = 'ATTELE',
  Monte = 'MONTE',
  Plat = 'PLAT',
}

export enum DistanceUnit {
  Metre = 'METRE',
}

export type CourseHippodrome = {
  codeHippodrome: string;
  libelleCourt: string;
  libelleLong: string;
};

export type Incident = {
  type: Type;
  numeroParticipants: number[];
};

export enum Type {
  DisqualifiePourAllureIrreguliere = 'DISQUALIFIE_POUR_ALLURE_IRREGULIERE',
  Distance = 'DISTANCE',
  NonPartant = 'NON_PARTANT',
}

export enum Parcours {
  Empty = '',
  PisteEnSableDirt = 'PISTE EN SABLE(DIRT)',
}

export type Paris = {
  nbChevauxReglementaire: number;
  ordre: boolean;
  combine: boolean;
  spotAutorise: boolean;
  complement: boolean;
  codePari: string;
  typePari: string;
  miseBase?: number;
  enVente: boolean;
  audience?: Audience;
  reportable: boolean;
  infosJackpot?: InfosJackpot;
  valeursFlexiAutorisees?: number[];
  valeursRisqueAutorisees?: number[];
  cagnotte?: number;
  nouveauQuinte?: boolean;
  infosOptionMax?: InfosOptionMax;
};

export type InfosJackpot = {
  miseBase: number;
  tauxContribution: TauxContribution;
};

export type TauxContribution = {
  numerateur: number;
  denominateur: number;
};

export type InfosOptionMax = {
  miseBase: number;
  tauxContribution: TauxContribution;
  tirage: Tirage[];
};

export type Tirage = {
  coef: number;
  numeros: number[];
};

export type Penetrometre = {
  valeurMesure: ValeurMesure;
  heureMesure: HeureMesure;
  intitule: Intitule;
  commentaire: string;
};

export enum HeureMesure {
  The20240707T1000 = '2024-07-07T10:00',
  The20240707T1252 = '2024-07-07T12:52',
  The20240707T1253 = '2024-07-07T12:53',
}

export enum Intitule {
  Bon = 'Bon',
  BonSouple = 'Bon souple',
}

export enum ValeurMesure {
  The30 = '3,0',
  The33 = '3,3',
}

export type PoolID = {
  codePari: CodePari;
  poolId: string;
};

export enum CodePari {
  EPick5 = 'E_PICK5',
  EQuintePlus = 'E_QUINTE_PLUS',
  Eb5 = 'EB5',
}

export enum Statut {
  ArriveeDefinitiveComplete = 'ARRIVEE_DEFINITIVE_COMPLETE',
  DepartDansTroisMinutes = 'DEPART_DANS_TROIS_MINUTES',
  FinCourse = 'FIN_COURSE',
  Programmee = 'PROGRAMMEE',
  RougeAuxPartants = 'ROUGE_AUX_PARTANTS',
}

export type ReunionHippodrome = {
  code: string;
  libelleCourt: string;
  libelleLong: string;
};

export type Meteo = {
  datePrevision: number;
  nebulositeCode: string;
  nebulositeLibelleCourt: string;
  nebulositeLibelleLong: string;
  temperature: number;
  forceVent: number;
  directionVent: string;
};

export type ParisEvenement = {
  codePari: CodePari;
  course: ParisEvenementCourse;
};

export type ParisEvenementCourse = {
  dateProgramme: number;
  numReunion: number;
  numOrdre: number;
};

export type Pays = {
  code: string;
  libelle: string;
};

export type TimestampPMU = {
  timestamp: number;
  timezoneOffset: number;
};
