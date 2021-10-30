import { Field, Form, Formik } from "formik";
import React from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import InputElement from "../components/ui-elements/input";

interface Props {}

interface IInitialValues {
  username: string;
  password: string;
}

const RegisterPage: React.FC<Props> = () => {
  const initialValues: IInitialValues = { username: "", password: "" };
  return (
    <AuthLayout>
      <h1>My Example</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });

          actions.setSubmitting(false);
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputElement
              label="Username"
              id="username"
              name="username"
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
            />

            <InputElement
              label="Password"
              id="password"
              name="password"
              placeholder="Password"
              value={values.password}
              type="password"
              onChange={handleChange}
            />

            <button type="submit">{isSubmitting ? "loading" : "Submit"}</button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default RegisterPage;
