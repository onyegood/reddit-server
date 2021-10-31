import { Field, Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import AuthLayout from "../components/layouts/AuthLayout";
import InputElement from "../components/ui-elements/input";
import REGISTER_USER_MUTATION from "../mutations/register";

interface Props {}

interface IInitialValues {
  username: string;
  password: string;
}

const RegisterPage: React.FC<Props> = () => {
  const [{}, register] = useMutation(REGISTER_USER_MUTATION);

  const initialValues: IInitialValues = { username: "", password: "" };
  return (
    <AuthLayout>
      <h1>My Example</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          return register(values);
        //   actions.setSubmitting(false);
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
