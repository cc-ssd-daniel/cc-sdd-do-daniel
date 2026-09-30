// FocoErrorBoundary.js — mostra o erro na tela em vez de deixar branco (diagnóstico).
import React from 'react';

export default class FocoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    // Também loga no console do navegador.
    // eslint-disable-next-line no-console
    console.error('Foco crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', color: '#b42318' }}>
          <h2>Erro no Foco (capturado)</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String((this.state.error && this.state.error.stack) || this.state.error)}</pre>
          {this.state.info && (
            <pre style={{ whiteSpace: 'pre-wrap', color: '#7a271a' }}>
              {this.state.info.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
