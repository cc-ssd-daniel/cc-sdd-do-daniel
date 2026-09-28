import React, { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputRoulette from '../../src/minigames/roleta/InputRoulette';
import RouletteHarness from '../../src/minigames/roleta/RouletteHarness';

beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('4.1: teclado seleciona, erro é anunciado e reinício funciona', () => {
  render(<InputRoulette />);
  expect(screen.getByText(/Entrada correta:/)).toHaveTextContent('Entrada correta: HDMI 2');
  const select = screen.getByRole('button', { name: 'Selecionar entrada' });
  select.focus(); userEvent.keyboard('{Enter}');
  expect(screen.getByRole('status')).toHaveTextContent(/Entrada incorreta/);
  act(() => jest.advanceTimersByTime(570));
  userEvent.keyboard(' ');
  expect(screen.getByRole('status')).toHaveTextContent(/Entrada correta selecionada/);
  expect(select).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
  expect(select).not.toBeDisabled();
  expect(screen.getByLabelText('Entrada atual')).toHaveTextContent('HDMI 1');
});

test('3.2, 4.2, 4.3: StrictMode limpa efeitos, flags reduzem pressão sem animação', () => {
  const { unmount } = render(<StrictMode><InputRoulette accessibility={{ reducedTimePressure: true, reducedMotion: true, reducedFlash: true }} /></StrictMode>);
  expect(jest.getTimerCount()).toBe(1);
  act(() => jest.advanceTimersByTime(700));
  expect(screen.getByLabelText('Entrada atual')).toHaveTextContent('HDMI 1');
  act(() => jest.advanceTimersByTime(700));
  expect(screen.getByLabelText('Entrada atual')).toHaveTextContent('HDMI 2');
  expect(screen.getByText(/Sem animações ou flashes/)).toBeInTheDocument();
  unmount(); expect(jest.getTimerCount()).toBe(0);
});

test('3.3: harness usa fixture de Paciência e reset não a restaura', () => {
  render(<RouletteHarness />);
  fireEvent.click(screen.getByRole('button', { name: 'Selecionar entrada' }));
  expect(screen.getByLabelText('Paciência fake')).toHaveTextContent('92');
  fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
  expect(screen.getByLabelText('Paciência fake')).toHaveTextContent('92');
});

test('callbacks atualizados não reiniciam a partida; configuração nova reinicia', () => {
  const first = jest.fn(); const next = jest.fn();
  const { rerender } = render(<InputRoulette onEvent={first} />);
  act(() => jest.advanceTimersByTime(700));
  rerender(<InputRoulette onEvent={next} />);
  fireEvent.click(screen.getByRole('button', { name: 'Selecionar entrada' }));
  expect(next).toHaveBeenCalledWith(expect.objectContaining({ type: 'minigame:succeeded' }));
  rerender(<InputRoulette config={{ target: 'VGA' }} />);
  expect(screen.getByRole('button', { name: 'Selecionar entrada' })).not.toBeDisabled();
  expect(screen.getByText(/Entrada correta:/)).toHaveTextContent('Entrada correta: VGA');
});
