export interface AppOTPInputProps {
  value: string;
  onChange: (value: string) => void;
  digits?: number;
  containerStyle?: any;
  inputStyle?: any;
  error?: string;
  disabled?: boolean;
}
