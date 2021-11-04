import React from "react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import { usePostsMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import AuthLayout from "../components/layouts/AuthLayout";
import InputElement from "../components/ui-elements/input";
import { createUrqlClient } from "../configurations/createUrqlClient";
import TextareaInputElement from "../components/ui-elements/textarea";

interface Props {}

interface IInitialValues {
  text: string;
  title: string;
}

const CreatePostPage: React.FC<Props> = () => {
  const [{}, post] = usePostsMutation();
  const router = useRouter();

  const initialValues: IInitialValues = { text: "", title: "" };
  return (
    <AuthLayout>
      <h1>New Post</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await post(values);
          if (data?.post.errors) {
            setErrors(toErrorMap(data?.post.errors));
          } else if (data?.post.user) {
            router.push("/");
          }
          //   actions.setSubmitting(false);
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

            <button type="submit">{isSubmitting ? "loading" : "Create"}</button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePostPage);
