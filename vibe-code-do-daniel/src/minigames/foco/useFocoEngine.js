// useFocoEngine.js — Hook React que roda o contrato do Foco no tempo e expõe estado.
// Requirements: 2.1, 3.1, 1.5 (limpeza no unmount)

import { useCallback, useEffect, useRef, useState } from 'react';
import { createFocoContract } from './focoContract';

/**
 * @param {object} params
 * @param {object} params.config
 * @param {*} params.services
 * @param {(result: import('./focoContract').FocoResult) => void} params.onComplete
 * @param {(reason: string) => void} params.onFail
 * @param {boolean} [params.autoStart]
 */
export function useFocoEngine({ config, services, onComplete, onFail, autoStart = true }) {
  const [state, setState] = useState(null);
  const contractRef = useRef(null);

  // Mantém callbacks atuais sem recriar o contrato a cada render.
  const onCompleteRef = useRef(onComplete);
  const onFailRef = useRef(onFail);
  onCompleteRef.current = onComplete;
  onFailRef.current = onFail;

  useEffect(() => {
    const contract = createFocoContract({
      onComplete: (r) => onCompleteRef.current && onCompleteRef.current(r),
      onFail: (reason) => onFailRef.current && onFailRef.current(reason),
      onState: setState,
    });
    contractRef.current = contract;

    if (autoStart) {
      contract.start(config, services);
    }

    return () => {
      contract.dispose(); // (1.5) limpa timers ao desmontar
      contractRef.current = null;
    };
    // Recria quando config/services mudam (nova rodada).
  }, [config, services, autoStart]);

  const move = useCallback((delta) => {
    if (contractRef.current) contractRef.current.move(delta);
  }, []);

  const restart = useCallback(() => {
    if (contractRef.current) contractRef.current.start(config, services);
  }, [config, services]);

  return { state, move, restart };
}
