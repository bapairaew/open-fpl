import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import GA4React from "ga-4-react";

const { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: google_analytics_id } = process.env;

export default function useAnalytics() {
  const router = useRouter();
  const [isInitialised, setIsInitialised] = useState(false);

  const ga = google_analytics_id ? new GA4React(google_analytics_id) : null;

  useEffect(() => {
    if (ga && !isInitialised) {
      setIsInitialised(true);
      ga.initialize().then(() => logPageView(router.route));
    }
    const logPageView = (url: string) => {
      try {
        ga?.pageview(url);
      } catch (e) {
        // Ignore error
      }
    };
    router.events.on("routeChangeComplete", logPageView);
    return () => router.events.off("routeChangeComplete", logPageView);
  }, [ga]);
}
