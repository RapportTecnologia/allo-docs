import { useConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router';

export default {
  primaryHue: 11,
  primarySaturation: 70,
  darkMode: false,
  nextThemes: { defaultTheme: 'light', forcedTheme: 'light' },
  logo: (
    <span className="allo-brand">
      <span className="allo-brand-mark" aria-hidden="true">a.</span>
      <span>ALLO Protocol<small>por Rapport Tecnologia</small></span>
    </span>
  ),
  navbar: {
    extraContent: <a className="allo-site-link" href="https://rapport.tec.br/allo/">Site ALLO ↗</a>
  },
  footer: {
    component: (
      <footer className="allo-footer">
        <div className="allo-footer-grid">
          <div>
            <h2>ALLO Protocol</h2>
            <p>Alocação e Distribuição Descentralizada de Fundos</p>
          </div>
          <nav aria-label="Links do site">
            <h3>Explore</h3>
            <a href="https://rapport.tec.br/allo/">Início</a>
            <a href="https://rapport.tec.br/allo/arquitetura/">Arquitetura</a>
            <a href="https://rapport.tec.br/allo/dao/">Governança DAO</a>
          </nav>
          <nav aria-label="Fontes do projeto">
            <h3>Fontes</h3>
            <a href="https://github.com/RapportTecnologia/allo">Fork Acadêmico ↗</a>
            <a href="https://github.com/allo-protocol/allo-v2">Allo Protocol V2 ↗</a>
            <a href="https://rapport.tec.br">Rapport Tecnologia ↗</a>
          </nav>
        </div>
        <div className="allo-footer-bottom">
          © {new Date().getFullYear()} Rapport Tecnologia. Conteúdo baseado no Allo Protocol V2 (Gitcoin, AGPL-3.0)
          e no trabalho acadêmico de Francisco Josias da Silva Batista.
        </div>
      </footer>
    )
  },
  project: {
    link: 'https://github.com/allo-protocol'
  },
  docsRepositoryBase: 'https://github.com/allo-protocol/docs/blob/main',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Allo Docs'
    }
  },
  head: () => {
    const { frontMatter } = useConfig()
    const { basePath } = useRouter()
 
    return (
      <>
        <meta property="og:title" content={frontMatter.title || 'Allo Docs'} />
        <meta
          property="og:description"
          content={frontMatter.description || 'The Allo protocol docs'}
        />
        <link rel="icon" type="image/svg+xml" href={`${basePath}/favicon.svg`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </>
    )
  }
}
