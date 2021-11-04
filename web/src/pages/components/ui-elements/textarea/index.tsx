import { useField } from "formik";
import React, { DetailedHTMLProps, TextareaHTMLAttributes } from "react";

type TextareaInputFieldProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label: string;
  name: string;
};

const TextareaInputElement: React.FC<TextareaInputFieldProps> = ({
  label,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <textarea {...field} {...props} id={field.name} />
      {error ? <span>{error}</span> : null}
    </div>
  );
};

export default TextareaInputElement;
