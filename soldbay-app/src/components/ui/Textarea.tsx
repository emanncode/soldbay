import React from 'react';
import { Input, InputProps } from './Input';

export interface TextareaProps extends Omit<InputProps, 'multiline' | 'textAlignVertical'> {}

export function Textarea(props: TextareaProps) {
  return <Input multiline textAlignVertical="top" {...props} />;
}
