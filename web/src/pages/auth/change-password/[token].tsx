import { NextPage } from "next";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import { useChangePasswordMutation } from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import AuthLayout from "../../components/layouts/AuthLayout";
import InputElement from "../../components/ui-elements/input";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../configurations/createUrqlClient";

interface IInitialValues {
  newPassword: string;
}

const ChangePassword: NextPage = () => {
  const [{}, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const token =
    typeof router.query.token === "string" ? router.query.token : "";

  const [tokenError, setTokenError] = useState("");

  const initialValues: IInitialValues = { newPassword: "" };
  return (
    <AuthLayout>
      <h1>Change Password</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (data?.changePassword.errors) {
            const errorMap = toErrorMap(data?.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (data?.changePassword.user) {
            router.push("/");
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

            {tokenError ? <div>{tokenError}</div> : null}

            <button type="submit">
              {isSubmitting ? "loading" : "Change password"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
