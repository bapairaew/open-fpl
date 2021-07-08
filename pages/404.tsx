import { NextSeo } from "next-seo";
import NotFound from "~/features/Error/NotFound";
import AppLayout from "~/features/Layout/AppLayout";

export default function Custom404() {
  return (
    <>
      <NextSeo
        title="Not found – Open FPL"
        description="This page does not exist."
        noindex
      />
      <AppLayout>
        <NotFound as="main" />
      </AppLayout>
    </>
  );
}
