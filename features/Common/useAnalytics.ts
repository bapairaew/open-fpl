import * as Fathom from "fathom-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const { NEXT_PUBLIC_FATHOM_TRACKING_CODE: fathom_tracking_code } = process.env;

export default function useAnalytics() {
  const router = useRouter();

  useEffect(() => {
    Fathom.load(fathom_tracking_code!, {
      includedDomains: ["www.openfpl.com"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []);
}
