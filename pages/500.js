import { NextSeo } from "next-seo";
import UnhandledError from "~/components/Error/UnhandledError";

export default function Custom404() {
  return (
    <>
      <NextSeo
        title="Something went wrong | Open FPL"
        description="This page does not exist."
        noindex={true}
      />
      <UnhandledError />
    </>
  );
}
