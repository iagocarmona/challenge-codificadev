import { cn } from '@/lib/utils';
import lodash from 'lodash';
import { Loader2 } from 'lucide-react';
import React from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { FormInputComponentProps } from './formInput.types';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const FormInputComponent = <T extends FieldValues>({
  control,
  name,
  description,
  rules,
  mask,
  unmask,
  hideErrors,
  ...props
}: UseControllerProps<T> & FormInputComponentProps): React.JSX.Element => {
  const handleRemoveMask = (value: string): string => {
    if (unmask) {
      return unmask(value).toString();
    }

    return value;
  };

  const handleChangeText = (value: string): string => {
    if (!value.trim().length) {
      return '';
    }
    return handleRemoveMask(value);
  };

  //  Biblioteca que facilita a manipulação de objetos e arrays.
  //  Usada no código para remover propriedades desnecessárias.
  const inputProps = lodash.omit(props, 'required');

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={(): React.JSX.Element => {
        return (
          <FormField
            control={control}
            name={name}
            render={({ field }) => {
              return (
                <FormItem className={cn(props.generalclassname, 'mt-1')}>
                  <FormLabel className={cn(props.labelClassName)}>
                    {props.label}
                    {props.required && <span className="text-red-400">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute flex h-12 w-11 items-center justify-center">
                        {props.icon}
                      </div>
                      <Input
                        {...field}
                        {...inputProps}
                        disabled={
                          field.disabled || inputProps.disabled || props.loading
                        }
                        className={cn(
                          '-mt-2 h-12',
                          props.icon && 'pl-11',
                          props.type === 'date' && '!py-0',
                          props.className,
                        )}
                        value={mask ? mask(field.value) : field.value}
                        placeholder={props.placeholder}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                          const formattedValue = handleChangeText(
                            event.currentTarget.value,
                          );
                          field.onChange(formattedValue);
                          if (props.onChange) props.onChange(formattedValue);
                        }}
                      />
                      {props.loading && (
                        <div className="absolute right-0 top-0 flex h-12 w-11 items-center justify-center">
                          <Loader2
                            size={16}
                            className="absolute flex animate-spin items-center text-muted-foreground"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {description && (
                    <FormDescription className="text-xs">
                      {description}
                    </FormDescription>
                  )}
                  {!hideErrors && <FormMessage />}
                </FormItem>
              );
            }}
          />
        );
      }}
    />
  );
};
