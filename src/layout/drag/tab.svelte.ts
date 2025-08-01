type Tab = {
  id: string;
  title: string;
  type: "file" | "terminal" | "setting" | "custom";
  content: any;
  metadata: Record<string, any>;
};
