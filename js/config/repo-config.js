/**
 * ========================================
 * CONFIGURAÇÃO GLOBAL DO REPOSITÓRIO
 * ========================================
 * 
 * Este arquivo centraliza a configuração da URL base do repositório.
 * Ao trocar de repositório no GitHub, basta alterar o valor de BASE_URL.
 * 
 * A configuração fica disponível globalmente via window.URL_CONFIG
 * 
 * IMPORTANTE: Não adicione barra (/) no final da URL.
 */

// ⚙️ CONFIGURAÇÃO - Detecção Automática do Repositório
// No GitHub Pages, o pathname costuma ser '/nome-do-repo/index.html'. 
// Esta lógica extrai o nome do repositório automaticamente.
const getAutoBaseUrl = () => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s !== '');

    // Se estivermos em um ambiente local (ex: localhost:5500)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Se houver segmentos e o primeiro não for uma página conhecida, assume que é uma pasta
        const knownPages = ['index.html', 'test-config.html', 'admin', 'tools'];
        if (segments.length > 0 && !knownPages.includes(segments[0])) {
            return '/' + segments[0];
        }
        return '';
    }

    // No GitHub Pages (/nome-do-repo/...)
    if (segments.length > 0) {
        // Verificamos se o primeiro segmento é uma pasta do projeto ou arquivo
        const projectFolders = ['admin', 'tools', 'js', 'pwa'];
        const isFile = segments[0].includes('.');
        if (!projectFolders.includes(segments[0]) && !isFile) {
            return '/' + segments[0];
        }
    }
    return '';
};

// ⚙️ DEFINIÇÃO DA URL BASE
const BASE_URL = getAutoBaseUrl();

/**
 * Função auxiliar para construir caminhos completos
 * @param {string} path - Caminho relativo (ex: '/js/auth/auth-core.js' ou 'js/auth/auth-core.js')
 * @returns {string} - URL completa
 * 
 * Exemplo de uso:
 * const authPath = window.URL_CONFIG.path('/js/auth/auth-core.js');
 */
function buildPath(path) {
    // Remove barra inicial do path se existir para evitar duplicação
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
}

/**
 * Configuração global disponível em window.URL_CONFIG
 */
window.URL_CONFIG = {
    // URL base do repositório
    BASE: BASE_URL,

    // Função para construir paths
    path: buildPath,

    // Paths comuns pré-configurados
    AUTH_CORE: `${BASE_URL}/js/auth/auth-core.js`,
    AUTH_UI: `${BASE_URL}/js/auth/auth-ui.js`,
    AUTH_GUARD: `${BASE_URL}/js/auth/auth-guard.js`,
    AUTH_LOCK: `${BASE_URL}/js/auth/auth-lock.js`,
    MATRICULA_HANDLER: `${BASE_URL}/js/auth/matricula-handler.js`,
    FIREBASE_CONFIG: `${BASE_URL}/js/auth/firebase-config.js`,

    // Configuração
    BASES_CONFIG: `${BASE_URL}/js/config/bases-config.js`,
    ENDPOINTS_MANAGER: `${BASE_URL}/js/config/endpoints-manager.js`,

    // PWA
    PWA_APP: `${BASE_URL}/pwa/app.js`,

    // Páginas
    INDEX: `${BASE_URL}/index.html`,
    ADMIN_USUARIOS: `${BASE_URL}/admin/usuarios.html`,
    ADMIN_CONFIG_BASES: `${BASE_URL}/admin/config-bases.html`,
    TOOLS_EXTINTORES: `${BASE_URL}/tools/extintores.html`,
};

// Log de confirmação para debug
console.log('✅ URL_CONFIG (Auto-detect):', window.URL_CONFIG.BASE || 'Raiz (/)');
