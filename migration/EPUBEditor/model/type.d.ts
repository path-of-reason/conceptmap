export type FileSystemEntry = {
  name: string;
  is_dir: boolean;
  path: string;
  children?: FileSystemEntry[];
  fileType?: string; // 편의상 추가 (확장자로 판단 가능)
  content?: string;
};

export type EEditorProps = {
  initialContent: string;
  onContentChange: (content: string) => void;
  fileType?: string | undefined;
  onBlur?: () => void; // Optional blur handler
};
