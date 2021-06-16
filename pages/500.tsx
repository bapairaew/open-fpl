import { NextSeo } from "next-seo";
import UnhandledError from "~/features/Error/UnhandledError";

export default function Custom500() {
  return (
    <>
      <NextSeo
        title="Something went wrong | Open FPL"
        description="This page does not exist."
        noindex
      />
      <UnhandledError />
    </>
  );
}
