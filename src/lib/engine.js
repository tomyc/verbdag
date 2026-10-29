import { VERBS, VERB_BY_ID } from '../data/verbs.js';

// ---------- daty ----------
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  return todayKey(new Date(y, m - 1, d + n));
}

// ---------- deterministyczny RNG (seed z daty) ----------
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed) {
  let a = hash(String(seed));
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr, rand) => arr[Math.floor(rand() * arr.length)];

// ---------- system powtórek (Leitner) ----------
// box 0 = nowy; po poprawnym pakiecie box+1, po błędach powrót do 1
export const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
export const MAX_BOX = INTERVALS.length - 1;

export function reviewVerb(progress, id, cleanRun, date) {
  const prev = progress[id] || { box: 0, seen: 0, errors: 0 };
  const box = cleanRun ? Math.min(prev.box + 1, MAX_BOX) : 1;
  return {
    ...progress,
    [id]: {
      box,
      seen: prev.seen + 1,
      errors: prev.errors + (cleanRun ? 0 : 1),
      last: date,
      due: addDays(date, INTERVALS[box]),
    },
  };
}

export function buildPack({ progress, date, size, groups, exclude = [], salt = '' }) {
  const pool = VERBS.filter((v) => groups.includes(v.group) && !exclude.includes(v.id));
  const due = pool
    .filter((v) => progress[v.id] && progress[v.id].due <= date)
    .sort((a, b) => progress[a.id].box - progress[b.id].box || progress[a.id].due.localeCompare(progress[b.id].due));
  const fresh = pool.filter((v) => !progress[v.id]);

  const ids = due.slice(0, size).map((v) => v.id);
  for (const v of fresh) {
    if (ids.length >= size) break;
    ids.push(v.id);
  }
  // wszystko opanowane i nic do powtórki – losowa powtórka
  if (ids.length < size) {
    const rest = shuffle(pool.filter((v) => !ids.includes(v.id)), rng(date + salt));
    for (const v of rest) {
      if (ids.length >= size) break;
      ids.push(v.id);
    }
  }
  return ids;
}

// ---------- ćwiczenia ----------
const SUBJECTS = ['han', 'hun', 'de', 'Ola', 'Kari', 'barna'];
const MARKERS = {
  pres: [
    { lead: 'Hver dag', pl: 'codziennie' },
    { lead: 'Vanligvis', pl: 'zwykle' },
    { lead: 'Nå', pl: 'teraz' },
  ],
  pret: [
    { lead: 'I går', pl: 'wczoraj' },
    { lead: 'I fjor', pl: 'w zeszłym roku' },
    { lead: 'I forrige uke', pl: 'w zeszłym tygodniu' },
    { lead: 'For to dager siden', pl: 'dwa dni temu' },
  ],
  perf: [
    { mid: 'allerede', pl: 'już' },
    { mid: 'aldri', pl: 'nigdy' },
    { mid: 'nettopp', pl: 'właśnie' },
  ],
  fut: [
    { lead: 'I morgen', pl: 'jutro' },
    { lead: 'Neste uke', pl: 'w przyszłym tygodniu' },
  ],
};

export const TENSE_LABEL = {
  inf: 'Infinitiv',
  pres: 'Presens',
  pret: 'Preteritum',
  perf: 'Perfektum',
  fut: 'Futurum (skal + inf.)',
};

const head = (form) => form.split(' ')[0];
const tail = (form) => form.split(' ').slice(1).join(' ');
const alts = (form) => form.split('/');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// zdanie z luką; w zdaniach z inwersją partykuła (av, etter, seg) idzie za podmiotem
function makeCloze(v, rand) {
  const tense = pick(['pres', 'pret', 'pret', 'perf', 'perf', 'fut'], rand);
  const subj = pick(SUBJECTS, rand);
  // podmiot w 3. osobie, więc min/mi/mitt/mine → sin/si/sitt/sine (lekcja 20)
  const REFL = { min: 'sin', mi: 'si', mitt: 'sitt', mine: 'sine' };
  const rest = [tail(v.inf), v.obj].filter(Boolean).join(' ').replace(/(^| )(min|mi|mitt|mine)(?= |$)/g, (_, sp, w) => sp + REFL[w]);
  const hint = `å ${v.inf}`;
  let before;
  let after;
  let answer;
  let marker;

  if (tense === 'perf') {
    marker = pick(MARKERS.perf, rand);
    before = `${cap(subj)} har ${marker.mid}`;
    after = rest;
    answer = alts(v.perf).map(head);
  } else {
    marker = pick(MARKERS[tense], rand);
    if (tense === 'fut') {
      before = `${marker.lead} skal ${subj}`;
      after = rest;
      answer = [head(v.inf)];
    } else {
      before = marker.lead;
      after = [subj, rest].filter(Boolean).join(' ');
      answer = alts(v[tense]).map(head);
    }
  }
  return {
    kind: 'cloze',
    verbId: v.id,
    tense,
    before,
    after,
    hint,
    markerPl: marker.pl,
    answers: answer,
  };
}

export function buildExercises(ids, seed) {
  const rand = rng(seed);
  const items = [];
  for (const id of ids) {
    const v = VERB_BY_ID[id];
    items.push({ kind: 'form', verbId: id, tense: 'inf', answers: [v.inf] });
    items.push({ kind: 'form', verbId: id, tense: 'pres', answers: alts(v.pres) });
    items.push({ kind: 'form', verbId: id, tense: 'pret', answers: alts(v.pret) });
    items.push({ kind: 'form', verbId: id, tense: 'perf', answers: alts(v.perf) });
    if (v.cloze) items.push(makeCloze(v, rand));
  }
  // formy danego czasownika w kolejności, ale czasowniki przeplatane w dwóch rundach
  const formsRound = shuffle(items.filter((i) => i.kind === 'form' && i.tense !== 'perf'), rand);
  const lateRound = shuffle(items.filter((i) => i.kind === 'cloze' || i.tense === 'perf'), rand);
  return [...formsRound, ...lateRound].map((it, n) => ({ ...it, key: `${it.verbId}-${it.tense}-${it.kind}-${n}` }));
}

// ---------- sprawdzanie odpowiedzi ----------
const norm = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[.!?,]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^å /, '')
    .replace(/^har /, '');

const fold = (s) => s.replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/aa/g, 'a').replace(/oe/g, 'o').replace(/ae/g, 'e');

export function check(input, answers, lenient) {
  const n = norm(input);
  if (!n) return 'empty';
  if (answers.some((a) => norm(a) === n)) return 'ok';
  if (answers.some((a) => fold(norm(a)) === fold(n))) return lenient ? 'ok-diacritics' : 'diacritics';
  return 'wrong';
}
