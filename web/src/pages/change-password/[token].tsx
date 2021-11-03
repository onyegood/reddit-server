import { NextPage } from 'next';
import React from 'react';
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import AuthLayout from "../components/layouts/AuthLayout";
import InputElement from "../components/ui-elements/input";

interface IInitialValues {
    newPassword: string;
}

const ChangePassword: NextPage<{token: string}> = ({ token }) => {
  const [{}, changePassword] = useChangePasswordMutation();
  const router = useRouter();

  const initialValues: IInitialValues = { newPassword: "" };
  return (
    <AuthLayout>
      <h1>Change Password</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, {setErrors}) => {
          const {data} = await changePassword({newPassword: values.newPassword, token});
          if (data?.changePassword.errors) {
            setErrors(toErrorMap(data?.changePassword.errors))
          }else if(data?.changePassword.user){
            router.push('/')
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputElement
              label="New Password"
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              value={values.newPassword}
              type="password"
              onChange={handleChange}
            />

            <button type="submit">{isSubmitting ? "loading" : "Change password"}</button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};


ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default ChangePassword;