// js/app.js

import { Game } from './game.js';

const DIAG_STORAGE_KEY = 'blocklands_diag_events';
const DIAG_MAX_EVENTS = 60;

function saveDiagnosticEvent(type, payload = {}) {
    try {
        const now = Date.now();
        const raw = localStorage.getItem(DIAG_STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.push({ t: now, type, payload });
        while (list.length > DIAG_MAX_EVENTS) list.shift();
        localStorage.setItem(DIAG_STORAGE_KEY, JSON.stringify(list));
    } catch (_) {
        // Never break the game due to diagnostics.
    }
}

function setupDiagnostics() {
    window.addEventListener('error', (evt) => {
        saveDiagnosticEvent('error', {
            msg: evt.message || 'unknown',
            src: evt.filename || '',
            line: evt.lineno || 0,
            col: evt.colno || 0
        });
    });

    window.addEventListener('unhandledrejection', (evt) => {
        const reason = evt.reason;
        const message = (reason && reason.message) ? reason.message : String(reason || 'unknown');
        saveDiagnosticEvent('unhandledrejection', { msg: message });
    });
}

function setupReducedMotionClass() {
    const app = document.getElementById('app');
    if (!app || !window.matchMedia) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => app.classList.toggle('reduced-motion', !!media.matches);
    apply();

    if (typeof media.addEventListener === 'function') media.addEventListener('change', apply);
    else if (typeof media.addListener === 'function') media.addListener(apply);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((reg) => console.log('SW registrado', reg))
            .catch((err) => console.log('SW falhou', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupDiagnostics();
    setupReducedMotionClass();

    try {
        const game = new Game();
        window.gameInstance = game;
    } catch (err) {
        saveDiagnosticEvent('startup_crash', { msg: err?.message || String(err) });

        const fallback = document.createElement('div');
        fallback.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:#0f172a;color:#e2e8f0;font-family:sans-serif;text-align:center;z-index:9999;';
        fallback.innerHTML = '<div><h2 style="margin:0 0 8px 0;">Falha ao iniciar o jogo</h2><p style="margin:0;opacity:.9;">Reinicie o app. Se persistir, reinstale para limpar cache.</p></div>';
        document.body.appendChild(fallback);
    }
});
