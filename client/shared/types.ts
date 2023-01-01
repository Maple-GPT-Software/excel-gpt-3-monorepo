/** Response when querying prompt API */
export interface GPTCompetion {
  choices: { finish_reason: string; index: number; text: string }[];
  id: string;
  model: string;
  object: string;
}
