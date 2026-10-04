export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => Promise<void> | void;
  isLoading?: boolean;
  initialUsername?: string;
  initialPassword?: string;
}
