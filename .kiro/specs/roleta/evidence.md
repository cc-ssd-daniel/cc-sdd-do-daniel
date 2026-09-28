# Gestão e evidências — pacote Cadu

Data: 27/09/2026. Base Git: `3df57ed` (Estrutura do repo). Remoto identificado na configuração: `https://github.com/VitorAPC2/cc-sdd-do-daniel.git`. Fonte: Backlog_detalhado_por_jogo_4_integrantes.docx, recuperado do anexo da conversa original.

## Status por tarefa
| ID | Entrega | Estado |
|---|---|---|
| ROL-01 | spec.json, objetivo/escopo em requirements.md | Implementado |
| ROL-02 | requisitos observáveis 1.1–4.3 | Implementado |
| ROL-03 | design, contrato, fixtures e fronteiras | Implementado |
| ROL-04 | tasks.md com saídas e critérios | Implementado |
| ROL-05 | motor, adapter, interface e harness isolado | Implementado e testado |
| ROL-06 | testes, checklist, build e smoke abaixo | Evidências registradas; limitações globais abaixo |
| PER-01 | src/storage/SPEC.md | Implementado |
| PER-02 | src/storage/storageAdapter.js e teste sem telas | Implementado e testado |
| IA-04 | .kiro/steering/tech.md | Atualizado |

## Rastreabilidade Roleta
Os nomes abaixo são cenários executados em `tests/roleta`.
| Requisito | Evidência | Resultado |
|---|---|---|
| 1.1 | pista, entrada inicial, configuração default | PASS |
| 1.2 | wrap após 4 × 700 ms, acerto no fim do intervalo | PASS |
| 1.3 | sucesso único, score 100, duração 4199 ms, resultado auditável | PASS |
| 2.1 | erro textual, 700→570 ms, mínimo 180 ms, delta -8 | PASS |
| 2.2 | quinto erro emite falha única, canRestart, acumulado -40 | PASS |
| 2.3 | 11 configurações inválidas rejeitadas sem eventos/timers | PASS |
| 3.1 | reset zera estado interno e preserva Paciência fake 92 | PASS |
| 3.2 | dispose/unmount cancela timers/assinaturas; StrictMode deixa um timer | PASS |
| 3.3 | envelope/eventos compatíveis e fixture sem import do core | PASS |
| 4.1 | Enter/Espaço, botões nativos, pista textual, status anunciado | PASS |
| 4.2 | pressão reduzida 1400→1140 ms e controles funcionais | PASS |
| 4.3 | flags aceitas; interface sem animação/flashes; áudio opcional | PASS |

## Rastreabilidade persistência
`storageAdapter.test.js` declara ambiente Node: nenhuma tela ou React participa.
| Requisito da SPEC.md | Evidência | Resultado |
|---|---|---|
| 1.1 | primeira execução não grava; defaults/progresso vazio | PASS |
| 1.2 | configurações recuperadas em outra instância | PASS |
| 1.3 | JSON quebrado, null/array, versão futura, schema parcial | PASS |
| 2.1 | recorde 90→90→95, contagens, IDs toString/valueOf/hasOwnProperty | PASS |
| 2.2 | IDs perigosos, pontuações inválidas e flags erradas rejeitados sem gravação | PASS |
| 3.1 | cota e leitura negada: memória preservada e persisted false | PASS |
| 3.2 | execução sem window com Storage fake ou memória | PASS |
| 3.3 | mutar resultado retornado não altera dados internos | PASS |

## Comandos e resultados observados
Na aplicação local:
- `node node_modules/jest/bin/jest.js --config tests/roleta/jest.config.cjs --runInBand --watchAll=false`: **35 testes, 3 suítes PASS**, saída 0 (4,319 s na execução final dos testes).
- `node tests/roleta/build-harness.cjs`: **PASS**, saída 0; Webpack compilou em 9035 ms, bundle `main.7d840ae5.js` de 223 KiB antes de gzip. Inclui a Roleta mesmo sem registro no App.
- ESLint das áreas próprias: execução e revisão registradas ao final deste documento.
- `git diff --check`: saída 0. As mudanças anteriores de App.js/App.css/App.test.js e arquivos dos outros pacotes não foram editadas nem incluídas na entrega.

