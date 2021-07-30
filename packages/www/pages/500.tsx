import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { NextSeo } from "next-seo";

export default function Custom500() {
  return (
    <>
      <NextSeo
        title="Something went wrong – Open FPL"
        description="This page does not exist."
        noindex
      />
      <UnhandledError as="main" />
    </>
  );
}
