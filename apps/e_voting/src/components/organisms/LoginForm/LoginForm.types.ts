interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => Promise<void> | void;
  isLoading?: boolean;
  initialUsername?: string;
  initialPassword?: string;
}

export type { LoginCredentials, LoginFormProps };
