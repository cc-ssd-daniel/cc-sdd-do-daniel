# Tarefas do Cadu — ROL-04

Autorização: pedido explícito de implementar todo o pacote. Ordem sequencial; revisão antes de concluir.

- [x] 1. Especificar objetivo, requisitos e design (ROL-01, ROL-02, ROL-03, ROL-04).
  - Saída: spec inicial, requirements, design e plano com limites e critérios observáveis.
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_
  - _Boundary: especificação Roleta_
- [ ] 2. Implementar mecânica e adapter com testes prévios (ROL-05).
  - Saída: seleção, aceleração, sucesso/falha única, reset/dispose e payloads testados.
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_
  - _Boundary: motor e adapter Roleta_
- [ ] 3. Montar interface acessível e harness fake (ROL-05).
  - Saída: botões por teclado/ponteiro, feedback textual e opções de acessibilidade testados.
  - _Requirements: 4.1, 4.2, 4.3, 3.3_
  - _Boundary: apresentação Roleta_
- [ ] 4. Validar e registrar evidências (ROL-06).
  - Saída: todos os requisitos relacionados a testes, resultado de build, smoke e revisão registrados.
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_
  - _Boundary: testes e evidências Roleta_

As tarefas de persistência não fazem parte da implementação atual da Roleta. O steering técnico canônico está em `.kiro/steering/tech.md`; a gestão da Roleta está consolidada em `evidence.md`.
