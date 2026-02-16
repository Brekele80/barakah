export type DuaID = string;

export type DuaIndexItem = {
  id: DuaID;
  category: string;
  tags: string[];
  source?: string;
};

export type DuaLangContent = {
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
};

export type DuaLanguageFile = Record<DuaID, DuaLangContent>;

export type DuaFull = DuaIndexItem & DuaLangContent;
