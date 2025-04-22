import { InputProps } from '@/components/ui/input';

export interface FormInputComponentProps extends Omit<InputProps, 'onChange'> {
  mask?: (_value: string) => string;
  unmask?: (_value: string) => string | number;
  label?: string;
  labelClassName?: string;
  description?: string;
  hideErrors?: boolean;
  icon?: JSX.Element;
  onChange?: (_value: string) => void;
  generalclassname?: string;
  loading?: boolean;
}
