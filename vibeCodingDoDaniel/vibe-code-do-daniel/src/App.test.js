import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the reboot challenge title', () => {
  render(<App />);

  expect(screen.getByText(/reboot de 10 segundos/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /iniciar reboot/i })).toBeInTheDocument();
});

test('fails when the player releases too early', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /iniciar reboot/i }));

  let currentNow = 4000;
  jest.spyOn(performance, 'now').mockImplementation(() => currentNow);

  fireEvent.mouseDown(screen.getByRole('button', { name: /botão de reboot/i }));
  currentNow = 4500;
  fireEvent.mouseUp(screen.getByRole('button', { name: /botão de reboot/i }));

  expect(screen.getByText(/soltou cedo/i)).toBeInTheDocument();
});

test('succeeds when the player releases inside the safe window', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /iniciar reboot/i }));

  let currentNow = 4000;
  jest.spyOn(performance, 'now').mockImplementation(() => currentNow);

  fireEvent.mouseDown(screen.getByRole('button', { name: /botão de reboot/i }));
  currentNow = 7000;
  fireEvent.mouseUp(screen.getByRole('button', { name: /botão de reboot/i }));

  expect(screen.getByText(/sucesso! o projetor voltou/i)).toBeInTheDocument();
});
