import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import AuthLayout from "../components/layouts/AuthLayout";
import InputElement from "../components/ui-elements/input";
import { createUrqlClient } from "../configurations/createUrqlClient";

interface Props {}

interface IInitialValues {
  username: string;
  password: string;
}

const RegisterPage: React.FC<Props> = () => {
  const [{}, register] = useRegisterMutation();
  const router = useRouter();

  const initialValues: IInitialValues = { username: "", password: "" };
  return (
    <AuthLayout>
      <h1>Register</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, {setErrors}) => {
          const {data} = await register(values);
          if (data?.register.errors) {
            setErrors(toErrorMap(data?.register.errors))
          }else if(data?.register.user){
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

            <button type="submit">{isSubmitting ? "loading" : "Register"}</button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: false})(RegisterPage);
