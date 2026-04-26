"use client";

import { useEffect, useState } from "react";

export function useSafari() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const detected = /safari/i.test(ua) && !/chrome|chromium|android/i.test(ua);
    setIsSafari(detected);
  }, []);

  return isSafari;
}
