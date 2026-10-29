import React from 'react';
import { VERBS, VERB_BY_ID } from '../data/verbs.js';

const ex = (...ids) => ids.map((id) => VERB_BY_ID[id]).filter(Boolean);
const f = (s) => s.split('/')[0];

// temat = bezokolicznik bez końcowego -e; podkreślamy końcówkę tematu, która decyduje o grupie
function Stem({ inf, mark }) {
  const word = inf.split(' ')[0];
  const stem = word.endsWith('e') && word.length > 2 ? word.slice(0, -1) : word;
  const rest = word.slice(stem.length);
  const cut = Math.max(0, stem.length - mark);
  return (
    <span className="no">
      {stem.slice(0, cut)}
      <u>{stem.slice(cut)}</u>
      <span className="muted">{rest}</span>
    </span>
  );
}

const WEAK = [
  {
    key: '1',
    name: 'Gruppe 1',
    pret: '-et',
    perf: '-et',
    when: [
      'Temat kończy się na dwie lub więcej różnych spółgłosek: snakk-, kast-, husk-, pakk-.',
      'Temat kończy się na -d po samogłosce: bad- → badet. Podwójne -tt, -kk, -ss też należą tutaj: slutt-, lukk-.',
      'To największa grupa. Gdy nie masz pewności, a słowo nie pasuje do grup 2–4, zgaduj -et.',
    ],
    tip: 'W bokmål dopuszczalna jest też końcówka -a (snakka, kasta). W kursie używamy -et.',
    examples: ex('snakke', 'kaste', 'huske', 'vente', 'bade', 'slutte'),
    mark: 2,
  },
  {
    key: '2',
    name: 'Gruppe 2',
    pret: '-te',
    perf: '-t',
    when: [
      'Temat kończy się na jedną spółgłoskę (oprócz -d): spis-, kjøp-, les-, lek-. Po -t litera się podwaja: møte → møtte.',
      'Temat kończy się na podwójne -ll, -mm, -nn albo na -ng, -nd: spill-, glemm-, kjenn-, treng-, send-.',
      'Wszystkie czasowniki na -ere: studere, reparere.',
    ],
    tip: 'Przy podwójnej spółgłosce przed -te jedna litera znika: glemme → glemte, spille → spilte. Przy -nd zostaje: sende → sendte.',
    examples: ex('spise', 'kjøpe', 'lese', 'møte', 'spille', 'glemme', 'sende', 'studere'),
    mark: 1,
  },
  {
    key: '3',
    name: 'Gruppe 3',
    pret: '-de',
    perf: '-d',
    when: [
      'Temat kończy się na -v lub -g: lev-, prøv-, øv-, lag-.',
      'Temat kończy się na dyftong -ei, -øy: pleie, eie.',
      'Temat kończy się na -gg: bygge → bygde (jedno g znika).',
    ],
    tip: 'Mała grupa. Niektóre czasowniki mają dwie formy: lagde / laget.',
    examples: ex('leve', 'prøve', 'øve', 'pleie', 'bygge', 'lage'),
    mark: 1,
  },
  {
    key: '4',
    name: 'Gruppe 4',
    pret: '-dde',
    perf: '-dd',
    when: [
      'Czasowniki jednosylabowe zakończone akcentowaną samogłoską, bez końcowego -e: bo, tro, sy, nå.',
    ],
    tip: 'Uwaga na wyjątki: gå, stå, se, ta, få, le są jednosylabowe, ale nieregularne.',
    examples: ex('bo', 'tro'),
    mark: 0,
  },
];

const STRONG = [
  { pattern: 'i – e – e/i', ids: ['skrive', 'bite', 'beskrive'] },
  { pattern: 'i – a – u', ids: ['drikke', 'finne', 'synge', 'vinne', 'hjelpe'] },
  { pattern: 'e – a – å', ids: ['stjele', 'bære', 'skjære'] },
  { pattern: 'y – øy – øy', ids: ['fly', 'lyve'] },
  { pattern: 'a – o – a', ids: ['ta', 'dra', 'la', 'forlate'] },
  { pattern: 'krótka zmiana', ids: ['ligge', 'sitte', 'gå', 'få', 'gjøre', 'si'] },
];

const count = (k) => VERBS.filter((v) => v.group === k).length;

