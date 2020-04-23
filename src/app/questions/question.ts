export interface Question {
  availableLanguages?: any;
  createdDate: number;
  id?: string;
  image?: any | null;
  question?: Languages;
  optionA?: Languages;
  optionB?: Languages;
  optionC?: Languages;
  optionD?: Languages;
  rightAnswer?: string;
  status?: string;
  topic?: string;
}
export interface Languages {
  en?: string;
  es?: string;
  fr?: string;
  pt?: string;
  de?: string;
  it?: string;
}
