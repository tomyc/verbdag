import React, { useEffect, useMemo, useState } from 'react';
import { VERBS, VERB_BY_ID, GROUPS } from './data/verbs.js';
import { todayKey, addDays, buildPack, buildExercises, reviewVerb, INTERVALS, TENSE_LABEL } from './lib/engine.js';
import { useStore, streak, DEFAULT_STATE } from './lib/store.js';
import { Learn } from './components/Learn.jsx';
import { Drill } from './components/Drill.jsx';
import { VerbTable, BoxPips } from './components/VerbTable.jsx';
import { Theory } from './components/Theory.jsx';

const GROUP_ORDER = ['S', '1', '2', '3', '4', 'M'];

function nbDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  try {
    return new Intl.DateTimeFormat('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(y, m - 1, d));
  } catch {
    return key;
  }
}

// ---------------- Dziś ----------------
function Today({ state, today, onStart, onExtra }) {
  const day = state.days[today];
  const packs = day?.packs ?? [];
  const current = packs.find((p) => !p.done);
  const doneCount = packs.filter((p) => p.done).length;
  const s = streak(state.days, today, addDays);

  const stats = useMemo(() => {
    const p = state.progress;
    const known = VERBS.filter((v) => (p[v.id]?.box ?? 0) >= 3).length;
    const learning = VERBS.filter((v) => p[v.id] && p[v.id].box < 3).length;
    const tomorrow = VERBS.filter((v) => p[v.id] && p[v.id].due <= addDays(today, 1) && p[v.id].due > today).length;
    return { known, learning, fresh: VERBS.length - known - learning, tomorrow };
  }, [state.progress, today]);

  const last = packs.filter((p) => p.done).at(-1);

  return (
    <section className="today">
      <div className="hero">
        <div className="eyebrow">{nbDate(today)}</div>
        <h1>Dagens verb</h1>
        <p className="lead">
          {current
            ? `${current.ids.length} czasowników na dziś: bezokolicznik, presens, preteritum i perfektum.`
            : 'Dzisiejszy pakiet zrobiony. Możesz wziąć dodatkowy albo wrócić jutro.'}
        </p>
      </div>

      <div className="card pack">
        <div className="pack-head">
          <span className="eyebrow">{current ? `Pakiet ${packs.length}` : `Ukończone pakiety: ${doneCount}`}</span>
          {last && <span className="tabular small muted">ostatni wynik {last.score}%</span>}
        </div>
        <ul className="chips">
          {(current ?? last ?? { ids: [] }).ids.map((id) => {
            const v = VERB_BY_ID[id];
            const isNew = !state.progress[id];
            return (
              <li key={id} className="chip">
                <span className="no">å {v.inf}</span>
                <span className="muted small">{v.pl}</span>
                {current && <span className={`tag ${isNew ? 'new' : 'rev'}`}>{isNew ? 'nowy' : 'powtórka'}</span>}
              </li>
            );
          })}
        </ul>
        <div className="actions">
          {current ? (
            <button className="primary" type="button" onClick={() => onStart(current)}>
              Zaczynamy
            </button>
          ) : (
            <button className="primary" type="button" onClick={onExtra}>
              Dodatkowy pakiet
            </button>
          )}
        </div>
      </div>

      <dl className="stats">
        <div>
          <dt>Seria</dt>
          <dd className="tabular">
            {s} {s === 1 ? 'dzień' : 'dni'}
          </dd>
        </div>
        <div>
          <dt>Opanowane</dt>
          <dd className="tabular">{stats.known}</dd>
        </div>
        <div>
          <dt>W trakcie</dt>
          <dd className="tabular">{stats.learning}</dd>
        </div>
        <div>
          <dt>Nowe w bazie</dt>
          <dd className="tabular">{stats.fresh}</dd>
        </div>
      </dl>
      <p className="muted small">
        Jutro do powtórki: {stats.tomorrow}. Powtórki wracają po {INTERVALS.slice(1).join(', ')} dniach, zależnie od poziomu.
      </p>
    </section>
  );
}

