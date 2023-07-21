export interface SystemMessageProps {
  disabled?: boolean;
  data: Messages[];
  onChange: React.Dispatch<React.SetStateAction<Messages[]>>;
}

export interface SystemMessageItemProps {
  disabled?: boolean;
  prompt: SmList;
  onChange: (id: string, message: Messages) => void;
  onDelete: (id: string) => void;
}

export interface SmList {
  id: string;
  role: Role;
  content: string;
}
