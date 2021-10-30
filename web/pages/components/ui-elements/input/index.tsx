import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

const InputElement: React.FC<InputFieldProps> = ({ label, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <input {...field} {...props} id={field.name} />
      {error ? <span>{error}</span> : null}
    </div>
  );
};

export default InputElement;