Base limpa de validação: extração por `git archive HEAD` dos arquivos commitados, somada somente às novas pastas do Cadu; mesmas dependências/package-lock. Nenhum arquivo offline de outro pacote é incluído.
- `npm test -- --watchAll=false --runInBand`: **15 testes PASS**, saída 0 (teste original de App + persistência).
- `npm run build` com CI=true: **Compiled successfully**, saída 0; bundle principal 70,01 kB gzip.
- Runner próprio com `--roots src tests/roleta`: **36 testes, 4 suítes PASS**, saída 0 (inclui App original, persistência e Roleta).

Esses resultados validam a base commitada mais esta entrega. Não validam os minigames locais ainda não commitados de outros pacotes.

## Smoke do artefato compilado
Servido por `node tests/roleta/serve-harness.cjs`, em http://localhost:4173, usando o build de produção. Navegador exibiu título, pista HDMI 2, entrada atual e três opções de acessibilidade; nenhum erro ou aviso de console capturado.

Interação por teclado observada: selecionar DisplayPort mostrou “Entrada incorreta”, erros 1, intervalo 570 ms e Paciência fake 92. Reiniciar zerou erros; ativar menor pressão de tempo mostrou intervalo 1400 ms e manteve Paciência fake 92. Sucesso/falha e demais bordas têm testes determinísticos acima. Não se declara auditoria completa por leitor de tela.

## Revisão e controles negativos
Revisão independente das specs: PASS. Revisão de código encontrou e levou à correção de acesso herdado em mapas de progresso. Antes da correção, três testes para IDs válidos toString/valueOf/hasOwnProperty falharam; depois, os três passaram. Também foi corrigida a descrição das raízes do runner e o suporte a SVG do teste original de App.

Os testes foram escritos antes do código, mas a execução inicial ficou bloqueada pela instalação e por arquivos offline. Portanto **não existe registro RED anterior à implementação inicial da mecânica**. Não confundir falhas de infraestrutura/seletores com prova de comportamento ausente. Como controle adicional posterior, desabilitou-se temporariamente start apenas na cópia de validação: **17/17 testes do motor falharam (saída 1)**; após restauração, os testes passaram. Esse controle demonstra sensibilidade, mas não muda a cronologia do desenvolvimento. Nenhuma flag ou mutação de controle foi deixada no código entregue.

## Limitações e publicação
1. Doze arquivos preexistentes de outros pacotes estão OFFLINE/RECALL_ON_DATA_ACCESS no OneDrive; a leitura de MinigameShell.js bloqueou os testes/build da cópia de trabalho completa. Processos presos foram encerrados sem modificar esses arquivos. O usuário deve disponibilizar a pasta offline para validar a composição local dos demais pacotes.
2. As permissões de escrita da pasta e de .git foram solicitadas e concedidas, mas o Windows continuou negando FETCH_HEAD e criação de refs. A branch planejada é `cadu/roleta-persistencia`; **ela não foi criada**.
3. Git remoto não pôde autenticar no ambiente; a integração GitHub retornou 404 para VitorAPC2/cc-sdd-do-daniel. **Nenhum commit ou push foi realizado**. Não foi alterada configuração de credenciais ou ACL para contornar a restrição.
4. A substituição no registro do App continua sendo INT-01 de Vitor. O adapter e o harness estão prontos para esse consumo; nenhuma tarefa de Lívia, Nathan ou Vitor foi implementada.

A entrega exportada contém somente as áreas próprias e tech.md. Depois de resolver acesso ao repositório, revisar e publicar seletivamente; não adicionar os arquivos preexistentes dos colegas por engano.
