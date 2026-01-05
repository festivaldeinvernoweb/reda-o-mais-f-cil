/* =====================================================
   +REDAÇÃO - SCRIPTS PRINCIPAIS
   Funcionalidades interativas do site
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // ===================== NAVEGAÇÃO MOBILE =====================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Toggle do menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fecha o menu ao clicar em um link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // ===================== HEADER SCROLL EFFECT =====================
    const header = document.getElementById('header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verifica estado inicial
    
    // ===================== NAVEGAÇÃO POR ABAS (TEMAS) =====================
    const themeTabs = document.querySelectorAll('.theme-tab:not(.theme-tab--soon)');
    const themePanels = document.querySelectorAll('.theme-panel');
    
    themeTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const themeId = this.getAttribute('data-theme');
            
            // Remove classe ativa de todas as abas
            themeTabs.forEach(function(t) {
                t.classList.remove('theme-tab--active');
            });
            
            // Adiciona classe ativa na aba clicada
            this.classList.add('theme-tab--active');
            
            // Esconde todos os painéis
            themePanels.forEach(function(panel) {
                panel.classList.remove('theme-panel--active');
            });
            
            // Mostra o painel correspondente
            const targetPanel = document.getElementById('theme-' + themeId);
            if (targetPanel) {
                targetPanel.classList.add('theme-panel--active');
            }
        });
    });
    
    // ===================== CONTADOR DE CARACTERES E LINHAS =====================
    const essayTextarea = document.getElementById('essay');
    const charCount = document.getElementById('char-count');
    const lineCount = document.getElementById('line-count');
    
    if (essayTextarea && charCount && lineCount) {
        essayTextarea.addEventListener('input', function() {
            const text = this.value;
            const chars = text.length;
            
            // Estima linhas (aproximadamente 80 caracteres por linha)
            const estimatedLines = Math.ceil(chars / 80) || 0;
            
            charCount.textContent = chars + ' caracteres';
            lineCount.textContent = '~' + estimatedLines + ' linhas';
            
            // Feedback visual se estiver muito curto ou longo
            if (estimatedLines < 7 && chars > 0) {
                lineCount.style.color = '#f59e0b'; // Aviso: muito curto
            } else if (estimatedLines > 30) {
                lineCount.style.color = '#ef4444'; // Erro: muito longo
            } else {
                lineCount.style.color = ''; // Normal
            }
        });
    }
    
    // ===================== ENVIO DO FORMULÁRIO =====================
    const essayForm = document.getElementById('essay-form');
    
    if (essayForm) {
        essayForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const theme = formData.get('theme') || 'Não informado';
            const essay = formData.get('essay');
            
            // Validação básica
            if (!name || !email || !essay) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // Monta o corpo do email
            const subject = encodeURIComponent('[+Redação] Nova redação enviada por ' + name);
            const body = encodeURIComponent(
                '=================================\n' +
                '+REDAÇÃO - ENVIO DE REDAÇÃO\n' +
                '=================================\n\n' +
                'DADOS DO ESTUDANTE:\n' +
                '-------------------\n' +
                'Nome: ' + name + '\n' +
                'E-mail: ' + email + '\n' +
                'Tema: ' + theme + '\n\n' +
                'REDAÇÃO:\n' +
                '--------\n\n' +
                essay + '\n\n' +
                '=================================\n' +
                'Enviado através do site +Redação'
            );
            
            // Abre o cliente de email com os dados preenchidos
            const mailtoLink = 'mailto:kauacesarpereira049@gmail.com?subject=' + subject + '&body=' + body;
            
            // Tenta abrir o cliente de email
            window.location.href = mailtoLink;
            
            // Mostra mensagem de sucesso
            setTimeout(function() {
                showNotification(
                    'Seu cliente de e-mail foi aberto! Complete o envio por lá. ' +
                    'Se não abriu, copie sua redação e envie manualmente para: kauacesarpereira049@gmail.com',
                    'success'
                );
            }, 500);
        });
    }
    
    // ===================== SISTEMA DE NOTIFICAÇÕES =====================
    function showNotification(message, type) {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification notification--' + type;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">${type === 'success' ? '✓' : '⚠'}</span>
                <p class="notification__message">${message}</p>
                <button class="notification__close" aria-label="Fechar">&times;</button>
            </div>
        `;
        
        // Adiciona estilos inline (para não depender de CSS adicional)
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            left: 20px;
            max-width: 500px;
            margin-left: auto;
            padding: 16px 20px;
            background: ${type === 'success' ? '#10b981' : '#f59e0b'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideUp 0.3s ease;
        `;
        
        // Adiciona a animação via CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .notification__content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification__icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            .notification__message {
                flex: 1;
                margin: 0;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            .notification__close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.8;
                padding: 0;
                line-height: 1;
            }
            .notification__close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Adiciona ao DOM
        document.body.appendChild(notification);
        
        // Botão de fechar
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto-remove após 10 segundos
        setTimeout(function() {
            if (notification.parentNode) {
                notification.style.animation = 'slideUp 0.3s ease reverse';
                setTimeout(function() {
                    notification.remove();
                }, 300);
            }
        }, 10000);
    }
    
    // ===================== LINK ATIVO NA NAVEGAÇÃO =====================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.style.color = '#0d6e6e';
                    } else if (!link.classList.contains('nav__link--cta')) {
                        link.style.color = '';
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // ===================== SMOOTH SCROLL PARA LINKS INTERNOS =====================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================== ANIMAÇÃO DE ENTRADA DOS ELEMENTOS =====================
    // Observador de interseção para animar elementos quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Aplica animação aos elementos
    const animatedElements = document.querySelectorAll('.tip-card, .structure-part, .repertoire-block, .hero__card');
    
    animatedElements.forEach(function(el, index) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease ' + (index * 0.1) + 's, transform 0.5s ease ' + (index * 0.1) + 's';
        observer.observe(el);
    });
    
    // ===================== LOG DE INICIALIZAÇÃO =====================
    console.log('✅ +Redação carregado com sucesso!');
    console.log('📚 Desenvolvido para ajudar estudantes brasileiros');
});
