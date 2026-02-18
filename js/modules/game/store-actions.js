export function setupStoreListeners(game, deps = {}) {
    if (game._storeListenersBound) return;
    const storeProducts = deps.storeProducts || {};
    const runtimeLogs = Boolean(deps.runtimeLogs);
    const storeGrids = document.querySelectorAll('.store-grid');

    if (!storeGrids || storeGrids.length === 0) {
        console.warn('[STORE] .store-grid nao encontrado no DOM');
        return;
    }

    storeGrids.forEach((storeGrid) => {
        storeGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-buy');
            if (!btn || btn.hasAttribute('disabled')) return;

            e.preventDefault();
            e.stopPropagation();

            const unlockableId = btn.getAttribute('data-unlockable-id')
                || btn.closest('[data-unlockable-id]')?.getAttribute('data-unlockable-id');

            if (unlockableId) {
                game.handleUnlockableSelection(unlockableId);
                return;
            }

            const productId = btn.getAttribute('data-product-id');
            if (runtimeLogs) console.log('[STORE] Tentando comprar:', productId);

            if (productId && storeProducts[productId]) {
                if (game.audio) game.audio.playClick();
                game.showPurchaseModal(storeProducts[productId]);
            } else {
                console.error('[STORE] Produto nao encontrado:', productId, storeProducts);
            }
        });
    });

    game._storeListenersBound = true;
    if (runtimeLogs) console.log('[STORE] Event listeners configurados com event delegation');
}

export function setupStoreTabs(game) {
    if (game._storeTabsBound) return;
    const tabs = document.querySelectorAll('.store-tab');
    const categories = document.querySelectorAll('.store-category');

    if (!tabs || tabs.length === 0 || !categories || categories.length === 0) {
        console.warn('[STORE] Tabs/categorias nao encontrados');
        return;
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            if (!category) return;

            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            categories.forEach((panel) => {
                const isActive = panel.getAttribute('data-category') === category;
                panel.classList.toggle('active', isActive);
            });
        });
    });
    game._storeTabsBound = true;
}

export function showPurchaseModal(game, product, deps = {}) {
    const runtimeLogs = Boolean(deps.runtimeLogs);
    const modal = document.createElement('div');
    modal.className = 'store-modal active';

    const newBalance = game.crystals - product.price;
    const canAfford = game.crystals >= product.price;

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">${product.icon}</div>
            <h3 class="modal-title">${game.i18n.t('store.confirm_title')}</h3>
            <p class="modal-description">${game.i18n.t(product.descKeyModal || product.descKey || 'store.magnet_pack_desc')}</p>

            <div class="modal-price-info">
                <div class="modal-price-row">
                    <span class="modal-price-label">${game.i18n.t('store.price_label')}</span>
                    <span class="modal-price-value">\u{1F48E} ${product.price}</span>
                </div>
                <div class="modal-price-row">
                    <span class="modal-price-label">${game.i18n.t('store.balance_label')}</span>
                    <span class="modal-price-value">\u{1F48E} ${game.crystals}</span>
                </div>
                <div class="modal-price-row">
                    <span class="modal-price-label">${game.i18n.t('store.new_balance_label')}</span>
                    <span class="modal-price-value ${canAfford ? '' : 'text-danger'}">
                        \u{1F48E} ${canAfford ? newBalance : '---'}
                    </span>
                </div>
            </div>

            <div class="modal-buttons">
                <button class="modal-btn modal-btn-cancel">${game.i18n.t('store.btn_cancel')}</button>
                <button class="modal-btn modal-btn-confirm" ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? game.i18n.t('store.btn_confirm') : game.i18n.t('store.insufficient_funds')}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const btnCancel = modal.querySelector('.modal-btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            if (runtimeLogs) console.log('[STORE] Compra cancelada');
            if (game.audio) game.audio.playBack();
            modal.remove();
        });
    }

    const btnConfirm = modal.querySelector('.modal-btn-confirm');
    if (btnConfirm) {
        if (runtimeLogs) console.log('[STORE] Botao confirmar encontrado. canAfford:', canAfford);

        btnConfirm.addEventListener('click', (e) => {
            if (runtimeLogs) console.log('[STORE] Botao confirmar clicado');

            if (!canAfford) {
                console.warn('[STORE] Tentativa de compra sem saldo suficiente');
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (game.audio) game.audio.playClick();

            if (runtimeLogs) console.log('[STORE] Executando purchaseProduct...');
            const success = game.purchaseProduct(product);

            if (success) {
                if (runtimeLogs) console.log('[STORE] Compra bem-sucedida, fechando modal');
                modal.remove();
            } else {
                console.error('[STORE] Compra falhou, mantendo modal aberto');
            }
        });
    } else {
        console.error('[STORE] Botao confirmar nao encontrado no modal!');
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (game.audio) game.audio.playBack();
            modal.remove();
        }
    });
}

