export interface Content {
  parts: Part[];
  role: string;
}

interface Part {
  text: string;
}

export interface BotResponse {
  msg: string;
}
