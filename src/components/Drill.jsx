import React, { useEffect, useMemo, useRef, useState } from 'react';
import { VERB_BY_ID, GROUPS } from '../data/verbs.js';
import { TENSE_LABEL, check } from '../lib/engine.js';
import { VerbTable } from './VerbTable.jsx';

const SPECIAL = ['æ', 'ø', 'å'];

function Prompt({ item }) {
  const v = VERB_BY_ID[item.verbId];
  if (item.kind === 'cloze') {
    return (
      <div className="prompt">
        <div className="eyebrow">
          Uzupełnij zdanie <span className="muted">· wskaźnik czasu: {item.markerPl}</span>
        </div>
        <p className="sentence">
          {item.before} <span className="gap">____</span> <span className="hint">({item.hint})</span>{' '}
          {item.after}
          {item.after ? '.' : '.'}
        </p>
      </div>
    );
  }
  if (item.tense === 'inf') {
    return (
      <div className="prompt">
        <div className="eyebrow">Jak jest po norwesku?</div>
        <p className="big-pl">{v.pl}</p>
        <div className="form-line">
          <span className="aux">å</span> <span className="gap">____</span>
        </div>
      </div>
    );
  }
  return (
    <div className="prompt">
      <div className="eyebrow">
        {TENSE_LABEL[item.tense]} <span className="muted">· {v.pl}</span>
      </div>
      <p className="big-no">å {v.inf}</p>
      <div className="form-line">
        <span className="aux">{item.tense === 'perf' ? 'jeg har' : 'jeg'}</span> <span className="gap">____</span>
        {item.tense === 'pret' && <span className="muted small"> (i går)</span>}
      </div>
    </div>
  );
}

export function Drill({ ids, exercises, lenient, onFinish, onQuit }) {
  const [queue, setQueue] = useState(exercises);
  const [pos, setPos] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null); // null | 'ok' | 'wrong' | ...
  const [log, setLog] = useState([]); // { verbId, firstTry }
  const [showTable, setShowTable] = useState(false);
  const inputRef = useRef(null);
  const nextRef = useRef(null);

  const item = queue[pos];
  const total = exercises.length;
  const doneFirst = log.length;

  useEffect(() => {
    if (result === null) inputRef.current?.focus();
    else nextRef.current?.focus();
  }, [result, pos]);

  const verb = item ? VERB_BY_ID[item.verbId] : null;

  function insert(ch) {
    const el = inputRef.current;
    if (!el) return setInput((s) => s + ch);
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const next = input.slice(0, start) + ch + input.slice(end);
    setInput(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 1, start + 1);
    });
  }

  function submit(e) {
    e?.preventDefault();
    if (result !== null) return advance();
    const r = check(input, item.answers, lenient);
    if (r === 'empty') return;
    if (r === 'diacritics') {
      setResult('diacritics');
      return;
    }
    const ok = r === 'ok' || r === 'ok-diacritics';
    setResult(r === 'ok-diacritics' ? 'ok-diacritics' : ok ? 'ok' : 'wrong');
    if (!item.retry) setLog((l) => [...l, { verbId: item.verbId, tense: item.tense, kind: item.kind, ok }]);
    if (!ok) setQueue((q) => [...q, { ...item, retry: true, key: item.key + '-r' }]);
  }

  function retryDiacritics() {
    setResult(null);
  }

  function advance() {
    setInput('');
    setResult(null);
    setShowTable(false);
    if (pos + 1 >= queue.length) {
      onFinish(log);
    } else {
      setPos((p) => p + 1);
    }
  }

  const summary = useMemo(() => {
    const ok = log.filter((l) => l.ok).length;
    return { ok, wrong: log.length - ok };
  }, [log]);

  if (!item) return null;
  const correct = item.answers[0];
  const shown = item.kind === 'form' && item.tense === 'inf' ? correct : correct;

  return (
    <section className="drill">
      <header className="drill-head">
        <button className="link" type="button" onClick={onQuit}>
          Przerwij
        </button>
        <div className="progress" aria-label={`Postęp ${Math.min(doneFirst, total)} z ${total}`}>
          <div className="progress-bar" style={{ width: `${(Math.min(doneFirst, total) / total) * 100}%` }} />
        </div>
        <span className="tabular small">
          {Math.min(pos + 1, queue.length)}/{queue.length}
        </span>
      </header>

      {item.retry && <div className="retry-tag">Powtórka błędu</div>}

      <form className="card exercise" onSubmit={submit} autoComplete="off">
        <Prompt item={item} />

        <div className="answer-row">
          <input
            id="answer"
            ref={inputRef}
            className={`answer ${result ?? ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            readOnly={result !== null && result !== 'diacritics'}
            placeholder="wpisz formę"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            lang="nb"
          />
          <div className="special">
            {SPECIAL.map((ch) => (
              <button key={ch} type="button" className="key" onClick={() => insert(ch)} disabled={result !== null && result !== 'diacritics'}>
                {ch}
              </button>
            ))}
          </div>
        </div>

        {result === 'diacritics' && (
          <div className="feedback warn">
            Prawie. Sprawdź znaki æ, ø, å i spróbuj jeszcze raz.
            <button type="button" className="link" onClick={retryDiacritics}>
              Popraw
            </button>
          </div>
        )}
        {(result === 'ok' || result === 'ok-diacritics') && (
          <div className="feedback ok">
            Riktig!{result === 'ok-diacritics' && <> Poprawny zapis: <b>{shown}</b>.</>}
            {item.answers.length > 1 && <span className="muted"> Obie formy poprawne: {item.answers.join(' / ')}.</span>}
          </div>
        )}
        {result === 'wrong' && (
          <div className="feedback bad">
            Galt. Poprawnie: <b>{item.answers.join(' / ')}</b>
            <button type="button" className="link" onClick={() => setShowTable((s) => !s)}>
              {showTable ? 'Ukryj odmianę' : 'Pokaż odmianę'}
            </button>
          </div>
        )}
        {showTable && verb && <VerbTable verbs={[verb]} compact />}

        <div className="actions">
          {result === null || result === 'diacritics' ? (
            <button className="primary" type="submit" disabled={!input.trim()}>
              Sprawdź
            </button>
          ) : (
            <button ref={nextRef} className="primary" type="button" onClick={advance}>
              Dalej
            </button>
          )}
          <span className="muted small">
            {GROUPS[verb.group].label} · lekcja {verb.lesson}
          </span>
        </div>
      </form>

      <p className="muted small tabular">
        Pierwsze podejście: {summary.ok} poprawnie, {summary.wrong} błędów
      </p>
    </section>
  );
}
