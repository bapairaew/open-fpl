import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
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
      <AppLayout>
        <NotFound Wrapper={FullScreenMessageWithAppDrawer} as="main" />
      </AppLayout>
    </>
  );
}
