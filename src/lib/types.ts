export type HeritageType =
  | "festival"
  | "craft"
  | "performing"
  | "oral"
  | "ritual"
  | "knowledge";

export type Source = {
  id: string;
  url: string;
  title: string;
  publisher: string | null;
  accessed_on: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer_index: number;
  explanation: string;
  sort_order: number;
};

export type Quiz = {
  id: string;
  item_id: string;
  title: string;
  questions: QuizQuestion[];
};

export type Region = {
  id: string;
  slug: string;
  name: string;
  state_ut: string | null;
  zone: string | null;
  lat: number | null;
  lng: number | null;
  blurb: string;
};

export type HeritageItem = {
  id: string;
  slug: string;
  type: HeritageType;
  title: string;
  summary: string;
  body: string;
  unesco_id: string | null;
  gi_flag: boolean;
  region_id: string;
  region_slug: string;
  calendar_note: string;
  sensitivity_flag: boolean;
  published: boolean;
  tags: string[];
  languages: string[];
  sources: Source[];
  quiz: Quiz;
};

export type Catalogue = {
  generated_on: string;
  disclaimer: string;
  regions: Region[];
  languages: { code: string; name: string }[];
  items: HeritageItem[];
};
