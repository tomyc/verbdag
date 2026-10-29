import { useEffect, useState } from 'react';

const KEY = 'verbdag-v1';

export const DEFAULT_STATE = {
  settings: { size: 5, groups: ['S', '1', '2', '3', '4', 'M'], lenient: false },
  progress: {}, // id -> { box, seen, errors, last, due }
  days: {}, // 'YYYY-MM-DD' -> { packs: [{ ids, done, score }] }
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const s = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...s, settings: { ...DEFAULT_STATE.settings, ...s.settings } };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useStore() {
  const [state, setState] = useState(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* brak dostępu do pamięci przeglądarki – aplikacja działa bez zapisu */
    }
  }, [state]);
  return [state, setState];
}

export function streak(days, today, addDays) {
  const doneOn = (k) => days[k]?.packs?.some((p) => p.done);
  let n = 0;
  let k = doneOn(today) ? today : addDays(today, -1);
  while (doneOn(k)) {
    n++;
    k = addDays(k, -1);
  }
  return n;
}
