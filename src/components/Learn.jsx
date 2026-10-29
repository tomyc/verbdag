import React from 'react';
import { VERB_BY_ID, GROUPS } from '../data/verbs.js';

const first = (f) => f.split('/')[0];
const head = (f) => f.split(' ')[0];
const tail = (f) => f.split(' ').slice(1).join(' ');

function examples(v) {
  if (!v.cloze) return [];
  const rest = [tail(v.inf), v.obj].filter(Boolean).join(' ').replace(/\bseg\b/, 'meg');
  const r = rest ? ' ' + rest : '';
  return [
    ['Presens', `Hver dag ${head(first(v.pres))} jeg${r}.`],
    ['Preteritum', `I går ${head(first(v.pret))} jeg${r}.`],
    ['Perfektum', `Jeg har aldri ${head(first(v.perf))}${r}.`],
  ];
}

export function Learn({ ids, onStart, onBack }) {
  return (
    <section className="learn">
      <div className="section-head">
        <div>
          <div className="eyebrow">Krok 1 z 2</div>
          <h2>Poznaj dzisiejsze czasowniki</h2>
        </div>
        <button className="link" type="button" onClick={onBack}>
          Wróć
        </button>
      </div>
      <p className="lead">Przeczytaj każdą odmianę na głos. W ćwiczeniach wpiszesz formy z pamięci.</p>

      <ol className="verb-cards">
        {ids.map((id) => {
          const v = VERB_BY_ID[id];
          const g = GROUPS[v.group];
          return (
            <li key={id} className="card verb-card">
              <div className="vc-top">
                <h3 className="no">å {v.inf}</h3>
                <span className={`badge g${v.group}`}>{g.label}</span>
              </div>
              <p className="pl">{v.pl}</p>
              <dl className="forms">
                <div>
                  <dt>Presens</dt>
                  <dd className="no">{v.pres.replace('/', ' / ')}</dd>
                </div>
                <div>
                  <dt>Preteritum</dt>
                  <dd className="no strong">{v.pret.replace('/', ' / ')}</dd>
                </div>
                <div>
                  <dt>Perfektum</dt>
                  <dd className="no">har {v.perf.replace('/', ' / ')}</dd>
                </div>
              </dl>
              <p className="rule small">{g.rule}</p>
              {examples(v).length > 0 && (
                <ul className="examples">
                  {examples(v).map(([t, s]) => (
                    <li key={t}>
                      <span className="ex-t">{t}</span> <span className="no">{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <div className="actions sticky-actions">
        <button className="primary" type="button" onClick={onStart}>
          Zacznij ćwiczenia
        </button>
      </div>
    </section>
  );
}
