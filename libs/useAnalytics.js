import { useEffect } from "react";
import { useRouter } from "next/router";
import ga from "react-ga";

const { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: google_analytics_id } = process.env;

export default function useAnalytics() {
  const router = useRouter();

  if (google_analytics_id) {
    useEffect(() => {
      ga.initialize(google_analytics_id);

      const logPageView = (url) => {
        ga.pageview(url);
      };

      router.events.on("routeChangeComplete", logPageView);
      return () => {
        router.events.off("routeChangeComplete", logPageView);
      };
    }, []);
  }
}
