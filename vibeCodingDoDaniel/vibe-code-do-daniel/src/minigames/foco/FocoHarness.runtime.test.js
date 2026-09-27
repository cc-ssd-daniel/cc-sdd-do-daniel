// Reproduz o cenário de execução (tempo correndo) para capturar erro de runtime.
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import FocoHarness from './FocoHarness';

jest.useFakeTimers();

test('harness sobrevive ao loop de tempo rodando ate o sucesso', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<FocoHarness />);

  // Avanca ~3 segundos de jogo (o alvo padrao eh 1.5s em foco, comeca no centro).
  act(() => {
    jest.advanceTimersByTime(3000);
  });

  // A tela ainda deve estar renderizada (nao "branca").
  expect(screen.getByRole('heading', { name: /harness de teste/i })).toBeInTheDocument();

  // Nao deve haver erro de update em componente desmontado / loop.
  const calls = errorSpy.mock.calls.map((c) => String(c[0]));
  const bad = calls.filter((m) => /not wrapped in act|Maximum update depth|unmounted/i.test(m));
  errorSpy.mockRestore();
  expect(bad).toEqual([]);
});
