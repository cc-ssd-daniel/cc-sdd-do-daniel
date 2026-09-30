// Smoke test do harness: garante que a tela monta sem erro de runtime.
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import FocoHarness from './FocoHarness';

test('FocoHarness monta sem quebrar e mostra o minigame', () => {
  act(() => {
    render(<FocoHarness />);
  });
  expect(screen.getByRole('heading', { name: /harness de teste/i })).toBeInTheDocument();
  expect(screen.getByRole('slider', { name: /indicador de foco/i })).toBeInTheDocument();
});
