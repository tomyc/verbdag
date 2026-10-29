// Sanity check bazy czasowników i generatora ćwiczeń: uruchom `npm test`.
import { VERBS, GROUPS } from '../src/data/verbs.js';
import { buildExercises, buildPack, check, todayKey } from '../src/lib/engine.js';

let errors = 0;
const fail = (m) => { errors++; console.error('BŁĄD:', m); };

const ids = new Set();
for (const v of VERBS) {
  if (ids.has(v.id)) fail(`duplikat ${v.id}`);
  ids.add(v.id);
  for (const k of ['inf', 'pres', 'pret', 'perf', 'pl']) if (!v[k]) fail(`${v.id}: brak pola ${k}`);
  if (!GROUPS[v.group]) fail(`${v.id}: nieznana grupa ${v.group}`);
  if (Number.isNaN(v.lesson)) fail(`${v.id}: zły numer lekcji`);
}

const all = VERBS.map((v) => v.id);
const ex = buildExercises(all, 'test');
for (const e of ex) {
  if (!e.answers.length || e.answers.some((a) => !a)) fail(`puste odpowiedzi w ${e.key}`);
  if (check(e.answers[0], e.answers, false) !== 'ok') fail(`odpowiedź wzorcowa nie przechodzi: ${e.key}`);
}
if (check('har spist', ['spist'], false) !== 'ok') fail('har + partisipp');
if (check('å spise', ['spise'], false) !== 'ok') fail('å + infinitiv');
if (check('gatt', ['gått'], false) !== 'diacritics') fail('wykrywanie diakrytyków');

const pack = buildPack({ progress: {}, date: todayKey(), size: 5, groups: Object.keys(GROUPS) });
if (pack.length !== 5) fail('pakiet ma złą długość');

console.log(`${VERBS.length} czasowników, ${ex.length} ćwiczeń, ${errors} błędów`);
process.exit(errors ? 1 : 0);
