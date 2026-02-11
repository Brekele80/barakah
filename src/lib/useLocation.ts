"use client";

import { useEffect, useState } from "react";

export type LocationData = {
  lat: number;
  lon: number;
  city: string;
  country: string;
};

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`
        );
        const data = await res.json();

        setLocation({
          lat,
          lon,
          city: data.city,
          country: data.countryName,
        });
      } catch {
        setLocation({
          lat,
          lon,
          city: "",
          country: "",
        });
      }
    });
  }, []);

  return location;
}
