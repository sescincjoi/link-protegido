/**
 * AUTH UI
 * Central SCI Joinville - Interface de Autenticação
 * 
 * Cria e gerencia o modal de login/cadastro dinamicamente
 * - Modal responsivo e acessível
 * - Alternância entre Login/Cadastro/Recuperação
 * - Feedback visual de erros e sucessos
 * - Integração com auth-core.js
 */
import authCore from './auth-core.js';
import { CONFIG } from './firebase-config.js';
class AuthUI {
  constructor() {
    this.modal = null;
    this.currentView = 'login'; // 'login', 'cadastro', 'recuperar'
    this.isOpen = false;
    this.isCadastreFlow = false;
    // Criar modal ao inicializar
    this.createModal();
    // Escutar mudanças de autenticação
    authCore.addAuthListener((event, user) => {
      if (event === 'login') {
        this.closeModal();
        if (this.isCadastreFlow) {
          this.showNotification(`Cadastro realizado com sucesso! Bem-vindo(a), ${user.displayName}!`, 'success');
          this.isCadastreFlow = false;
        } else {
          this.showNotification(`Bem-vindo(a), ${user.displayName}!`, 'success');
        }
        // Tentar criar seletor com logs de debug
        console.log('👤 Login detectado, tentando criar seletor de base...');
        setTimeout(() => this.createBaseSelector(), 500);
        setTimeout(() => this.createBaseSelector(), 2000); // Retry segurança
      }
    });
  }
  /**
   * CRIAR ESTRUTURA DO MODAL
   */
  createModal() {
    // Criar elemento do modal
    const modalHTML = `
      <div id="auth-modal" class="auth-modal" style="display: none;">
        <div class="auth-modal-overlay" id="auth-modal-overlay"></div>
        <div class="auth-modal-container">
          <div class="auth-modal-header">
            <h2 id="auth-modal-title">Login</h2>
            <button class="auth-modal-close" id="auth-modal-close" aria-label="Fechar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="auth-modal-body">
            <!-- Mensagem de erro/sucesso -->
            <div id="auth-message" class="auth-message" style="display: none;"></div>
            
            <!-- FORMULÁRIO DE LOGIN -->
            <form id="auth-form-login" class="auth-form" style="display: block;">
              <div class="auth-form-group">
                <label for="login-matricula">Matrícula</label>
                <input 
                  type="text" 
                  id="login-matricula" 
                  name="matricula"
                  placeholder="ABC1234"
                  maxlength="7"
                  autocomplete="username"
                  required
                />
                <small class="auth-help-text">3 letras + 4 números</small>
              </div>
              
              <div class="auth-form-group">
                <label for="login-senha">Senha</label>
                <input 
                  type="password" 
                  id="login-senha" 
                  name="senha"
                  autocomplete="current-password"
                  required
                />
              </div>
              
              <button type="submit" class="auth-btn auth-btn-primary" id="login-btn">
                Entrar
              </button>
              
              <div class="auth-links">
                <a href="#" id="link-recuperar" class="auth-link">Esqueci minha senha</a>
              </div>
            </form>
            
            <!-- FORMULÁRIO DE CADASTRO -->
            <form id="auth-form-cadastro" class="auth-form" style="display: none;">
              <div class="auth-form-group">
                <label for="cadastro-matricula">Matrícula *</label>
                <input 
                  type="text" 
                  id="cadastro-matricula" 
                  name="matricula"
                  placeholder="ABC1234"
                  maxlength="7"
                  autocomplete="off"
                  required
                />
                <small class="auth-help-text">3 letras + 4 números (fornecida pelo administrador)</small>
              </div>
              
              <div class="auth-form-group">
                <label for="cadastro-nome">Nome Completo *</label>
                <input 
                  type="text" 
                  id="cadastro-nome" 
                  name="nome"
                  placeholder="João da Silva"
                  autocomplete="name"
                  required
                />
              </div>
              
              <div class="auth-form-group">
                <label for="cadastro-nome-ba">Nome de BA *</label>
                <input 
                  type="text" 
                  id="cadastro-nome-ba" 
                  name="nomeBA"
                  placeholder="Como você quer ser chamado"
                  autocomplete="off"
                  required
                />
                <small class="auth-help-text">Nome que aparecerá no sistema</small>
              </div>
              
              <div class="auth-form-group">
                <label for="cadastro-email">Email para Recuperação *</label>
                <input 
                  type="email" 
                  id="cadastro-email" 
                  name="email"
                  placeholder="seuemail@exemplo.com"
                  autocomplete="email"
                  required
                />
                <small class="auth-help-text">Usado apenas para recuperar sua senha</small>
              </div>
              
              <div class="auth-form-group">
                <label for="cadastro-senha">Senha *</label>
                <input 
                  type="password" 
                  id="cadastro-senha" 
                  name="senha"
                  autocomplete="new-password"
                  required
                />
                <small class="auth-help-text">
                  Mín. 8 caracteres, com maiúscula, minúscula, número e especial
                </small>
              </div>
              
              <div class="auth-form-group">
                <label for="cadastro-confirmar">Confirmar Senha *</label>
                <input 
                  type="password" 
                  id="cadastro-confirmar" 
                  name="confirmar"
                  autocomplete="new-password"
                  required
                />
              </div>
              
              <button type="submit" class="auth-btn auth-btn-primary" id="cadastro-btn">
                Cadastrar
              </button>
              
              <div class="auth-links">
                <a href="#" id="link-login-from-cadastro" class="auth-link">Já tenho cadastro</a>
              </div>
            </form>
            
            <!-- FORMULÁRIO DE RECUPERAÇÃO -->
            <form id="auth-form-recuperar" class="auth-form" style="display: none;">
              <p class="auth-info-text">
                Digite sua matrícula para receber um link de recuperação no email cadastrado.
              </p>
              
              <div class="auth-form-group">
                <label for="recuperar-matricula">Matrícula</label>
                <input 
                  type="text" 
                  id="recuperar-matricula" 
                  name="matricula"
                  placeholder="ABC1234"
                  maxlength="7"
                  required
                />
              </div>
              
              <button type="submit" class="auth-btn auth-btn-primary" id="recuperar-btn">
                Enviar Link de Recuperação
              </button>
              
              <div class="auth-links">
                <a href="#" id="link-login-from-recuperar" class="auth-link">Voltar ao login</a>
              </div>
            </form>
          </div>
          
          <div class="auth-modal-footer">
            <p class="auth-footer-text">
              <span id="footer-switch-text">Não tem cadastro?</span>
              <a href="#" id="footer-switch-link" class="auth-link-bold">Cadastre-se</a>
            </p>
          </div>
        </div>
      </div>
    `;
    // Inserir no body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    // Guardar referência
    this.modal = document.getElementById('auth-modal');
    // Adicionar event listeners
    this.attachEventListeners();
    // Adicionar CSS
    this.injectStyles();
    // Escutar evento de Bases carregadas
    window.addEventListener('bases-config-loaded', () => {
      this.createBaseSelector();
    });
    // Escutar mudança de base
    window.addEventListener('base-changed', () => {
      this.updateBaseSelector();
    });
  }
  /**
   * CRIAR SELETOR DE BASE (SUPER ADMIN)
   */
  createBaseSelector() {
    console.log('🔧 createBaseSelector chamado');
    // Remover seletor anterior se existir
    const oldSelector = document.getElementById('base-selector-container');
    if (oldSelector) oldSelector.remove();
    // Verificar permissão
    const isSuper = authCore.isSuperAdmin();
    console.log('👤 Usuário é super admin?', isSuper, authCore.currentUser);
    if (!isSuper && !authCore.currentUser) return;
    if (authCore.currentUser && !isSuper) {
      console.log('❌ Usuário não é super admin, abortando seletor');
      return;
    }
    if (!window.endpointsManager) {
      console.warn('⚠️ endpointsManager não encontrado');
      return;
    }
    const bases = window.endpointsManager.listarBases();
    console.log('📍 Bases encontradas:', bases.length);
    if (bases.length <= 1) {
      console.log('ℹ️ Apenas 1 ou 0 bases, não precisa de seletor');
      return;
    }
    const baseAtual = window.endpointsManager.getBaseAtual();
    const selectorHTML = `
        <div id="base-selector-container" class="base-selector-container">
            <div class="base-selector-label">Base Ativa:</div>
            <select id="base-selector" class="base-selector-select">
                ${bases.map(base => `
                    <option value="${base.id}" ${base.id === baseAtual ? 'selected' : ''}>
                        ${base.nome} (${base.icao})
                    </option>
                `).join('')}
            </select>
        </div>
      `;
    // Inserir no topo da página ou dentro do menu do usuário
    // Vamos tentar inserir no menu do usuário se ele existir, senão no body fixo
    const userMenu = document.getElementById('auth-user-menu');
    if (userMenu) {
      userMenu.insertAdjacentHTML('afterbegin', selectorHTML);
    } else {
      // Fallback - inserir no canto inferior direito
      document.body.insertAdjacentHTML('beforeend', selectorHTML);
      document.getElementById('base-selector-container').classList.add('floating');
    }
    // Adicionar listener
    document.getElementById('base-selector').addEventListener('change', (e) => {
      const novaBase = e.target.value;
      if (window.endpointsManager.setBase(novaBase)) {
        this.showNotification(`Base alterada para ${novaBase}`, 'success');
        setTimeout(() => window.location.reload(), 1000); // Recarregar para aplicar
      }
    });
  }
  /**
   * ATUALIZAR SELETOR
   */
  updateBaseSelector() {
    // Re-criar para garantir estado atualizado
    this.createBaseSelector();
  }
  /**
   * ANEXAR EVENT LISTENERS
   */
  attachEventListeners() {
    // Fechar modal
    document.getElementById('auth-modal-close').addEventListener('click', () => {
      this.closeModal();
    });
    document.getElementById('auth-modal-overlay').addEventListener('click', () => {
      this.closeModal();
    });
    // ESC para fechar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeModal();
      }
    });
    // Links de alternância
    document.getElementById('link-recuperar').addEventListener('click', (e) => {
      e.preventDefault();
      this.switchView('recuperar');
    });
    document.getElementById('link-login-from-cadastro').addEventListener('click', (e) => {
      e.preventDefault();
      this.switchView('login');
    });
    document.getElementById('link-login-from-recuperar').addEventListener('click', (e) => {
      e.preventDefault();
      this.switchView('login');
    });
    document.getElementById('footer-switch-link').addEventListener('click', (e) => {
      e.preventDefault();
      if (this.currentView === 'login') {
        this.switchView('cadastro');
      } else {
        this.switchView('login');
      }
    });
    // Formulário de login
    document.getElementById('auth-form-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin(e);
    });
    // Formulário de cadastro
    document.getElementById('auth-form-cadastro').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleCadastro(e);
    });
    // Formulário de recuperação
    document.getElementById('auth-form-recuperar').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleRecuperar(e);
    });
    // Auto-uppercase para matrícula
    ['login-matricula', 'cadastro-matricula', 'recuperar-matricula'].forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
      });
    });
  }
  /**
   * ALTERNAR ENTRE VIEWS (login/cadastro/recuperar)
   */
  switchView(view) {
    this.currentView = view;
    // Esconder todos os formulários
    document.getElementById('auth-form-login').style.display = 'none';
    document.getElementById('auth-form-cadastro').style.display = 'none';
    document.getElementById('auth-form-recuperar').style.display = 'none';
    // Limpar mensagens
    this.hideMessage();
    // Resetar formulários
    document.getElementById('auth-form-login').reset();
    document.getElementById('auth-form-cadastro').reset();
    document.getElementById('auth-form-recuperar').reset();
    // Mostrar formulário correto
    if (view === 'login') {
      document.getElementById('auth-modal-title').textContent = 'Login';
      document.getElementById('auth-form-login').style.display = 'block';
      document.getElementById('footer-switch-text').textContent = 'Não tem cadastro?';
      document.getElementById('footer-switch-link').textContent = 'Cadastre-se';
    } else if (view === 'cadastro') {
      document.getElementById('auth-modal-title').textContent = 'Cadastro';
      document.getElementById('auth-form-cadastro').style.display = 'block';
      document.getElementById('footer-switch-text').textContent = 'Já tem cadastro?';
      document.getElementById('footer-switch-link').textContent = 'Fazer login';
    } else if (view === 'recuperar') {
      document.getElementById('auth-modal-title').textContent = 'Recuperar Senha';
      document.getElementById('auth-form-recuperar').style.display = 'block';
      document.getElementById('footer-switch-text').textContent = '';
      document.getElementById('footer-switch-link').textContent = '';
    }
  }
  /**
   * HANDLE LOGIN
   */
  async handleLogin(e) {
    const btn = document.getElementById('login-btn');
    const matricula = document.getElementById('login-matricula').value;
    const senha = document.getElementById('login-senha').value;
    try {
      this.setLoading(btn, true);
      this.hideMessage();
      await authCore.login(matricula, senha);
      // Sucesso - o listener já vai fechar o modal
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.setLoading(btn, false);
    }
  }
  /**
   * HANDLE CADASTRO
   */
  async handleCadastro(e) {
    const btn = document.getElementById('cadastro-btn');
    const matricula = document.getElementById('cadastro-matricula').value;
    const nome = document.getElementById('cadastro-nome').value;
    const nomeBA = document.getElementById('cadastro-nome-ba').value;
    const email = document.getElementById('cadastro-email').value;
    const senha = document.getElementById('cadastro-senha').value;
    const confirmar = document.getElementById('cadastro-confirmar').value;
    try {
      this.setLoading(btn, true);
      this.hideMessage();
      this.isCadastreFlow = true;  // marca que é fluxo de cadastro
      const result = await authCore.cadastrar(matricula, senha, confirmar, email, nome, nomeBA);
      // Mostrar mensagem de sucesso
      this.showSuccess(result.message);
      // Aguardar 1 segundo para usuário ver a mensagem
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Modal vai fechar automaticamente quando o authCore.onAuthStateChanged detectar o login
    } catch (error) {
      this.isCadastreFlow = false;
      this.showError(error.message);
    } finally {
      this.setLoading(btn, false);
    }
  }
  /**
   * HANDLE RECUPERAR SENHA
   */
  async handleRecuperar(e) {
    const btn = document.getElementById('recuperar-btn');
    const matricula = document.getElementById('recuperar-matricula').value;
    try {
      this.setLoading(btn, true);
      this.hideMessage();
      const result = await authCore.recuperarSenha(matricula);
      this.showSuccess(result.message);
      // Voltar ao login após 3 segundos
      setTimeout(() => {
        this.switchView('login');
      }, 3000);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.setLoading(btn, false);
    }
  }
  /**
   * MOSTRAR MENSAGEM DE ERRO
   */
  showError(message) {
    const messageEl = document.getElementById('auth-message');
    messageEl.className = 'auth-message auth-message-error';
    messageEl.textContent = message;
    messageEl.style.display = 'block';
  }
  /**
   * MOSTRAR MENSAGEM DE SUCESSO
   */
  showSuccess(message) {
    const messageEl = document.getElementById('auth-message');
    messageEl.className = 'auth-message auth-message-success';
    messageEl.textContent = message;
    messageEl.style.display = 'block';
  }
  /**
   * ESCONDER MENSAGEM
   */
  hideMessage() {
    const messageEl = document.getElementById('auth-message');
    messageEl.style.display = 'none';
  }
  /**
   * SETAR LOADING NO BOTÃO
   */
  setLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'Processando...';
      button.classList.add('auth-btn-loading');
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || button.textContent;
      button.classList.remove('auth-btn-loading');
    }
  }
  /**
   * ABRIR MODAL
   */
  openModal(view = 'login') {
    this.switchView(view);
    this.modal.style.display = 'flex';
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // Prevenir scroll do body
    // Focar no primeiro input
    setTimeout(() => {
      const firstInput = this.modal.querySelector('input:not([type="hidden"])');
      if (firstInput) firstInput.focus();
    }, 100);
  }
  /**
   * FECHAR MODAL
   */
  closeModal() {
    this.modal.style.display = 'none';
    this.isOpen = false;
    document.body.style.overflow = ''; // Restaurar scroll
    // Limpar formulários
    document.getElementById('auth-form-login').reset();
    document.getElementById('auth-form-cadastro').reset();
    document.getElementById('auth-form-recuperar').reset();
    this.hideMessage();
  }
  /**
   * INJETAR ESTILOS CSS
   */
  injectStyles() {
    const styleId = 'auth-ui-styles';
    // Evitar duplicação
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* MODAL OVERLAY */
      .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: authFadeIn 0.2s ease-out;
      }
      
      @keyframes authFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .auth-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
      }
      
      /* CONTAINER DO MODAL */
      .auth-modal-container {
        position: relative;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        width: 90%;
        max-width: 440px;
        max-height: 90vh;
        overflow-y: auto;
        animation: authSlideIn 0.3s ease-out;
      }
      
      @keyframes authSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* HEADER */
      .auth-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 24px 16px;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .auth-modal-header h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #111827;
      }
      
      .auth-modal-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #6b7280;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .auth-modal-close:hover {
        color: #111827;
      }
      
      /* BODY */
      .auth-modal-body {
        padding: 24px;
      }
      
      /* MENSAGENS */
      .auth-message {
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .auth-message-error {
        background: #fee2e2;
        color: #991b1b;
        border-left: 4px solid #dc2626;
      }
      
      .auth-message-success {
        background: #d1fae5;
        color: #065f46;
        border-left: 4px solid #10b981;
      }
      
      /* FORMULÁRIOS */
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .auth-form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      
      .auth-form-group label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
      }
      
      .auth-form-group input {
        padding: 10px 14px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 15px;
        transition: all 0.2s;
        font-family: inherit;
      }
      
      .auth-form-group input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      .auth-help-text {
        font-size: 12px;
        color: #6b7280;
        margin-top: 2px;
      }
      
      .auth-info-text {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.5;
        margin: 0 0 16px 0;
      }
      
      /* BOTÕES */
      .auth-btn {
        padding: 10px 24px;
        margin: 10px 0;
        width: -webkit-fill-available;
        border-radius: 6px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: inherit;
      }
      
      .auth-btn-primary {
        
        background: #3b82f6;
        color: white;
      }
      
      .auth-btn-primary:hover:not(:disabled) {
        background: #2563eb;
      }
      
      .auth-btn-primary:disabled {
        background: #93c5fd;
        cursor: not-allowed;
      }
      
      .auth-btn-loading {
        position: relative;
      }
      
      /* LINKS */
      .auth-links {
        text-align: center;
        margin-top: 8px;
      }
      
      .auth-link {
        color: #3b82f6;
        text-decoration: none;
        font-size: 14px;
        transition: color 0.2s;
      }
      
      .auth-link:hover {
        color: #2563eb;
        text-decoration: underline;
      }
      
      .auth-link-bold {
        color: #3b82f6;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s;
      }
      
      .auth-link-bold:hover {
        color: #2563eb;
      }
      
      /* FOOTER */
      .auth-modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
      }
      
      .auth-footer-text {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
      }
      
      /* RESPONSIVO */
      @media (max-width: 480px) {
        .auth-modal-container {
          width: 95%;
          border-radius: 8px;
        }
        
        .auth-modal-header,
        .auth-modal-body,
        .auth-modal-footer {
          padding-left: 16px;
          padding-right: 16px;
        }
      }
      /* SELETOR DE BASE */
      .base-selector-container {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
      }
      .base-selector-container.floating {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 9999;
      }
      .base-selector-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 4px;
      }
      .base-selector-select {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          background: white;
          color: #1f2937;
      }
    `;
    document.head.appendChild(style);
  }
  /**
   * MOSTRAR NOTIFICAÇÃO TOAST
   */
  showNotification(message, type = 'success') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.innerHTML = `
      <div class="auth-notification-content">
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-5 h-5"></i>
        <span>${message}</span>
      </div>
    `;
    // Adicionar ao body
    document.body.appendChild(notification);
    // Recriar ícones
    if (window.lucide) {
      lucide.createIcons();
    }
    // Animar entrada
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    // Remover após 4 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }
}
// Criar instância global
const authUI = new AuthUI();
// Exportar
export default authUI;
// Também disponibilizar globalmente
window.authUI = authUI;
console.log('✅ AuthUI inicializado');
