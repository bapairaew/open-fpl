import { NextSeo } from "next-seo";
import UnhandledError from "@open-fpl/app/features/Error/UnhandledError";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";

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
