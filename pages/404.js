import NotFound from "~/components/Error/NotFound";
import { NextSeo } from "next-seo";

export default function Custom404() {
  return (
    <>
      <NextSeo
        title="Not found | Open FPL"
        description="This page does not exist."
        noindex={true}
      />
      <NotFound />
    </>
  );
}
