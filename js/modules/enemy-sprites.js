/* =========================================
   ENEMY SPRITES SYSTEM
   Sistema de sprites de inimigos (substitui emojis)
   ========================================= */

/**
 * Gerencia a exibição de sprites de inimigos em vez de emojis
 * - Adiciona classes e atributos necessários automaticamente
 * - Detecta erros de carregamento e faz fallback para emoji
 * - Não altera a lógica do jogo, apenas a apresentação visual
 */
class EnemySpriteSystem {
    constructor() {
        this.loadedSprites = new Set();
        this.failedSprites = new Set();
        this.spriteCache = new Map();
    }

    /**
     * Gera o ID do sprite baseado no mundo e no nível
     * @param {string} worldId - ID do mundo (ex: 'fire_world')
     * @param {number} levelNumber - Número da fase (ex: 10, 15, 20)
     * @param {string} levelType - Tipo da fase ('elite' ou 'boss')
     * @returns {string} - ID do sprite (ex: 'fire_elite_10')
     */

    getSpriteId(worldId, levelNumber, levelType) {
        // Mapeia world IDs para nomes de pasta
        const worldMap = {
            'tutorial_world': 'guardian',
            'fire_world': 'fire',
            'forest_world': 'forest',
            'mountain_world': 'mountain',
            'desert_world': 'desert',
            'castle_world': 'castle'
        };

        const worldFolder = worldMap[worldId] || 'guardian';

        // Mapeia os IDs reais de fase para os slots (elite 10/15 e boss)
        const levelSlots = {
            'tutorial_world': { boss: [0] },
            'fire_world': { elite10: [10], elite15: [15], boss: [20] },
            'forest_world': { elite10: [30], elite15: [35], boss: [40] },
            'mountain_world': { elite10: [50], elite15: [55], boss: [60] },
            'desert_world': { elite10: [70], elite15: [75], boss: [80] },
            'castle_world': { elite10: [90], elite15: [95], boss: [100] }
        };

        const slots = levelSlots[worldId];
        if (slots) {
            if (slots.elite10 && slots.elite10.includes(levelNumber)) {
                return `${worldFolder}_elite_10`;
            }
            if (slots.elite15 && slots.elite15.includes(levelNumber)) {
                return `${worldFolder}_elite_15`;
            }
            if (slots.boss && slots.boss.includes(levelNumber)) {
                return `${worldFolder}_boss`;
            }
        }

        // Determina o tipo de inimigo (fallback)
        if (levelType === 'boss') {
            return `${worldFolder}_boss`;
        }

        // Fallback (nao deveria chegar aqui)
        return `${worldFolder}_elite_${levelNumber}`;
    }

    activateSprite(avatarElement, worldId, levelNumber, levelType) {

        if (!avatarElement) {
            console.warn('[SPRITE] Avatar element not found');
            return;
        }

        const spriteId = this.getSpriteId(worldId, levelNumber, levelType);

        // Se já tentou carregar e falhou, não tenta novamente
        if (this.failedSprites.has(spriteId)) {
            console.log(`[SPRITE] ${spriteId} failed previously, using emoji fallback`);
            return;
        }

        // Adiciona classes e atributos
        avatarElement.classList.add('boss-sprite');
        avatarElement.setAttribute('data-enemy-id', spriteId);

        console.log(`[SPRITE] ✓ Activated sprite: ${spriteId}`);

        // Tenta pré-carregar a imagem para detectar erro
        this.preloadSprite(spriteId, avatarElement);
    }

    /**
     * Pré-carrega a imagem do sprite e detecta erros
     * @param {string} spriteId - ID do sprite
     * @param {HTMLElement} avatarElement - Elemento .boss-avatar
     */
    preloadSprite(spriteId, avatarElement) {
        // Se já carregou com sucesso, não precisa recarregar
        if (this.loadedSprites.has(spriteId)) {
            return;
        }

        // Extrai o mundo do spriteId (ex: 'fire' de 'fire_elite_10')
        const worldMatch = spriteId.match(/^([a-z]+)_/);
        const world = worldMatch ? worldMatch[1] : 'guardian';

        // Detecta qual imagem usar (elite_10, elite_15, ou boss)
        const fileName = spriteId.replace(`${world}_`, '');

        // Tenta WebP primeiro
        const imgWebP = new Image();
        const folder = world === 'guardian' ? 'guardian' : `${world}_world`;
        const pathWebP = `assets/enemies/${folder}/${fileName}.webp`;

        imgWebP.onload = () => {
            this.loadedSprites.add(spriteId);
            console.log(`[SPRITE] ✓ Loaded: ${pathWebP}`);
        };

        imgWebP.onerror = () => {
            // Se WebP falhou, tenta PNG
            console.warn(`[SPRITE] ⚠ WebP failed for ${spriteId}, trying PNG...`);
            this.tryPngFallback(spriteId, world, fileName, avatarElement);
        };

        imgWebP.src = pathWebP;
    }

    /**
     * Tenta carregar PNG se WebP falhou
     * @param {string} spriteId - ID do sprite
     * @param {string} world - Nome do mundo
     * @param {string} fileName - Nome do arquivo
     * @param {HTMLElement} avatarElement - Elemento .boss-avatar
     */
    tryPngFallback(spriteId, world, fileName, avatarElement) {
        const imgPng = new Image();
        const folder = world === 'guardian' ? 'guardian' : `${world}_world`;
        const pathPng = `assets/enemies/${folder}/${fileName}.png`;

        imgPng.onload = () => {
            this.loadedSprites.add(spriteId);
            console.log(`[SPRITE] ✓ Loaded PNG fallback: ${pathPng}`);
        };

        imgPng.onerror = () => {
            // Ambos falharam: marca como falho e remove sprite
            console.error(`[SPRITE] ✗ Both WebP and PNG failed for ${spriteId}`);
            this.failedSprites.add(spriteId);
            this.deactivateSprite(avatarElement);
        };

        imgPng.src = pathPng;
    }

    /**
     * Desativa o sprite e volta para emoji
     * @param {HTMLElement} avatarElement - Elemento .boss-avatar
     */
    deactivateSprite(avatarElement) {
        if (!avatarElement) return;

        avatarElement.classList.remove('boss-sprite');
        avatarElement.classList.add('sprite-error');
        avatarElement.removeAttribute('data-enemy-id');

        console.log('[SPRITE] → Fallback to emoji');
    }

    /**
     * Adiciona animação de dano quando boss é atingido
     * @param {HTMLElement} avatarElement - Elemento .boss-avatar
     */
    triggerDamageAnimation(avatarElement) {
        if (!avatarElement) return;

        avatarElement.classList.add('taking-damage');

        setTimeout(() => {
            avatarElement.classList.remove('taking-damage');
        }, 300);
    }

    /**
     * Limpa cache e estado
     */
    reset() {
        this.loadedSprites.clear();
        this.failedSprites.clear();
        this.spriteCache.clear();
        console.log('[SPRITE] System reset');
    }
}

// Exporta instância global
window.enemySpriteSystem = new EnemySpriteSystem();
