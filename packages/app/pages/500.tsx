import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { NextSeo } from "next-seo";

export default function Custom500() {
  return (
    <>
      <NextSeo title="Something went wrong – Open FPL" noindex />
      <AppLayout>
        <UnhandledError
          Wrapper={FullScreenMessageWithAppDrawer}
          as="main"
          height="100%"
        />
      </AppLayout>
    </>
  );
}
