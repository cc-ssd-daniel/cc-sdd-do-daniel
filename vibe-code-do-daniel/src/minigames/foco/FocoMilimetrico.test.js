// Testes de UI do componente FocoMilimetrico. FOC-06 (Req 5.4, 7.1, 7.3)
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FocoMilimetrico from './FocoMilimetrico';
import { createFakeServices } from '../fakes/fakeServices';

const cfg = {
  min: 0,
  max: 100,
  focusStart: 45,
  focusEnd: 55,
  focusTargetMs: 1000,
  overshootLimit: 90,
  penaltyPerOvershoot: 1,
  failPenalty: 3,
  roundMs: 10000,
  overshootPatienceDelta: -5,
};

function renderFoco(overrides = {}) {
  const services = createFakeServices();
  const props = {
    config: cfg,
    services,
    onComplete: jest.fn(),
    onFail: jest.fn(),
    ...overrides,
  };
  const utils = render(<FocoMilimetrico {...props} />);
  return { ...utils, ...props, services };
}

test('renderiza o slider acessível com aria (7.1, 7.3)', () => {
  renderFoco();
  const slider = screen.getByRole('slider', { name: /indicador de foco/i });
  expect(slider).toBeInTheDocument();
  expect(slider).toHaveAttribute('aria-valuemin', '0');
  expect(slider).toHaveAttribute('aria-valuemax', '100');
});

test('estado de foco é comunicado por texto além da cor (7.1)', () => {
  renderFoco();
  // inicia no centro (50), dentro da faixa -> texto de foco
  const status = screen.getByRole('status');
  expect(status.textContent).toMatch(/foco/i);
});

test('controle por teclado move o indicador (7.3)', () => {
  renderFoco();
  const slider = screen.getByRole('slider', { name: /indicador de foco/i });
  const before = slider.getAttribute('aria-valuenow');
  act(() => {
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
  });
  const after = slider.getAttribute('aria-valuenow');
  expect(Number(after)).toBeGreaterThan(Number(before));
});
