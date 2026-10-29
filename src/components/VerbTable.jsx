import React from 'react';
import { GROUPS } from '../data/verbs.js';
import { INTERVALS } from '../lib/engine.js';

const fmt = (f) => f.split('/').join(' / ');

export function BoxPips({ box }) {
  return (
    <span className="pips" title={box ? `Poziom ${box} z ${INTERVALS.length - 1}` : 'Nowy'}>
      {INTERVALS.slice(1).map((_, i) => (
        <i key={i} className={i < box ? 'on' : ''} />
      ))}
    </span>
  );
}

export function VerbTable({ verbs, progress, compact }) {
  return (
    <div className="table-wrap">
      <table className={`verbs ${compact ? 'compact' : ''}`}>
        <thead>
          <tr>
            <th>Infinitiv</th>
            <th>Presens</th>
            <th>Preteritum</th>
            <th>Perfektum</th>
            {!compact && <th>Znaczenie</th>}
            {!compact && <th>Grupa</th>}
            {progress && <th>Postęp</th>}
          </tr>
        </thead>
        <tbody>
          {verbs.map((v) => (
            <tr key={v.id}>
              <td className="no c-inf">å {v.inf}</td>
              <td className="no c-form" data-label="Presens">{fmt(v.pres)}</td>
              <td className="no strong c-form" data-label="Preteritum">{fmt(v.pret)}</td>
              <td className="no c-form" data-label="Perfektum">har {fmt(v.perf)}</td>
              {!compact && <td className="pl c-pl">{v.pl}</td>}
              {!compact && (
                <td className="c-badge">
                  <span className={`badge g${v.group}`}>{GROUPS[v.group].short}</span>
                </td>
              )}
              {progress && (
                <td className="c-prog">
                  <BoxPips box={progress[v.id]?.box ?? 0} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
