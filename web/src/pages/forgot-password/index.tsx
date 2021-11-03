import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useForgotPasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import AuthLayout from "../components/layouts/AuthLayout";
import InputElement from "../components/ui-elements/input";

interface Props {}

interface IInitialValues {
  email: string;
}

const ForgotPasswordPage: React.FC<Props> = () => {
  const [{}, register] = useForgotPasswordMutation();
  const router = useRouter();

  const initialValues: IInitialValues = { email: "" };
  return (
    <AuthLayout>
      <h1>Forgot Password</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, {setErrors}) => {
          const {data} = await register(values);
          if (data?.forgotPassword.errors) {
            setErrors(toErrorMap(data?.forgotPassword.errors))
          }else if(data?.forgotPassword.user){
            router.push('/')
          }
        //   actions.setSubmitting(false);
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputElement
              label="email"
              id="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
            />

            <button type="submit">{isSubmitting ? "loading" : "Send"}</button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