export function Theory({ onShowGroup }) {
  return (
    <section className="theory">
      <div className="section-head">
        <div>
          <div className="eyebrow">Grammatikk</div>
          <h2>Grupy czasowników</h2>
        </div>
      </div>
      <p className="lead">
        Czasowniki regularne tworzą preteritum i perfektum, dodając końcówkę do tematu. Grupę poznajesz po tym, jak kończy się temat.
      </p>

      <div className="card">
        <h3>Jak znaleźć grupę</h3>
        <ol className="steps">
          <li>
            <b>Odetnij -e z bezokolicznika.</b> Zostaje temat: å kast<span className="muted">e</span> → <span className="no">kast</span>. Ta sama forma
            to tryb rozkazujący: Kast!
          </li>
          <li>
            <b>Jednosylabowy, bez -e?</b> (bo, tro) → grupa 4.
          </li>
          <li>
            <b>Temat na -v, -g, -ei?</b> (lev, prøv, pleie) → grupa 3.
          </li>
          <li>
            <b>Jedna spółgłoska (nie -d), -ll/-mm/-nn/-ng/-nd albo -ere?</b> (spis, spill, studere) → grupa 2.
          </li>
          <li>
            <b>Dwie spółgłoski albo -d?</b> (snakk, kast, slutt, bad) → grupa 1.
          </li>
        </ol>
        <p className="muted small">
          Reguły to tendencje, nie prawa. Najczęstsze czasowniki są nieregularne i trzeba je znać na pamięć. Presens zawsze jest prosty: bezokolicznik + -r
          (kaste → kaster, bo → bor).
        </p>
      </div>

      <div className="table-wrap">
        <table className="endings">
          <thead>
            <tr>
              <th>Grupa</th>
              <th>Preteritum</th>
              <th>Perfektum</th>
              <th>Przykład</th>
            </tr>
          </thead>
          <tbody>
            {WEAK.map((g) => (
              <tr key={g.key}>
                <td>
                  <span className={`badge g${g.key}`}>{g.key}</span>
                </td>
                <td className="no strong">{g.pret}</td>
                <td className="no strong">har {g.perf}</td>
                <td className="no">
                  {g.examples[0].inf} – {f(g.examples[0].pret)} – {f(g.examples[0].perf)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {WEAK.map((g) => (
        <article key={g.key} className="card group-card" id={`gruppe-${g.key}`}>
          <div className="vc-top">
            <h3>{g.name}</h3>
            <span className="endings-pill no">
              {g.pret} / {g.perf}
            </span>
          </div>
          <ul className="when">
            {g.when.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <ul className="ex-grid">
            {g.examples.map((v) => (
              <li key={v.id}>
                <Stem inf={v.inf} mark={g.mark} />
                <span className="arrow" aria-hidden="true">
                  →
                </span>
                <span className="no strong">{f(v.pret)}</span>
                <span className="no muted">har {f(v.perf)}</span>
              </li>
            ))}
          </ul>
          <p className="rule small">{g.tip}</p>
          <button type="button" className="link" onClick={() => onShowGroup(g.key)}>
            Wszystkie z grupy {g.key} w tabeli ({count(g.key)})
          </button>
        </article>
      ))}

      <article className="card group-card">
        <div className="vc-top">
          <h3>Sterke verb (nieregularne)</h3>
          <span className="endings-pill no">zmiana samogłoski</span>
        </div>
        <ul className="when">
          <li>W preteritum nie mają końcówki, zmienia się samogłoska tematu: drikke → drakk.</li>
          <li>Partisipp zwykle kończy się na -et lub -tt: drukket, gått, tatt.</li>
          <li>Ten sam wzór zmiany samogłoski powtarza się w wielu czasownikach. Ucz się ich seriami:</li>
        </ul>
        <div className="strong-list">
          {STRONG.map((s) => (
            <div key={s.pattern} className="strong-row">
              <div className="eyebrow">{s.pattern}</div>
              <ul>
                {ex(...s.ids).map((v) => (
                  <li key={v.id} className="no">
                    {v.inf} – <b>{f(v.pret)}</b> – {f(v.perf)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button type="button" className="link" onClick={() => onShowGroup('S')}>
          Wszystkie nieregularne w tabeli ({count('S')})
        </button>
      </article>

      <article className="card group-card">
        <div className="vc-top">
          <h3>Modale verb</h3>
          <span className="endings-pill no">kan – kunne – kunnet</span>
        </div>
        <ul className="when">
          <li>Presens jest nieregularny: kan, skal, vil, må, bør.</li>
          <li>Preteritum ma tę samą formę co bezokolicznik: kunne, skulle, ville, måtte, burde.</li>
          <li>Po nich stoi bezokolicznik bez å: Jeg kunne ikke komme.</li>
        </ul>
      </article>
    </section>
  );
}