// ---------------- Podsumowanie ----------------
function Summary({ ids, log, progress, onDone }) {
  const byVerb = ids.map((id) => {
    const items = log.filter((l) => l.verbId === id);
    const misses = items.filter((l) => !l.ok);
    return { id, total: items.length, misses };
  });
  const ok = log.filter((l) => l.ok).length;
  const pct = log.length ? Math.round((ok / log.length) * 100) : 0;
  return (
    <section className="summary">
      <div className="hero">
        <div className="eyebrow">Ferdig</div>
        <h1 className="tabular">{pct}%</h1>
        <p className="lead">
          {ok} z {log.length} poprawnie za pierwszym razem.
        </p>
      </div>
      <ul className="result-list">
        {byVerb.map(({ id, misses }) => {
          const v = VERB_BY_ID[id];
          return (
            <li key={id} className="card result">
              <div className="vc-top">
                <span className="no strong">å {v.inf}</span>
                <BoxPips box={progress[id]?.box ?? 0} />
              </div>
              {misses.length === 0 ? (
                <p className="small ok-text">Bez błędów. Następna powtórka: {progress[id]?.due}.</p>
              ) : (
                <p className="small bad-text">
                  Błędy: {[...new Set(misses.map((m) => (m.kind === 'cloze' ? 'zdanie' : TENSE_LABEL[m.tense])))].join(', ')}. Wraca jutro.
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <VerbTable verbs={ids.map((id) => VERB_BY_ID[id])} compact />
      <div className="actions">
        <button className="primary" type="button" onClick={onDone}>
          Gotowe
        </button>
      </div>
    </section>
  );
}

// ---------------- Tabela ----------------
function Table({ progress, g, setG, onTheory }) {
  const [q, setQ] = useState('');
  const list = VERBS.filter(
    (v) => (g === 'all' || v.group === g) && (!q || (v.inf + ' ' + v.pret + ' ' + v.perf + ' ' + v.pl).toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <section>
      <div className="section-head">
        <div>
          <div className="eyebrow">{VERBS.length} czasowników z lekcji</div>
          <h2>Tabell</h2>
        </div>
      </div>
      <div className="filters">
        <input id="search" className="search" placeholder="Szukaj: gikk, czekać, skrive…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="seg" role="group" aria-label="Grupa">
          <button type="button" className={g === 'all' ? 'on' : ''} onClick={() => setG('all')}>
            Wszystkie
          </button>
          {GROUP_ORDER.map((k) => (
            <button key={k} type="button" className={g === k ? 'on' : ''} onClick={() => setG(k)}>
              {GROUPS[k].label}
            </button>
          ))}
        </div>
      </div>
      {g !== 'all' && (
        <p className="rule">
          {GROUPS[g].rule}.{' '}
          <button type="button" className="link" onClick={onTheory}>
            Teoria grup
          </button>
        </p>
      )}
      <p className="muted small tabular">{list.length} wyników</p>
      <VerbTable verbs={list} progress={progress} />
    </section>
  );
}

// ---------------- Ustawienia ----------------
function Settings({ state, setState }) {
  const { settings } = state;
  const [io, setIo] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const set = (patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  const toggleGroup = (k) => {
    const has = settings.groups.includes(k);
    if (has && settings.groups.length === 1) return;
    set({ groups: has ? settings.groups.filter((x) => x !== k) : [...settings.groups, k] });
  };

  async function exportData() {
    const text = JSON.stringify(state);
    setIo(text);
    try {
      await navigator.clipboard.writeText(text);
      setMsg('Skopiowano postęp do schowka.');
    } catch {
      setMsg('Zaznacz tekst poniżej i skopiuj go ręcznie.');
    }
  }
  function importData() {
    try {
      const s = JSON.parse(io);
      if (!s.progress || !s.settings) throw new Error();
      setState({ ...DEFAULT_STATE, ...s });
      setMsg('Postęp wczytany.');
    } catch {
      setMsg('Nie udało się wczytać. Wklej cały tekst wyeksportowany z aplikacji.');
    }
  }

  return (
    <section className="settings">
      <div className="section-head">
        <div>
          <div className="eyebrow">Innstillinger</div>
          <h2>Ustawienia</h2>
        </div>
      </div>

      <div className="card">
        <label htmlFor="size" className="field-label">
          Czasowników w pakiecie: <b className="tabular">{settings.size}</b>
        </label>
        <input id="size" type="range" min="3" max="10" value={settings.size} onChange={(e) => set({ size: Number(e.target.value) })} />
        <p className="muted small">Zmiana działa od następnego pakietu.</p>
      </div>

      <div className="card">
        <div className="field-label">Grupy czasowników</div>
        <div className="checks">
          {GROUP_ORDER.map((k) => (
            <label key={k} className="check">
              <input id={`g-${k}`} type="checkbox" checked={settings.groups.includes(k)} onChange={() => toggleGroup(k)} />
              <span>
                <b>{GROUPS[k].label}</b> <span className="muted small">{GROUPS[k].rule}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <label className="check">
          <input id="lenient" type="checkbox" checked={settings.lenient} onChange={(e) => set({ lenient: e.target.checked })} />
          <span>
            <b>Wyrozumiałość dla æ, ø, å</b>
            <span className="muted small"> Odpowiedź „gatt” zamiast „gått” liczy się jako poprawna.</span>
          </span>
        </label>
      </div>

      <div className="card">
        <div className="field-label">Kopia postępu</div>
        <p className="muted small">Postęp jest zapisany w tej przeglądarce. Żeby przenieść go na inne urządzenie, wyeksportuj i wklej tam tekst.</p>
        <div className="actions">
          <button type="button" onClick={exportData}>
            Eksportuj
          </button>
          <button type="button" onClick={importData} disabled={!io.trim()}>
            Importuj wklejony tekst
          </button>
        </div>
        <textarea id="io" rows="4" value={io} onChange={(e) => setIo(e.target.value)} placeholder="Tu pojawi się eksport albo wklej tekst do importu" />
        {msg && <p className="small">{msg}</p>}
      </div>

      <div className="card">
        {confirmReset ? (
          <div className="actions">
            <span className="small">Usunąć cały postęp?</span>
            <button
              type="button"
              className="danger"
              onClick={() => {
                setState(DEFAULT_STATE);
                setConfirmReset(false);
              }}
            >
              Tak, usuń
            </button>
            <button type="button" onClick={() => setConfirmReset(false)}>
              Anuluj
            </button>
          </div>
        ) : (
          <button type="button" className="link danger-text" onClick={() => setConfirmReset(true)}>
            Wyzeruj postęp
          </button>
        )}
      </div>
    </section>
  );
}

// ---------------- Aplikacja ----------------
export default function App() {
  const [state, setState] = useStore();
  const [tab, setTab] = useState('today');
  const [tableGroup, setTableGroup] = useState('all');
  const [session, setSession] = useState(null); // { pack, phase, exercises, log }
  const [today, setToday] = useState(todayKey());

  // przejście przez północ przy otwartej karcie
  useEffect(() => {
    const t = setInterval(() => setToday(todayKey()), 60_000);
    return () => clearInterval(t);
  }, []);

  // pakiet dnia
  useEffect(() => {
    if (state.days[today]?.packs?.length) return;
    const ids = buildPack({ progress: state.progress, date: today, size: state.settings.size, groups: state.settings.groups });
    setState((s) => ({ ...s, days: { ...s.days, [today]: { packs: [{ ids, done: false }] } } }));
  }, [today, state.days, state.progress, state.settings, setState]);

  function startPack(pack) {
    const idx = state.days[today].packs.indexOf(pack);
    setSession({ idx, ids: pack.ids, phase: 'learn', exercises: buildExercises(pack.ids, `${today}-${idx}`), log: [] });
  }

  function extraPack() {
    const used = state.days[today].packs.flatMap((p) => p.ids);
    const ids = buildPack({
      progress: state.progress,
      date: today,
      size: state.settings.size,
      groups: state.settings.groups,
      exclude: used,
      salt: String(used.length),
    });
    if (!ids.length) return;
    setState((s) => ({
      ...s,
      days: { ...s.days, [today]: { packs: [...s.days[today].packs, { ids, done: false }] } },
    }));
  }

  function finish(log) {
    const ok = log.filter((l) => l.ok).length;
    const score = log.length ? Math.round((ok / log.length) * 100) : 0;
    setState((s) => {
      let progress = s.progress;
      for (const id of session.ids) {
        const clean = log.filter((l) => l.verbId === id).every((l) => l.ok);
        progress = reviewVerb(progress, id, clean, today);
      }
      const packs = s.days[today].packs.map((p, i) => (i === session.idx ? { ...p, done: true, score } : p));
      return { ...s, progress, days: { ...s.days, [today]: { packs } } };
    });
    setSession((ss) => ({ ...ss, phase: 'summary', log }));
  }

  const inSession = !!session;

  return (
    <div className="app">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => !inSession && setTab('today')}>
          <span className="mark" aria-hidden="true">
            å
          </span>
          Verbdag
        </button>
        {!inSession && (
          <nav className="tabs" aria-label="Widoki">
            {[
              ['today', 'I dag'],
              ['table', 'Tabell'],
              ['theory', 'Grupy'],
              ['settings', 'Ustawienia'],
            ].map(([k, l]) => (
              <button key={k} type="button" className={tab === k ? 'on' : ''} onClick={() => { setTab(k); window.scrollTo(0, 0); }}>
                {l}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>
        {session?.phase === 'learn' && (
          <Learn ids={session.ids} onBack={() => setSession(null)} onStart={() => setSession((s) => ({ ...s, phase: 'drill' }))} />
        )}
        {session?.phase === 'drill' && (
          <Drill
            ids={session.ids}
            exercises={session.exercises}
            lenient={state.settings.lenient}
            onFinish={finish}
            onQuit={() => setSession(null)}
          />
        )}
        {session?.phase === 'summary' && (
          <Summary ids={session.ids} log={session.log} progress={state.progress} onDone={() => setSession(null)} />
        )}
        {!session && tab === 'today' && state.days[today] && (
          <Today state={state} today={today} onStart={startPack} onExtra={extraPack} />
        )}
        {!session && tab === 'table' && (
          <Table progress={state.progress} g={tableGroup} setG={setTableGroup} onTheory={() => setTab('theory')} />
        )}
        {!session && tab === 'theory' && (
          <Theory
            onShowGroup={(k) => {
              setTableGroup(k);
              setTab('table');
              window.scrollTo(0, 0);
            }}
          />
        )}
        {!session && tab === 'settings' && <Settings state={state} setState={setState} />}
      </main>
    </div>
  );
}
