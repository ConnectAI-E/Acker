export interface LoginOutletProps {
  onEmailSubmit: (email: string) => Promise<void>;
  onPhoneSubmit: (phone: string) => Promise<void>;
  onEmailCodeSubmit: (code: string) => Promise<void>;
  onPhoneCodeSubmit: (code: string) => Promise<void>;
  onGithubLogin: () => Promise<void>;
}
