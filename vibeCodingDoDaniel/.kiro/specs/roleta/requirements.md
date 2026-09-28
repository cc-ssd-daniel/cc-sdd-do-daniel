# Roleta do Input — ROL-01 e ROL-02

## Objetivo e escopo
Responsável: Cadu. Parar a troca de entradas do projetor na entrada indicada pela pista textual. Entregar módulo isolado, adapter, harness, testes e evidências. Referência: Backlog_detalhado_por_jogo_4_integrantes.docx, pacote Cadu.

Fora do escopo: core, estado global de Paciência, Reboot, Foco, integração final e slides. A Roleta comunica deltas; o dono da Paciência decide derrota global. Persistência é um pacote independente. Não há acesso ao armazenamento pelo minigame.

## 1. Pista e seleção
- 1.1 When uma partida começa, the Roleta shall mostrar a pista da entrada correta e o nome da entrada atual; os padrões são HDMI 1, HDMI 2, VGA e DisplayPort, alvo HDMI 2.
- 1.2 While a partida está ativa, the Roleta shall avançar circularmente a seleção; a zona correta corresponde a todo o intervalo em que o nome atual coincide com a pista.
- 1.3 When a entrada correta é selecionada, the Roleta shall concluir uma única vez com pontuação, tempo, erros e delta acumulado de paciência.

## 2. Erro e dificuldade
- 2.1 When uma entrada incorreta é selecionada, the Roleta shall apresentar erro textual, emitir um delta de paciência e acelerar até o limite configurado.
- 2.2 When o limite configurado de erros é atingido, the Roleta shall falhar uma única vez com motivo wrong-input-limit e permitir reinício.
- 2.3 If uma configuração é inválida, the Roleta shall rejeitar a partida antes de iniciar efeitos.

## 3. Ciclo de vida e isolamento
- 3.1 When reiniciada, the Roleta shall limpar somente seleção, erros, dificuldade e resultado internos; não restaurará a paciência global.
- 3.2 When descartada, the Roleta shall cancelar timers e assinaturas, ignorando entradas posteriores até uma nova partida.
- 3.3 When usada pelo adapter, the Roleta shall emitir início, sucesso, falha, reinício e delta no formato do contrato local existente; o harness deve executar com Paciência fake sem importar o core.

## 4. Acessibilidade
- 4.1 The Roleta shall oferecer seleção e reinício por botões nativos utilizáveis por teclado e ponteiro, nomes textuais e feedback anunciado, sem depender de cor.
- 4.2 Where menor pressão de tempo está habilitada, the Roleta shall duplicar intervalos, aceleração e limite mínimo, preservando a mesma regra de acerto.
- 4.3 Where movimento reduzido ou flashes reduzidos estão habilitados, the Roleta shall manter pista e controles utilizáveis sem animações ou flashes; efeitos sonoros são opcionais e não necessários.

Parâmetros iniciais herdados da Roleta local: intervalo 700 ms, aceleração 130 ms por erro, mínimo 180 ms, delta -8. Decisões configuráveis deste pacote: limite de 5 erros; pontuação max(0, 100 - 10 × erros); acerto não repõe paciência. Não são regras impostas ao estado global.
