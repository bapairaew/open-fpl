import { NextSeo } from "next-seo";
import UnhandledError from "~/features/Error/UnhandledError";
import AppLayout from "~/features/Layout/AppLayout";

export default function Custom500() {
  return (
    <>
      <NextSeo
        title="Something went wrong – Open FPL"
        description="This page does not exist."
        noindex
      />
      <AppLayout>
        <UnhandledError as="main" />
      </AppLayout>
    </>
  );
}
