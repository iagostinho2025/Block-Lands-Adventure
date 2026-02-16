// js/modules/data/levels.js

// --- OBSTÁCULOS COMUNS ---
const LAVA = { type: 'LAVA', key: 'volcano', emoji: '\u{1F30B}' };
const THORNS = { type: 'OBSTACLE', key: 'thorns', emoji: '\u{1F33F}' }; // Espinhos da Floresta
const ROCKS = { type: 'OBSTACLE', key: 'rocks', emoji: '\u{1FAA8}' }; // Rochas da Montanha
const QUICKSAND = { type: 'OBSTACLE', key: 'quicksand', emoji: '\u{1F3DC}\u{FE0F}' }; // Areia Movedi?a do Deserto
const SHADOWS = { type: 'OBSTACLE', key: 'shadows', emoji: '\u{1F311}' }; // Sombras do Castelo

// Helpers para posiÃ§Ãµes do Grid (Gameplay)
const CORNERS = [{r:0,c:0}, {r:0,c:7}, {r:7,c:0}, {r:7,c:7}];
const CORNERS_OPPOSITE = [{r:0,c:0}, {r:7,c:7}]; 

export const WORLDS = [
    // =========================================================================
    // MUNDO 0: O PORTÃƒO (TUTORIAL)
    // =========================================================================
    {
        id: 'tutorial_world',
        name: 'O Portao',
        emoji: '\u{26E9}\u{FE0F}',
        gradient: 'linear-gradient(135deg, #475569, #0f172a)', // Cinza Azulado
        totalLevels: 1,
        bossName: 'Guardiao',
        bossAvatar: '\u{1F5FF}',
        bgImage: '', // Opcional
        
        // POSIÃ‡ÃƒO DA ILHA NO MAPA DE MUNDOS (0-100%)
        worldPos: { x: 29, y: 87 }, // LÃ¡ embaixo, na entrada
        worldSize: 140,
        
        levels: [
            { 
                id: 0, 
                type: 'boss', 
                boss: { id: 'guardian', name: 'AEGON', emoji: '\u{1F5FF}', maxHp: 15 },
                musicId: 'boss_theme', // MÃºsica genÃ©rica para o tutorial
                items: ['amulet', 'dagger', 'ancient_key'], 
                gridConfig: [], 
                mapPos: { x: 50, y: 50 } 
            }
        ]
    },

    // =========================================================================
    // MUNDO 1: TERRA DO FOGO (Fases 1-20)
    // =========================================================================
    {
        id: 'fire_world',
        name: 'Terra do Fogo',
        emoji: '\u{1F30B}',
        gradient: 'linear-gradient(135deg, #b91c1c, #d97706)', // Vermelho/Laranja
        totalLevels: 20,
        bossName: 'Ignis',
        bossAvatar: '\u{1F409}',
        themeClass: 'theme-fire',
        bgImage: 'assets/img/map_fire.webp', 
        
        worldPos: { x: 72, y: 75 },
        worldSize: 184,

        levels: [
            // FASE 1
            { id: 1, type: 'normal', goals: { fire: 5 }, items: ['fire'], gridConfig: [], mapPos: { x: 76, y: 89 } },
            // FASE 2
            { id: 2, type: 'normal', goals: { fire: 8 }, items: ['fire'], gridConfig: [], mapPos: { x: 67, y: 81 } },
            // FASE 3
            { id: 3, type: 'normal', goals: { fire: 12 }, items: ['fire'], gridConfig: [], mapPos: { x: 43, y: 81 } },
            // FASE 4
            { id: 4, type: 'normal', goals: { heart: 8 }, items: ['heart'], gridConfig: [{r:0,c:0, ...LAVA}], mapPos: { x: 36, y: 73 } },
            // FASE 5
            { id: 5, type: 'normal', goals: { heart: 12 }, items: ['heart'], gridConfig: [{r:0,c:7, ...LAVA}], mapPos: { x: 17, y: 70 } },
            // FASE 6
            { id: 6, type: 'normal', goals: { fire: 8, heart: 5 }, items: ['fire', 'heart'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...LAVA}))], mapPos: { x: 26, y: 63 } },
            // FASE 7
            { id: 7, type: 'normal', goals: { fire: 15 }, items: ['fire'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...LAVA}))], mapPos: { x: 39, y: 59 } },
            // FASE 8
            { id: 8, type: 'normal', goals: { collision: 10 }, items: ['collision'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...LAVA}))], mapPos: { x: 51, y: 56 } },
            // FASE 9
            { id: 9, type: 'normal', goals: { fire: 5, heart: 5, collision: 5 }, items: ['fire', 'heart', 'collision'], gridConfig: [{r:0,c:0, ...LAVA}, {r:7,c:7, ...LAVA}, {r:3,c:3, ...LAVA}], mapPos: { x: 62, y: 53 } },
            
            // FASE 10: ELITE MAGMOR (MÃºsica Elite 1)
            { 
                id: 10, type: 'boss', 
                boss: { id: 'magmor', name: 'Magmor', emoji: '\u{1F47A}', maxHp: 25 },
                musicId: 'bgm_fire_10', // <--- MÃšSICA TEMA 1
                items: ['fire', 'heart'], 
                gridConfig: [{r:0,c:0, ...LAVA}, {r:0,c:7, ...LAVA}, {r:3,c:3, ...LAVA}],
                mapPos: { x: 74, y: 48 }
            },

            // FASES 11-14
            { id: 11, type: 'normal', goals: { fire: 18 }, items: ['fire'], gridConfig: [...CORNERS.map(p => ({...p, ...LAVA}))], mapPos: { x: 62, y: 44 } },
            { id: 12, type: 'normal', goals: { heart: 10, collision: 10 }, items: ['heart', 'collision'], gridConfig: [...CORNERS.map(p => ({...p, ...LAVA}))], mapPos: { x: 51, y: 42 } },
            { id: 13, type: 'normal', goals: { fire: 12 }, items: ['fire'], gridConfig: [...CORNERS.map(p => ({...p, ...LAVA}))], mapPos: { x: 41, y: 40 } },
            { id: 14, type: 'normal', goals: { fire: 10, heart: 10 }, items: ['fire', 'heart'], gridConfig: [...CORNERS.map(p => ({...p, ...LAVA}))], mapPos: { x: 32, y: 36 } },
            
            // FASE 15: ELITE FÃŠNIX INFERNAL (MÃºsica Elite 2)
            { 
                id: 15, type: 'boss', 
                boss: { id: 'pyra', name: 'PYRA', emoji: '\u{1F985}', maxHp: 35 },
                musicId: 'bgm_fire_15', // <--- MÃšSICA TEMA 2
                items: ['fire', 'heart', 'collision'],
                gridConfig: [...CORNERS.map(p => ({...p, ...LAVA}))],
                mapPos: { x: 44, y: 32 }
            },

            // FASES 16-19
            { id: 16, type: 'normal', goals: { fire: 8, heart: 8, collision: 5 }, items: ['fire', 'heart', 'collision'], gridConfig: [...CORNERS.map(p => ({...p, ...LAVA})), {r:3,c:3, ...LAVA}], mapPos: { x: 56, y: 30 } },
            { id: 17, type: 'normal', goals: { heart: 20 }, items: ['heart'], gridConfig: [...CORNERS.map(p => ({...p, ...LAVA})), {r:4,c:4, ...LAVA}], mapPos: { x: 64, y: 26 } },
            { id: 18, type: 'normal', goals: { fire: 12, collision: 12 }, items: ['fire', 'collision'], gridConfig: [{r:2,c:2, ...LAVA}, {r:2,c:3, ...LAVA}, {r:2,c:4, ...LAVA}, {r:5,c:2, ...LAVA}, {r:5,c:3, ...LAVA}, {r:5,c:4, ...LAVA}], mapPos: { x: 52, y: 24 } },
            { id: 19, type: 'normal', goals: { collision: 25 }, items: ['collision'], gridConfig: [{r:2,c:2, ...LAVA}, {r:2,c:3, ...LAVA}, {r:2,c:4, ...LAVA}, {r:5,c:2, ...LAVA}, {r:5,c:3, ...LAVA}, {r:5,c:4, ...LAVA}], mapPos: { x: 43, y: 21 } },

            // FASE 20: BOSS FINAL IGNIS (MÃºsica Boss)
            { 
                id: 20, type: 'boss', 
                boss: { id: 'ignis', name: 'Ignis', emoji: '\u{1F409}', maxHp: 50 },
                musicId: 'bgm_fire_20', // <--- MÃšSICA BOSS FINAL
                items: ['fire', 'heart', 'collision'],
                gridConfig: [
                    {r:0,c:2},{r:0,c:3},{r:0,c:4},{r:0,c:5},
                    {r:7,c:2},{r:7,c:3},{r:7,c:4},{r:7,c:5},
                    {r:2,c:0},{r:5,c:0},{r:2,c:7},{r:5,c:7}
                ].map(p => ({...p, ...LAVA})),
                mapPos: { x: 52, y: 15 }
            }
        ]
    },

    // =========================================================================
    // MUNDO 2: FLORESTA NEGRA (Fases 21-40)
    // =========================================================================
    {
        id: 'forest_world',
        name: 'Floresta Negra',
        emoji: '\u{1F332}',
        gradient: 'linear-gradient(135deg, #14532d, #581c87)',
        totalLevels: 20,
        bossName: 'Sylvaris',
        bossAvatar: '\u{1F333}',
        themeClass: 'theme-forest',
        bgImage: 'assets/img/map_forest.webp',

        worldPos: { x: 31, y: 57 },
        worldSize: 200,

        levels: [
            // FASE 21
            { id: 21, type: 'normal', goals: { leaf: 8 }, items: ['leaf'], gridConfig: [], mapPos: { x: 36, y: 91 } },
            // FASE 22
            { id: 22, type: 'normal', goals: { leaf: 12 }, items: ['leaf'], gridConfig: [], mapPos: { x: 21, y: 87 } },
            // FASE 23
            { id: 23, type: 'normal', goals: { leaf: 15 }, items: ['leaf'], gridConfig: [], mapPos: { x: 28, y: 79 } },
            // FASE 24
            { id: 24, type: 'normal', goals: { poison: 5 }, items: ['poison'], gridConfig: [{r:0,c:0, ...THORNS}], mapPos: { x: 44, y: 77 } },
            // FASE 25
            { id: 25, type: 'normal', goals: { poison: 8 }, items: ['poison'], gridConfig: [{r:0,c:7, ...THORNS}], mapPos: { x: 62, y: 76 } },
            // FASE 26
            { id: 26, type: 'normal', goals: { leaf: 10, poison: 6 }, items: ['leaf', 'poison'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...THORNS}))], mapPos: { x: 54, y: 69 } },
            // FASE 27
            { id: 27, type: 'normal', goals: { leaf: 18 }, items: ['leaf'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...THORNS}))], mapPos: { x: 39, y: 68 } },
            // FASE 28
            { id: 28, type: 'normal', goals: { mushroom: 8 }, items: ['mushroom'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...THORNS}))], mapPos: { x: 25, y: 65 } },
            // FASE 29
            { id: 29, type: 'normal', goals: { leaf: 8, poison: 6, mushroom: 6 }, items: ['leaf', 'poison', 'mushroom'], gridConfig: [{r:0,c:0, ...THORNS}, {r:7,c:7, ...THORNS}, {r:3,c:3, ...THORNS}], mapPos: { x: 25, y: 57 } },

            // FASE 30: ELITE LOBO ALFA (MÃºsica Elite 1)
            {
                id: 30, type: 'boss',
                boss: { id: 'wolf_alpha', name: 'Fenrir', emoji: '\u{1F43A}', maxHp: 35 },
                musicId: 'bgm_forest_10',
                items: ['leaf', 'poison'],
                gridConfig: [{r:0,c:0, ...THORNS}, {r:0,c:7, ...THORNS}, {r:3,c:3, ...THORNS}],
                mapPos: { x: 41, y: 55 }
            },

            // FASES 31-34
            { id: 31, type: 'normal', goals: { leaf: 20 }, items: ['leaf'], gridConfig: [...CORNERS.map(p => ({...p, ...THORNS}))], mapPos: { x: 58, y: 54 } },
            { id: 32, type: 'normal', goals: { poison: 12, mushroom: 10 }, items: ['poison', 'mushroom'], gridConfig: [...CORNERS.map(p => ({...p, ...THORNS}))], mapPos: { x: 72, y: 52 } },
            { id: 33, type: 'normal', goals: { leaf: 15 }, items: ['leaf'], gridConfig: [...CORNERS.map(p => ({...p, ...THORNS}))], mapPos: { x: 83, y: 48 } },
            { id: 34, type: 'normal', goals: { poison: 10, leaf: 12 }, items: ['poison', 'leaf'], gridConfig: [...CORNERS.map(p => ({...p, ...THORNS}))], mapPos: { x: 81, y: 41 } },

            // FASE 35: ELITE ARACNA (MÃºsica Elite 2)
            {
                id: 35, type: 'boss',
                boss: { id: 'aracna', name: 'Aracna', emoji: '\u{1F577}\u{FE0F}', maxHp: 45 },
                musicId: 'bgm_forest_15',
                items: ['leaf', 'poison', 'mushroom'],
                gridConfig: [...CORNERS.map(p => ({...p, ...THORNS}))],
                mapPos: { x: 67, y: 39 }
            },

            // FASES 36-39
            { id: 36, type: 'normal', goals: { leaf: 10, poison: 10, mushroom: 8 }, items: ['leaf', 'poison', 'mushroom'], gridConfig: [...CORNERS.map(p => ({...p, ...THORNS})), {r:3,c:3, ...THORNS}], mapPos: { x: 53, y: 38 } },
            { id: 37, type: 'normal', goals: { poison: 25 }, items: ['poison'], gridConfig: [...CORNERS.map(p => ({...p, ...THORNS})), {r:4,c:4, ...THORNS}], mapPos: { x: 40, y: 37 } },
            { id: 38, type: 'normal', goals: { leaf: 15, mushroom: 15 }, items: ['leaf', 'mushroom'], gridConfig: [{r:2,c:2, ...THORNS}, {r:2,c:3, ...THORNS}, {r:2,c:4, ...THORNS}, {r:5,c:2, ...THORNS}, {r:5,c:3, ...THORNS}, {r:5,c:4, ...THORNS}], mapPos: { x: 28, y: 34 } },
            { id: 39, type: 'normal', goals: { mushroom: 30 }, items: ['mushroom'], gridConfig: [{r:2,c:2, ...THORNS}, {r:2,c:3, ...THORNS}, {r:2,c:4, ...THORNS}, {r:5,c:2, ...THORNS}, {r:5,c:3, ...THORNS}, {r:5,c:4, ...THORNS}], mapPos: { x: 33, y: 27 } },

            // FASE 40: BOSS FINAL SYLVARIS (MÃºsica Boss)
            {
                id: 40, type: 'boss',
                boss: { id: 'ent_ancient', name: 'Sylvaris', emoji: '\u{1F333}', maxHp: 60 },
                musicId: 'bgm_forest_20',
                items: ['leaf', 'poison', 'mushroom'],
                gridConfig: [
                    {r:0,c:2},{r:0,c:3},{r:0,c:4},{r:0,c:5},
                    {r:7,c:2},{r:7,c:3},{r:7,c:4},{r:7,c:5},
                    {r:2,c:0},{r:5,c:0},{r:2,c:7},{r:5,c:7}
                ].map(p => ({...p, ...THORNS})),
                mapPos: { x: 53, y: 17 }
            }
        ]
    },

    // =========================================================================
    // MUNDO 3: MONTANHA DE FERRO (Fases 41-60)
    // =========================================================================
    {
        id: 'mountain_world',
        name: 'Montanha de Ferro',
        emoji: '\u{1F3D4}\u{FE0F}',
        gradient: 'linear-gradient(135deg, #57534e, #ca8a04)',
        totalLevels: 20,
        bossName: 'Golem Rei',
        bossAvatar: '\u{1F916}',
        themeClass: 'theme-mountain',
        bgImage: 'assets/img/map_mountain.webp',

        worldPos: { x: 72, y: 41 },
        worldSize: 180,

        levels: [
            // FASE 41
            { id: 41, type: 'normal', goals: { gold: 10 }, items: ['gold'], gridConfig: [], mapPos: { x: 36, y: 91 } },
            // FASE 42
            { id: 42, type: 'normal', goals: { gold: 15 }, items: ['gold'], gridConfig: [], mapPos: { x: 21, y: 87 } },
            // FASE 43
            { id: 43, type: 'normal', goals: { gold: 20 }, items: ['gold'], gridConfig: [], mapPos: { x: 28, y: 79 } },
            // FASE 44
            { id: 44, type: 'normal', goals: { pickaxe: 6 }, items: ['pickaxe'], gridConfig: [{r:0,c:0, ...ROCKS}], mapPos: { x: 44, y: 77 } },
            // FASE 45
            { id: 45, type: 'normal', goals: { pickaxe: 10 }, items: ['pickaxe'], gridConfig: [{r:0,c:7, ...ROCKS}], mapPos: { x: 62, y: 76 } },
            // FASE 46
            { id: 46, type: 'normal', goals: { gold: 12, pickaxe: 8 }, items: ['gold', 'pickaxe'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...ROCKS}))], mapPos: { x: 54, y: 69 } },
            // FASE 47
            { id: 47, type: 'normal', goals: { gold: 25 }, items: ['gold'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...ROCKS}))], mapPos: { x: 39, y: 68 } },
            // FASE 48
            { id: 48, type: 'normal', goals: { iron: 10 }, items: ['iron'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...ROCKS}))], mapPos: { x: 25, y: 65 } },
            // FASE 49
            { id: 49, type: 'normal', goals: { gold: 10, pickaxe: 8, iron: 8 }, items: ['gold', 'pickaxe', 'iron'], gridConfig: [{r:0,c:0, ...ROCKS}, {r:7,c:7, ...ROCKS}, {r:3,c:3, ...ROCKS}], mapPos: { x: 25, y: 57 } },

            // FASE 50: ELITE TROLL (MÃºsica Elite 1)
            {
                id: 50, type: 'boss',
                boss: { id: 'troll', name: 'Brakkar', emoji: '\u{1F479}', maxHp: 50 },
                musicId: 'bgm_mountain_10',
                items: ['gold', 'pickaxe'],
                gridConfig: [{r:0,c:0, ...ROCKS}, {r:0,c:7, ...ROCKS}, {r:3,c:3, ...ROCKS}],
                mapPos: { x: 41, y: 55 }
            },

            // FASES 51-54
            { id: 51, type: 'normal', goals: { gold: 28 }, items: ['gold'], gridConfig: [...CORNERS.map(p => ({...p, ...ROCKS}))], mapPos: { x: 58, y: 54 } },
            { id: 52, type: 'normal', goals: { pickaxe: 15, iron: 12 }, items: ['pickaxe', 'iron'], gridConfig: [...CORNERS.map(p => ({...p, ...ROCKS}))], mapPos: { x: 72, y: 52 } },
            { id: 53, type: 'normal', goals: { gold: 20 }, items: ['gold'], gridConfig: [...CORNERS.map(p => ({...p, ...ROCKS}))], mapPos: { x: 83, y: 48 } },
            { id: 54, type: 'normal', goals: { pickaxe: 12, gold: 15 }, items: ['pickaxe', 'gold'], gridConfig: [...CORNERS.map(p => ({...p, ...ROCKS}))], mapPos: { x: 81, y: 41 } },

            // FASE 55: ELITE GIGANTE (MÃºsica Elite 2)
            {
                id: 55, type: 'boss',
                boss: { id: 'giant', name: 'Kolgar', emoji: '\u{1F5FF}', maxHp: 65 },
                musicId: 'bgm_mountain_15',
                items: ['gold', 'pickaxe', 'iron'],
                gridConfig: [...CORNERS.map(p => ({...p, ...ROCKS}))],
                mapPos: { x: 67, y: 39 }
            },

            // FASES 56-59
            { id: 56, type: 'normal', goals: { gold: 12, pickaxe: 12, iron: 10 }, items: ['gold', 'pickaxe', 'iron'], gridConfig: [...CORNERS.map(p => ({...p, ...ROCKS})), {r:3,c:3, ...ROCKS}], mapPos: { x: 53, y: 38 } },
            { id: 57, type: 'normal', goals: { pickaxe: 30 }, items: ['pickaxe'], gridConfig: [...CORNERS.map(p => ({...p, ...ROCKS})), {r:4,c:4, ...ROCKS}], mapPos: { x: 40, y: 37 } },
            { id: 58, type: 'normal', goals: { gold: 18, iron: 18 }, items: ['gold', 'iron'], gridConfig: [{r:2,c:2, ...ROCKS}, {r:2,c:3, ...ROCKS}, {r:2,c:4, ...ROCKS}, {r:5,c:2, ...ROCKS}, {r:5,c:3, ...ROCKS}, {r:5,c:4, ...ROCKS}], mapPos: { x: 28, y: 34 } },
            { id: 59, type: 'normal', goals: { iron: 35 }, items: ['iron'], gridConfig: [{r:2,c:2, ...ROCKS}, {r:2,c:3, ...ROCKS}, {r:2,c:4, ...ROCKS}, {r:5,c:2, ...ROCKS}, {r:5,c:3, ...ROCKS}, {r:5,c:4, ...ROCKS}], mapPos: { x: 33, y: 27 } },

            // FASE 60: BOSS FINAL GOLEM REI (MÃºsica Boss)
            {
                id: 60, type: 'boss',
                boss: { id: 'golem_king', name: 'Dravok', emoji: '\u{1F916}', maxHp: 80 },
                musicId: 'bgm_mountain_20',
                items: ['gold', 'pickaxe', 'iron'],
                gridConfig: [
                    {r:0,c:2},{r:0,c:3},{r:0,c:4},{r:0,c:5},
                    {r:7,c:2},{r:7,c:3},{r:7,c:4},{r:7,c:5},
                    {r:2,c:0},{r:5,c:0},{r:2,c:7},{r:5,c:7}
                ].map(p => ({...p, ...ROCKS})),
                mapPos: { x: 53, y: 17 }
            }
        ]
    },

    // =========================================================================
    // MUNDO 4: DESERTO DA MORTE (Fases 61-80)
    // =========================================================================
    {
        id: 'desert_world',
        name: 'Deserto da Morte',
        emoji: '\u{1F3DC}\u{FE0F}',
        gradient: 'linear-gradient(135deg, #78350f, #9a3412)',
        totalLevels: 20,
        bossName: 'Warlord Grok',
        bossAvatar: '\u{1F479}',
        themeClass: 'theme-desert',
        bgImage: 'assets/img/map_desert.webp',

        worldPos: { x: 30, y: 31 },
        worldSize: 185,

        levels: [
            // FASE 61
            { id: 61, type: 'normal', goals: { bone: 12 }, items: ['bone'], gridConfig: [], mapPos: { x: 36, y: 91 } },
            // FASE 62
            { id: 62, type: 'normal', goals: { bone: 18 }, items: ['bone'], gridConfig: [], mapPos: { x: 21, y: 87 } },
            // FASE 63
            { id: 63, type: 'normal', goals: { bone: 25 }, items: ['bone'], gridConfig: [], mapPos: { x: 28, y: 79 } },
            // FASE 64
            { id: 64, type: 'normal', goals: { sand: 8 }, items: ['sand'], gridConfig: [{r:0,c:0, ...QUICKSAND}], mapPos: { x: 44, y: 77 } },
            // FASE 65
            { id: 65, type: 'normal', goals: { sand: 12 }, items: ['sand'], gridConfig: [{r:0,c:7, ...QUICKSAND}], mapPos: { x: 62, y: 76 } },
            // FASE 66
            { id: 66, type: 'normal', goals: { bone: 15, sand: 10 }, items: ['bone', 'sand'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...QUICKSAND}))], mapPos: { x: 54, y: 69 } },
            // FASE 67
            { id: 67, type: 'normal', goals: { bone: 30 }, items: ['bone'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...QUICKSAND}))], mapPos: { x: 39, y: 68 } },
            // FASE 68
            { id: 68, type: 'normal', goals: { skull: 12 }, items: ['skull'], gridConfig: [...CORNERS_OPPOSITE.map(p => ({...p, ...QUICKSAND}))], mapPos: { x: 25, y: 65 } },
            // FASE 69
            { id: 69, type: 'normal', goals: { bone: 12, sand: 10, skull: 10 }, items: ['bone', 'sand', 'skull'], gridConfig: [{r:0,c:0, ...QUICKSAND}, {r:7,c:7, ...QUICKSAND}, {r:3,c:3, ...QUICKSAND}], mapPos: { x: 25, y: 57 } },

            // FASE 70: ELITE MÃšMIA (MÃºsica Elite 1)
            {
                id: 70, type: 'boss',
                boss: { id: 'mummy', name: 'Zahur', emoji: '\u{1F9DF}', maxHp: 70 },
                musicId: 'bgm_desert_10',
                items: ['bone', 'sand'],
                gridConfig: [{r:0,c:0, ...QUICKSAND}, {r:0,c:7, ...QUICKSAND}, {r:3,c:3, ...QUICKSAND}],
                mapPos: { x: 41, y: 55 }
            },

            // FASES 71-74
            { id: 71, type: 'normal', goals: { bone: 35 }, items: ['bone'], gridConfig: [...CORNERS.map(p => ({...p, ...QUICKSAND}))], mapPos: { x: 58, y: 54 } },
            { id: 72, type: 'normal', goals: { sand: 18, skull: 15 }, items: ['sand', 'skull'], gridConfig: [...CORNERS.map(p => ({...p, ...QUICKSAND}))], mapPos: { x: 72, y: 52 } },
            { id: 73, type: 'normal', goals: { bone: 25 }, items: ['bone'], gridConfig: [...CORNERS.map(p => ({...p, ...QUICKSAND}))], mapPos: { x: 83, y: 48 } },
            { id: 74, type: 'normal', goals: { sand: 15, bone: 18 }, items: ['sand', 'bone'], gridConfig: [...CORNERS.map(p => ({...p, ...QUICKSAND}))], mapPos: { x: 81, y: 41 } },

            // FASE 75: ELITE ESCORPIÃƒO (MÃºsica Elite 2)
            {
                id: 75, type: 'boss',
                boss: { id: 'zahrek', name: 'Zahrek', emoji: '\u{1F9D9}\u{200D}\u{2642}\u{FE0F}', maxHp: 85 },
                musicId: 'bgm_desert_15',
                items: ['bone', 'sand', 'skull'],
                gridConfig: [...CORNERS.map(p => ({...p, ...QUICKSAND}))],
                mapPos: { x: 67, y: 39 }
            },

            // FASES 76-79
            { id: 76, type: 'normal', goals: { bone: 15, sand: 15, skull: 12 }, items: ['bone', 'sand', 'skull'], gridConfig: [...CORNERS.map(p => ({...p, ...QUICKSAND})), {r:3,c:3, ...QUICKSAND}], mapPos: { x: 53, y: 38 } },
            { id: 77, type: 'normal', goals: { sand: 35 }, items: ['sand'], gridConfig: [...CORNERS.map(p => ({...p, ...QUICKSAND})), {r:4,c:4, ...QUICKSAND}], mapPos: { x: 40, y: 37 } },
            { id: 78, type: 'normal', goals: { bone: 22, skull: 22 }, items: ['bone', 'skull'], gridConfig: [{r:2,c:2, ...QUICKSAND}, {r:2,c:3, ...QUICKSAND}, {r:2,c:4, ...QUICKSAND}, {r:5,c:2, ...QUICKSAND}, {r:5,c:3, ...QUICKSAND}, {r:5,c:4, ...QUICKSAND}], mapPos: { x: 28, y: 34 } },
            { id: 79, type: 'normal', goals: { skull: 40 }, items: ['skull'], gridConfig: [{r:2,c:2, ...QUICKSAND}, {r:2,c:3, ...QUICKSAND}, {r:2,c:4, ...QUICKSAND}, {r:5,c:2, ...QUICKSAND}, {r:5,c:3, ...QUICKSAND}, {r:5,c:4, ...QUICKSAND}], mapPos: { x: 33, y: 27 } },

            // FASE 80: BOSS FINAL WARLORD GROK (MÃºsica Boss)
            {
                id: 80, type: 'boss',
                boss: { id: 'warlord_grok', name: 'Azrakar', emoji: '\u{1F479}', maxHp: 100 },
                musicId: 'bgm_desert_20',
                items: ['bone', 'sand', 'skull'],
                gridConfig: [
                    {r:0,c:2},{r:0,c:3},{r:0,c:4},{r:0,c:5},
                    {r:7,c:2},{r:7,c:3},{r:7,c:4},{r:7,c:5},
                    {r:2,c:0},{r:5,c:0},{r:2,c:7},{r:5,c:7}
                ].map(p => ({...p, ...QUICKSAND})),
                mapPos: { x: 53, y: 17 }
            }
        ]
    },

    // =========================================================================
    // MUNDO 5: CASTELO SOMBRIO (Fases 81-100)
    // =========================================================================
    {
        id: 'castle_world',
        name: 'Castelo Sombrio',
        emoji: '\u{1F3F0}',
        gradient: 'linear-gradient(135deg, #020617, #7f1d1d)',
        totalLevels: 20,
        bossName: 'Mago Negro',
        bossAvatar: '\u{1F9D9}\u{200D}\u{2642}\u{FE0F}',
        bgImage: 'assets/img/map_castle.webp',

        worldPos: { x: 77, y: 15 },
        worldSize: 138,

        levels: [
            // Fase 81 - IntroduÃ§Ã£o ao Castelo (Magia comum)
            { id: 81, type: 'normal', goals: { magic: 15 }, items: ['magic'], gridConfig: [], mapPos: { x: 36, y: 91 } },

            // Fase 82 - Primeiras Sombras
            { id: 82, type: 'normal', goals: { magic: 18 }, items: ['magic'], gridConfig: [{r:3,c:3, ...SHADOWS}], mapPos: { x: 21, y: 87 } },

            // Fase 83 - Aumenta dificuldade (Magia + CrÃ¢nio)
            { id: 83, type: 'normal', goals: { magic: 12, skull: 8 }, items: ['magic', 'skull'], gridConfig: [{r:0,c:0, ...SHADOWS}, {r:7,c:7, ...SHADOWS}], mapPos: { x: 28, y: 79 } },

            // Fase 84 - Sombras nos Cantos
            { id: 84, type: 'normal', goals: { magic: 15, skull: 10 }, items: ['magic', 'skull'],
                gridConfig: CORNERS.map(pos => ({...pos, ...SHADOWS})), mapPos: { x: 44, y: 77 } },

            // Fase 85 - Introduz Cristal Negro (Ã‰pico)
            { id: 85, type: 'normal', goals: { magic: 10, skull: 8, crystal: 5 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:3}, {r:0,c:4}, {r:7,c:3}, {r:7,c:4}].map(pos => ({...pos, ...SHADOWS})), mapPos: { x: 62, y: 76 } },

            // Fase 86 - PadrÃ£o em Cruz
            { id: 86, type: 'normal', goals: { magic: 12, skull: 10, crystal: 6 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:3}, {r:0,c:4}, {r:3,c:0}, {r:4,c:0}, {r:3,c:7}, {r:4,c:7}, {r:7,c:3}, {r:7,c:4}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 54, y: 69 } },

            // Fase 87 - Densidade Alta
            { id: 87, type: 'normal', goals: { magic: 15, skull: 12, crystal: 8 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:7}, {r:7,c:0}, {r:7,c:7}, {r:2,c:2}, {r:2,c:5}, {r:5,c:2}, {r:5,c:5}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 39, y: 68 } },

            // Fase 88 - PreparaÃ§Ã£o para Elite
            { id: 88, type: 'normal', goals: { magic: 18, skull: 15, crystal: 10 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:1}, {r:0,c:6}, {r:1,c:0}, {r:1,c:7}, {r:6,c:0}, {r:6,c:7}, {r:7,c:1}, {r:7,c:6}, {r:3,c:3}, {r:4,c:4}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 25, y: 65 } },

            // Fase 89 - Ãšltima antes do Elite 1
            { id: 89, type: 'normal', goals: { magic: 20, skull: 18, crystal: 12 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:3}, {r:0,c:4}, {r:0,c:7}, {r:3,c:0}, {r:3,c:7}, {r:4,c:0}, {r:4,c:7}, {r:7,c:0}, {r:7,c:3}, {r:7,c:4}, {r:7,c:7}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 25, y: 57 } },

            // FASE 90 - ELITE 1: GÃRGULA
            { id: 90, type: 'boss', boss: { id: 'gargoyle', name: 'VEXARA', emoji: '\u{1F987}', maxHp: 100 }, musicId: 'bgm_castle_10',
                goals: { magic: 25, skull: 20 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:7}, {r:7,c:0}, {r:7,c:7}, {r:1,c:3}, {r:1,c:4}, {r:6,c:3}, {r:6,c:4}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 41, y: 55 } },

            // Fase 91 - PÃ³s Elite 1
            { id: 91, type: 'normal', goals: { magic: 22, skull: 20, crystal: 15 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:2}, {r:0,c:5}, {r:2,c:0}, {r:2,c:7}, {r:5,c:0}, {r:5,c:7}, {r:7,c:2}, {r:7,c:5}, {r:3,c:3}, {r:4,c:4}, {r:3,c:4}, {r:4,c:3}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 58, y: 54 } },

            // Fase 92 - Complexidade Crescente
            { id: 92, type: 'normal', goals: { magic: 25, skull: 22, crystal: 18 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:1}, {r:0,c:6}, {r:0,c:7}, {r:1,c:0}, {r:1,c:7}, {r:6,c:0}, {r:6,c:7}, {r:7,c:0}, {r:7,c:1}, {r:7,c:6}, {r:7,c:7}, {r:3,c:3}, {r:4,c:4}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 72, y: 52 } },

            // Fase 93 - PadrÃ£o Diagonal
            { id: 93, type: 'normal', goals: { magic: 28, skull: 25, crystal: 20 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:1,c:1}, {r:2,c:2}, {r:5,c:5}, {r:6,c:6}, {r:7,c:7}, {r:0,c:7}, {r:1,c:6}, {r:2,c:5}, {r:5,c:2}, {r:6,c:1}, {r:7,c:0}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 83, y: 48 } },

            // Fase 94 - Ãšltima antes do Elite 2
            { id: 94, type: 'normal', goals: { magic: 30, skull: 28, crystal: 22 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:3}, {r:0,c:4}, {r:0,c:7}, {r:1,c:1}, {r:1,c:6}, {r:3,c:0}, {r:3,c:7}, {r:4,c:0}, {r:4,c:7}, {r:6,c:1}, {r:6,c:6}, {r:7,c:0}, {r:7,c:3}, {r:7,c:4}, {r:7,c:7}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 81, y: 41 } },

            // FASE 95 - ELITE 2: CAVALEIRO SOMBRIO
            { id: 95, type: 'boss', boss: { id: 'knight', name: 'Darius', emoji: '\u{1F6E1}\u{FE0F}', maxHp: 120 }, musicId: 'bgm_castle_15',
                goals: { magic: 35, skull: 30, crystal: 25 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:1}, {r:0,c:6}, {r:0,c:7}, {r:1,c:0}, {r:1,c:7}, {r:2,c:2}, {r:2,c:5}, {r:5,c:2}, {r:5,c:5}, {r:6,c:0}, {r:6,c:7}, {r:7,c:0}, {r:7,c:1}, {r:7,c:6}, {r:7,c:7}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 67, y: 39 } },

            // Fase 96 - Caminho Final (Extrema Dificuldade)
            { id: 96, type: 'normal', goals: { magic: 38, skull: 35, crystal: 30 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:1}, {r:0,c:2}, {r:0,c:5}, {r:0,c:6}, {r:0,c:7}, {r:1,c:0}, {r:1,c:7}, {r:2,c:0}, {r:2,c:7}, {r:5,c:0}, {r:5,c:7}, {r:6,c:0}, {r:6,c:7}, {r:7,c:0}, {r:7,c:1}, {r:7,c:2}, {r:7,c:5}, {r:7,c:6}, {r:7,c:7}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 53, y: 38 } },

            // Fase 97 - Quase ImpossÃ­vel
            { id: 97, type: 'normal', goals: { magic: 40, skull: 38, crystal: 35 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:1}, {r:0,c:2}, {r:0,c:3}, {r:0,c:4}, {r:0,c:5}, {r:0,c:6}, {r:0,c:7},
                             {r:1,c:0}, {r:1,c:7}, {r:2,c:0}, {r:2,c:7}, {r:3,c:0}, {r:3,c:7}, {r:4,c:0}, {r:4,c:7}, {r:5,c:0}, {r:5,c:7}, {r:6,c:0}, {r:6,c:7},
                             {r:7,c:0}, {r:7,c:1}, {r:7,c:2}, {r:7,c:3}, {r:7,c:4}, {r:7,c:5}, {r:7,c:6}, {r:7,c:7}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 40, y: 37 } },

            // Fase 98 - PenÃºltima do Jogo
            { id: 98, type: 'normal', goals: { magic: 42, skull: 40, crystal: 38 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:1}, {r:0,c:2}, {r:0,c:3}, {r:0,c:4}, {r:0,c:5}, {r:0,c:6}, {r:0,c:7},
                             {r:1,c:0}, {r:1,c:1}, {r:1,c:6}, {r:1,c:7}, {r:2,c:0}, {r:2,c:7}, {r:3,c:0}, {r:3,c:7}, {r:4,c:0}, {r:4,c:7}, {r:5,c:0}, {r:5,c:7}, {r:6,c:0}, {r:6,c:1}, {r:6,c:6}, {r:6,c:7},
                             {r:7,c:0}, {r:7,c:1}, {r:7,c:2}, {r:7,c:3}, {r:7,c:4}, {r:7,c:5}, {r:7,c:6}, {r:7,c:7}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 28, y: 34 } },

            // Fase 99 - Ãšltima antes do Boss Final
            { id: 99, type: 'normal', goals: { magic: 45, skull: 42, crystal: 40 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:1}, {r:0,c:2}, {r:0,c:3}, {r:0,c:4}, {r:0,c:5}, {r:0,c:6}, {r:0,c:7},
                             {r:1,c:0}, {r:1,c:1}, {r:1,c:2}, {r:1,c:5}, {r:1,c:6}, {r:1,c:7}, {r:2,c:0}, {r:2,c:1}, {r:2,c:6}, {r:2,c:7},
                             {r:3,c:0}, {r:3,c:7}, {r:4,c:0}, {r:4,c:7},
                             {r:5,c:0}, {r:5,c:1}, {r:5,c:6}, {r:5,c:7}, {r:6,c:0}, {r:6,c:1}, {r:6,c:2}, {r:6,c:5}, {r:6,c:6}, {r:6,c:7},
                             {r:7,c:0}, {r:7,c:1}, {r:7,c:2}, {r:7,c:3}, {r:7,c:4}, {r:7,c:5}, {r:7,c:6}, {r:7,c:7}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 33, y: 27 } },

            // FASE 100 - BOSS FINAL: MAGO NEGRO
            { id: 100, type: 'boss', boss: { id: 'dark_wizard', name: 'VORATH', emoji: '\u{1F9D9}\u{200D}\u{2642}\u{FE0F}', maxHp: 150 }, musicId: 'bgm_castle_20',
                goals: { magic: 50, skull: 45, crystal: 42 }, items: ['magic', 'skull', 'crystal'],
                gridConfig: [{r:0,c:0}, {r:0,c:1}, {r:0,c:2}, {r:0,c:3}, {r:0,c:4}, {r:0,c:5}, {r:0,c:6}, {r:0,c:7},
                             {r:1,c:0}, {r:1,c:1}, {r:1,c:2}, {r:1,c:5}, {r:1,c:6}, {r:1,c:7},
                             {r:2,c:0}, {r:2,c:1}, {r:2,c:6}, {r:2,c:7},
                             {r:3,c:0}, {r:3,c:7}, {r:4,c:0}, {r:4,c:7},
                             {r:5,c:0}, {r:5,c:1}, {r:5,c:6}, {r:5,c:7},
                             {r:6,c:0}, {r:6,c:1}, {r:6,c:2}, {r:6,c:5}, {r:6,c:6}, {r:6,c:7},
                             {r:7,c:0}, {r:7,c:1}, {r:7,c:2}, {r:7,c:3}, {r:7,c:4}, {r:7,c:5}, {r:7,c:6}, {r:7,c:7}].map(pos => ({...pos, ...SHADOWS})),
                mapPos: { x: 53, y: 17 } }
        ]
    }
];


