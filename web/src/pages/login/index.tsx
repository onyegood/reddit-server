import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useLoginMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import AuthLayout from "../components/layouts/AuthLayout";
import InputElement from "../components/ui-elements/input";

interface Props {}

interface IInitialValues {
  username: string;
  password: string;
}

const LoginPage: React.FC<Props> = () => {
  const [{}, register] = useLoginMutation();
  const router = useRouter();

  const initialValues: IInitialValues = { username: "", password: "" };
  return (
    <AuthLayout>
      <h1>Login</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, {setErrors}) => {
          const {data} = await register(values);
          if (data?.login.errors) {
            setErrors(toErrorMap(data?.login.errors))
          }else if(data?.login.user){
            router.push('/')
          }
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

            <button type="submit">{isSubmitting ? "loading" : "Login"}</button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default LoginPage;
