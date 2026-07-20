"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const LocaleContext = createContext(null);

export function LocaleProvider({ children, locale: initialLocale }) {
  const [dict, setDict] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Derive the current locale directly from the URL on every render
  const segments = pathname.split("/");
  const locale = segments[1] || initialLocale;

  useEffect(() => {
    import(`../translations/${locale}.json`)
      .then((mod) => setDict(mod.default || mod))
      .catch(() => {
        import(`../translations/en.json`).then((m) => setDict(m.default || m));
      });
  }, [locale]);

  const setLocale = (newLocale) => {
    if (newLocale === locale) return;
    const segs = pathname.split("/");
    segs[1] = newLocale;
    const newPath = segs.join("/") || `/${newLocale}`;
    router.push(newPath);
  };

  if (!dict) return null;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}