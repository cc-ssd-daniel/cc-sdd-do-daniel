# Design de Arquitetura

## Abordagem de Integração
O projeto foi consolidado em uma única aplicação Vite com TypeScript no shell e React/JSX nos componentes dos minigames. A pasta do projeto anterior não faz parte da base atual.

**Decisão arquitetural concluída:** o projeto raiz é a fonte de verdade. Os wrappers TypeScript em `src/minigames/` adaptam os componentes React em `src/minigames/react-apps/` ao `CoreLoop`.

## Arquitetura Sequencial (Game Flow Controller)
Para permitir que um minigame seja executado em seguida do outro:

1. **`core/loop.ts` & `core/patience.ts` (ou novo GameController):**
   - Deverá gerenciar uma fila (Array) de minigames a serem instanciados.
   - Quando um minigame emite um evento de conclusão (`onComplete`), o controlador:
     1. Desmonta o DOM/Eventos do minigame atual.
     2. Instancia e monta o próximo minigame da fila.
     3. (Opcional) Mostra uma tela de transição entre eles.

2. **Interface padrão para minigames (`MinigameContract`):**
   - Os wrappers em `src/minigames/` implementam `start`, `onSuccess`, `onFailure`, `restart` e `unmount` opcional.
   - O contrato detalhado está em `.kiro/steering/contract.md` e `src/core/contract.ts`.

## Estrutura Centralizada
- **Documentação & Tasks:** Todo o plano, histórico de tasks antigas e andamento atual das specs ficarão centralizados na pasta `.kiro/specs/` (ex: pastas já existentes para `foco-milimetrico`, `reboot-de-10-segundos`, `roleta`, e esta spec `merge-projects`).
- **Assets e Estilos:** Os diretórios `public/` e `src/assets/` concentrarão os arquivos estáticos de ambos os projetos.

## Tratamento de Falhas e Fluxos Limites
- Se um minigame der erro, o core encerra a tentativa, aplica a consequência de paciência e retorna à sala.
