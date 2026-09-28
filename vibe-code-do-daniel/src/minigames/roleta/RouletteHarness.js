import React, { useRef, useState } from 'react';
import InputRoulette from './InputRoulette';
import { createFakePatience, ROULETTE_FIXTURE } from './fixtures';

export default function RouletteHarness() {
  const patience = useRef(createFakePatience());
  const [value, setValue] = useState(patience.current.snapshot());
  const [accessibility, setAccessibility] = useState({ reducedMotion: false, reducedFlash: false, reducedTimePressure: false, soundCues: false });
  const [events, setEvents] = useState([]);
  const onEvent = event => {
    patience.current.onEvent(event);
    setValue(patience.current.snapshot());
    setEvents(previous => [...previous, event].slice(-8));
  };
  return <main>
    <p>Harness isolado — pacote Cadu</p>
    <fieldset><legend>Acessibilidade</legend>
      {[
        ['reducedMotion', 'Reduzir movimento'], ['reducedFlash', 'Reduzir flashes'],
        ['reducedTimePressure', 'Menor pressão de tempo'],
      ].map(([key, label]) => <label key={key} style={{ display: 'block' }}>
        <input type="checkbox" checked={accessibility[key]} onChange={e => setAccessibility(previous => ({ ...previous, [key]: e.target.checked }))} />{label}
      </label>)}
    </fieldset>
    <InputRoulette config={ROULETTE_FIXTURE} accessibility={accessibility} onEvent={onEvent} />
    <p>Paciência fake: <output aria-label="Paciência fake">{value}</output></p>
    <details><summary>Eventos do adapter</summary><pre>{JSON.stringify(events, null, 2)}</pre></details>
  </main>;
}
