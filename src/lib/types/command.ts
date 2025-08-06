export type Command = {
  key: string;
  description: string;
  action: () => void;
};