export function purchaseProduct(game, product, deps = {}) {
    const maxPowerupCount = deps.maxPowerupCount || 3;
    const runtimeLogs = Boolean(deps.runtimeLogs);
    const oldCrystals = game.crystals;
    const oldPowerUps = { ...game.powerUps };

    try {
        if (game.crystals < product.price) {
            game.showStoreToast(game.i18n.t('store.insufficient_crystals'), 'error');
            return false;
        }

        if (!product || !product.type) {
            throw new Error('Produto invalido');
        }

        if (product.type === 'powerup') {
            if (!product.powerupType) {
                throw new Error('Tipo de power-up nao especificado');
            }
            const currentCount = game.powerUps[product.powerupType] || 0;
            if (currentCount + product.quantity > maxPowerupCount) {
                game.showStoreToast(game.i18n.t('store.powerup_cap_reached'), 'error');
                return false;
            }
            game.powerUps[product.powerupType] = (game.powerUps[product.powerupType] || 0) + product.quantity;
        } else if (product.type === 'bundle') {
            if (!product.items || product.items.length === 0) {
                throw new Error('Bundle sem itens');
            }
            for (const item of product.items) {
                if (!item.powerupType) {
                    throw new Error('Item do bundle sem tipo');
                }
                const currentCount = game.powerUps[item.powerupType] || 0;
                if (currentCount + item.quantity > maxPowerupCount) {
                    game.showStoreToast(game.i18n.t('store.powerup_cap_reached'), 'error');
                    return false;
                }
            }
            product.items.forEach((item) => {
                if (!item.powerupType) {
                    throw new Error('Item do bundle sem tipo');
                }
                game.powerUps[item.powerupType] = (game.powerUps[item.powerupType] || 0) + item.quantity;
            });
        } else {
            throw new Error(`Tipo de produto desconhecido: ${product.type}`);
        }

        game.crystals -= product.price;
        localStorage.setItem('blocklands_crystals', game.crystals.toString());

        if (product.type === 'powerup') {
            localStorage.setItem(`blocklands_powerup_${product.powerupType}`, game.powerUps[product.powerupType].toString());
            if (runtimeLogs) console.log(`[STORE] Comprou ${product.quantity}x ${product.powerupType}. Total: ${game.powerUps[product.powerupType]}`);
        } else if (product.type === 'bundle') {
            product.items.forEach((item) => {
                localStorage.setItem(`blocklands_powerup_${item.powerupType}`, game.powerUps[item.powerupType].toString());
                if (runtimeLogs) console.log(`[STORE] Comprou ${item.quantity}x ${item.powerupType}. Total: ${game.powerUps[item.powerupType]}`);
            });
        }

        game.updateCrystalDisplay();

        if (game.powers && typeof game.powers.updateCounts === 'function') {
            game.powers.updateCounts(game.powerUps);
        }

        game.showStoreToast(`${product.icon} ${game.i18n.t('store.purchase_success')}`, 'success');
        if (game.audio) game.audio.playClick();

        if (game.achievements && typeof game.achievements.trackEvent === 'function') {
            try {
                game.achievements.trackEvent('store_purchase', { productId: product.id, price: product.price });
            } catch (e) {
                console.warn('[STORE] Erro ao trackear achievement:', e);
            }
        }

        if (runtimeLogs) console.log(`[STORE] COMPRA CONCLUIDA: ${product.id} | Cristais: ${oldCrystals} -> ${game.crystals}`);
        return true;
    } catch (error) {
        console.error('[STORE] ERRO em purchaseProduct:', error);
        if (runtimeLogs) console.warn('[STORE] Revertendo transacao...');

        game.crystals = oldCrystals;
        game.powerUps = oldPowerUps;

        localStorage.setItem('blocklands_crystals', game.crystals.toString());
        Object.keys(game.powerUps).forEach((key) => {
            localStorage.setItem(`blocklands_powerup_${key}`, game.powerUps[key].toString());
        });

        game.updateCrystalDisplay();

        if (game.powers && typeof game.powers.updateCounts === 'function') {
            game.powers.updateCounts(game.powerUps);
        }

        game.showStoreToast(game.i18n.t('store.purchase_error'), 'error');
        if (runtimeLogs) console.log(`[STORE] Rollback completo. Cristais restaurados: ${game.crystals}`);
        return false;
    }
}

export function showStoreToast(game, message, type = 'success') {
    const oldToast = document.querySelector('.store-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `store-toast ${type}`;

    const icon = type === 'success' ? '\u2713' : '\u26A0\uFE0F';

    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
