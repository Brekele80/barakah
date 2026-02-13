"use client";

import { useEffect, useState, useCallback } from "react";
import { safeFetch } from "@/lib/fetcher";

type Times = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

type AladhanResponse = {
  data: { timings: Times };
};

type GeoResponse = {
  city?: string;
  locality?: string;
  countryName?: string;
};

type Props = {
  lang?: string;
};

const labels: Record<
  string,
  {
    change: string;
    updated: string;
    refreshed: string;
    detecting: string;
    error: string;
  }
> = {
  "20": {
    change: "Change location",
    updated: "Location updated",
    refreshed: "Prayer times refreshed",
    detecting: "Detecting location…",
    error: "Location unavailable",
  },
  "33": {
    change: "Ubah lokasi",
    updated: "Lokasi diperbarui",
    refreshed: "Jadwal sholat diperbarui",
    detecting: "Mendeteksi lokasi…",
    error: "Lokasi tidak tersedia",
  },
  "31": {
    change: "Konumu değiştir",
    updated: "Konum güncellendi",
    refreshed: "Namaz vakitleri güncellendi",
    detecting: "Konum algılanıyor…",
    error: "Konum alınamadı",
  },
  "85": {
    change: "Changer l'emplacement",
    updated: "Emplacement mis à jour",
    refreshed: "Horaires actualisés",
    detecting: "Localisation…",
    error: "Position indisponible",
  },
  "97": {
    change: "مقام تبدیل کریں",
    updated: "مقام اپڈیٹ ہوگیا",
    refreshed: "نماز کے اوقات اپڈیٹ ہوگئے",
    detecting: "مقام معلوم کیا جا رہا ہے…",
    error: "مقام دستیاب نہیں",
  },
};

export default function PrayerWidget({ lang = "20" }: Props) {
  const t = labels[lang] ?? labels["20"];

  const [times, setTimes] = useState<Times | null>(null);
  const [location, setLocation] = useState<string>(t.detecting);
  const [modal, setModal] = useState(false);

  /* ---------- FETCH TIMES ---------- */
  const fetchTimes = useCallback(async (lat: number, lon: number) => {
    const method =
      lat >= -11 && lat <= 6 && lon >= 95 && lon <= 141 ? 11 : 2;

    const json = await safeFetch<AladhanResponse>(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=${method}`
    );

    if (!json) return;
    setTimes(json.data.timings);
  }, []);

  /* ---------- SET LOCATION TEXT ---------- */
  const setLocationText = useCallback(async (lat: number, lon: number) => {
    const geo = await safeFetch<GeoResponse>(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`
    );

    const city = geo?.city || geo?.locality || "";
    const country = geo?.countryName || "";

    if (!city && !country) {
      setLocation(t.error);
      return;
    }

    setLocation(`${city}, ${country}`);
  }, [t.error]);

  /* ---------- DETECT ---------- */
  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(t.error);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const current = JSON.stringify({
          lat: lat.toFixed(2),
          lon: lon.toFixed(2),
        });

        const last = localStorage.getItem("prayer-location");

        /* ALWAYS update visible location text */
        await setLocationText(lat, lon);

        /* ALWAYS refresh prayer times */
        await fetchTimes(lat, lon);

        /* SAME LOCATION → no modal */
        if (last === current) return;

        /* NEW LOCATION */
        localStorage.setItem("prayer-location", current);

        setModal(true);
        setTimeout(() => setModal(false), 2000);
      },
      () => {
        setLocation(t.error);
      },
      { enableHighAccuracy: true }
    );
  }, [fetchTimes, setLocationText, t.error]);

  useEffect(() => {
    const id = setTimeout(() => detect(), 0);
    return () => clearTimeout(id);
  }, [detect]);

  return (
    <div className="relative h-45 border rounded-2xl p-6 bg-white dark:bg-black flex flex-col justify-between">

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-zinc-900 px-10 py-8 rounded-2xl shadow-xl text-center">
            <div className="text-lg font-semibold mb-1">{t.updated}</div>
            <div className="text-sm text-gray-500">{t.refreshed}</div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{location}</span>

        <button
          onClick={detect}
          className="underline opacity-70 hover:opacity-100"
        >
          {t.change}
        </button>
      </div>

      {/* TIMES */}
      {!times ? (
        <div className="text-center text-gray-400 animate-pulse">
          Loading prayer times…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <Row name="Fajr" time={times.Fajr} />
          <Row name="Dhuhr" time={times.Dhuhr} />
          <Row name="Asr" time={times.Asr} />
          <Row name="Maghrib" time={times.Maghrib} />
          <Row name="Isha" time={times.Isha} />
        </div>
      )}
    </div>
  );
}

function Row({ name, time }: { name: string; time: string }) {
  return (
    <>
      <span className="text-left">{name}</span>
      <span className="text-right">{time}</span>
    </>
  );
}
