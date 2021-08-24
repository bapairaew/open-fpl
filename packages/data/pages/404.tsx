import NotFound from "@open-fpl/common/features/Error/NotFound";
import { NextSeo } from "next-seo";

export default function Custom404() {
  return (
    <>
      <NextSeo
        title="Not found – Open FPL"
        description="This page does not exist."
        noindex
      />
      <NotFound as="main" />
    </>
  );
}
