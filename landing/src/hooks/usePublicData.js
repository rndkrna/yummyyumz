import { useEffect, useState } from "react";
import { catalogProducts, featuredProducts, momentSlides } from "../data/siteData";
import { getPublicMoments, getPublicProducts } from "../services/publicData";

export function usePublicProducts() {
  const [state, setState] = useState({
    catalog: catalogProducts,
    featured: featuredProducts,
    source: "fallback",
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    getPublicProducts().then((result) => {
      if (!isMounted) return;
      setState({ ...result, isLoading: false });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

export function usePublicMoments() {
  const [state, setState] = useState({
    moments: momentSlides,
    source: "fallback",
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    getPublicMoments().then((result) => {
      if (!isMounted) return;
      setState({ ...result, isLoading: false });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
