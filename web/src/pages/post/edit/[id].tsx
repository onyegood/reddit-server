import React from "react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";

import { createUrqlClient } from "../../../configurations/createUrqlClient";
import { useUpdatePostMutation } from "../../../generated/graphql";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Form, Formik } from "formik";
import InputElement from "../../components/ui-elements/input";
import TextareaInputElement from "../../components/ui-elements/textarea";
import useGetPostFromUrl from "../../../hooks/useGetPostFromUrl";
import useGetIntIdFromUrl from "../../../hooks/useGetIntIdFromUrl";

interface IInitialValues {
  id: number;
  text: string;
  title: string;
}

const EditPost = () => {
  const router = useRouter();

  const intId = useGetIntIdFromUrl();
  const [{ data, fetching }] = useGetPostFromUrl();
  const [{}, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <AuthLayout>
        <div>loading...</div>
      </AuthLayout>
    );
  }

  if (!data?.post) {
    return (
      <AuthLayout>
        <div>Post not found</div>
      </AuthLayout>
    );
  }

  const initialValues: IInitialValues = {
    id: intId,
    text: data.post.text,
    title: data.post.title,
  };

  return (
    <AuthLayout>
      <h1>New Post</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const { errors } = await updatePost({ ...values });
          if (!errors) {
            router.back();
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputElement
              label="title"
              id="title"
              name="title"
              placeholder="Title"
              value={values.title}
              onChange={handleChange}
            />

            <TextareaInputElement
              label="Text"
              id="text"
              name="text"
              placeholder="Enter text"
              value={values.text}
              onChange={handleChange}
            />

            <button type="submit">{isSubmitting ? "loading" : "Update"}</button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(EditPost);
