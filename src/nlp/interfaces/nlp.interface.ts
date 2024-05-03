export interface Nlp {
  language: string;
  intents: Intents;
}

export interface Intents {
  recebi: RecebiOrGastei;
  gastei: RecebiOrGastei;
}

export interface RecebiOrGastei {
  examples?: string[] | null;
  responses?: string[] | null;
}
