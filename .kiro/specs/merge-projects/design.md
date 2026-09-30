# Design de Arquitetura

## Abordagem de Integração
Os dois projetos contêm versões dos mesmos minigames (`fake`, `foco`, `reboot`, `roleta`).
O projeto principal (`cc-sdd-do-daniel`) foi estruturado em Vanilla TypeScript + Vite.
O projeto aninhado (`vibe-code-do-daniel`) foi feito em React + JavaScript.

**Decisão Arquitetural:** O projeto raiz em Vanilla TS + Vite será mantido como a fonte de verdade. As lógicas de interface do React (`vibe-code-do-daniel`) que ainda não foram migradas serão convertidas para o sistema de componentes Vanilla, e os assets visuais e de estilo transferidos. Em seguida, o diretório React será apagado, unificando a base.

## Arquitetura Sequencial (Game Flow Controller)
Para permitir que um minigame seja executado em seguida do outro:

1. **`core/loop.ts` & `core/patience.ts` (ou novo GameController):**
   - Deverá gerenciar uma fila (Array) de minigames a serem instanciados.
   - Quando um minigame emite um evento de conclusão (`onComplete`), o controlador:
     1. Desmonta o DOM/Eventos do minigame atual.
     2. Instancia e monta o próximo minigame da fila.
     3. (Opcional) Mostra uma tela de transição entre eles.

2. **Interface Padrão para Minigames (`MinigameContract`):**
   - Os arquivos de TS em `src/minigames/` (`fake.ts`, `foco.ts`, etc.) devem implementar uma interface comum, contendo pelo menos:
     - `mount(container: HTMLElement, onComplete: () => void): void`
     - `unmount(): void`

## Estrutura Centralizada
- **Documentação & Tasks:** Todo o plano, histórico de tasks antigas e andamento atual das specs ficarão centralizados na pasta `.kiro/specs/` (ex: pastas já existentes para `foco-milimetrico`, `reboot-de-10-segundos`, `roleta`, e esta spec `merge-projects`).
- **Assets e Estilos:** Os diretórios `public/` e `src/assets/` concentrarão os arquivos estáticos de ambos os projetos.

## Tratamento de Falhas e Fluxos Limites
- Se um minigame der erro ou se o usuário quiser pular, o controlador poderá expor uma ação de `skip()` para forçar o carregamento do próximo item na fila.
