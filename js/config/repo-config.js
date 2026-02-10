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

// ⚙️ CONFIGURAÇÃO PRINCIPAL - Altere apenas esta linha ao trocar de repositório
const BASE_URL = '/Central-SCI';

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

// Também exportar para compatibilidade com imports ES6
export const REPO_BASE_URL = BASE_URL;
export const getRepoPath = buildPath;
export const REPO_PATHS = window.URL_CONFIG;
export default window.URL_CONFIG;

// Log de confirmação
console.log('✅ URL_CONFIG carregado:', window.URL_CONFIG.BASE);
