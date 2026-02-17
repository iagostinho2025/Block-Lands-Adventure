import { getRandomPiece, ITEM_STATS } from './modules/shapes.js';
import { EffectsSystem } from './modules/effects.js';
import { AudioSystem } from './modules/audio.js';
import { PowersSystem } from './modules/powers.js';
import { WORLDS } from './modules/data/levels.js';
import { BOSS_LOGIC } from './modules/logic/bosses.js';
import { I18nSystem } from './modules/i18n.js'; // ADICIONADO: ImportaÃ§Ã£o do sistema de idiomas
import { AchievementSystem } from './modules/achievements.js';
import { PlayerProgression, getRomanNumeral } from './modules/progression.js';
import { BlitzModeController } from './modules/modes/blitz-mode.js';
import './modules/enemy-sprites.js';

const DEBUG_BOSS_HUD = false;
const DEBUG_LAYOUT_GEOMETRY = false;
const DEBUG_DOCK_GEOMETRY = false;
const DEBUG_UNLOCK_ALL_ADVENTURE = false;
const DEBUG_UNLOCK_ALL_ADVENTURE_LEVEL = 999;
const PERF_DEBUG = false;
const RUNTIME_LOGS = false;
const FPS_INDICATOR_ENABLED = true;
const PERF_LITE_FPS_DOWNGRADE = 50;
const PERF_LITE_FPS_RECOVER = 56;
const PERF_LITE_DOWNGRADE_FRAMES = 45;
const PERF_LITE_RECOVER_FRAMES = 120;

const DRAG_VISUAL_OFFSET_Y = 130;

const BLITZ_ITEM_CHANCE = 0.2;
const BLITZ_LETTER_KEYS = [
    'letter_b',
    'letter_l',
    'letter_o',
    'letter_c',
    'letter_k',
    'letter_a',
    'letter_n',
    'letter_d',
    'letter_s'
];

const EMOJI_MAP = {
    // Itens Classicos
    'bee': '\u{1F41D}', 'ghost': '\u{1F47B}', 'cop': '\u{1F46E}', 'ice_shard': '\u{1F48E}',

    // Power-Ups
    'magnet': '\u{1F9F2}', 'rotate': '\u{1F504}', 'swap': '\u{1F500}',

    // Mundo Fogo
    'fire': '\u{1F525}', 'heart': '\u{2764}\u{FE0F}\u{200D}\u{1F525}', 'collision': '\u{1F4A5}', 'volcano': '\u{1F30B}',

    // Poderes de boss
    'stone': '\u{1FAA8}',
    'coal': '\u{26AB}',

    // Mundo Guardiao (Tutorial)
    'amulet': '\u{1FAAC}',
    'dagger': '\u{1F5E1}\u{FE0F}',
    'ancient_key': '\u{1F5DD}\u{FE0F}',
    'ancestral_portal': '\u{1F9FF}',

    // Mundo Agua
    'drop': '\u{1F4A7}', 'fish': '\u{1F41F}', 'algae': '\u{1F33F}',

    // Mundo Floresta
    'leaf': '\u{1F343}',
    'poison': '\u{2620}\u{FE0F}',
    'mushroom': '\u{1F344}',
    'thorns': '\u{1F33F}',
    'web': '\u{1F578}\u{FE0F}',

    // Mundo Montanha
    'gold': '\u{1F4B0}',
    'pickaxe': '\u{26CF}\u{FE0F}',
    'iron': '\u{2699}\u{FE0F}',
    'rocks': '\u{1FAA8}',
    'debris': '\u{1F4A5}',

    // Mundo Deserto
    'bone': '\u{1F9B4}',
    'sand': '\u{1F3D6}\u{FE0F}',
    'skull': '\u{1F480}',
    'quicksand': '\u{1F3DC}\u{FE0F}',
    'sandstorm': '\u{1F32A}\u{FE0F}',

    // Mundo Castelo Sombrio
    'magic': '\u{1F52E}',
    'crystal': '\u{1F48E}',
    'shadows': '\u{1F311}',
    'void': '\u{26AB}'
};

const ITEM_SPRITE_PATHS = {
    // Tutorial guardian
    amulet: 'assets/enemies/guardian/item_amulet.webp',
    dagger: 'assets/enemies/guardian/item_dagger.webp',
    ancient_key: 'assets/enemies/guardian/item_ancient_key.webp',
    ancestral_portal: 'assets/enemies/guardian/obstacle_ancestral_portal.webp',
    // Fire world
    fire: 'assets/enemies/fire_world/item_fire.webp',
    heart: 'assets/enemies/fire_world/item_heart.webp',
    collision: 'assets/enemies/fire_world/item_collision.webp',
    coal: 'assets/enemies/fire_world/obstacle_coal.webp',
    stone: 'assets/enemies/fire_world/obstacle_stone.webp'
};

const INFO_CARD_HEROES = [
    { icon: '\u{1F9DD}\u{200D}\u{2642}\u{FE0F}', titleKey: 'guardian_info.heroes.thalion_title', descKey: 'guardian_info.heroes.thalion_desc' },
    { icon: '\u{1F43A}', titleKey: 'guardian_info.heroes.nyx_title', descKey: 'guardian_info.heroes.nyx_desc' },
    { icon: '\u{2694}\u{FE0F}', titleKey: 'guardian_info.heroes.warrior_title', descKey: 'guardian_info.heroes.warrior_desc' },
    { icon: '\u{1F9D9}\u{200D}\u{2640}\u{FE0F}', titleKey: 'guardian_info.heroes.mage_title', descKey: 'guardian_info.heroes.mage_desc' }
];

const INFO_CARD_DATA = {
    guardian: {
        sealImage: 'assets/enemies/guardian/boss.webp',
        sealAltKey: 'guardian_info.title',
        titleKey: 'guardian_info.title',
        subtitleKey: 'guardian_info.subtitle',
        bossPowers: [
            { icon: '\u{1F9FF}', titleKey: 'guardian_info.boss.portal_title', descKey: 'guardian_info.boss.portal_desc' },
            { icon: '\u{2728}', titleKey: 'guardian_info.boss.restore_title', descKey: 'guardian_info.boss.restore_desc' }
        ],
        items: [
            { icon: '\u{1FAAC}', titleKey: 'guardian_info.items.amulet_title', descKey: 'guardian_info.items.amulet_desc' },
            { icon: '\u{1F5E1}\u{FE0F}', titleKey: 'guardian_info.items.dagger_title', descKey: 'guardian_info.items.dagger_desc' },
            { icon: '\u{1F5DD}\u{FE0F}', titleKey: 'guardian_info.items.key_title', descKey: 'guardian_info.items.key_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    fire_elite_10: {
        sealImage: 'assets/enemies/fire_world/elite_10.webp',
        sealFallback: 'assets/img/icon_world_fire.jpg',
        sealAltKey: 'fire_info.elite10.title',
        titleKey: 'fire_info.elite10.title',
        subtitleKey: 'fire_info.elite10.subtitle',
        bossPowers: [
            { icon: '\u{26AB}', titleKey: 'fire_info.elite10.boss.coal_title', descKey: 'fire_info.elite10.boss.coal_desc' }
        ],
        items: [
            { icon: '\u{1F525}', titleKey: 'fire_info.items.fire_title', descKey: 'fire_info.items.fire_desc' },
            { icon: '\u{2764}\u{FE0F}\u{200D}\u{1F525}', titleKey: 'fire_info.items.heart_title', descKey: 'fire_info.items.heart_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    fire_elite_15: {
        sealImage: 'assets/enemies/fire_world/elite_15.webp',
        sealFallback: 'assets/img/icon_world_fire.jpg',
        sealAltKey: 'fire_info.elite15.title',
        titleKey: 'fire_info.elite15.title',
        subtitleKey: 'fire_info.elite15.subtitle',
        bossPowers: [
            { icon: '\u{1FA79}', titleKey: 'fire_info.elite15.boss.regen_title', descKey: 'fire_info.elite15.boss.regen_desc' }
        ],
        items: [
            { icon: '\u{1F525}', titleKey: 'fire_info.items.fire_title', descKey: 'fire_info.items.fire_desc' },
            { icon: '\u{2764}\u{FE0F}\u{200D}\u{1F525}', titleKey: 'fire_info.items.heart_title', descKey: 'fire_info.items.heart_desc' },
            { icon: '\u{1F4A5}', titleKey: 'fire_info.items.collision_title', descKey: 'fire_info.items.collision_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    fire_boss_20: {
        sealImage: 'assets/enemies/fire_world/boss.webp',
        sealFallback: 'assets/img/icon_world_fire.jpg',
        sealAltKey: 'fire_info.boss20.title',
        titleKey: 'fire_info.boss20.title',
        subtitleKey: 'fire_info.boss20.subtitle',
        bossPowers: [
            { icon: '\u{26AB}', titleKey: 'fire_info.boss20.boss.coal_title', descKey: 'fire_info.boss20.boss.coal_desc' },
            { icon: '\u{1FA79}', titleKey: 'fire_info.boss20.boss.regen_title', descKey: 'fire_info.boss20.boss.regen_desc' },
            { icon: '\u{1FAA8}', titleKey: 'fire_info.boss20.boss.petrify_title', descKey: 'fire_info.boss20.boss.petrify_desc' }
        ],
        items: [
            { icon: '\u{1F525}', titleKey: 'fire_info.items.fire_title', descKey: 'fire_info.items.fire_desc' },
            { icon: '\u{2764}\u{FE0F}\u{200D}\u{1F525}', titleKey: 'fire_info.items.heart_title', descKey: 'fire_info.items.heart_desc' },
            { icon: '\u{1F4A5}', titleKey: 'fire_info.items.collision_title', descKey: 'fire_info.items.collision_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    forest_elite_30: {
        sealImage: 'assets/enemies/forest_world/elite_10.webp',
        sealFallback: 'assets/img/icon_world_forest.jpg',
        sealAltKey: 'forest_info.elite30.title',
        titleKey: 'forest_info.elite30.title',
        subtitleKey: 'forest_info.elite30.subtitle',
        bossPowers: [
            { icon: '\u{1F33F}', titleKey: 'forest_info.elite30.boss.thorns_title', descKey: 'forest_info.elite30.boss.thorns_desc' }
        ],
        items: [
            { icon: '\u{1F343}', titleKey: 'forest_info.items.leaf_title', descKey: 'forest_info.items.leaf_desc' },
            { icon: '\u{2620}\u{FE0F}', titleKey: 'forest_info.items.poison_title', descKey: 'forest_info.items.poison_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    forest_elite_35: {
        sealImage: 'assets/enemies/forest_world/elite_15.webp',
        sealFallback: 'assets/img/icon_world_forest.jpg',
        sealAltKey: 'forest_info.elite35.title',
        titleKey: 'forest_info.elite35.title',
        subtitleKey: 'forest_info.elite35.subtitle',
        bossPowers: [
            { icon: '\u{1F33F}', titleKey: 'forest_info.elite35.boss.roots_title', descKey: 'forest_info.elite35.boss.roots_desc' },
            { icon: '\u{1FA79}', titleKey: 'forest_info.elite35.boss.regen_title', descKey: 'forest_info.elite35.boss.regen_desc' }
        ],
        items: [
            { icon: '\u{1F343}', titleKey: 'forest_info.items.leaf_title', descKey: 'forest_info.items.leaf_desc' },
            { icon: '\u{2620}\u{FE0F}', titleKey: 'forest_info.items.poison_title', descKey: 'forest_info.items.poison_desc' },
            { icon: '\u{1F344}', titleKey: 'forest_info.items.mushroom_title', descKey: 'forest_info.items.mushroom_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    forest_boss_40: {
        sealImage: 'assets/enemies/forest_world/boss.webp',
        sealFallback: 'assets/img/icon_world_forest.jpg',
        sealAltKey: 'forest_info.boss40.title',
        titleKey: 'forest_info.boss40.title',
        subtitleKey: 'forest_info.boss40.subtitle',
        bossPowers: [
            { icon: '\u{1F33F}', titleKey: 'forest_info.boss40.boss.thorns_title', descKey: 'forest_info.boss40.boss.thorns_desc' },
            { icon: '\u{1F33F}', titleKey: 'forest_info.boss40.boss.roots_title', descKey: 'forest_info.boss40.boss.roots_desc' },
            { icon: '\u{1F578}\u{FE0F}', titleKey: 'forest_info.boss40.boss.web_title', descKey: 'forest_info.boss40.boss.web_desc' }
        ],
        items: [
            { icon: '\u{1F343}', titleKey: 'forest_info.items.leaf_title', descKey: 'forest_info.items.leaf_desc' },
            { icon: '\u{2620}\u{FE0F}', titleKey: 'forest_info.items.poison_title', descKey: 'forest_info.items.poison_desc' },
            { icon: '\u{1F344}', titleKey: 'forest_info.items.mushroom_title', descKey: 'forest_info.items.mushroom_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    mountain_elite_50: {
        sealImage: 'assets/enemies/mountain_world/elite_10.webp',
        sealFallback: 'assets/img/icon_world_mountain.jpg',
        sealAltKey: 'mountain_info.elite50.title',
        titleKey: 'mountain_info.elite50.title',
        subtitleKey: 'mountain_info.elite50.subtitle',
        bossPowers: [
            { icon: '\u{1FAA8}', titleKey: 'mountain_info.elite50.boss.rocks_title', descKey: 'mountain_info.elite50.boss.rocks_desc' }
        ],
        items: [
            { icon: '\u{1F4B0}', titleKey: 'mountain_info.items.gold_title', descKey: 'mountain_info.items.gold_desc' },
            { icon: '\u{26CF}\u{FE0F}', titleKey: 'mountain_info.items.pickaxe_title', descKey: 'mountain_info.items.pickaxe_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    mountain_elite_55: {
        sealImage: 'assets/enemies/mountain_world/elite_15.webp',
        sealFallback: 'assets/img/icon_world_mountain.jpg',
        sealAltKey: 'mountain_info.elite55.title',
        titleKey: 'mountain_info.elite55.title',
        subtitleKey: 'mountain_info.elite55.subtitle',
        bossPowers: [
            { icon: '\u{1FAA8}', titleKey: 'mountain_info.elite55.boss.crush_title', descKey: 'mountain_info.elite55.boss.crush_desc' },
            { icon: '\u{1F6E1}\u{FE0F}', titleKey: 'mountain_info.elite55.boss.armor_title', descKey: 'mountain_info.elite55.boss.armor_desc' }
        ],
        items: [
            { icon: '\u{1F4B0}', titleKey: 'mountain_info.items.gold_title', descKey: 'mountain_info.items.gold_desc' },
            { icon: '\u{26CF}\u{FE0F}', titleKey: 'mountain_info.items.pickaxe_title', descKey: 'mountain_info.items.pickaxe_desc' },
            { icon: '\u{2699}\u{FE0F}', titleKey: 'mountain_info.items.iron_title', descKey: 'mountain_info.items.iron_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    mountain_boss_60: {
        sealImage: 'assets/enemies/mountain_world/boss.webp',
        sealFallback: 'assets/img/icon_world_mountain.jpg',
        sealAltKey: 'mountain_info.boss60.title',
        titleKey: 'mountain_info.boss60.title',
        subtitleKey: 'mountain_info.boss60.subtitle',
        bossPowers: [
            { icon: '\u{1FAA8}', titleKey: 'mountain_info.boss60.boss.rocks_title', descKey: 'mountain_info.boss60.boss.rocks_desc' },
            { icon: '\u{1FAA8}', titleKey: 'mountain_info.boss60.boss.crush_title', descKey: 'mountain_info.boss60.boss.crush_desc' },
            { icon: '\u{1F4A5}', titleKey: 'mountain_info.boss60.boss.quake_title', descKey: 'mountain_info.boss60.boss.quake_desc' }
        ],
        items: [
            { icon: '\u{1F4B0}', titleKey: 'mountain_info.items.gold_title', descKey: 'mountain_info.items.gold_desc' },
            { icon: '\u{26CF}\u{FE0F}', titleKey: 'mountain_info.items.pickaxe_title', descKey: 'mountain_info.items.pickaxe_desc' },
            { icon: '\u{2699}\u{FE0F}', titleKey: 'mountain_info.items.iron_title', descKey: 'mountain_info.items.iron_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    desert_elite_70: {
        sealImage: 'assets/enemies/desert_world/elite_10.webp',
        sealFallback: 'assets/img/icon_world_desert.jpg',
        sealAltKey: 'desert_info.elite70.title',
        titleKey: 'desert_info.elite70.title',
        subtitleKey: 'desert_info.elite70.subtitle',
        bossPowers: [
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.elite70.boss.quicksand_title', descKey: 'desert_info.elite70.boss.quicksand_desc' }
        ],
        items: [
            { icon: '\u{1F9B4}', titleKey: 'desert_info.items.bone_title', descKey: 'desert_info.items.bone_desc' },
            { icon: '\u{1F3D6}\u{FE0F}', titleKey: 'desert_info.items.sand_title', descKey: 'desert_info.items.sand_desc' },
            { icon: '\u{1F480}', titleKey: 'desert_info.items.skull_title', descKey: 'desert_info.items.skull_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    desert_elite_75: {
        sealImage: 'assets/enemies/desert_world/elite_15.webp',
        sealFallback: 'assets/img/icon_world_desert.jpg',
        sealAltKey: 'desert_info.elite75.title',
        titleKey: 'desert_info.elite75.title',
        subtitleKey: 'desert_info.elite75.subtitle',
        bossPowers: [
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.elite75.boss.sand_poison_title', descKey: 'desert_info.elite75.boss.sand_poison_desc' },
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.elite75.boss.quicksand_title', descKey: 'desert_info.elite75.boss.quicksand_desc' }
        ],
        items: [
            { icon: '\u{1F9B4}', titleKey: 'desert_info.items.bone_title', descKey: 'desert_info.items.bone_desc' },
            { icon: '\u{1F3D6}\u{FE0F}', titleKey: 'desert_info.items.sand_title', descKey: 'desert_info.items.sand_desc' },
            { icon: '\u{1F480}', titleKey: 'desert_info.items.skull_title', descKey: 'desert_info.items.skull_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    desert_boss_80: {
        sealImage: 'assets/enemies/desert_world/boss.webp',
        sealFallback: 'assets/img/icon_world_desert.jpg',
        sealAltKey: 'desert_info.boss80.title',
        titleKey: 'desert_info.boss80.title',
        subtitleKey: 'desert_info.boss80.subtitle',
        bossPowers: [
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.boss80.boss.bone_quicksand_title', descKey: 'desert_info.boss80.boss.bone_quicksand_desc' },
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.boss80.boss.sand_quicksand_title', descKey: 'desert_info.boss80.boss.sand_quicksand_desc' },
            { icon: '\u{1F32A}\u{FE0F}', titleKey: 'desert_info.boss80.boss.sandstorm_title', descKey: 'desert_info.boss80.boss.sandstorm_desc' }
        ],
        items: [
            { icon: '\u{1F9B4}', titleKey: 'desert_info.items.bone_title', descKey: 'desert_info.items.bone_desc' },
            { icon: '\u{1F3D6}\u{FE0F}', titleKey: 'desert_info.items.sand_title', descKey: 'desert_info.items.sand_desc' },
            { icon: '\u{1F480}', titleKey: 'desert_info.items.skull_title', descKey: 'desert_info.items.skull_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    castle_elite_90: {
        sealImage: 'assets/enemies/castle_world/elite_10.webp',
        sealFallback: 'assets/img/icon_world_castle.jpg',
        sealAltKey: 'castle_info.elite90.title',
        titleKey: 'castle_info.elite90.title',
        subtitleKey: 'castle_info.elite90.subtitle',
        bossPowers: [
            { icon: '\u{1F311}', titleKey: 'castle_info.elite90.boss.magic_shadow_title', descKey: 'castle_info.elite90.boss.magic_shadow_desc' },
            { icon: '\u{1F311}', titleKey: 'castle_info.elite90.boss.shadow_spawn_title', descKey: 'castle_info.elite90.boss.shadow_spawn_desc' }
        ],
        items: [
            { icon: '\u{1F52E}', titleKey: 'castle_info.items.magic_title', descKey: 'castle_info.items.magic_desc' },
            { icon: '\u{1F480}', titleKey: 'castle_info.items.skull_title', descKey: 'castle_info.items.skull_desc' },
            { icon: '\u{1F48E}', titleKey: 'castle_info.items.crystal_title', descKey: 'castle_info.items.crystal_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    castle_elite_95: {
        sealImage: 'assets/enemies/castle_world/elite_15.webp',
        sealFallback: 'assets/img/icon_world_castle.jpg',
        sealAltKey: 'castle_info.elite95.title',
        titleKey: 'castle_info.elite95.title',
        subtitleKey: 'castle_info.elite95.subtitle',
        bossPowers: [
            { icon: '\u{1F311}', titleKey: 'castle_info.elite95.boss.magic_shadow_title', descKey: 'castle_info.elite95.boss.magic_shadow_desc' },
            { icon: '\u{1F311}', titleKey: 'castle_info.elite95.boss.skull_shadow_title', descKey: 'castle_info.elite95.boss.skull_shadow_desc' }
        ],
        items: [
            { icon: '\u{1F52E}', titleKey: 'castle_info.items.magic_title', descKey: 'castle_info.items.magic_desc' },
            { icon: '\u{1F480}', titleKey: 'castle_info.items.skull_title', descKey: 'castle_info.items.skull_desc' },
            { icon: '\u{1F48E}', titleKey: 'castle_info.items.crystal_title', descKey: 'castle_info.items.crystal_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    castle_boss_100: {
        sealImage: 'assets/enemies/castle_world/boss.webp',
        sealFallback: 'assets/img/icon_world_castle.jpg',
        sealAltKey: 'castle_info.boss100.title',
        titleKey: 'castle_info.boss100.title',
        subtitleKey: 'castle_info.boss100.subtitle',
        bossPowers: [
            { icon: '\u{1F311}', titleKey: 'castle_info.boss100.boss.magic_shadow_title', descKey: 'castle_info.boss100.boss.magic_shadow_desc' },
            { icon: '\u{1F311}', titleKey: 'castle_info.boss100.boss.skull_shadow_title', descKey: 'castle_info.boss100.boss.skull_shadow_desc' },
            { icon: '\u{26AB}', titleKey: 'castle_info.boss100.boss.void_title', descKey: 'castle_info.boss100.boss.void_desc' },
            { icon: '\u{1F311}', titleKey: 'castle_info.boss100.boss.shadow_spawn_title', descKey: 'castle_info.boss100.boss.shadow_spawn_desc' }
        ],
        items: [
            { icon: '\u{1F52E}', titleKey: 'castle_info.items.magic_title', descKey: 'castle_info.items.magic_desc' },
            { icon: '\u{1F480}', titleKey: 'castle_info.items.skull_title', descKey: 'castle_info.items.skull_desc' },
            { icon: '\u{1F48E}', titleKey: 'castle_info.items.crystal_title', descKey: 'castle_info.items.crystal_desc' }
        ],
        heroes: INFO_CARD_HEROES
    }
};

// ============================================
// PRODUTOS DA LOJA DE MESTRES
// ============================================
const STORE_PRODUCTS = {
    magnet_pack: {
        id: 'magnet_pack',
        nameKey: 'store.magnet_pack_name',
        descKey: 'store.magnet_pack_desc',
        descKeyModal: 'store.magnet_pack_desc_modal',
        icon: '\u{1F9F2}',
        type: 'powerup',
        powerupType: 'magnet',
        quantity: 1,
        price: 50
    },
    rotate_pack: {
        id: 'rotate_pack',
        nameKey: 'store.rotate_pack_name',
        descKey: 'store.rotate_pack_desc',
        descKeyModal: 'store.rotate_pack_desc_modal',
        icon: '\u{1F504}',
        type: 'powerup',
        powerupType: 'rotate',
        quantity: 1,
        price: 50
    },
    swap_pack: {
        id: 'swap_pack',
        nameKey: 'store.swap_pack_name',
        descKey: 'store.swap_pack_desc',
        descKeyModal: 'store.swap_pack_desc_modal',
        icon: '\u{1F500}',
        type: 'powerup',
        powerupType: 'swap',
        quantity: 1,
        price: 50
    },
    complete_pack: {
        id: 'complete_pack',
        nameKey: 'store.complete_pack_name',
        descKey: 'store.complete_pack_desc',
        icon: '\u{1F381}',
        type: 'bundle',
        quantity: 9, // 3 de cada
        price: 120,
        originalPrice: 150,
        items: [
            { powerupType: 'magnet', quantity: 3 },
            { powerupType: 'rotate', quantity: 3 },
            { powerupType: 'swap', quantity: 3 }
        ]
    }
};
const MAX_POWERUP_COUNT = 3;
const XP_REWARDS = {
    levelComplete: 50,
    bossDefeat: 150,
    missionComplete: 30,
    lineClear: 6,
    comboStep: 8
};

const CLASSIC_THEME_STORAGE_KEY = 'blocklands_classic_theme';
const CLASSIC_DEFAULT_THEME = 'arena';
const CLASSIC_THEME_CLASSES = [
    'classic-theme-arena',
    'classic-theme-neon',
    'classic-theme-glass',
    'classic-theme-flat',
    'classic-theme-cyber',
    'classic-theme-solar',
    'classic-theme-void',
    'classic-theme-emerald'
];
const CLASSIC_THEME_UNLOCKABLES = {
    classic_theme_arena: 'arena',
    classic_theme_neon: 'neon',
    classic_theme_glass: 'glass',
    classic_theme_flat: 'flat',
    classic_theme_cyber: 'cyber',
    classic_theme_solar: 'solar',
    classic_theme_void: 'void',
    classic_theme_emerald: 'emerald'
};

export class Game {
    constructor() {
        this.gridSize = 8;
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(null));
        
        // Elementos DOM
        this.screenMenu = document.getElementById('screen-menu');
        this.screenLevels = document.getElementById('screen-levels');
        this.screenStory = document.getElementById('screen-story');
        this.screenHeroSelect = document.getElementById('screen-hero-select'); // NOVO
		this.screenCampfire = document.getElementById('screen-campfire'); // <--- ADICIONE ISSO
        this.screenGame = document.getElementById('screen-game');
        this.screenSettings = document.getElementById('screen-settings');
        this.screenAchievements = document.getElementById('screen-achievements');
        this.screenStore = document.getElementById('screen-store'); 
        
        // ConfiguraÃ§Ãµes PadrÃ£o
        this.settings = {
            music: true,
            sfx: true,
            haptics: true,
            performanceMode: 'auto'
        };
        this.loadSettings(); 
        
        // --- NOVO: Carrega a classe do jogador (se jÃ¡ escolheu) ---
        this.playerClass = localStorage.getItem('blocklands_player_class') || null; 

        this.boardEl = document.getElementById('game-board');
        this.dockEl = document.getElementById('dock');
        this.goalsArea = document.getElementById('goals-area');
        this.modalOver = document.getElementById('modal-gameover');
        this.modalWin = document.getElementById('modal-victory');
        this.scoreOverEl = document.getElementById('score-final');
        this.comboState = { count: 0, lastClearTime: 0 };
        this.assetsLoaded = false; 

        // Estado do Jogo
        this.currentMode = 'casual'; 
        this.currentLevelConfig = null;
        this.currentHand = [];
        this.bossState = { active: false, maxHp: 0, currentHp: 0, attackRate: 3, movesWithoutDamage: 0 };

        // Estado do Modo ClÃ¡ssico
        this.classicState = {
            score: 0,
            level: 1,
            linesCleared: 0,
            bestScore: parseInt(localStorage.getItem('classic_best_score') || '0'),
            comboStreak: 0,
            comboTimer: null,
            recordBeaten: false, // Flag para controlar se jÃ¡ mostrou mensagem de recorde
            visualV1: true, // Feature flag para efeitos visuais premium (true = ativado)
            missions: [],
            missionsBestStreak: parseInt(localStorage.getItem('classic_missions_best_streak') || '0'),
            missionsTotal: parseInt(localStorage.getItem('classic_missions_total') || '0'),
            missionRewardActive: false,
            missionRewardMultiplier: 1.0,
            missionRewardEndTime: null
        };

        // Tema visual do modo clÃ¡ssico (liberado para troca livre)
        this.classicTheme = localStorage.getItem(CLASSIC_THEME_STORAGE_KEY) || CLASSIC_DEFAULT_THEME;

        this.currentGoals = {}; 
        this.collected = {};
        this.score = 0;
        this.activeSnap = null; 
        this.i18n = new I18nSystem();
        this.preloadAssets();

        // Achievement System (optimized with batching)
        this.achievements = null; // Lazy-loaded after i18n

        // Player Progression
        this.progression = new PlayerProgression({
            onChange: (snapshot) => this.updateProgressionUI(snapshot),
            onLevelUp: (snapshot) => this.showLevelUpToast(snapshot),
            onRankUp: (snapshot) => this.showRankUpModal(snapshot)
        });
        this.progressionEls = null;
        this.lastRankIndex = null;

        // Power-Ups (inicializado vazio, serÃ¡ carregado do localStorage)
        this.powerUps = { magnet: 0, rotate: 0, swap: 0 };
        this.interactionMode = null; 
        
        // Sistemas
        const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this._isMobileDevice = isMobile;
        this.effects = new EffectsSystem({
            forceQuality: (this.settings.performanceMode === 'stable60')
                ? 'low'
                : (isMobile ? 'low' : 'auto'),
            disableComboHud: this.settings.performanceMode === 'stable60' || isMobile
        });
        this.audio = new AudioSystem();
        this.powers = new PowersSystem(this);
        this.maxUnlockedLevel = 99;
        this.blitz = new BlitzModeController();
        this.blitz.init(this);

        // ============================================
        // SISTEMA DE ECONOMIA - CRISTAIS
        // ============================================
        this.crystals = parseInt(localStorage.getItem('blocklands_crystals') || '0');
        this.crystalValueEl = document.querySelector('.crystal-value');
        this.crystalValueGameEl = document.querySelector('.crystal-value-game'); // Elemento na tela de jogo
        this.crystalValueStoreEl = document.querySelector('.crystal-value-store'); // Elemento na loja
        this._storeListenersBound = false;
        this._storeTabsBound = false;
        this._settingsLogicBound = false;

        // EstatÃ­sticas para economia
        this.dailyStats = this.loadDailyStats();
        this.classicState.lastScoreMilestone = 0; // Controla cristais por pontuaÃ§Ã£o

        // Controle da HistÃ³ria
        this.storyStep = 0; // Para controlar os slides

        this.setupMenuEvents();
        this.startLoadingSequence();
        this.updateCrystalDisplay();

        this.initProgressionUI();

        // Cache de mÃ©tricas do tabuleiro (para evitar layout reads frequentes no drag)
        this._boardMetrics = null;
        this._boardMetricsDirty = true;
        window.addEventListener('resize', () => {
            this._boardMetricsDirty = true;
        }, { passive: true });
        if (window.ResizeObserver && this.boardEl) {
            this._boardResizeObserver = new ResizeObserver(() => {
                this._boardMetricsDirty = true;
            });
            this._boardResizeObserver.observe(this.boardEl);
        }
        this.updateProgressionUI(this.progression.getSnapshot());
        this.updateClassicThemeClass();
		
		// --- SAVE (debounce seguro) ---
		this._saveTimer = null;
		this._pendingSaveJson = null;
		this._lastSavedJson = null;
        this._saveDisabled = false;
		this._saveToken = 0; // invalida callbacks antigos

        // Recompensas da partida (modo aventura)
        this._matchRewards = { crystals: 0, xp: 0 };
        this._matchRewardsActive = false;

        // Resultado do modo clÃ¡ssico
        this._classicStartTime = 0;
        this._classicMatchXp = 0;
        this._classicXpActive = false;
        this._classicMaxCombo = 0;
        this._classicBestAtStart = this.classicState.bestScore;

        // Resultado do modo blitz
        this._blitzStartTime = 0;
        this._blitzMatchXp = 0;
        this._blitzXpActive = false;
        this._blitzLinesCleared = 0;
        this._blitzMaxCombo = 0;
        this._blitzBlocksDone = 0;
        this._blitzBlocksTotal = 0;

        // Perf instrumentation (disabled by default)
        this._perf = {
            enabled: PERF_DEBUG,
            lastReport: performance.now(),
            totals: Object.create(null),
            counts: Object.create(null),
            max: Object.create(null)
        };

        // Runtime performance profile (visual only, never alters gameplay rules)
        this.performanceProfile = 'full';
        this._runtimePerfDowngrade = false;
        this._fpsMonitorRaf = 0;
        this._fpsMonitorLastTs = 0;
        this._fpsLowStreak = 0;
        this._fpsHighStreak = 0;
        this._fpsSmoothed = 0;
        this._fpsUiLastUpdate = 0;
        this._perfIndicatorEl = null;
        this._classicUiCache = null;
        this._bossHudRefs = null;
        this._bossHudLastPct = null;
        this._pendingSyncedBossImpacts = 0;
        this._postImpactMoveCheckNeeded = false;
        this._postImpactBossTurnEndNeeded = false;
        this._resultResolved = false;
        this.initPerformanceMode();

    }

    perfStart(label) {
        if (!this._perf || !this._perf.enabled) return 0;
        return performance.now();
    }

    perfEnd(label, startTime) {
        if (!startTime || !this._perf || !this._perf.enabled) return;
        const now = performance.now();
        const dt = now - startTime;
        const totals = this._perf.totals;
        const counts = this._perf.counts;
        const max = this._perf.max;

        totals[label] = (totals[label] || 0) + dt;
        counts[label] = (counts[label] || 0) + 1;
        if (!max[label] || dt > max[label]) max[label] = dt;

        if ((now - this._perf.lastReport) >= 5000) {
            this._perf.lastReport = now;
            const lines = [];
            for (const key of Object.keys(totals)) {
                const avg = totals[key] / Math.max(1, counts[key]);
                lines.push(`${key}: avg ${avg.toFixed(2)}ms (max ${max[key].toFixed(2)}ms, n=${counts[key]})`);
            }
            if (lines.length > 0) {
                console.log('[PERF]', lines.join(' | '));
            }
            // Reset window after report to keep numbers fresh
            this._perf.totals = Object.create(null);
            this._perf.counts = Object.create(null);
            this._perf.max = Object.create(null);
        }
    }

    initPerformanceMode() {
        const prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
        const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;

        this._autoPerformanceProfile = (prefersReducedMotion || isMobile || lowCores || lowMemory) ? 'lite' : 'full';
        this.applyPerformancePreference();
    }

    applyPerformancePreference() {
        const mode = this.settings?.performanceMode || 'auto';

        if (mode === 'stable60') {
            this.performanceProfile = 'lite';
            this._runtimePerfDowngrade = false;
        } else if (mode === 'quality') {
            this.performanceProfile = 'full';
            this._runtimePerfDowngrade = false;
        } else {
            this.performanceProfile = this._autoPerformanceProfile || 'full';
        }

        if (this.effects) {
            const disableComboHud = mode === 'stable60' || (
                this._isMobileDevice &&
                mode === 'auto' &&
                this.performanceProfile === 'lite'
            );
            if (typeof this.effects.setForceQuality === 'function') {
                this.effects.setForceQuality(mode === 'stable60' ? 'low' : 'auto');
            }
            if (typeof this.effects.setDisableComboHud === 'function') {
                this.effects.setDisableComboHud(disableComboHud);
            }
        }

        this.applyPerformanceClass();
    }

    applyPerformanceClass() {
        const app = document.getElementById('app');
        if (!app) return;
        const useLite = this.performanceProfile === 'lite' || this._runtimePerfDowngrade;
        const perfMode = this.settings?.performanceMode || 'auto';
        const useMobileLiteHard = !!(
            this._isMobileDevice &&
            (perfMode === 'stable60' || (perfMode === 'auto' && useLite))
        );
        app.classList.toggle('perf-lite', useLite);
        app.classList.toggle('mobile-lite-hard', useMobileLiteHard);
    }

    ensurePerfIndicator() {
        if (!FPS_INDICATOR_ENABLED) return null;
        if (this._perfIndicatorEl && this._perfIndicatorEl.isConnected) return this._perfIndicatorEl;
        if (!this.screenGame) return null;

        const el = document.createElement('div');
        el.id = 'perf-fps-indicator';
        el.className = 'perf-fps-indicator';
        el.setAttribute('aria-live', 'off');
        el.textContent = 'FPS --';
        this.screenGame.appendChild(el);
        this._perfIndicatorEl = el;
        return el;
    }

    updatePerfIndicator(fpsValue) {
        const el = this.ensurePerfIndicator();
        if (!el) return;

        const fps = Math.max(0, Math.round(fpsValue || 0));
        const tier = (this.performanceProfile === 'lite' || this._runtimePerfDowngrade) ? 'LITE' : 'FULL';
        el.textContent = `FPS ${fps} | ${tier}`;
        el.classList.remove('fps-good', 'fps-mid', 'fps-bad', 'hidden');
        if (fps >= 55) el.classList.add('fps-good');
        else if (fps >= 35) el.classList.add('fps-mid');
        else el.classList.add('fps-bad');
    }

    startFpsMonitor() {
        if (this._fpsMonitorRaf) return;
        this._fpsMonitorLastTs = performance.now();
        this._fpsLowStreak = 0;
        this._fpsHighStreak = 0;
        this._fpsSmoothed = 0;
        this._fpsUiLastUpdate = 0;
        const indicator = this.ensurePerfIndicator();
        if (indicator) indicator.classList.remove('hidden');

        const tick = (now) => {
            const dt = now - this._fpsMonitorLastTs;
            this._fpsMonitorLastTs = now;

            const fps = dt > 0 ? (1000 / dt) : 60;
            this._fpsSmoothed = this._fpsSmoothed > 0
                ? (this._fpsSmoothed * 0.88) + (fps * 0.12)
                : fps;

            const perfMode = this.settings?.performanceMode || 'auto';
            if (this.effects && typeof this.effects.setDisableComboHud === 'function') {
                const lowFpsMobile = this._isMobileDevice && perfMode === 'auto' && this._fpsSmoothed < 57;
                const forceDisableComboHud = perfMode === 'stable60' || lowFpsMobile || this._runtimePerfDowngrade;
                this.effects.setDisableComboHud(forceDisableComboHud);
            }
            if (this.effects && typeof this.effects.setRuntimeFps === 'function') {
                this.effects.setRuntimeFps(this._fpsSmoothed);
            }

            if (perfMode === 'auto') {
                if (fps < PERF_LITE_FPS_DOWNGRADE) {
                    this._fpsLowStreak++;
                    this._fpsHighStreak = 0;
                } else if (fps > PERF_LITE_FPS_RECOVER) {
                    this._fpsHighStreak++;
                    this._fpsLowStreak = 0;
                }

                if (!this._runtimePerfDowngrade && this._fpsLowStreak >= PERF_LITE_DOWNGRADE_FRAMES) {
                    this._runtimePerfDowngrade = true;
                    this.applyPerformanceClass();
                } else if (
                    this._runtimePerfDowngrade &&
                    this.performanceProfile !== 'lite' &&
                    this._fpsHighStreak >= PERF_LITE_RECOVER_FRAMES
                ) {
                    this._runtimePerfDowngrade = false;
                    this.applyPerformanceClass();
                }
            } else if (this._runtimePerfDowngrade) {
                this._runtimePerfDowngrade = false;
                this.applyPerformanceClass();
            }

            if (FPS_INDICATOR_ENABLED && now - this._fpsUiLastUpdate >= 180) {
                this._fpsUiLastUpdate = now;
                this.updatePerfIndicator(this._fpsSmoothed);
            }

            this._fpsMonitorRaf = requestAnimationFrame(tick);
        };

        this._fpsMonitorRaf = requestAnimationFrame(tick);
    }

    stopFpsMonitor() {
        if (this._fpsMonitorRaf) {
            cancelAnimationFrame(this._fpsMonitorRaf);
            this._fpsMonitorRaf = 0;
        }
        this._fpsLowStreak = 0;
        this._fpsHighStreak = 0;
        this._fpsSmoothed = 0;
        this._fpsUiLastUpdate = 0;
        if (this._perfIndicatorEl) {
            this._perfIndicatorEl.classList.add('hidden');
        }
    }

    restartCssAnimationClass(el, className) {
        if (!el || !className) return;
        if (!this._animRestartMap) this._animRestartMap = new WeakMap();

        const prev = this._animRestartMap.get(el);
        if (prev) {
            if (prev.raf1) cancelAnimationFrame(prev.raf1);
            if (prev.raf2) cancelAnimationFrame(prev.raf2);
        }

        el.classList.remove(className);
        const state = { raf1: 0, raf2: 0 };
        state.raf1 = requestAnimationFrame(() => {
            state.raf2 = requestAnimationFrame(() => {
                el.classList.add(className);
                this._animRestartMap.delete(el);
            });
        });
        this._animRestartMap.set(el, state);
    }
	
	// --- PERSISTÃŠNCIA DE ESTADO (SAVE GAME) ---

    saveGameState() {
    if (this.currentMode !== 'adventure' || !this.currentLevelConfig) return;
    if (this._saveDisabled) return;

    const perfSerializeStart = this.perfStart('save.serialize');

    const state = {
        levelId: this.currentLevelConfig.id,
        grid: this.grid,
        score: this.score,
        hand: this.currentHand,
        bossState: this.bossState,
        heroState: this.heroState,
        currentGoals: this.currentGoals,
        collected: this.collected,
        comboState: this.comboState
        // powerUps NÃƒO Ã© salvo aqui, Ã© gerenciado separadamente no localStorage
    };

    let json;
    try {
        json = JSON.stringify(state);
    } catch (e) {
        console.warn('Falha ao serializar save:', e);
        return;
    }
    this.perfEnd('save.serialize', perfSerializeStart);

    // Dedupe: evita salvar exatamente o mesmo payload repetidamente
    if (json === this._lastSavedJson) return;

    this._pendingSaveJson = json;

    // Invalida qualquer callback anterior
    const myToken = ++this._saveToken;

    if (this._saveTimer) clearTimeout(this._saveTimer);

    // 200~400ms costuma ser bom no mobile
    this._saveTimer = setTimeout(() => {
        // Se algo mudou nesse meio tempo, ignora este callback
        if (this._saveDisabled) return;
        if (myToken !== this._saveToken) return;
        if (!this._pendingSaveJson) return;

        const perfWriteStart = this.perfStart('save.write');
        try {
            localStorage.setItem('blocklands_savestate', this._pendingSaveJson);
            this._lastSavedJson = this._pendingSaveJson;
        } catch (e) {
            console.warn('Falha ao salvar jogo:', e);
        } finally {
            this.perfEnd('save.write', perfWriteStart);
            this._pendingSaveJson = null;
            this._saveTimer = null;
        }
    }, 250);
}

cancelPendingSaveGameState() {
    // invalida callbacks antigos imediatamente
    this._saveToken++;

    if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
    }
    this._pendingSaveJson = null;
}

flushSaveGameState() {
    if (this._saveDisabled) return;

    // Se tem algo pendente, grava imediatamente
    if (this._pendingSaveJson) {
        try {
            localStorage.setItem('blocklands_savestate', this._pendingSaveJson);
            this._lastSavedJson = this._pendingSaveJson;
        } catch (e) {
            console.warn('Falha ao flush do save:', e);
        } finally {
            this._pendingSaveJson = null;
        }
    }

    // cancela timer por limpeza
    if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
    }
}

	// --- HELPER: GET CURRENT WORLD ---
	getCurrentWorld() {
		if (!this.currentLevelConfig) return null;

		const world = WORLDS.find(w => w.levels.some(l => l.id === this.currentLevelConfig.id));
		return world ? world.id.replace('_world', '') : null;
	}

	getCurrentWorldConfig() {
		if (!this.currentLevelConfig) return null;
		return WORLDS.find(w => w.levels.some(l => l.id === this.currentLevelConfig.id)) || null;
	}



	applyBossSprite(avatarElement) {
		if (!avatarElement) return;
		if (this.currentMode !== 'adventure' || !this.currentLevelConfig) return;

		const worldConfig = this.getCurrentWorldConfig();
		if (!worldConfig) return;

		// Usa o mesmo gerador de spriteId quando disponivel
		let spriteId = null;
		if (window.enemySpriteSystem && typeof window.enemySpriteSystem.getSpriteId === 'function') {
			spriteId = window.enemySpriteSystem.getSpriteId(
				worldConfig.id,
				this.currentLevelConfig.id,
				this.currentLevelConfig.type
			);
		}



		if (!spriteId) {
			// Fallback simples e consistente com o sprite system
			const worldMap = {
				'tutorial_world': 'guardian',
				'fire_world': 'fire',
				'forest_world': 'forest',
				'mountain_world': 'mountain',
				'desert_world': 'desert',
				'castle_world': 'castle'
			};
			const worldFolder = worldMap[worldConfig.id] || 'guardian';
			const levelNumber = this.currentLevelConfig.id;
			const levelType = this.currentLevelConfig.type;
			if (levelType === 'boss' || levelNumber === 20) {
				spriteId = `${worldFolder}_boss`;
			} else if (levelNumber === 10) {
				spriteId = `${worldFolder}_elite_10`;
			} else if (levelNumber === 15) {
				spriteId = `${worldFolder}_elite_15`;
			} else {
				spriteId = `${worldFolder}_elite_${levelNumber}`;
			}
		}

		const worldMatch = spriteId.match(/^([a-z]+)_/);
		const world = worldMatch ? worldMatch[1] : 'guardian';
		const fileName = spriteId.replace(`${world}_`, '');
		const folder = world === 'guardian' ? 'guardian' : `${world}_world`;
		const pathWebP = `assets/enemies/${folder}/${fileName}.webp`;
		const pathPng = `assets/enemies/${folder}/${fileName}.png`;

        const applySprite = (path) => {
            // Resolve sprite URL against the current document so CSS variables
            // used in external stylesheets don't get re-based to the CSS file path.
            const resolvedPath = new URL(path, window.location.href).toString();
            avatarElement.classList.add('boss-sprite');
            avatarElement.setAttribute('data-enemy-id', spriteId);
            avatarElement.style.setProperty('background-image', `url('${resolvedPath}')`, 'important');
            avatarElement.style.setProperty('--boss-sprite-url', `url('${resolvedPath}')`);
            avatarElement.style.setProperty('background-repeat', 'no-repeat', 'important');
            avatarElement.style.setProperty('background-position', '50% 60%', 'important');
            let bgSize = '88%';
            const fireOverlayCfg = this.getFireBossOverlayConfig();
            if (fireOverlayCfg) {
                bgSize = '180%';
            }
            avatarElement.style.setProperty('background-size', bgSize, 'important');
            avatarElement.style.setProperty('background-color', 'transparent', 'important');
            // If Ignis overlay mode is active, re-sync after sprite loads.
            if (fireOverlayCfg) {
                this.updateIgnisBossUiOverride();
                this.syncIgnisSpriteOverlay();
            }
        };

		const imgWebP = new Image();
		imgWebP.onload = () => applySprite(pathWebP);
		imgWebP.onerror = () => {
			const imgPng = new Image();
			imgPng.onload = () => applySprite(pathPng);
			imgPng.onerror = () => {
				// Se nenhum sprite carregar, mantem emoji
			};
			imgPng.src = pathPng;
		};
		imgWebP.src = pathWebP;
	}

    getFireBossOverlayConfig() {
        if (this.currentMode !== 'adventure' || !this.currentLevelConfig) return null;
        if (this._infoCardOpen) return null;

        const worldConfig = this.getCurrentWorldConfig();
        if (!worldConfig) return null;

        const levelId = this.currentLevelConfig.id;
        const bossId = this.currentLevelConfig.boss?.id || '';

        if (worldConfig.id === 'tutorial_world' && levelId === 0 && bossId === 'guardian') {
            return {
                key: 'guardian_boss_0',
                appClass: 'boss-big-guardian',
                spriteScale: 1.7,
                spriteOffsetY: -20,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(30, 64, 175, 0.55)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.55)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'fire_world') {
            if (levelId === 20 && bossId === 'ignis') {
                return {
                    key: 'fire_boss_20',
                    appClass: 'boss-big-ignis',
                    spriteScale: 2.0,
                    spriteOffsetY: -12,
                    nameOffsetX: -130,
                    nameOffsetY: 115,
                    spriteFilter: 'drop-shadow(0 8px 14px rgba(185, 28, 28, 0.6)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) brightness(1.03)',
                    nameIntroToHud: true
                };
            }

            if (levelId === 15 && bossId === 'pyra') {
                return {
                    key: 'fire_elite_15',
                    appClass: 'boss-big-elite15',
                    spriteScale: 1.8,
                    spriteOffsetY: -8,
                    nameOffsetX: -130,
                    nameOffsetY: 115,
                    spriteFilter: 'drop-shadow(0 8px 14px rgba(185, 28, 28, 0.6)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) brightness(1.03)',
                    nameIntroToHud: true
                };
            }

            if (levelId === 10 && bossId === 'magmor') {
                return {
                    key: 'fire_elite_10',
                    appClass: 'boss-big-elite10',
                    spriteScale: 1.68,
                    spriteOffsetY: -12,
                    nameOffsetX: -104,
                    nameOffsetY: 115,
                    spriteFilter: 'drop-shadow(0 8px 14px rgba(185, 28, 28, 0.6)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) brightness(1.03)',
                    nameIntroToHud: true
                };
            }
        }

        if (worldConfig.id === 'forest_world' && levelId === 30 && bossId === 'wolf_alpha') {
            return {
                key: 'forest_elite_30',
                appClass: 'boss-big-forest-elite30',
                spriteScale: 1.6,
                spriteOffsetY: -16,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(6, 95, 70, 0.45)) drop-shadow(0 0 10px rgba(52, 211, 153, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'forest_world' && levelId === 35 && bossId === 'aracna') {
            return {
                key: 'forest_elite_35',
                appClass: 'boss-big-forest-elite35',
                spriteScale: 2.15,
                spriteOffsetY: -4,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(6, 95, 70, 0.45)) drop-shadow(0 0 10px rgba(52, 211, 153, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'forest_world' && levelId === 40 && bossId === 'ent_ancient') {
            return {
                key: 'forest_boss_40',
                appClass: 'boss-big-forest-boss40',
                spriteScale: 2.46,
                spriteOffsetY: -8,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(6, 95, 70, 0.45)) drop-shadow(0 0 10px rgba(52, 211, 153, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'mountain_world' && levelId === 50 && bossId === 'troll') {
            return {
                key: 'mountain_elite_50',
                appClass: 'boss-big-mountain-elite50',
                spriteScale: 1.48,
                spriteOffsetY: -24,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(30, 64, 175, 0.42)) drop-shadow(0 0 10px rgba(96, 165, 250, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'mountain_world' && levelId === 55 && bossId === 'giant') {
            return {
                key: 'mountain_elite_55',
                appClass: 'boss-big-mountain-elite55',
                spriteScale: 1.86,
                spriteOffsetY: -12,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(30, 64, 175, 0.42)) drop-shadow(0 0 10px rgba(96, 165, 250, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'mountain_world' && levelId === 60 && bossId === 'golem_king') {
            return {
                key: 'mountain_boss_60',
                appClass: 'boss-big-mountain-boss60',
                spriteScale: 2.18,
                spriteOffsetY: -6,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(30, 64, 175, 0.42)) drop-shadow(0 0 10px rgba(96, 165, 250, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'desert_world' && levelId === 70 && bossId === 'mummy') {
            return {
                key: 'desert_elite_70',
                appClass: 'boss-big-desert-elite70',
                spriteScale: 1.78,
                spriteOffsetX: -10,
                spriteOffsetY: -10,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(120, 53, 15, 0.48)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.42)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'desert_world' && levelId === 75 && bossId === 'zahrek') {
            return {
                key: 'desert_elite_75',
                appClass: 'boss-big-desert-elite75',
                spriteScale: 2.0,
                spriteOffsetY: -10,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(120, 53, 15, 0.48)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.42)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'desert_world' && levelId === 80 && bossId === 'warlord_grok') {
            return {
                key: 'desert_boss_80',
                appClass: 'boss-big-desert-boss80',
                spriteScale: 1.54,
                spriteOffsetX: -8,
                spriteOffsetY: -24,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(120, 53, 15, 0.48)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.42)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'castle_world' && levelId === 90 && bossId === 'gargoyle') {
            return {
                key: 'castle_elite_90',
                appClass: 'boss-big-castle-elite90',
                spriteScale: 2.24,
                spriteOffsetY: -10,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(76, 5, 25, 0.52)) drop-shadow(0 0 10px rgba(192, 132, 252, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'castle_world' && levelId === 95 && bossId === 'knight') {
            return {
                key: 'castle_elite_95',
                appClass: 'boss-big-castle-elite95',
                spriteScale: 2.26,
                spriteOffsetY: -10,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(76, 5, 25, 0.52)) drop-shadow(0 0 10px rgba(192, 132, 252, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (worldConfig.id === 'castle_world' && levelId === 100 && bossId === 'dark_wizard') {
            return {
                key: 'castle_boss_100',
                appClass: 'boss-big-castle-boss100',
                spriteScale: 1.92,
                spriteOffsetY: -14,
                nameOffsetX: -120,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(76, 5, 25, 0.52)) drop-shadow(0 0 10px rgba(192, 132, 252, 0.4)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        return null;
    }

	isIgnisBossPhase20() {
		// Compatibilidade retroativa: mantÃ©m o nome antigo para chamadas existentes.
		const cfg = this.getFireBossOverlayConfig();
		return !!(cfg && cfg.key === 'fire_boss_20');
	}

	updateIgnisBossUiOverride() {
		const overlayCfg = this.getFireBossOverlayConfig();
		const shouldApply = !!overlayCfg;
		const bossUiContainer = document.querySelector('.boss-ui-container');
		const bossHpHud = document.getElementById('boss-hp-hud');
		const appRoot = document.getElementById('app');
		const screenGame = document.getElementById('screen-game');
        const overlayClasses = [
            'boss-big-ignis',
            'boss-big-elite15',
            'boss-big-elite10',
            'boss-big-guardian',
            'boss-big-forest-elite30',
            'boss-big-forest-elite35',
            'boss-big-forest-boss40',
            'boss-big-mountain-elite50',
            'boss-big-mountain-elite55',
            'boss-big-mountain-boss60',
            'boss-big-desert-elite70',
            'boss-big-desert-elite75',
            'boss-big-desert-boss80',
            'boss-big-castle-elite90',
            'boss-big-castle-elite95',
            'boss-big-castle-boss100'
        ];
        const activeClass = overlayCfg?.appClass || null;

		if (bossUiContainer) {
            for (let i = 0; i < overlayClasses.length; i++) {
                const cls = overlayClasses[i];
                bossUiContainer.classList.toggle(cls, shouldApply && activeClass === cls);
            }
		}
		if (bossHpHud) {
            for (let i = 0; i < overlayClasses.length; i++) {
                const cls = overlayClasses[i];
                bossHpHud.classList.toggle(cls, shouldApply && activeClass === cls);
            }
		}
		if (appRoot) {
            for (let i = 0; i < overlayClasses.length; i++) {
                const cls = overlayClasses[i];
                appRoot.classList.toggle(cls, shouldApply && activeClass === cls);
            }
		}
		if (screenGame) {
            for (let i = 0; i < overlayClasses.length; i++) {
                const cls = overlayClasses[i];
                screenGame.classList.toggle(cls, shouldApply && activeClass === cls);
            }
		}

		if (shouldApply) {
			this.ensureIgnisSpriteOverlay();
			this.syncIgnisSpriteOverlay();
		} else {
			this.teardownIgnisSpriteOverlay();
		}
	}

	ensureIgnisSpriteOverlay() {
		if (this._ignisOverlayEl) return;
		const overlay = document.createElement('div');
		overlay.id = 'ignis-sprite-overlay';

		const sprite = document.createElement('div');
		sprite.className = 'ignis-sprite';
		const img = document.createElement('img');
		img.alt = 'Ignis';
		sprite.appendChild(img);

		const nameOverlay = document.createElement('div');
		nameOverlay.className = 'ignis-name-overlay';
		nameOverlay.textContent = 'Ignis';

		overlay.appendChild(sprite);
		overlay.appendChild(nameOverlay);
		document.body.appendChild(overlay);

		this._ignisOverlayEl = overlay;
		this._ignisOverlaySpriteEl = sprite;
		this._ignisOverlayImgEl = img;
		this._ignisOverlayNameEl = nameOverlay;

		if (!this._ignisOverlayResizeBound) {
			this._ignisOverlayResizeBound = () => this.syncIgnisSpriteOverlay();
			window.addEventListener('resize', this._ignisOverlayResizeBound);
		}
	}

	teardownIgnisSpriteOverlay() {
		if (this._ignisOverlayEl) {
			this._ignisOverlayEl.remove();
		}
        if (this._bossNameIntroAnim) {
            try { this._bossNameIntroAnim.cancel(); } catch (e) {}
            this._bossNameIntroAnim = null;
        }
        if (this._bossNameIntroTimer) {
            clearTimeout(this._bossNameIntroTimer);
            this._bossNameIntroTimer = null;
        }
        if (this._bossNameIntroRetryRaf) {
            cancelAnimationFrame(this._bossNameIntroRetryRaf);
            this._bossNameIntroRetryRaf = 0;
        }
        this.clearBossNameLetterIntro();
        this._bossNameIntroAnimating = false;
        this._bossNameIntroKey = null;
        this._bossNameIntroActiveKey = null;
		this._ignisOverlayEl = null;
		this._ignisOverlaySpriteEl = null;
		this._ignisOverlayImgEl = null;
		this._ignisOverlayNameEl = null;

		const avatar = document.getElementById('boss-hp-avatar') || document.getElementById('boss-target');
		if (avatar) {
			avatar.style.opacity = '';
		}
		const nameEl = document.getElementById('boss-hp-name');
		if (nameEl) {
			nameEl.style.visibility = '';
		}
	}

	syncIgnisSpriteOverlay() {
		if (!this._ignisOverlayEl || !this._ignisOverlaySpriteEl || !this._ignisOverlayImgEl || !this._ignisOverlayNameEl) return;
        const overlayCfg = this.getFireBossOverlayConfig();
		if (!overlayCfg) {
			this.teardownIgnisSpriteOverlay();
			return;
		}

		const avatar = document.getElementById('boss-hp-avatar') || document.getElementById('boss-target');
		if (!avatar) return;

		const style = getComputedStyle(avatar);
		const spriteUrl = style.getPropertyValue('--boss-sprite-url')?.trim();
		if (!spriteUrl) {
			this._ignisOverlayEl.style.display = 'none';
			avatar.style.opacity = '';
			return;
		}

		const rect = avatar.getBoundingClientRect();
		const sprite = this._ignisOverlaySpriteEl;
        const offsetX = Number.isFinite(overlayCfg.spriteOffsetX) ? overlayCfg.spriteOffsetX : 0;
		const offsetY = Number.isFinite(overlayCfg.spriteOffsetY) ? overlayCfg.spriteOffsetY : -12;
		const scale = Number.isFinite(overlayCfg.spriteScale) ? overlayCfg.spriteScale : 2.0;

		sprite.style.width = `${rect.width * scale}px`;
		sprite.style.height = `${rect.height * scale}px`;
		sprite.style.left = `${rect.left + rect.width / 2 + offsetX}px`;
		sprite.style.top = `${rect.top + rect.height / 2 + offsetY}px`;
		this._ignisOverlayImgEl.src = spriteUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        this._ignisOverlayImgEl.style.filter = overlayCfg.spriteFilter
            || 'drop-shadow(0 8px 14px rgba(185, 28, 28, 0.6)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) brightness(1.03)';

		const nameEl = document.getElementById('boss-hp-name');
		if (nameEl) {
			const nameRect = nameEl.getBoundingClientRect();
			const nameOffsetX = Number.isFinite(overlayCfg.nameOffsetX) ? overlayCfg.nameOffsetX : -130;
			const nameOffsetY = Number.isFinite(overlayCfg.nameOffsetY) ? overlayCfg.nameOffsetY : 115;
            const bossName = this.currentLevelConfig?.boss?.name || nameEl.textContent || 'Boss';
            const introToHud = overlayCfg.nameIntroToHud === true;
            const introKey = overlayCfg.key || `${this.currentLevelConfig?.id || 'level'}:${this.currentLevelConfig?.boss?.id || 'boss'}`;
            const hpBarEl =
                document.querySelector('#boss-hp-hud .boss-hp-bar-bg') ||
                document.querySelector('#boss-hp-hud .hp-bar-bg');
            const hpBarRect = hpBarEl ? hpBarEl.getBoundingClientRect() : null;
            const finalAdvance = 11.5;

            if (introToHud && (!hpBarRect || hpBarRect.width < 40 || hpBarRect.height < 10)) {
                const avatarCenterX = rect.left + (rect.width / 2);
                const avatarCenterY = rect.top + (rect.height / 2) + (Number.isFinite(overlayCfg.spriteOffsetY) ? overlayCfg.spriteOffsetY : 0);
                this._ignisOverlayNameEl.textContent = bossName;
                this._ignisOverlayNameEl.style.left = `${avatarCenterX}px`;
                this._ignisOverlayNameEl.style.top = `${avatarCenterY}px`;
                this._ignisOverlayNameEl.style.opacity = '1';
                this._ignisOverlayNameEl.style.fontFamily = '"Cinzel", "Poppins", serif';
                this._ignisOverlayNameEl.style.fontSize = 'clamp(1.2rem, 4vw, 2rem)';
                this._ignisOverlayNameEl.style.fontWeight = '600';
                this._ignisOverlayNameEl.style.letterSpacing = '1.6px';
                this._ignisOverlayNameEl.style.textShadow =
                    '0 3px 10px rgba(0,0,0,0.85), 0 0 14px rgba(34,211,238,0.45), 0 0 24px rgba(16,185,129,0.45)';
                nameEl.style.visibility = 'hidden';
                if (!this._bossNameIntroRetryRaf) {
                    this._bossNameIntroRetryRaf = requestAnimationFrame(() => {
                        this._bossNameIntroRetryRaf = requestAnimationFrame(() => {
                            this._bossNameIntroRetryRaf = 0;
                            this.syncIgnisSpriteOverlay();
                        });
                    });
                }
                return;
            }

            let targetX = nameRect.left + nameRect.width / 2 + nameOffsetX;
            if (hpBarRect) {
                const defaultCenterX = hpBarRect.left + Math.min(66, hpBarRect.width * 0.12);
                const fenrirFirstOffset = this.getBossNameFirstVisibleOffset('Fenrir', finalAdvance);
                const defaultFirstLetterX = defaultCenterX + fenrirFirstOffset;
                const thisFirstOffset = this.getBossNameFirstVisibleOffset(bossName, finalAdvance);

                const firstLetterX = Number.isFinite(overlayCfg.nameBarFirstLetterPx) || Number.isFinite(overlayCfg.nameBarFirstLetterRatio)
                    ? (
                        hpBarRect.left +
                        Math.min(
                            Number.isFinite(overlayCfg.nameBarFirstLetterPx) ? overlayCfg.nameBarFirstLetterPx : 38,
                            hpBarRect.width * (Number.isFinite(overlayCfg.nameBarFirstLetterRatio) ? overlayCfg.nameBarFirstLetterRatio : 0.09)
                        )
                    )
                    : defaultFirstLetterX;

                targetX = firstLetterX - thisFirstOffset;
            }
            const targetY = hpBarRect
                ? (hpBarRect.top + hpBarRect.height / 2)
                : (nameRect.top + nameRect.height / 2 + nameOffsetY);

            this._ignisOverlayNameEl.textContent = bossName;

            if (introToHud) {
                if (this._bossNameIntroKey !== overlayCfg.key) {
                    this._bossNameIntroKey = overlayCfg.key;
                    this._bossNameIntroPlayed = false;
                    this._bossNameIntroAnimating = false;
                    this._bossNameIntroActiveKey = null;
                }

                if (!this._bossNameIntroPlayed) {
                    nameEl.style.visibility = 'hidden';
                    if (!this._bossNameIntroAnimating) {
                        this.playBossNameIntroToHud({
                            bossName,
                            targetX,
                            targetY,
                            overlayCfg,
                            nameEl,
                            introKey
                        });
                    }
                } else {
                    // ApÃ³s a intro, mantemos apenas as letras jÃ¡ fixadas na barra.
                    // Evita duplicaÃ§Ã£o (texto-base + letras) e flicker lateral.
                    this._ignisOverlayNameEl.style.opacity = '0';
                    this._ignisOverlayNameEl.textContent = '';
                    nameEl.style.visibility = 'hidden';
                }
            } else {
                this._ignisOverlayNameEl.style.left = `${targetX}px`;
                this._ignisOverlayNameEl.style.top = `${targetY}px`;
                nameEl.style.visibility = 'hidden';
            }
		}

		this._ignisOverlayEl.style.display = 'block';
		avatar.style.opacity = '0';
	}

    clearBossNameLetterIntro() {
        if (this._bossNameLetterAnims && this._bossNameLetterAnims.length > 0) {
            for (let i = 0; i < this._bossNameLetterAnims.length; i++) {
                const anim = this._bossNameLetterAnims[i];
                if (!anim) continue;
                try { anim.cancel(); } catch (e) {}
            }
        }
        this._bossNameLetterAnims = [];

        if (this._bossNameLetterNodes && this._bossNameLetterNodes.length > 0) {
            for (let i = 0; i < this._bossNameLetterNodes.length; i++) {
                const node = this._bossNameLetterNodes[i];
                if (node && node.parentNode) node.parentNode.removeChild(node);
            }
        }
        this._bossNameLetterNodes = [];
    }

    buildBossNameOffsets(text, advance) {
        const chars = Array.from(String(text || ''));
        const widths = chars.map((ch) => (ch === ' ' ? advance * 0.5 : advance));
        const total = widths.reduce((sum, w) => sum + w, 0);
        let cursor = -total / 2;
        const offsets = widths.map((w) => {
            const x = cursor + (w / 2);
            cursor += w;
            return x;
        });
        return { chars, offsets, widths, total };
    }

    getBossNameFirstVisibleOffset(text, advance) {
        const layout = this.buildBossNameOffsets(text, advance);
        for (let i = 0; i < layout.chars.length; i++) {
            if (layout.chars[i] !== ' ') return layout.offsets[i];
        }
        return 0;
    }

    playBossNameIntroToHud({ bossName, targetX, targetY, overlayCfg, nameEl, introKey }) {
        if (!this._ignisOverlayNameEl) return;
        if (!introKey) return;

        this.clearBossNameLetterIntro();
        const overlayNameEl = this._ignisOverlayNameEl;
        const avatarEl = document.getElementById('boss-hp-avatar') || document.getElementById('boss-target');
        const avatarRect = avatarEl ? avatarEl.getBoundingClientRect() : null;
        const spriteRect = this._ignisOverlaySpriteEl?.getBoundingClientRect();
        const hasAvatarRect = !!(avatarRect && avatarRect.width > 0 && avatarRect.height > 0);
        const hasSpriteRect = !!(spriteRect && spriteRect.width > 0 && spriteRect.height > 0);
        const midX = hasAvatarRect
            ? (avatarRect.left + avatarRect.width / 2)
            : (hasSpriteRect ? (spriteRect.left + spriteRect.width / 2) : targetX);
        const midY = hasAvatarRect
            ? (avatarRect.top + avatarRect.height / 2)
            : (hasSpriteRect ? (spriteRect.top + spriteRect.height / 2) : Math.max(150, window.innerHeight * 0.34));
        const startX = midX;
        const startY = Math.max(78, window.innerHeight * 0.12);
        const dy = startY - targetY;

        overlayNameEl.textContent = bossName || 'Boss';
        overlayNameEl.style.left = `${midX}px`;
        overlayNameEl.style.top = `${midY}px`;
        overlayNameEl.style.fontFamily = '"Cinzel", "Poppins", serif';
        overlayNameEl.style.fontSize = 'clamp(1.4rem, 4.8vw, 2.3rem)';
        overlayNameEl.style.letterSpacing = '2.4px';
        overlayNameEl.style.textShadow =
            '0 3px 10px rgba(0,0,0,0.85), 0 0 14px rgba(34,211,238,0.45), 0 0 24px rgba(16,185,129,0.45)';

        this._bossNameIntroAnimating = true;
        this._bossNameIntroActiveKey = introKey;
        if (this._bossNameIntroAnim) {
            try { this._bossNameIntroAnim.cancel(); } catch (e) {}
            this._bossNameIntroAnim = null;
        }

        const introAnim = overlayNameEl.animate([
            {
                opacity: 0,
                transform: `translate(-50%, -50%) translate(0px, ${dy}px) scale(1.24)`
            },
            {
                opacity: 1,
                transform: `translate(-50%, -50%) translate(0px, ${dy * 0.38}px) scale(1.08)`,
                offset: 0.18
            },
            {
                opacity: 1,
                transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1.02)',
                offset: 0.78
            },
            {
                opacity: 1,
                transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1)',
                offset: 1
            }
        ], {
            duration: 760,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
        });
        this._bossNameIntroAnim = introAnim;

        introAnim.onfinish = () => {
            if (this._bossNameIntroActiveKey !== introKey) return;
            // Libera os estilos "fill: forwards" para permitir controle total via inline style
            try { introAnim.cancel(); } catch (e) {}
            if (this._bossNameIntroAnim === introAnim) {
                this._bossNameIntroAnim = null;
            }
            this._bossNameIntroTimer = setTimeout(() => {
                if (this._bossNameIntroActiveKey !== introKey) return;
                if (!this._bossNameIntroAnimating) return;
                const initialAdvance = 20;
                const finalAdvance = 11.5;
                const letterDelay = 68;
                const travelDuration = 520;
                const initialLayout = this.buildBossNameOffsets(bossName || 'Boss', initialAdvance);
                const finalLayout = this.buildBossNameOffsets(bossName || 'Boss', finalAdvance);
                const chars = initialLayout.chars;
                const initialOffsets = initialLayout.offsets;
                const finalOffsets = finalLayout.offsets;

                const nodes = [];
                const anims = [];
                let finished = 0;

                for (let i = 0; i < chars.length; i++) {
                    const ch = chars[i];
                    if (ch === ' ') {
                        continue;
                    }

                    const letterEl = document.createElement('span');
                    letterEl.className = 'ignis-name-letter';
                    letterEl.textContent = ch;
                    letterEl.style.position = 'absolute';
                    letterEl.style.left = `${midX + initialOffsets[i]}px`;
                    letterEl.style.top = `${midY}px`;
                    letterEl.style.transform = 'translate(-50%, -50%)';
                    letterEl.style.pointerEvents = 'none';
                    letterEl.style.whiteSpace = 'pre';
                    letterEl.style.fontFamily = '"Cinzel", "Poppins", serif';
                    letterEl.style.fontSize = 'clamp(1.2rem, 4vw, 2rem)';
                    letterEl.style.fontWeight = '400';
                    letterEl.style.letterSpacing = '0px';
                    letterEl.style.color = '#d1fae5';
                    letterEl.style.textShadow =
                        '0 3px 10px rgba(0,0,0,0.85), 0 0 14px rgba(34,211,238,0.45), 0 0 24px rgba(16,185,129,0.45)';
                    letterEl.style.zIndex = '65';
                    this._ignisOverlayEl.appendChild(letterEl);
                    nodes.push(letterEl);

                    const endX = targetX + finalOffsets[i];
                    const endY = targetY;
                    const travelX = endX - (midX + initialOffsets[i]);
                    const travelY = endY - midY;
                    const moveAnim = letterEl.animate([
                        {
                            opacity: 1,
                            transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1.08)'
                        },
                        {
                            opacity: 1,
                            transform: `translate(-50%, -50%) translate(${travelX}px, ${travelY}px) scale(0.98)`
                        }
                    ], {
                        delay: i * letterDelay,
                        duration: travelDuration,
                        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                        fill: 'none'
                    });
                    anims.push(moveAnim);

                    moveAnim.onfinish = () => {
                        if (this._bossNameIntroActiveKey !== introKey) return;
                        try { moveAnim.cancel(); } catch (e) {}
                        finished++;
                        const staticLetterEl = document.createElement('span');
                        staticLetterEl.className = 'ignis-name-letter';
                        staticLetterEl.textContent = ch;
                        staticLetterEl.style.position = 'absolute';
                        staticLetterEl.style.left = `${endX}px`;
                        staticLetterEl.style.top = `${endY}px`;
                        staticLetterEl.style.transform = 'translate(-50%, -50%) scale(1)';
                        staticLetterEl.style.pointerEvents = 'none';
                        staticLetterEl.style.whiteSpace = 'pre';
                        staticLetterEl.style.fontFamily = '"Cinzel", "Poppins", serif';
                        staticLetterEl.style.fontSize = 'clamp(0.86rem, 2.4vw, 1.02rem)';
                        staticLetterEl.style.fontWeight = '700';
                        staticLetterEl.style.letterSpacing = '0px';
                        staticLetterEl.style.color = '#d1fae5';
                        staticLetterEl.style.textShadow =
                            '0 2px 6px rgba(0,0,0,0.8), 0 0 8px rgba(15,23,42,0.45)';
                        staticLetterEl.style.zIndex = '65';
                        if (this._ignisOverlayEl) {
                            this._ignisOverlayEl.appendChild(staticLetterEl);
                        }
                        const nodeIdx = nodes.indexOf(letterEl);
                        if (nodeIdx >= 0) nodes[nodeIdx] = staticLetterEl;
                        if (letterEl.parentNode) letterEl.parentNode.removeChild(letterEl);

                        if (finished === nodes.length) {
                            if (this._bossNameIntroActiveKey !== introKey) return;
                            this._bossNameIntroAnimating = false;
                            this._bossNameIntroPlayed = true;
                            this._bossNameIntroActiveKey = null;
                            // MantÃ©m as letras fixas onde chegaram, sem reconstruir texto-base.
                            overlayNameEl.style.opacity = '0';
                            overlayNameEl.textContent = '';
                            if (nameEl) nameEl.style.visibility = 'hidden';
                        }
                    };
                }

                this._bossNameLetterNodes = nodes;
                this._bossNameLetterAnims = anims;
                if (nodes.length === 0) {
                    if (this._bossNameIntroActiveKey !== introKey) return;
                    this._bossNameIntroAnimating = false;
                    this._bossNameIntroPlayed = true;
                    this._bossNameIntroActiveKey = null;
                    overlayNameEl.style.opacity = '0';
                    overlayNameEl.textContent = '';
                    if (nameEl) nameEl.style.visibility = 'hidden';
                } else {
                    // Evita "blink": sÃ³ oculta o texto-base apÃ³s as letras
                    // jÃ¡ estarem montadas no mesmo frame.
                    requestAnimationFrame(() => {
                        overlayNameEl.style.opacity = '0';
                        overlayNameEl.textContent = '';
                    });
                }
                this._bossNameIntroTimer = null;
            }, 360);
        };
    }

	applyGuardianBossSprite(avatarElement) {
		// Mantem o wrapper antigo so para compatibilidade
		this.applyBossSprite(avatarElement);
	}

	// --- NOVO SISTEMA DE HISTÃ“RIA E SELEÃ‡ÃƒO ---

	showCampfireScene() {
        const screen = document.getElementById('screen-campfire');
        const textEl = document.getElementById('campfire-text');
        const btnTextEl = document.getElementById('campfire-btn-text');
        
        if (!screen) return;

        const bgImage = (this.playerClass === 'warrior') 
            ? 'assets/img/bg_campfire_warrior.webp' 
            : 'assets/img/bg_campfire_mage.webp';
        this.preloadImage(bgImage);
        
        screen.style.backgroundImage = `url('${bgImage}')`;

        if (textEl) textEl.innerHTML = this.i18n.t('campfire.text').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fbbf24">$1</strong>');
        if (btnTextEl) btnTextEl.innerText = this.i18n.t('campfire.btn_start');

        this.showScreen(screen);
        this.toggleGlobalHeader(false);

        const btnStart = document.getElementById('btn-start-boss');
        if (btnStart) {
            const newBtn = btnStart.cloneNode(true);
            btnStart.parentNode.replaceChild(newBtn, btnStart);
            
            newBtn.addEventListener('click', () => {
                if (this.audio) {
                    this.audio.playClick();
                }

                // MUDANÃ‡A AQUI: Vai para o MAPA, onde a mÃ£ozinha vai guiar
                this.showWorldSelect(); 
            });
        }
    }

    playStory() {
        this.preloadDeferredAssets('story_intro');
        this.showScreen(this.screenStory);
        this.toggleGlobalHeader(false);
        this.storyStep = 0;
        this.renderStorySlide();

        // Configura botÃµes da tela de histÃ³ria (caso nÃ£o tenham sido configurados no setupMenuEvents)
        // Dica: Idealmente mova esses listeners para setupMenuEvents, mas aqui garante que funcione agora
        const btnNext = document.getElementById('btn-next-slide');
        const btnSkip = document.getElementById('btn-skip-story');
        
        // Remove listeners antigos para evitar duplicaÃ§Ã£o (cloneNode trick)
        if(btnNext) {
            const newNext = btnNext.cloneNode(true);
            btnNext.parentNode.replaceChild(newNext, btnNext);
            newNext.onclick = () => {
                if(this.audio) this.audio.playClick();
                this.storyStep++;
                this.renderStorySlide();
            };
        }

        if(btnSkip) {
            const newSkip = btnSkip.cloneNode(true);
            btnSkip.parentNode.replaceChild(newSkip, btnSkip);
            newSkip.onclick = () => {
                if(this.audio) this.audio.playClick();
                this.showHeroSelection();
            };
        }
    }

    buildStorySequence(includeAfter = false) {
        const base = [
            { textKey: 'story_slides.1', imageSrc: './assets/img/thalion_story_1.png' },
            { textKey: 'story_slides.2', imageSrc: './assets/img/thalion_story_2.png' },
            { textKey: 'story_slides.3', imageSrc: './assets/img/thalion_story_3.png' },
            { textKey: 'story_slides.4', imageSrc: './assets/img/thalion_story_4.png' },
            { textKey: 'story_slides.5', imageSrc: './assets/img/thalion_story_5.png' },
            { textKey: 'story_slides.6', imageSrc: './assets/img/thalion_story_6.png' }
        ];

        if (!includeAfter) return base;
        this.preloadDeferredAssets('story_after');

        const extra = [
            { seenKey: 'blocklands_story_guardian_seen', textKey: 'story_guardian_gate_opening', imageSrc: 'assets/img/story_guardian_gate_opening.webp' },
            { seenKey: 'blocklands_story_fire_ignis_seen', textKey: 'story_fire_ignis_aftermath', imageSrc: 'assets/img/story_fire_ignis_aftermath.webp' },
            { seenKey: 'blocklands_story_forest_aracna_seen', textKey: 'story_forest_aracna_aftermath', imageSrc: 'assets/img/story_forest_aracna_aftermath.webp' },
            { seenKey: 'blocklands_story_mountain_golem_seen', textKey: 'story_mountain_golem_aftermath', imageSrc: 'assets/img/story_mountain_golem_aftermath.webp' },
            { seenKey: 'blocklands_story_desert_grok_seen', textKey: 'story_desert_grok_aftermath', imageSrc: 'assets/img/story_desert_grok_aftermath.webp' },
            { seenKey: 'blocklands_story_castle_dark_wizard_seen', textKey: 'story_castle_dark_wizard_aftermath', imageSrc: 'assets/img/story_castle_dark_wizard_aftermath.webp' }
        ];

        const unlocked = extra.filter(s => localStorage.getItem(s.seenKey) === 'true');
        return base.concat(unlocked);
    }

    renderStorySlide() {
        const textEl = document.getElementById('story-text');
        const imgEl = document.getElementById('story-reaction-img');
        
        if (!textEl || !imgEl) return;

        const sequence = this._storySequence || this.buildStorySequence(false);

        if (this.storyStep < sequence.length) {
            // LÃ³gica de exibiÃ§Ã£o (mantida igual)
            textEl.style.opacity = 0;
            imgEl.style.opacity = 0;

            setTimeout(() => {
                const slide = sequence[this.storyStep];
                textEl.innerText = this.i18n.t(slide.textKey);
                if (slide.imageSrc) imgEl.src = slide.imageSrc;
                requestAnimationFrame(() => {
                    textEl.style.opacity = 1;
                    imgEl.style.opacity = 1;
                });
            }, 200);

        } else {
            // --- MUDANÃ‡A AQUI: O que fazer ao fim da histÃ³ria? ---
            const savedClass = localStorage.getItem('blocklands_player_class');
            
            if (this._storyReplayMode || savedClass) {
                // Se jÃ¡ tem classe (estÃ¡ apenas revendo a histÃ³ria), volta pro Mapa
                this.showWorldSelect();
            } else {
                // Se NÃƒO tem classe (primeira vez), vai para a SeleÃ§Ã£o
                this.showHeroSelection();
            }
        }
    }

    showSingleStory({ textKey, imageSrc, onDone }) {
        const textEl = document.getElementById('story-text');
        const imgEl = document.getElementById('story-reaction-img');
        const screen = this.screenStory || document.getElementById('screen-story');
        if (!textKey || !textEl || !imgEl || !screen) return;
        if (imageSrc) this.preloadImage(imageSrc);

        this.showScreen(this.screenStory);
        this.toggleGlobalHeader(false);

        textEl.style.opacity = 0;
        imgEl.style.opacity = 0;
        imgEl.style.display = 'none';
        if (imageSrc) {
            screen.style.backgroundImage = `url('${imageSrc}')`;
            screen.style.backgroundSize = 'cover';
            screen.style.backgroundPosition = 'center';
        }

        setTimeout(() => {
            textEl.innerText = this.i18n.t(textKey);
            requestAnimationFrame(() => {
                textEl.style.opacity = 1;
            });
        }, 200);

        const bindStoryExit = (id) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.onclick = () => {
                if (this.audio) this.audio.playClick();
                if (typeof onDone === 'function') onDone();
            };
        };

        bindStoryExit('btn-next-slide');
        bindStoryExit('btn-skip-story');
    }

    showHeroSelection() {
        this.showScreen(this.screenHeroSelect);
        this.toggleGlobalHeader(false);
    }

    selectHero(heroId) {
        if(this.audio) {
            this.audio.playClick();
            if (heroId === 'warrior') this.audio.playSword(); 
            if (heroId === 'mage') this.audio.playMage();
        }

        // Salva a escolha
        this.playerClass = heroId;
        localStorage.setItem('blocklands_player_class', heroId);

        // Feedback visual no card
        const card = document.getElementById(`card-${heroId}`);
        if(card) {
            card.style.transform = 'scale(1.05)';
            card.style.borderColor = '#fbbf24';
            card.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.4)';
        }

        // Aguarda 800ms (tempo de ver o card brilhar) e inicia a transiÃ§Ã£o fake
        setTimeout(() => {
            this.runHeroTransition(heroId);
        }, 800);
    }
	
	runHeroTransition(heroId) {
        const screen = document.getElementById('loading-screen');
        const bar = document.getElementById('loading-bar-fill');
        const text = document.getElementById('loading-text');

        if (!screen || !bar) return;

        // 1. Prepara a tela (Reseta o estado anterior)
        screen.classList.remove('fade-out');
        screen.style.display = 'flex';
        screen.style.opacity = '1';
        bar.style.width = '0%';

        // 2. Define os textos baseados na classe
        const msg1 = (heroId === 'warrior') ? this.i18n.t('hero_loading.warrior_1') : this.i18n.t('hero_loading.mage_1');
        const msg2 = (heroId === 'warrior') ? this.i18n.t('hero_loading.warrior_2') : this.i18n.t('hero_loading.mage_2');
        const msgFinal = this.i18n.t('hero_loading.common');

        if(text) text.innerText = msg1;

        // 3. AnimaÃ§Ã£o Fake (Barra enchendo)
        let progress = 0;
        const duration = 2500; // 2.5 segundos de "loading"
        const intervalTime = 30;
        const steps = duration / intervalTime;
        const increment = 100 / steps;

        const interval = setInterval(() => {
            progress += increment;
            
            // VariaÃ§Ã£o orgÃ¢nica na velocidade (dÃ¡ uma travadinha nos 70% pra parecer real)
            if (progress > 70 && progress < 80) progress -= (increment * 0.5); 

            // Atualiza visual
            bar.style.width = Math.min(progress, 100) + '%';

            // Troca de texto em 40% e 80%
            if (progress > 40 && progress < 80 && text) text.innerText = msg2;
            if (progress >= 80 && text) text.innerText = msgFinal;

            // FIM DO LOADING
            if (progress >= 100) {
                clearInterval(interval);
                bar.style.width = '100%';
                
                // Pequeno delay final antes de sumir
                setTimeout(() => {
                    // Inicia o nÃ­vel de verdade (por trÃ¡s da cortina)
                    const tutorialWorld = WORLDS.find(w => w.id === 'tutorial_world');
                    if (tutorialWorld) {
                        const tutorialLevel = tutorialWorld.levels[0];
                        this.showCampfireScene();
                    }

                    // Fade out da tela de loading
                    screen.classList.add('fade-out');
                    setTimeout(() => {
                        screen.style.display = 'none';
                    }, 800);

                }, 500);
            }
        }, intervalTime);
    }

    restoreGameState(targetLevelId) {
    const raw = localStorage.getItem('blocklands_savestate');
    if (!raw) return false;

    try {
        const state = JSON.parse(raw);

        // SeguranÃ§a: SÃ³ carrega se o save for do mesmo nÃ­vel que estamos tentando abrir
        if (state.levelId !== targetLevelId) return false;

        // Restaura os dados
        this.grid = state.grid;
        this.score = state.score;
        this.currentHand = state.hand;
        this.bossState = state.bossState;
        this.heroState = state.heroState;
        this.currentGoals = state.currentGoals;
        this.collected = state.collected;
        this.comboState = state.comboState || { count: 0, lastClearTime: 0 };

        // âœ… IMPORTANTÃSSIMO: o grid foi trocado, entÃ£o o cache de vazios ficou invÃ¡lido
        this._emptyCells = null;
        this._emptyCellsDirty = true;

        // Recarrega Powerups do localStorage (fonte da verdade)
        // Nunca usa state.powerUps pois pode estar desatualizado
        this.loadPowerUps();

        // Atualiza a UI Visualmente
        this.renderGrid();
        this.renderDock();
        this.renderControlsUI(); // Atualiza botÃµes de herÃ³i/powerup

        if (this.bossState.active) {
            this.setupBossUI(this.currentLevelConfig.boss); // Recria a estrutura HTML
            this.ensureBossHud(this.currentLevelConfig.boss);
            this.updateBossUI(); // Atualiza a vida
        } else {
            // Recria a UI dos goals (isso zera this.collected internamente)
            this.setupGoalsUI(this.currentGoals);

            // REAPLICA o progresso salvo
            this.collected = state.collected || this.collected;

            // Atualiza nÃºmeros/estado completado na UI
            this.updateGoalsUI();
        }

        return true; // Sucesso
    } catch (e) {
        console.error('Erro ao carregar save:', e);
        return false;
    }
}


    clearSavedGame() {
    this.cancelPendingSaveGameState();

    try {
        localStorage.removeItem('blocklands_savestate');
    } catch (e) {
        console.warn('Falha ao remover save:', e);
    }

    this._lastSavedJson = null;
}


    loadSettings() {
        const saved = localStorage.getItem('blocklands_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    this.settings = { ...this.settings, ...parsed };
                }
            } catch (error) {
                console.warn('[SETTINGS] Failed to parse settings, using defaults.', error);
            }
        }
        if (!this.settings.performanceMode) this.settings.performanceMode = 'auto';
        this.applySettings();
    }

    saveSettings() {
        localStorage.setItem('blocklands_settings', JSON.stringify(this.settings));
        this.applySettings();
    }

    applySettings() {
        // Aplica Ãudio (Se o AudioSystem estiver pronto)
        if (this.audio) {
            // Se mÃºsica off -> volume 0. Se on -> volume 0.3 (padrÃ£o do audio.js)
            if (this.audio.bgmGain) {
                this.audio.bgmGain.gain.value = this.settings.music ? 0.3 : 0;
            }
            if (this.audio.masterGain) {
                this.audio.masterGain.gain.value = this.settings.sfx ? 0.5 : 0;
            }
        }
        this.applyPerformancePreference();
        // A vibraÃ§Ã£o Ã© checada na hora de usar (this.audio.vibrate)
    }

    loadProgress() {
        const saved = localStorage.getItem('blocklands_progress_main');
        const progress = saved ? parseInt(saved) : 0;

        if (DEBUG_UNLOCK_ALL_ADVENTURE) {
            return Math.max(progress, DEBUG_UNLOCK_ALL_ADVENTURE_LEVEL);
        }

        return progress;
    }

    saveProgress(levelId) {
        const currentSaved = this.loadProgress();
        if (levelId > currentSaved) {
            localStorage.setItem('blocklands_progress_main', levelId);
        }
    }

    // ============================================
    // SISTEMA DE CRISTAIS - ECONOMIA DO JOGO
    // ============================================

    /**
     * Carrega estatÃ­sticas diÃ¡rias para controle de primeira vitÃ³ria do dia
     */
    loadDailyStats() {
        const saved = localStorage.getItem('blocklands_daily_stats');
        if (!saved) {
            return { lastPlayDate: null, firstWinClaimed: false };
        }

        try {
            const stats = JSON.parse(saved);
            const today = new Date().toDateString();

            // Se mudou de dia, reseta o flag de primeira vitÃ³ria
            if (stats.lastPlayDate !== today) {
                stats.firstWinClaimed = false;
                stats.lastPlayDate = today;
                this.saveDailyStats(stats);
            }

            return stats;
        } catch (e) {
            console.warn('[CRYSTALS] Erro ao carregar daily stats:', e);
            return { lastPlayDate: null, firstWinClaimed: false };
        }
    }

    /**
     * Salva estatÃ­sticas diÃ¡rias
     */
    saveDailyStats(stats) {
        try {
            localStorage.setItem('blocklands_daily_stats', JSON.stringify(stats));
        } catch (error) {
            console.error('[CRYSTALS] Erro em saveDailyStats:', error);
        }
    }

    resetMatchRewards() {
        this._matchRewards = { crystals: 0, xp: 0 };
        this._matchRewardsActive = true;
    }

    getSlotFullLabel() {
        const lang = this.i18n?.currentLang || 'en';
        return lang === 'pt-BR' ? 'Slot cheio' : 'Slot full';
    }

    rollAdventurePowerupReward() {
        const chance = 0.08; // 8% chance
        if (Math.random() > chance) return null;

        const types = ['magnet', 'rotate', 'swap'];
        const type = types[Math.floor(Math.random() * types.length)];
        const current = this.powerUps?.[type] || 0;
        const isFull = current >= MAX_POWERUP_COUNT;

        if (!isFull) {
            this.powerUps[type] = current + 1;
            this.savePowerUps();
            this.renderControlsUI();
        }

        return { type, isFull };
    }

    /**
     * Adiciona cristais ao saldo do jogador
     * @param {number} amount - Quantidade de cristais a adicionar
     * @param {string} reason - Motivo do ganho (para log/analytics)
     * @param {boolean} animated - Se deve mostrar animaÃ§Ã£o
     */
    addCrystals(amount, reason = 'unknown', animated = true) {
        try {
            if (amount <= 0) return;

            if (this._matchRewardsActive && this.currentMode === 'adventure' && this.currentLevelConfig) {
                this._matchRewards.crystals += amount;
            }

            const oldAmount = this.crystals;
            this.crystals += amount;

            // Salva no localStorage
            localStorage.setItem('blocklands_crystals', this.crystals.toString());

            console.log(`[CRYSTALS] +${amount} cristais (${reason}). Total: ${this.crystals}`);

            // Atualiza display (sempre sem animaÃ§Ã£o para evitar conflitos)
            this.updateCrystalDisplay(null);

            // NotificaÃ§Ãµes popup desabilitadas (causavam conflito com fluxo do jogo)

            // Trigger para achievements (se existir e tiver mÃ©todo trackEvent)
            if (this.achievements && typeof this.achievements.trackEvent === 'function') {
                try {
                    this.achievements.trackEvent('crystals_earned', { amount: amount });
                    this.achievements.trackEvent('crystals_total', { total: this.crystals });
                } catch (e) {
                    console.warn('[CRYSTALS] Erro ao trackear achievement:', e);
                }
            }
        } catch (error) {
            console.error('[CRYSTALS] ERRO CRÃTICO em addCrystals:', error);
            // NÃƒO deixa o erro propagar para nÃ£o quebrar o jogo
        }
    }

    /**
     * Atualiza o display de cristais na UI (menu + tela de jogo)
     * @param {number|null} fromValue - Valor inicial para animaÃ§Ã£o (null = sem animaÃ§Ã£o)
     */
    updateCrystalDisplay(fromValue = null) {
        try {
            const valueText = this.crystals.toLocaleString();

            // Atualiza badge do menu principal
            if (this.crystalValueEl) {
                this.crystalValueEl.textContent = valueText;
            }

            // Atualiza badge da tela de jogo
            if (this.crystalValueGameEl) {
                this.crystalValueGameEl.textContent = valueText;
            }

            // Atualiza badge da loja
            if (this.crystalValueStoreEl) {
                this.crystalValueStoreEl.textContent = valueText;
            }
        } catch (error) {
            console.error('[CRYSTALS] ERRO em updateCrystalDisplay:', error);
            // NÃƒO deixa o erro propagar
        }
    }

    initProgressionUI() {
        this.progressionEls = {
            avatar: document.getElementById('rank-avatar'),
            rank: document.getElementById('rank-title'),
            xpFill: document.getElementById('rank-xp-fill'),
            xpText: document.getElementById('rank-xp-text')
        };
    }

    updateProgressionUI(snapshot) {
        if (!snapshot) return;
        if (!this.progressionEls) this.initProgressionUI();

        const { avatar, rank, xpFill, xpText } = this.progressionEls || {};
        const roman = snapshot.levelRoman || getRomanNumeral(snapshot.level);
        const rankText = `${snapshot.rank} ${roman}`;

        if (rank) rank.textContent = rankText;
        if (xpText) xpText.textContent = `${snapshot.xp} / ${snapshot.xpToNext}`;

        if (xpFill) {
            const percent = snapshot.xpToNext > 0 ? Math.min((snapshot.xp / snapshot.xpToNext) * 100, 100) : 0;
            xpFill.style.width = `${percent}%`;
        }

        if (avatar && snapshot.rankInfo) {
            if (this.lastRankIndex !== snapshot.rankIndex) {
                avatar.textContent = snapshot.rankInfo.avatar;
                avatar.style.background = snapshot.rankInfo.theme.bg;
                avatar.style.borderColor = snapshot.rankInfo.theme.border;
                this.lastRankIndex = snapshot.rankIndex;
            }
        }
    }

    awardXP(amount, reason) {
        if (!this.progression) return;
        if (this._matchRewardsActive && this.currentMode === 'adventure' && this.currentLevelConfig) {
            const delta = Math.max(0, Math.floor(amount || 0));
            if (delta) this._matchRewards.xp += delta;
        }
        if (this._classicXpActive && this.currentMode === 'classic') {
            const delta = Math.max(0, Math.floor(amount || 0));
            if (delta) this._classicMatchXp += delta;
        }
        if (this._blitzXpActive && this.currentMode === 'blitz') {
            const delta = Math.max(0, Math.floor(amount || 0));
            if (delta) this._blitzMatchXp += delta;
        }
        this.progression.addXP(amount, reason);
    }

    showLevelUpToast(snapshot) {
        if (!snapshot) return;

        const toast = document.createElement('div');
        toast.className = 'levelup-toast';
        const levelUpText = this.i18n ? this.i18n.t('progression.level_up') : 'Level up!';
        const levelUpIcon = snapshot.rankInfo?.avatar || 'â­';
        toast.innerHTML = `
            <div class="levelup-toast-title">${levelUpIcon} ${levelUpText}</div>
            <div class="levelup-toast-rank">${snapshot.rank} ${snapshot.levelRoman}</div>
        `;

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 200);
        }, 1500);
    }

    showRankUpModal(snapshot) {
        if (!snapshot || !snapshot.rankInfo) return;

        const modal = document.createElement('div');
        modal.className = 'rankup-modal';
        const rankUpText = this.i18n ? this.i18n.t('progression.rank_up') : 'NEW RANK';
        const continueText = this.i18n ? this.i18n.t('progression.continue') : 'Continue';
        const rankIcon = snapshot.rankInfo.avatar || 'â­';
        modal.innerHTML = `
            <div class="rankup-panel">
                <div class="rankup-emblem">${rankIcon}</div>
                <div class="rankup-title">${rankIcon} ${rankUpText}</div>
                <div class="rankup-name">${snapshot.rank.toUpperCase()}</div>
                <button class="rankup-btn" type="button">${continueText}</button>
            </div>
        `;

        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('show'));

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 200);
        };

        modal.querySelector('.rankup-btn').addEventListener('click', closeModal);
    }


    /**
     * Anima o contador de cristais de um valor para outro
     */
    animateCrystalCounter(from, to) {
        const duration = 800; // ms
        const startTime = Date.now();
        const diff = to - from;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            const currentValue = Math.floor(from + (diff * easeProgress));

            this.crystalValueEl.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.crystalValueEl.textContent = to.toLocaleString();
            }
        };

        animate();
    }

    /**
     * Mostra notificaÃ§Ã£o visual de ganho de cristais
     * DESABILITADO: NotificaÃ§Ãµes popup causam conflito com fluxo do jogo
     */
    showCrystalNotification(amount, reason) {
        // Sistema desabilitado - apenas console log para debug
        if (RUNTIME_LOGS) console.log(`[CRYSTALS] \u{1F48E} +${amount} (${this.getCrystalReasonText(reason)})`);

        // NotificaÃ§Ãµes popup removidas - apenas o contador no header Ã© suficiente
        // O jogador vÃª o valor aumentando no canto superior direito
    }

    /**
     * Retorna texto traduzido para o motivo do ganho
     */
    getCrystalReasonText(reason) {
        const reasons = {
            'level_complete': 'Nivel Completado',
            'level_2stars': 'Excelente! **',
            'level_3stars': 'Perfeito! ***',
            'boss_defeated': 'Chefao Derrotado!',
            'world_unlocked': 'Novo Mundo!',
            'score_milestone': 'Marco de Pontuacao',
            'new_record': 'Novo Recorde!',
            'mission_complete': 'Missao Completa',
            'all_missions': 'Todas as Missoes!',
            'first_win': 'Primeira Vitoria do Dia',
            'achievement': 'Conquista Desbloqueada'
        };

        return reasons[reason] || 'Cristais Ganhos';
    }

    /**
     * Verifica e recompensa cristais por primeira vitÃ³ria do dia
     */
    checkFirstWinOfDay() {
        try {
            const today = new Date().toDateString();

            if (this.dailyStats.lastPlayDate !== today) {
                this.dailyStats.lastPlayDate = today;
                this.dailyStats.firstWinClaimed = false;
                this.saveDailyStats(this.dailyStats);
            }

            if (!this.dailyStats.firstWinClaimed) {
                this.dailyStats.firstWinClaimed = true;
                this.saveDailyStats(this.dailyStats);
                this.addCrystals(25, 'first_win');
                return true;
            }

            return false;
        } catch (error) {
            console.error('[CRYSTALS] Erro em checkFirstWinOfDay:', error);
            return false;
        }
    }

    /**
     * Processa recompensas de cristais por completar nÃ­vel (Modo Aventura)
     */
    rewardAdventureLevel(stars) {
        try {
            let totalCrystals = 0;
            let reason = 'level_complete';

            // Base: 10 cristais por completar
            totalCrystals = 10;

            // BÃ´nus por estrelas
            if (stars === 2) {
                totalCrystals += 5;
                reason = 'level_2stars';
            } else if (stars === 3) {
                totalCrystals += 10;
                reason = 'level_3stars';
            }

            this.addCrystals(totalCrystals, reason);

            // Verifica se Ã© chefÃ£o
            if (this.currentLevelConfig && this.currentLevelConfig.isBoss) {
                // BÃ´nus extra por derrotar chefÃ£o
                this.addCrystals(50, 'boss_defeated');
            }

            // Verifica primeira vitÃ³ria do dia
            this.checkFirstWinOfDay();
        } catch (error) {
            console.error('[CRYSTALS] Erro em rewardAdventureLevel:', error);
        }
    }

    /**
     * Processa recompensas de cristais por pontuaÃ§Ã£o (Modo ClÃ¡ssico)
     */
    checkClassicScoreRewards() {
        try {
            const currentScore = this.classicState.score;
            const milestone = 500;

            // Verifica quantos marcos de 500 pontos foram alcanÃ§ados
            const currentMilestone = Math.floor(currentScore / milestone);
            const lastMilestone = Math.floor(this.classicState.lastScoreMilestone / milestone);

            if (currentMilestone > lastMilestone) {
                const crystalsToAward = (currentMilestone - lastMilestone) * 5;
                this.addCrystals(crystalsToAward, 'score_milestone', false);
                this.classicState.lastScoreMilestone = currentScore;
            }
        } catch (error) {
            console.error('[CRYSTALS] Erro em checkClassicScoreRewards:', error);
        }
    }

    /**
     * Processa recompensas por novo recorde (Modo ClÃ¡ssico)
     */
    rewardNewRecord() {
        try {
            this.addCrystals(20, 'new_record');
        } catch (error) {
            console.error('[CRYSTALS] Erro em rewardNewRecord:', error);
        }
    }

    /**
     * Processa recompensas por completar missÃ£o (Modo ClÃ¡ssico)
     */
    rewardMissionComplete() {
        try {
            if (this.currentMode !== 'classic') return;
            if (!this.classicState.missions || this.classicState.missions.length === 0) return;
            this.addCrystals(10, 'mission_complete');
        } catch (error) {
            console.error('[CRYSTALS] Erro em rewardMissionComplete:', error);
        }
    }

    /**
     * Processa recompensas por completar todas as 3 missÃµes (Modo ClÃ¡ssico)
     */
    rewardAllMissionsComplete() {
        try {
            if (this.currentMode !== 'classic') return;
            if (!this.classicState.missions || this.classicState.missions.length === 0) return;
            // 3 missÃµes x 10 = 30 + 20 bÃ´nus = 50 total
            this.addCrystals(20, 'all_missions');
        } catch (error) {
            console.error('[CRYSTALS] Erro em rewardAllMissionsComplete:', error);
        }
    }

    /**
     * Processa recompensas por desbloquear novo mundo
     */
    rewardWorldUnlocked() {
        try {
            this.addCrystals(100, 'world_unlocked');
        } catch (error) {
            console.error('[CRYSTALS] Erro em rewardWorldUnlocked:', error);
        }
    }

	// Adicione logo apos o constructor ou antes do start()
    // --- CARREGAMENTO REAL (FUNCIONAL) ---
    async preloadAssets() {
        try {
            // ADICIONADO: Carrega idiomas antes de tudo
            await this.i18n.init();

            // Initialize Achievement System (after i18n)
            this.achievements = new AchievementSystem(this);

            if (!this._preloadedImages) this._preloadedImages = new Set();

            // Somente o essencial para primeira tela/transicao inicial
            const criticalImages = [
                'assets/img/bg_world_select.webp',
                'assets/img/icon_world_tutorial.jpg',
                'assets/img/icon_world_fire.jpg',
                'assets/img/icon_world_forest.jpg',
                'assets/img/icon_world_desert.jpg',
                'assets/img/icon_world_castle.jpg',
                'assets/img/icon_world_mountain.jpg'
            ];

            await this.preloadImageList(criticalImages);
            if (RUNTIME_LOGS) console.log('Assets carregados!');

            // Continua preload em idle sem bloquear UX inicial
            this.preloadDeferredAssets('background_all');
        } catch (error) {
            console.error('[PRELOAD] Falha no preload inicial:', error);
        } finally {
            // Fail-safe: nunca deixar o loading travado.
            this.assetsLoaded = true;
        }
    }

    preloadImage(src) {
        if (!src) return Promise.resolve(false);
        if (!this._preloadedImages) this._preloadedImages = new Set();
        if (!this._imagePreloadPromises) this._imagePreloadPromises = new Map();
        if (this._preloadedImages.has(src)) return Promise.resolve(true);
        if (this._imagePreloadPromises.has(src)) return this._imagePreloadPromises.get(src);

        const promise = new Promise((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.src = src;
            img.onload = () => {
                this._preloadedImages.add(src);
                this._imagePreloadPromises.delete(src);
                resolve(true);
            };
            img.onerror = () => {
                console.warn(`Falha ao carregar: ${src}`);
                this._imagePreloadPromises.delete(src);
                resolve(false);
            };
        });
        this._imagePreloadPromises.set(src, promise);
        return promise;
    }

    preloadImageList(list = []) {
        const items = Array.isArray(list) ? Array.from(new Set(list.filter(Boolean))) : [];
        if (items.length === 0) return Promise.resolve();
        return Promise.all(items.map((src) => this.preloadImage(src))).then(() => undefined);
    }

    preloadDeferredAssets(scope = 'background_all') {
        const groups = {
            world_select: [
                'assets/img/map_fire.webp',
                'assets/img/map_forest.webp',
                'assets/img/map_mountain.webp',
                'assets/img/map_desert.webp',
                'assets/img/map_castle.webp',
                'assets/img/bg_world_select.webp',
                'assets/img/icon_world_tutorial.jpg',
                'assets/img/icon_world_fire.jpg',
                'assets/img/icon_world_forest.jpg',
                'assets/img/icon_world_desert.jpg',
                'assets/img/icon_world_castle.jpg',
                'assets/img/icon_world_mountain.jpg'
            ],
            story_intro: [
                'assets/img/thalion_story_1.png',
                'assets/img/thalion_story_2.png',
                'assets/img/thalion_story_3.png',
                'assets/img/thalion_story_4.png',
                'assets/img/thalion_story_5.png',
                'assets/img/thalion_story_6.png'
            ],
            story_after: [
                'assets/img/story_guardian_gate_opening.webp',
                'assets/img/story_fire_ignis_aftermath.webp',
                'assets/img/story_forest_aracna_aftermath.webp',
                'assets/img/story_mountain_golem_aftermath.webp',
                'assets/img/story_desert_grok_aftermath.webp',
                'assets/img/story_castle_dark_wizard_aftermath.webp'
            ]
        };

        const all = [
            ...groups.world_select,
            ...groups.story_intro,
            ...groups.story_after
        ];
        const targets = scope === 'background_all' ? all : (groups[scope] || []);
        if (targets.length === 0) return;

        const run = () => { this.preloadImageList(targets); };

        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => { run(); }, { timeout: 2000 });
        } else {
            setTimeout(() => { run(); }, 250);
        }
    }
    
    // --- Carregar PowerUps ---
    loadPowerUps() {
        const rawMagnet = parseInt(localStorage.getItem('blocklands_powerup_magnet') || '0');
        const rawRotate = parseInt(localStorage.getItem('blocklands_powerup_rotate') || '0');
        const rawSwap = parseInt(localStorage.getItem('blocklands_powerup_swap') || '0');

        this.powerUps.magnet = Math.min(rawMagnet, MAX_POWERUP_COUNT);
        this.powerUps.rotate = Math.min(rawRotate, MAX_POWERUP_COUNT);
        this.powerUps.swap = Math.min(rawSwap, MAX_POWERUP_COUNT);
        console.log('[POWERUPS] Carregados:', this.powerUps);
        this.updateControlsVisuals();
        if (rawMagnet !== this.powerUps.magnet || rawRotate !== this.powerUps.rotate || rawSwap !== this.powerUps.swap) {
            this.savePowerUps();
        }
    }

    savePowerUps() {
        localStorage.setItem('blocklands_powerup_magnet', this.powerUps.magnet);
        localStorage.setItem('blocklands_powerup_rotate', this.powerUps.rotate);
        localStorage.setItem('blocklands_powerup_swap', this.powerUps.swap);
        console.log('[POWERUPS] Salvos:', this.powerUps);
        this.updateControlsVisuals();
    }
	
	// --- SEQUÃŠNCIA VISUAL INTELIGENTE ---
    startLoadingSequence() {
        const bar = document.getElementById('loading-bar-fill');
        const text = document.getElementById('loading-text');
        const screen = document.getElementById('loading-screen');
        
        if (!bar || !screen) return;

        // Fases visuais para entreter o jogador
        // ATUALIZADO: Usando this.i18n.t() para traduzir as mensagens
        const messages = [
            this.i18n.t('loading.connecting'),
            this.i18n.t('loading.polishing'),
            this.i18n.t('loading.mapping'),
            this.i18n.t('loading.summoning'),
            this.i18n.t('loading.finalizing')
        ];

        let visualPct = 0; // Porcentagem visual atual

        const updateLoop = () => {
            // Se jÃ¡ carregou tudo (Real) e a barra jÃ¡ passou de 80%, acelera para o fim
            if (this.assetsLoaded && visualPct >= 80) {
                visualPct += 5; // Vai rÃ¡pido atÃ© 100
            } 
            // Se ainda nÃ£o carregou, avanÃ§a devagar atÃ© travar em 85%
            else if (!this.assetsLoaded && visualPct < 85) {
                visualPct += (Math.random() * 2); // AvanÃ§o lento e orgÃ¢nico
            }
            // Se jÃ¡ carregou mas a barra ainda estÃ¡ no comeÃ§o, avanÃ§a normal
            else if (this.assetsLoaded && visualPct < 80) {
                visualPct += 3; // AvanÃ§o mÃ©dio
            }

            // Trava visual (Cap) em 100%
            if (visualPct > 100) visualPct = 100;

            // Atualiza a Barra
            bar.style.width = visualPct + '%';
            
            // Atualiza Texto baseado no progresso
            const msgIndex = Math.min(Math.floor((visualPct / 100) * messages.length), messages.length - 1);
            if(text) text.innerText = messages[msgIndex];

            // VERIFICAÃ‡ÃƒO DE FIM
            if (visualPct >= 100) {
                // SÃ³ termina se o visual chegou em 100 E os assets reais terminaram
                if (this.assetsLoaded) {
                    setTimeout(() => {
                        screen.classList.add('fade-out');
                        setTimeout(() => {
                            screen.style.display = 'none';
                        }, 800);
                    }, 200);
                } else {
                    // Se visual chegou em 100 mas assets nÃ£o (raro, mas possÃ­vel), espera
                    requestAnimationFrame(updateLoop);
                }
            } else {
                // Continua o loop
                requestAnimationFrame(updateLoop);
            }
        };

        // Inicia o loop
        requestAnimationFrame(updateLoop);
    }

    setupMenuEvents() {
        // Unlock de Ãudio
        const unlockAudioOnce = () => {
            if (this.audio && this.audio.unlock) {
                this.audio.unlock();
            }
            document.removeEventListener('click', unlockAudioOnce);
            document.removeEventListener('touchstart', unlockAudioOnce);
        };
        document.addEventListener('click', unlockAudioOnce, { once: true, passive: true });
        document.addEventListener('touchstart', unlockAudioOnce, { once: true, passive: true });
        
        const bindClick = (id, action) => {
            const el = document.getElementById(id);
            if(el) {
                // Remove listeners antigos para evitar duplicaÃ§Ã£o se o setup rodar 2x
                const newEl = el.cloneNode(true); 
                el.parentNode.replaceChild(newEl, el);
                
                newEl.addEventListener('click', (e) => {
                    if (this.audio) this.audio.playClick();
                    action(e);
                });
            }
        };

        const bindGuardianInfo = () => {
            const helpBtn = document.getElementById('gear-help-btn');
            if (helpBtn) {
                const newHelp = helpBtn.cloneNode(true);
                helpBtn.parentNode.replaceChild(newHelp, helpBtn);
                newHelp.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.audio) this.audio.playClick();
                    const gearOverlay = document.getElementById('gear-settings-overlay');
                    const gearBtn = document.getElementById('game-gear-btn');
                    if (gearOverlay) {
                        gearOverlay.classList.add('hidden');
                        gearOverlay.setAttribute('aria-hidden', 'true');
                    }
                    if (gearBtn) gearBtn.setAttribute('aria-expanded', 'false');
                    this.openInfoCard();
                });
            }

            const overlay = document.getElementById('guardian-info-overlay');
            if (overlay) {
                const newOverlay = overlay.cloneNode(true);
                overlay.parentNode.replaceChild(newOverlay, overlay);

                const closeBtn = newOverlay.querySelector('#guardian-info-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (this.audio) this.audio.playClick();
                        this.closeInfoCard();
                    });
                }

                newOverlay.addEventListener('click', (e) => {
                    if (e.target === newOverlay) this.closeInfoCard();
                });
            }
        };

        const bindGearMenu = () => {
            const gearBtn = document.getElementById('game-gear-btn');
            const overlay = document.getElementById('gear-settings-overlay');
            const closeBtn = document.getElementById('gear-settings-close');
            const toggleMusic = document.getElementById('gear-toggle-music');
            const toggleSfx = document.getElementById('gear-toggle-sfx');
            if (!gearBtn || !overlay) return;

            const syncToggles = () => {
                if (toggleMusic) toggleMusic.checked = !!this.settings.music;
                if (toggleSfx) toggleSfx.checked = !!this.settings.sfx;
            };

            const closePanel = () => {
                overlay.classList.add('hidden');
                overlay.setAttribute('aria-hidden', 'true');
                gearBtn.setAttribute('aria-expanded', 'false');
            };

            const openPanel = () => {
                syncToggles();
                overlay.classList.remove('hidden');
                overlay.setAttribute('aria-hidden', 'false');
                gearBtn.setAttribute('aria-expanded', 'true');
            };

            const togglePanel = (e) => {
                e.stopPropagation();
                if (this.audio) this.audio.playClick();
                if (overlay.classList.contains('hidden')) openPanel();
                else closePanel();
            };

            const newGear = gearBtn.cloneNode(true);
            gearBtn.parentNode.replaceChild(newGear, gearBtn);
            newGear.addEventListener('click', togglePanel);

            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.audio) this.audio.playClick();
                    closePanel();
                });
            }

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closePanel();
            });

            if (toggleMusic) {
                toggleMusic.addEventListener('change', (e) => {
                    this.settings.music = e.target.checked;
                    this.saveSettings();
                    const settingsToggle = document.getElementById('toggle-music');
                    if (settingsToggle) settingsToggle.checked = this.settings.music;
                });
            }

            if (toggleSfx) {
                toggleSfx.addEventListener('change', (e) => {
                    this.settings.sfx = e.target.checked;
                    this.saveSettings();
                    const settingsToggle = document.getElementById('toggle-sfx');
                    if (settingsToggle) settingsToggle.checked = this.settings.sfx;
                });
            }
        };

        // NavegaÃ§Ã£o Principal
        bindClick('btn-mode-casual', () => this.startClassicMode());
        bindClick('btn-mode-adventure', () => this.checkAdventureIntro()); 
        bindClick('btn-mode-blitz', () => this.startBlitzMode());
        bindClick('btn-back-menu', () => this.showScreen(this.screenMenu));
        bindClick('btn-quit-game', () => this.showScreen(this.screenMenu));
        
        // --- NOVOS BOTÃ•ES DA HISTÃ“RIA (Agora configurados aqui para sempre funcionarem) ---
        bindClick('btn-next-slide', () => {
            this.storyStep++;
            this.renderStorySlide();
        });

        bindClick('btn-skip-story', () => {
            const savedClass = localStorage.getItem('blocklands_player_class');
            if (this._storyReplayMode || savedClass) {
                this.showWorldSelect(); // JÃ¡ tem herÃ³i? Mapa.
            } else {
                this.showHeroSelection(); // NÃ£o tem? SeleÃ§Ã£o.
            }
        });

        bindClick('btn-start-adventure', () => {
            localStorage.setItem('blocklands_intro_seen', 'true');
            this.showWorldSelect();
        });
        // -------------------------------------------------------------------------------

        // BotÃµes de Game Over / VitÃ³ria
        bindClick('btn-restart-over', () => this.retryGame());
        
        bindClick('btn-quit-game', () => {
            // Para a mÃºsica ao sair
            if(this.audio) this.audio.stopMusic();

            if (this.currentMode === 'blitz') {
                if (this.blitz) this.blitz.exit();
                this.showScreen(this.screenMenu);
            } else if (this.currentMode === 'adventure') {
                // Identifica em qual mundo estamos baseado na fase atual
                const currentWorld = WORLDS.find(w => w.levels.some(l => l.id === this.currentLevelConfig?.id));
                
                // Se achou o mundo E NÃƒO Ã‰ O TUTORIAL (que nÃ£o tem mapa interno)
                if (currentWorld && currentWorld.id !== 'tutorial_world') {
                    this.showScreen(this.screenLevels); // Garante que o container apareÃ§a
                    this.openWorldMap(currentWorld);    // Abre o mapa do mundo (Fogo, Floresta, etc)
                } else {
                    // Se for Tutorial (GuardiÃ£o) ou erro, volta para a SeleÃ§Ã£o de Mundos
                    this.showWorldSelect();
                }
            } else {
                // Modo Casual: Volta para o Menu Principal
                this.showScreen(this.screenMenu);
            }
        });
        
        // Power-Ups
        bindClick('pwr-bomb', () => this.activatePowerUp('bomb'));
        bindClick('pwr-rotate', () => this.activatePowerUp('rotate'));
        bindClick('pwr-swap', () => this.activatePowerUp('swap'));

        // GuardiÃ£o: card informativo
        bindGuardianInfo();
        bindGearMenu();
        
        // LÃ³gica de VitÃ³ria (Continuar/Voltar)
        const btnNextLevel = document.getElementById('btn-next-level');
        if (btnNextLevel) {
            const newBtn = btnNextLevel.cloneNode(true);
            btnNextLevel.parentNode.replaceChild(newBtn, btnNextLevel);
            newBtn.addEventListener('click', () => {
                if(this.audio) this.audio.playClick();
                this.modalWin.classList.add('hidden');
                
                if(this.currentMode === 'adventure') {
                    const currentWorld = WORLDS.find(w => w.levels.some(l => l.id === this.currentLevelConfig?.id));
                    if (currentWorld) {
                        const levelId = this.currentLevelConfig?.id;
                        const seenKey = 'blocklands_story_fire_ignis_seen';
                        if (levelId === 20 && localStorage.getItem(seenKey) !== 'true') {
                            localStorage.setItem(seenKey, 'true');
                            this.showSingleStory({
                                textKey: 'story_fire_ignis_aftermath',
                                imageSrc: 'assets/img/story_fire_ignis_aftermath.webp',
                                onDone: () => {
                                    this.showScreen(this.screenLevels);
                                    this.openWorldMap(currentWorld);
                                }
                            });
                            return;
                        }
                        this.showScreen(this.screenLevels);
                        this.openWorldMap(currentWorld);
                    } else {
                        this.showWorldSelect();
                    }
                } else {
                    this.retryGame(); 
                }
            });
        }

        const btnVictoryBack = document.getElementById('btn-victory-back');
        if (btnVictoryBack) {
            const newBtn = btnVictoryBack.cloneNode(true);
            btnVictoryBack.parentNode.replaceChild(newBtn, btnVictoryBack);
            newBtn.addEventListener('click', () => {
                if(this.audio) this.audio.playBack();
                this.modalWin.classList.add('hidden');
                if (this.currentMode === 'adventure') {
                    this.showScreen(this.screenLevels);
                    const currentWorld = WORLDS.find(w => w.levels.some(l => l.id === this.currentLevelConfig?.id));
                    if (currentWorld) this.openWorldMap(currentWorld);
                    else this.showWorldSelect();
                } else {
                    this.showScreen(this.screenMenu);
                }
            });
        }

        // Idioma e Sidebar
        const btnEn = document.getElementById('btn-lang-en');
        const btnPt = document.getElementById('btn-lang-pt');
        const updateLangUI = () => {
            if(btnEn && btnPt) {
                btnEn.style.background = (this.i18n.currentLang === 'en') ? '#fbbf24' : 'rgba(255,255,255,0.1)';
                btnEn.style.color = (this.i18n.currentLang === 'en') ? '#000' : '#fff';
                btnPt.style.background = (this.i18n.currentLang === 'pt-BR') ? '#fbbf24' : 'rgba(255,255,255,0.1)';
                btnPt.style.color = (this.i18n.currentLang === 'pt-BR') ? '#000' : '#fff';
            }
        };
        updateLangUI(); 

        if(btnEn) btnEn.addEventListener('click', async () => {
            if(this.audio) this.audio.playClick();
            await this.i18n.changeLanguage('en');
            updateLangUI();
            if (this.screenLevels.classList.contains('active-screen')) this.showWorldSelect();
        });

        if(btnPt) btnPt.addEventListener('click', async () => {
            if(this.audio) this.audio.playClick();
            await this.i18n.changeLanguage('pt-BR');
            updateLangUI();
            if (this.screenLevels.classList.contains('active-screen')) this.showWorldSelect();
        });

        // Sidebar Toggles
        const btnOpen = document.getElementById('btn-open-sidebar');
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('menu-overlay');
        const btnClose = document.getElementById('btn-close-sidebar');
        const toggleSidebar = (show) => {
            if(show) { sidebar.classList.add('open'); overlay.classList.remove('hidden'); setTimeout(()=>overlay.classList.add('visible'),10); }
            else { sidebar.classList.remove('open'); overlay.classList.remove('visible'); setTimeout(()=>overlay.classList.add('hidden'),300); }
        };
        if(btnOpen) btnOpen.addEventListener('click', () => { if(this.audio) this.audio.playClick(); toggleSidebar(true); });
        if(btnClose) btnClose.addEventListener('click', () => { if(this.audio) this.audio.playBack(); toggleSidebar(false); });
        if(overlay) overlay.addEventListener('click', () => { if(this.audio) this.audio.playBack(); toggleSidebar(false); });
        
        this.setupSettingsLogic();

        const btnSettings = document.querySelector('.sidebar-item span[data-i18n="sidebar.settings"]')?.parentNode;
        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                if(this.audio) this.audio.playClick();
                toggleSidebar(false);
                this.showScreen(this.screenSettings);
            });
        }

        const btnAchievements = document.getElementById('btn-achievements');
        if (btnAchievements) {
            btnAchievements.addEventListener('click', () => {
                if(this.audio) this.audio.playClick();
                toggleSidebar(false);
                this.showAchievementsScreen();
            });
        }

        const btnAchievementsBack = document.getElementById('btn-achievements-back');
        if (btnAchievementsBack) {
            btnAchievementsBack.addEventListener('click', () => {
                if(this.audio) this.audio.playBack();
                this.showScreen(this.screenMenu);
            });
        }

        // BotÃ£o da Loja de Mestres na sidebar
        const btnStore = document.querySelector('.sidebar-item span[data-i18n="sidebar.store"]')?.parentNode;
        if (btnStore) {
            btnStore.addEventListener('click', () => {
                if(this.audio) this.audio.playClick();
                toggleSidebar(false);
                this.showStoreScreen();
            });
        }

        // BotÃ£o de voltar da loja
        const btnStoreBack = document.getElementById('btn-store-back');
        if (btnStoreBack) {
            btnStoreBack.addEventListener('click', () => {
                if(this.audio) this.audio.playBack();
                this.showScreen(this.screenMenu);
            });
        }

        // Event listeners dos produtos da loja
        this.setupStoreListeners();
        this.setupStoreTabs();
    }

    // --- NOVO: LÃ³gica da tela de configuraÃ§Ãµes ---
    setupSettingsLogic() {
        // Elementos da UI
        const toggleMusic = document.getElementById('toggle-music');
        const toggleSfx = document.getElementById('toggle-sfx');
        const toggleHaptics = document.getElementById('toggle-haptics');
        const togglePerformance = document.getElementById('toggle-performance');
        const btnReset = document.getElementById('btn-reset-progress');
        const btnBack = document.getElementById('btn-settings-back');
        const btnLangEn = document.getElementById('btn-lang-en');
        const btnLangPt = document.getElementById('btn-lang-pt');
        const btnDiagOpen = document.getElementById('btn-diag-open');
        const btnDiagCopy = document.getElementById('btn-diag-copy');
        const btnDiagClear = document.getElementById('btn-diag-clear');
        const diagOutput = document.getElementById('diag-output');

        // 1. Sincroniza UI com Estado Atual
        if(toggleMusic) toggleMusic.checked = this.settings.music;
        if(toggleSfx) toggleSfx.checked = this.settings.sfx;
        if(toggleHaptics) toggleHaptics.checked = this.settings.haptics;
        if (togglePerformance) togglePerformance.value = this.settings.performanceMode || 'auto';

        const updateLangVisuals = () => {
            if (this.i18n.currentLang === 'en') {
                btnLangEn?.classList.add('active');
                btnLangPt?.classList.remove('active');
            } else {
                btnLangPt?.classList.add('active');
                btnLangEn?.classList.remove('active');
            }
        };
        updateLangVisuals(); // Roda ao abrir

        if (this._settingsLogicBound) return;
        this._settingsLogicBound = true;

        // 2. Eventos dos Toggles
        if(toggleMusic) toggleMusic.addEventListener('change', (e) => {
            this.settings.music = e.target.checked;
            this.saveSettings();
        });
        if(toggleSfx) toggleSfx.addEventListener('change', (e) => {
            this.settings.sfx = e.target.checked;
            this.saveSettings();
        });
        if(toggleHaptics) toggleHaptics.addEventListener('change', (e) => {
            this.settings.haptics = e.target.checked;
            this.saveSettings();
            if (this.settings.haptics && this.audio) this.audio.vibrate(50);
        });
        if (togglePerformance) togglePerformance.addEventListener('change', (e) => {
            const nextMode = String(e.target.value || 'auto');
            this.settings.performanceMode = (nextMode === 'quality' || nextMode === 'stable60') ? nextMode : 'auto';
            this.saveSettings();
        });

        // 3. Resetar Progresso
        if(btnReset) btnReset.addEventListener('click', () => {
            if (confirm(this.i18n.t('settings.reset_confirm'))) {
                localStorage.clear(); // Limpa tudo
                location.reload();    // Recarrega o jogo do zero
            }
        });

        // 4. NavegaÃ§Ã£o (Voltar)
        if(btnBack) btnBack.addEventListener('click', () => {
            if(this.audio) this.audio.playBack();
            this.showScreen(this.screenMenu);
        });

        // 5. BotÃµes de Idioma (LÃ³gica migrada)
        if(btnLangEn) btnLangEn.addEventListener('click', async () => {
            if(this.audio) this.audio.playClick();
            await this.i18n.changeLanguage('en');
            updateLangVisuals();
        });

        if(btnLangPt) btnLangPt.addEventListener('click', async () => {
            if(this.audio) this.audio.playClick();
            await this.i18n.changeLanguage('pt-BR');
            updateLangVisuals();
        });

        const buildDiagAndShow = () => {
            if (!diagOutput) return '';
            const report = this.buildDiagnosticsReport();
            diagOutput.value = report;
            diagOutput.classList.remove('hidden');
            return report;
        };

        if (btnDiagOpen) {
            btnDiagOpen.addEventListener('click', () => {
                if (this.audio) this.audio.playClick();
                buildDiagAndShow();
            });
        }
        if (btnDiagCopy) {
            btnDiagCopy.addEventListener('click', async () => {
                if (this.audio) this.audio.playClick();
                const report = buildDiagAndShow();
                await this.copyDiagnosticsReport(report);
            });
        }
        if (btnDiagClear) {
            btnDiagClear.addEventListener('click', () => {
                if (this.audio) this.audio.playBack();
                localStorage.removeItem('blocklands_diag_events');
                if (diagOutput) {
                    diagOutput.value = '';
                    diagOutput.classList.add('hidden');
                }
                this.showStoreToast('Eventos de diagnostico limpos.', 'success');
            });
        }
    }

    buildDiagnosticsReport() {
        const now = new Date().toISOString();
        const profile = this.performanceProfile || 'auto';
        const perfMode = this.settings?.performanceMode || 'auto';
        const fps = Math.round(this._fpsSmoothed || 0);
        const world = this.getCurrentWorld() || 'none';
        const level = this.currentLevelConfig?.id ?? null;
        const mode = this.currentMode || 'unknown';
        const crystals = this.crystals || 0;
        const lang = this.i18n?.currentLang || 'unknown';
        const ua = navigator.userAgent || '';
        const diagEventsRaw = localStorage.getItem('blocklands_diag_events');
        let diagEvents = [];
        try { diagEvents = diagEventsRaw ? JSON.parse(diagEventsRaw) : []; } catch (_) { diagEvents = []; }

        const lines = [];
        lines.push('Block Lands Diagnostic Report');
        lines.push(`time_utc=${now}`);
        lines.push(`mode=${mode}`);
        lines.push(`world=${world}`);
        lines.push(`level=${level}`);
        lines.push(`language=${lang}`);
        lines.push(`crystals=${crystals}`);
        lines.push(`perf_mode=${perfMode}`);
        lines.push(`perf_profile=${profile}`);
        lines.push(`fps_smoothed=${fps}`);
        lines.push(`runtime_downgrade=${this._runtimePerfDowngrade ? '1' : '0'}`);
        lines.push(`display=${window.innerWidth}x${window.innerHeight}`);
        lines.push(`pixel_ratio=${window.devicePixelRatio || 1}`);
        lines.push(`user_agent=${ua}`);
        lines.push(`diag_events_count=${diagEvents.length}`);
        lines.push('diag_events=');
        lines.push(JSON.stringify(diagEvents, null, 2));
        return lines.join('\n');
    }

    async copyDiagnosticsReport(report) {
        const text = report || this.buildDiagnosticsReport();
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            this.showStoreToast('Relatorio copiado.', 'success');
        } catch (_) {
            this.showStoreToast('Falha ao copiar relatorio.', 'error');
        }
    }

    // --- NOVO: Verifica se o jogador jÃ¡ viu a intro ---
    checkAdventureIntro() {
        const savedClass = localStorage.getItem('blocklands_player_class');
        const hasSeen = localStorage.getItem('blocklands_intro_seen');

        if (savedClass) {
            // JÃ¡ escolheu personagem: vai direto para o mapa
            this.showWorldSelect();
        } else if (hasSeen === 'true') {
            // JÃ¡ viu a intro, mas nÃ£o tem classe salva: vai para a seleÃ§Ã£o
            this.showHeroSelection();
        } else {
            // Primeira vez: mostra a histÃ³ria
            this.playStory();
        }
    }

    // --- NOVO: Exibe a tela de histÃ³ria ---
    playStory(options = {}) {
        const includeAfter = !!options.includeAfter;
        this._storyReplayMode = includeAfter;
        this._storySequence = this.buildStorySequence(includeAfter);

        this.showScreen(this.screenStory);
        this.toggleGlobalHeader(false); // Esconde o header de moedas/nÃ­vel para imersÃ£o
        this.storyStep = 0;
        this.renderStorySlide();

        const screen = this.screenStory;
        if (screen) {
            screen.style.backgroundImage = "url('./assets/img/bg_story.webp')";
            screen.style.backgroundSize = 'cover';
            screen.style.backgroundPosition = 'center';
        }

        const imgEl = document.getElementById('story-reaction-img');
        if (imgEl) imgEl.style.display = '';
        
        // Garante handlers corretos (sobrescreve o showSingleStory)
        const btnNext = document.getElementById('btn-next-slide');
        if (btnNext) {
            const newNext = btnNext.cloneNode(true);
            btnNext.parentNode.replaceChild(newNext, btnNext);
              newNext.onclick = () => {
                  if (this.audio && this.audio.buffers && this.audio.buffers.click) this.audio.playClick();
                  this.storyStep++;
                  this.renderStorySlide();
              };
          }

        const btnSkip = document.getElementById('btn-skip-story');
        if (btnSkip) {
            const newSkip = btnSkip.cloneNode(true);
            btnSkip.parentNode.replaceChild(newSkip, btnSkip);
              newSkip.onclick = () => {
                  if (this.audio && this.audio.buffers && this.audio.buffers.click) this.audio.playClick();
                  if (this._storyReplayMode) this.showWorldSelect();
                  else this.showHeroSelection();
              };
          }
    }

    // --- POWER-UP LOGIC ---

    updatePowerUpsUI() {
        ['bomb', 'rotate', 'swap'].forEach(type => {
            const btn = document.getElementById(`pwr-${type}`);
            if(!btn) return;
            
            const count = this.powerUps[type];
            btn.querySelector('.pwr-count').innerText = `${count}/3`;
            
            btn.classList.remove('active-mode');

            if (count <= 0) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
            
            if (this.interactionMode === type) {
                btn.classList.add('active-mode');
            }
        });
    }

    activatePowerUp(type) {
        if (this.powerUps[type] <= 0) {
            if(this.audio) this.audio.vibrate(50);
            return;
        }
        if (this.interactionMode === type) {
            this.interactionMode = null;
            this.updateControlsVisuals();
            return;
        }
        // Swap Ã© imediato
        if (type === 'swap') {
            if(this.audio) this.audio.playClick();
            this.powerUps.swap--;
            this.savePowerUps();
            this.spawnNewHand();
            this.effects.shakeScreen();
            this.renderControlsUI();

            // Achievement tracking: mark power as used
            this.powerUsedThisLevel = true;
            return;
        }
        // Ativa modo
        this.interactionMode = type;
        if(this.audio) this.audio.playClick();
        this.updateControlsVisuals();

        // Achievement tracking: mark power as used
        this.powerUsedThisLevel = true;
    }
	
	renderControlsUI() {
    // No modo clÃ¡ssico, nÃ£o renderizar controles
    if (this.currentMode === 'classic' || this.currentMode === 'blitz') {
        const controlsBar = document.getElementById('controls-bar');
        if (controlsBar) controlsBar.style.display = 'none';
        return;
    }

    // MantÃ©m compatibilidade com UI antiga
    const oldPwr = document.getElementById('powerups-area');
    if (oldPwr) oldPwr.style.display = 'none';
    const oldHeroes = document.getElementById('hero-powers-area');
    if (oldHeroes) oldHeroes.remove();

    // Garante container
    let controlsContainer = document.getElementById('controls-bar');
    if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.id = 'controls-bar';
        controlsContainer.className = 'controls-bar';
        if (this.dockEl && this.dockEl.parentNode) {
            this.dockEl.parentNode.insertBefore(controlsContainer, this.dockEl.nextSibling);
        } else {
            document.body.appendChild(controlsContainer);
        }
    } else {
        // Garante que estÃ¡ visÃ­vel no modo aventura
        controlsContainer.style.display = '';
    }

    // Cria grupos uma vez
    if (!this._controlsUI) {
        const leftGroup = document.createElement('div');
        leftGroup.className = 'controls-group';
        leftGroup.id = 'controls-left-group';

        const rightGroup = document.createElement('div');
        rightGroup.className = 'controls-group';
        rightGroup.id = 'controls-right-group';

        controlsContainer.innerHTML = '';
        controlsContainer.appendChild(leftGroup);
        controlsContainer.appendChild(rightGroup);

        // Cache refs
        this._controlsUI = {
            container: controlsContainer,
            leftGroup,
            rightGroup,
            pwrBtns: new Map(), // id -> button
            pwrCounts: new Map(), // id -> count span
            heroBtns: new Map(), // id -> button
            heroSignature: null // string para saber quando precisa recriar herÃ³is
        };

        // Cria botÃµes de powerup uma vez (estrutura estÃ¡vel)
        const pwrList = [
            { id: 'magnet', icon: '\u{1F9F2}' },
            { id: 'rotate', icon: '\u{1F504}' },
            { id: 'swap',   icon: '\u{1F500}' }
        ];

        for (const p of pwrList) {
            const btn = document.createElement('button');
            btn.className = `ctrl-btn pwr-${p.id}`;
            btn.id = `btn-pwr-${p.id}`;
            btn.type = 'button';

            // Estrutura interna fixa: Ã­cone + count
            const iconSpan = document.createElement('span');
            iconSpan.className = 'ctrl-icon';
            iconSpan.textContent = p.icon;

            const countSpan = document.createElement('span');
            countSpan.className = 'ctrl-count';
            countSpan.textContent = '0';

            btn.appendChild(iconSpan);
            btn.appendChild(countSpan);

            // Handler estÃ¡vel (nÃ£o recria)
            btn.addEventListener('click', () => this.activatePowerUp(p.id));

            this._controlsUI.leftGroup.appendChild(btn);
            this._controlsUI.pwrBtns.set(p.id, btn);
            this._controlsUI.pwrCounts.set(p.id, countSpan);
        }
    }

    // Atualiza contagem/disabled dos powerups (barato)
    for (const [id, btn] of this._controlsUI.pwrBtns.entries()) {
        const count = (this.powerUps && this.powerUps[id]) ? this.powerUps[id] : 0;
        const countEl = this._controlsUI.pwrCounts.get(id);
        if (countEl) countEl.textContent = String(count);

        if (count <= 0) btn.classList.add('disabled');
        else btn.classList.remove('disabled');
    }

    // ---- HerÃ³is: recria somente se necessÃ¡rio ----
    // A lista de herÃ³is depende do modo e da classe do player.
    const mode = this.currentMode || '';
    const cls = this.playerClass || '';
    const boss = (this.currentLevelConfig && this.currentLevelConfig.type) ? this.currentLevelConfig.type : '';
    const heroSignature = `${mode}|${cls}|${boss}`;

    if (this._controlsUI.heroSignature !== heroSignature) {
        this._controlsUI.heroSignature = heroSignature;

        const rightGroup = this._controlsUI.rightGroup;
        rightGroup.innerHTML = '';
        this._controlsUI.heroBtns.clear();

        if (this.currentMode === 'adventure') {
            const heroes = [
                { id: 'thalion', icon: '\u{1F9DD}\u{200D}\u{2642}\u{FE0F}' },
                { id: 'nyx',     icon: '\u{1F43A}' }
            ];

            if (this.playerClass === 'mage') heroes.push({ id: 'mage', icon: '\u{1F9D9}\u{200D}\u{2640}\u{FE0F}' });
            else heroes.push({ id: 'player', icon: '\u{2694}\u{FE0F}' });

            for (const h of heroes) {
                const btn = document.createElement('div');
                btn.className = 'ctrl-btn hero locked';
                btn.id = `btn-hero-${h.id}`;
                btn.textContent = h.icon;

                // Handler estÃ¡vel (por criaÃ§Ã£o do botÃ£o)
                btn.addEventListener('click', () => this.activateHeroPower(h.id));

                rightGroup.appendChild(btn);
                this._controlsUI.heroBtns.set(h.id, btn);
            }
        }
    }

    // MantÃ©m seu pipeline de atualizaÃ§Ã£o visual
    this.updateControlsVisuals();
}


    updateControlsVisuals() {
    // --- PowerUps ---
    const pwrIds = ['magnet', 'rotate', 'swap'];

    // Usa cache se existir (criado no renderControlsUI)
    const pwrBtns = this._controlsUI?.pwrBtns;
    const pwrCounts = this._controlsUI?.pwrCounts;

    for (let i = 0; i < pwrIds.length; i++) {
        const id = pwrIds[i];

        const btn = pwrBtns ? pwrBtns.get(id) : document.getElementById(`btn-pwr-${id}`);
        if (!btn) continue;

        const count = (this.powerUps && this.powerUps[id]) ? this.powerUps[id] : 0;

        // Atualiza contador apenas se mudou
        const countEl = pwrCounts ? pwrCounts.get(id) : btn.querySelector('.ctrl-count');
        if (countEl) {
            const newText = String(count);
            if (countEl.textContent !== newText) countEl.textContent = newText;
        }

        // Disabled
        const shouldDisable = count <= 0;
        btn.classList.toggle('disabled', shouldDisable);

        // Active mode
        btn.classList.toggle('active-mode', this.interactionMode === id);
    }

    // --- HerÃ³is ---
    if (this.currentMode !== 'adventure' || !this.heroState) return;

    // SÃ³ percorre os herÃ³is que podem existir. (Se nÃ£o existir o botÃ£o, ignora.)
    const heroIds = ['thalion', 'nyx', 'player', 'mage'];
    const heroBtns = this._controlsUI?.heroBtns;

    for (let i = 0; i < heroIds.length; i++) {
        const id = heroIds[i];
        const btn = heroBtns ? heroBtns.get(id) : document.getElementById(`btn-hero-${id}`);
        if (!btn) continue;

        const state = this.heroState[id];
        if (!state) continue;

        // Em vez de resetar className, fazemos toggle controlado
        // Garante base
        if (!btn.classList.contains('ctrl-btn')) btn.classList.add('ctrl-btn');
        if (!btn.classList.contains('hero')) btn.classList.add('hero');

        // Estados mutuamente exclusivos
        const isUsed = !!state.used;
        const isReady = !isUsed && !!state.unlocked;
        const isLocked = !isUsed && !state.unlocked;

        btn.classList.toggle('used', isUsed);
        btn.classList.toggle('ready', isReady);
        btn.classList.toggle('locked', isLocked);

        // Active mode
        btn.classList.toggle('active-mode', this.interactionMode === `hero_${id}`);
    }
}

	

    handleBoardClick(r, c) {
        // Se houver um modo de interaÃ§Ã£o ativo (Bomba, HerÃ³is), delega para o sistema de poderes
        if (this.interactionMode) {
            this.powers.handleBoardInteraction(this.interactionMode, r, c);
            return;
        }

        // Se nÃ£o tiver interaÃ§Ã£o, aqui ficaria lÃ³gica de clique normal (se houver no futuro)
    }

    handlePieceClick(index) {
        if (this.interactionMode === 'rotate') {
            this.powers.useRotate(index);
        }
    }

    
    renderDock() {
    // Coalescing leve: evita mÃºltiplos renders do dock no mesmo frame
    if (this._renderDockLocked) {
        this._renderDockPending = true;
        return;
    }

    this._renderDockLocked = true;
    if (!this._renderDockUnlockScheduled) {
        this._renderDockUnlockScheduled = true;
        requestAnimationFrame(() => {
            this._renderDockLocked = false;
            this._renderDockUnlockScheduled = false;
            if (this._renderDockPending) {
                this._renderDockPending = false;
                this.renderDock();
            }
        });
    }

    if (!this.dockEl) return;

    // Cria e mantÃ©m 3 slots fixos (uma vez)
    if (!this._dockSlots || this._dockSlots.length !== 3) {
        this.dockEl.innerHTML = '';
        this._dockSlots = [];
        this._dockSlotState = new Array(3);

        const frag = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'dock-slot';
            slot.dataset.slot = String(i);
            this.attachDockSlotDragEvents(slot);
            this._dockSlots.push(slot);
            frag.appendChild(slot);
        }
        this.dockEl.appendChild(frag);
        this.attachDockFallbackDragEvents();
    }

    // Atualiza cada slot sem destruir o dock inteiro
    for (let index = 0; index < 3; index++) {
        const slot = this._dockSlots[index];
        const piece = this.currentHand[index] || null;
        const layoutRef = piece ? (piece.layout || piece.matrix || null) : null;
        const prev = this._dockSlotState ? this._dockSlotState[index] : null;

        if (
            prev &&
            prev.pieceRef === piece &&
            prev.layoutRef === layoutRef &&
            slot.firstChild
        ) {
            continue;
        }

        // Limpa so quando houver mudanca real (evita churn desnecessario)
        if (slot.firstChild) slot.innerHTML = '';

        if (piece) {
            this.createDraggablePiece(piece, index, slot);
        }

        if (this._dockSlotState) {
            this._dockSlotState[index] = { pieceRef: piece, layoutRef };
        }
    }
}


    // --- GERENCIAMENTO DE TELAS ---
    showScreen(screenEl) {
        if (screenEl === this.screenGame) this.startFpsMonitor();
        else this.stopFpsMonitor();

        if (this.currentMode === 'blitz' && screenEl !== this.screenGame && this.blitz) {
            this.blitz.exit();
        }
        if (screenEl !== this.screenGame) {
            this.teardownIgnisSpriteOverlay();
        }
        if (this.screenGame.classList.contains('active-screen')) {
            if(this.audio) this.audio.stopMusic();
        }

        // Adicione this.screenHeroSelect Ã  lista de telas para esconder
        [this.screenMenu, this.screenLevels, this.screenStory, this.screenGame, this.screenSettings, this.screenHeroSelect, this.screenCampfire, this.screenAchievements, this.screenStore].forEach(s => {
            if(s) {
                s.classList.remove('active-screen');
                s.classList.add('hidden');
            }
        });

        if (screenEl === this.screenMenu) {
            this.toggleGlobalHeader(false);
        } else {
            // A tela de seleÃ§Ã£o e histÃ³ria tambÃ©m escondem o header
            if (screenEl === this.screenStory || screenEl === this.screenHeroSelect || screenEl === this.screenCampfire) {
                this.toggleGlobalHeader(false);
            } else {
                this.toggleGlobalHeader(true);
            }
        }

        if(screenEl) {
            screenEl.classList.remove('hidden');
            screenEl.classList.add('active-screen');
        }

        // ========================================
        // SISTEMA DE CLASSES DE ESTADO NO #APP
        // ========================================
        const app = document.getElementById('app');
        if (app) {
            // Remove todas as classes de tela
            app.classList.remove(
                'is-screen-home',
                'is-screen-classic',
                'is-screen-adventure',
                'is-screen-blitz',
                'is-screen-achievements',
                'is-screen-masters-store',
                'is-screen-how-to-play',
                'is-screen-settings'
            );

            // Adiciona classe correspondente Ã  tela ativa
            if (screenEl === this.screenMenu) {
                app.classList.add('is-screen-home');
            } else if (screenEl === this.screenGame) {
                // Detecta se ?? modo cl??ssico ou aventura
                if (this.currentMode === 'adventure') {
                    app.classList.add('is-screen-adventure');
                } else if (this.currentMode === 'blitz') {
                    app.classList.add('is-screen-blitz');
                } else {
                    app.classList.add('is-screen-classic');
                    this.updateClassicThemeClass();
                }
            } else if (screenEl === this.screenAchievements) {
                app.classList.add('is-screen-achievements');
            } else if (screenEl === this.screenSettings) {
                app.classList.add('is-screen-settings');
            }
            // Nota: is-screen-masters-store e is-screen-how-to-play serÃ£o adicionados quando essas telas forem criadas
        }

        // Layout pode mudar com troca de tela; invalida mÃ©tricas do tabuleiro
        this._boardMetricsDirty = true;
    }

    toggleGlobalHeader(show) {
        const levelHeader = document.querySelector('.level-header');
        if (levelHeader) {
            if (show) levelHeader.classList.remove('hidden-header');
            else levelHeader.classList.add('hidden-header');
        }
    }

    // ========================================
    // TEMAS DO MODO CLÃSSICO
    // ========================================
    updateClassicThemeClass() {
        const app = document.getElementById('app');
        if (!app) return;

        app.classList.remove(...CLASSIC_THEME_CLASSES);

        let themeId = this.classicTheme || CLASSIC_DEFAULT_THEME;
        if (!CLASSIC_THEME_CLASSES.includes(`classic-theme-${themeId}`)) {
            themeId = CLASSIC_DEFAULT_THEME;
            this.classicTheme = themeId;
            localStorage.setItem(CLASSIC_THEME_STORAGE_KEY, themeId);
        }
        app.classList.add(`classic-theme-${themeId}`);
    }

    setClassicTheme(themeId) {
        if (!themeId) return;
        if (!CLASSIC_THEME_CLASSES.includes(`classic-theme-${themeId}`)) return;

        this.classicTheme = themeId;
        localStorage.setItem(CLASSIC_THEME_STORAGE_KEY, themeId);

        this.updateClassicThemeClass();
        this.updateStoreUnlockablesUI();
    }

    handleUnlockableSelection(unlockableId) {
        const themeId = CLASSIC_THEME_UNLOCKABLES[unlockableId];
        if (!themeId) return;

        if (this.audio) this.audio.playClick();
        this.setClassicTheme(themeId);

        this.showStoreToast('\u{1F3A8} Tema aplicado', 'success');
    }

    updateStoreUnlockablesUI() {
        const unlockables = document.querySelectorAll('.store-item[data-unlockable-id]');
        if (!unlockables || unlockables.length === 0) return;

        unlockables.forEach((card) => {
            const unlockableId = card.getAttribute('data-unlockable-id');
            const themeId = CLASSIC_THEME_UNLOCKABLES[unlockableId];
            if (!themeId) return;

            const isActive = themeId === this.classicTheme;
            card.classList.toggle('featured', isActive);

            const badgeSpan = card.querySelector('.featured-badge span');
            if (badgeSpan) badgeSpan.textContent = isActive ? 'ATIVO' : 'NOVO';

            const btn = card.querySelector('.btn-buy');
            if (btn) {
                btn.disabled = isActive;
                btn.textContent = isActive ? 'Ativo' : 'Usar';
                btn.setAttribute('data-unlockable-id', unlockableId);
            }
        });
    }

    // ========================================
    // ATUALIZA CLASSE DE MUNDO NO #APP
    // ========================================
    updateWorldClass() {
        const app = document.getElementById('app');
        if (!app) return;

        // Remove todas as classes de mundo
        app.classList.remove(
            'world-guardian',
            'world-fire',
            'world-forest',
            'world-mountain',
            'world-desert',
            'world-castle',
            'theme-fire-elite',
            'level-forest-elite-10',
            'level-fire-boss-20',
            'level-fire-elite-10',
            'level-fire-elite-15'
        );

        // Remove todas as classes de tipo de fase
        app.classList.remove(
            'level-type-normal',
            'level-type-elite',
            'level-type-boss'
        );

        // Se nÃ£o estiver no modo aventura, nÃ£o adiciona nenhuma classe
        if (this.currentMode !== 'adventure' || !this.currentLevelConfig) {
        if (RUNTIME_LOGS) console.log('[WORLD-CLASS] NÃ£o Ã© modo aventura ou sem levelConfig. currentMode:', this.currentMode);
            return;
        }

        // Encontra o mundo atual baseado no levelConfig
        const currentWorld = WORLDS.find(w => w.levels.some(l => l.id === this.currentLevelConfig.id));
        if (!currentWorld) {
            console.warn('[WORLD-CLASS] Mundo nÃ£o encontrado para level:', this.currentLevelConfig.id);
            return;
        }

        // Mapeia o ID do mundo para a classe CSS
        const worldClassMap = {
            'tutorial_world': 'world-guardian',
            'fire_world': 'world-fire',
            'forest_world': 'world-forest',
            'mountain_world': 'world-mountain',
            'desert_world': 'world-desert',
            'castle_world': 'world-castle'
        };

        const worldClass = worldClassMap[currentWorld.id];
        if (worldClass) {
            app.classList.add(worldClass);
        }

        // Determina o tipo de fase e aplica classe correspondente
        const levelType = this.currentLevelConfig.type || 'normal';
        let levelTypeClass = 'level-type-normal';
        const eliteLevelIds = new Set([10, 15, 30, 35, 50, 55, 70, 75, 90, 95]);

        if (levelType === 'boss') {
            const levelId = this.currentLevelConfig.id;
            // Elites dos mundos (2 primeiras fases de boss por mundo)
            if (eliteLevelIds.has(levelId)) {
                levelTypeClass = 'level-type-elite';
            } else {
                levelTypeClass = 'level-type-boss';
            }
        }

        app.classList.add(levelTypeClass);
        const isFireElite = currentWorld.id === 'fire_world' && levelTypeClass === 'level-type-elite';
        if (isFireElite) {
            app.classList.add('theme-fire-elite');
        }
        if (DEBUG_BOSS_HUD && this.currentLevelConfig) {
            console.log('[ELITE-FIRE] root classes:', app.className, '| world:', currentWorld.id, '| level:', this.currentLevelConfig.id);
        }

        if (isFireElite) {
            this.ensureBoardFrameOnBoard();
        } else {
            this.removeBoardFrameFromBoard();
        }

        // Classe especial apenas para a fase Elite 10 da Floresta (levelId 30)
        if (currentWorld.id === 'forest_world' && this.currentLevelConfig.id === 30) {
            app.classList.add('level-forest-elite-10');
        }
        // Classe especial para o Boss Ignis (levelId 20)
        if (currentWorld.id === 'fire_world' && this.currentLevelConfig.id === 20) {
            app.classList.add('level-fire-boss-20');
        }
        if (currentWorld.id === 'fire_world' && this.currentLevelConfig.id === 10) {
            app.classList.add('level-fire-elite-10');
        }
        if (currentWorld.id === 'fire_world' && this.currentLevelConfig.id === 15) {
            app.classList.add('level-fire-elite-15');
        }

        if (RUNTIME_LOGS) console.log('[WORLD-CLASS] âœ… Classes aplicadas:', worldClass, '+', levelTypeClass, '| Mundo:', currentWorld.name, '| #app classes:', app.className);
    }

    getInfoCardId() {
        if (this.currentMode !== 'adventure' || !this.currentLevelConfig) return null;
        const levelId = this.currentLevelConfig.id;
        const currentWorld = WORLDS.find(w => w.levels.some(l => l.id === levelId));
        if (!currentWorld) return null;

        if (currentWorld.id === 'tutorial_world' && levelId === 0) return 'guardian';
        if (currentWorld.id === 'fire_world') {
            if (levelId === 10) return 'fire_elite_10';
            if (levelId === 15) return 'fire_elite_15';
            if (levelId === 20) return 'fire_boss_20';
        }
        if (currentWorld.id === 'forest_world') {
            if (levelId === 30) return 'forest_elite_30';
            if (levelId === 35) return 'forest_elite_35';
            if (levelId === 40) return 'forest_boss_40';
        }
        if (currentWorld.id === 'mountain_world') {
            if (levelId === 50) return 'mountain_elite_50';
            if (levelId === 55) return 'mountain_elite_55';
            if (levelId === 60) return 'mountain_boss_60';
        }
        if (currentWorld.id === 'desert_world') {
            if (levelId === 70) return 'desert_elite_70';
            if (levelId === 75) return 'desert_elite_75';
            if (levelId === 80) return 'desert_boss_80';
        }
        if (currentWorld.id === 'castle_world') {
            if (levelId === 90) return 'castle_elite_90';
            if (levelId === 95) return 'castle_elite_95';
            if (levelId === 100) return 'castle_boss_100';
        }
        return null;
    }

    updateInfoHelpIcon() {
        const helpBtn = document.getElementById('gear-help-btn');
        if (!helpBtn) return;
        const shouldShow = !!this.getInfoCardId();
        helpBtn.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
        if (!shouldShow) this.closeInfoCard();
    }

    renderInfoCard(infoId) {
        const info = INFO_CARD_DATA[infoId];
        if (!info || !this.i18n) return;

        const titleEl = document.getElementById('guardian-info-title');
        const subtitleEl = document.getElementById('guardian-info-subtitle');
        if (titleEl) titleEl.textContent = this.i18n.t(info.titleKey);
        if (subtitleEl) subtitleEl.textContent = this.i18n.t(info.subtitleKey);

        const sealImg = document.getElementById('guardian-info-seal');
        if (sealImg && info.sealImage) {
            if (info.sealAltKey) sealImg.alt = this.i18n.t(info.sealAltKey);
            sealImg.dataset.fallbackSrc = info.sealFallback || '';
            sealImg.onerror = () => {
                const fallback = sealImg.dataset.fallbackSrc;
                if (fallback && sealImg.src.indexOf(fallback) === -1) {
                    sealImg.src = fallback;
                }
            };
            sealImg.src = info.sealImage;
        }

        const makeItem = (item) => `
            <div class="scroll-item">
                <span class="scroll-icon">${item.icon || ''}</span>
                <div>
                    <div class="scroll-item-title">${this.i18n.t(item.titleKey)}</div>
                    <div class="scroll-item-desc">${this.i18n.t(item.descKey)}</div>
                </div>
            </div>`;

        const bossList = document.getElementById('guardian-info-boss-list');
        if (bossList) bossList.innerHTML = info.bossPowers.map(makeItem).join('');

        const itemsList = document.getElementById('guardian-info-items-list');
        if (itemsList) itemsList.innerHTML = info.items.map(makeItem).join('');

        const heroesList = document.getElementById('guardian-info-heroes-list');
        if (heroesList) heroesList.innerHTML = info.heroes.map(makeItem).join('');
    }

    openInfoCard() {
        const infoId = this.getInfoCardId();
        if (!infoId) return;
        this.renderInfoCard(infoId);
        const overlay = document.getElementById('guardian-info-overlay');
        if (!overlay) return;
        this._infoCardLastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        this._infoCardOpen = true;
        this.teardownIgnisSpriteOverlay();
        overlay.classList.remove('hidden');
        overlay.inert = false;
        overlay.setAttribute('aria-hidden', 'false');
        const closeBtn = overlay.querySelector('#guardian-info-close');
        if (closeBtn) closeBtn.focus();
    }

    closeInfoCard() {
        const overlay = document.getElementById('guardian-info-overlay');
        if (!overlay) return;
        const lastFocus = this._infoCardLastFocus;
        if (overlay.contains(document.activeElement)) {
            if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
            else overlay.blur?.();
        }
        overlay.classList.add('hidden');
        overlay.inert = true;
        overlay.setAttribute('aria-hidden', 'true');
        this._infoCardOpen = false;
        this.updateIgnisBossUiOverride();
    }

    getClassicResultImageSrc() {
        const lang = this.i18n?.currentLang || 'en';
        return lang === 'pt-BR'
            ? 'assets/images/modal_result_classic_pt.webp'
            : 'assets/images/modal_result_classic_en.webp';
    }

    formatDuration(ms) {
        const totalSeconds = Math.max(0, Math.floor((ms || 0) / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showClassicResult() {
        const modal = document.getElementById('modal-classic-result');
        if (!modal) return;

        if (this.modalOver) this.modalOver.classList.add('hidden');
        if (this.modalWin) this.modalWin.classList.add('hidden');

        const img = document.getElementById('classic-result-image');
        if (img) img.src = this.getClassicResultImageSrc();

        const timeEl = document.getElementById('classic-result-time');
        const scoreEl = document.getElementById('classic-result-score');
        const xpEl = document.getElementById('classic-result-xp');
        const linesEl = document.getElementById('classic-result-lines');
        const comboEl = document.getElementById('classic-result-combo');
        const recordInlineEl = document.getElementById('classic-result-record-inline');
        const scoreRowEl = document.getElementById('classic-result-score-row');

        const duration = Date.now() - (this._classicStartTime || Date.now());
        if (timeEl) timeEl.textContent = this.formatDuration(duration);
        if (scoreEl) scoreEl.textContent = this.classicState.score.toLocaleString();
        if (xpEl) xpEl.textContent = this._classicMatchXp.toLocaleString();
        if (linesEl) linesEl.textContent = this.classicState.linesCleared.toLocaleString();
        if (comboEl) comboEl.textContent = this._classicMaxCombo.toString();

        if (recordInlineEl) {
            const bestAtStart = Number.isFinite(this._classicBestAtStart)
                ? this._classicBestAtStart
                : this.classicState.bestScore;
            const isRecord = this.classicState.score > bestAtStart;
            if (isRecord) {
                recordInlineEl.classList.remove('hidden');
                recordInlineEl.style.display = 'inline-flex';
            } else {
                recordInlineEl.classList.add('hidden');
                recordInlineEl.style.display = 'none';
            }
            if (scoreRowEl) {
                if (isRecord) scoreRowEl.classList.add('is-record');
                else scoreRowEl.classList.remove('is-record');
            }
        }

        const btnRestart = document.getElementById('btn-classic-restart');
        if (btnRestart) {
            const newBtn = btnRestart.cloneNode(true);
            btnRestart.parentNode.replaceChild(newBtn, btnRestart);
            newBtn.addEventListener('click', () => {
                if (this.audio) this.audio.playClick();
                modal.classList.add('hidden');
                this.startClassicMode();
            });
        }

        const btnBack = document.getElementById('btn-classic-back');
        if (btnBack) {
            const newBtn = btnBack.cloneNode(true);
            btnBack.parentNode.replaceChild(newBtn, btnBack);
            newBtn.addEventListener('click', () => {
                if (this.audio) this.audio.playClick();
                modal.classList.add('hidden');
                this.showScreen(this.screenMenu);
            });
        }

        modal.classList.remove('hidden');
        modal.style.pointerEvents = '';
        modal.style.opacity = '';
    }

    maybeShowInfoCard() {
        const infoId = this.getInfoCardId();
        if (!infoId) return;
        const seenKey = `blocklands_info_seen_${infoId}`;
        if (localStorage.getItem(seenKey) === 'true') return;
        localStorage.setItem(seenKey, 'true');
        this.openInfoCard();
    }

    // --- MUNDOS E NÃVEIS ---

    showWorldSelect() {
        this.preloadDeferredAssets('world_select');
        const container = document.getElementById('levels-container');
        
        if (container) {
            container.style = ''; 
            container.style.backgroundImage = "url('assets/img/bg_world_select.webp')";
            container.className = 'world-select-layout';
        }

        this.showScreen(this.screenLevels); 
        this.toggleGlobalHeader(false); 

        if(!container) return;

        // 1. INSERE OS BOTÃ•ES PADRONIZADOS (AAA)
        container.innerHTML = `
            <div class="buttons-sticky-header">
                <button id="btn-world-back-internal" class="btn-aaa-back pos-absolute-top-left">
                    <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                </button>
                
                <button id="btn-replay-story" class="btn-aaa-back" style="position: absolute; top: 20px; right: 20px;">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                </button>
            </div>
            <div class="worlds-grid" id="worlds-grid"></div>
        `;

        // 2. CONFIGURA EVENTOS (Simplificado para evitar bugs)
        const backBtn = document.getElementById('btn-world-back-internal');
        if (backBtn) {
            backBtn.onclick = (e) => {
                e.preventDefault(); // Previne comportamentos estranhos
                if(this.audio) this.audio.playBack();
                container.className = '';
                container.style.backgroundImage = ''; 
                this.showScreen(this.screenMenu);
            };
        }
        
        const replayBtn = document.getElementById('btn-replay-story');
        if (replayBtn) {
            replayBtn.onclick = () => {
                if(this.audio) this.audio.playClick();
                this.playStory({ includeAfter: true });
            };
        }

        // 3. RENDERIZA OS MUNDOS (CÃ³digo original mantido)
        const grid = document.getElementById('worlds-grid');
        const currentSave = this.loadProgress(); 

        const worldImages = {
            'tutorial_world': 'assets/img/icon_world_tutorial.jpg',
            'fire_world':     'assets/img/icon_world_fire.jpg',
            'forest_world':   'assets/img/icon_world_forest.jpg',
            'mountain_world': 'assets/img/icon_world_mountain.jpg',
            'desert_world':   'assets/img/icon_world_desert.jpg',
            'castle_world':   'assets/img/icon_world_castle.jpg'
        };

        WORLDS.forEach((world) => {
            const worldItem = document.createElement('div');
            worldItem.style.position = 'absolute';
            const pos = world.worldPos || { x: 50, y: 50 };
            worldItem.style.left = pos.x + '%';
            worldItem.style.top = pos.y + '%';
            worldItem.style.transform = 'translate(-50%, -50%)';
            worldItem.style.display = 'flex';
            worldItem.style.flexDirection = 'column';
            worldItem.style.alignItems = 'center';
            worldItem.style.zIndex = '10';

            let firstLevelId = world.levels[0].id;
            const isLocked = currentSave < firstLevelId;

            if (world.id === 'tutorial_world' && currentSave === 0) {
                const hand = document.createElement('div');
                hand.className = 'tutorial-hand';
                hand.innerHTML = '\u{1F446}'; 
                worldItem.appendChild(hand);
            }

            const img = document.createElement('img');
            img.src = worldImages[world.id] || 'assets/img/icon_world_fire.jpg';
            img.alt = world.name;
            img.className = 'world-card-image';
            if (world.worldSize) img.style.width = world.worldSize + 'px';
            if (isLocked) img.classList.add('locked');

            img.addEventListener('click', () => {
                if (!isLocked) {
                    if(this.audio) this.audio.playClick();
                    if (world.id === 'tutorial_world') {
                        this.toggleGlobalHeader(true);
                        const container = document.getElementById('levels-container');
                        container.style.display = 'none';
                        document.body.className = '';
                        this.startAdventureLevel(world.levels[0]);
                    } else {
                        this.openWorldMap(world); 
                    }
                } else {
                    if(this.audio) this.audio.vibrate(50);
                    this.effects.showFloatingTextCentered(this.i18n.t('worlds.locked_msg'), "feedback-bad");
                }
            });

            worldItem.appendChild(img);
            if (isLocked) {
                const lock = document.createElement('div');
                lock.className = 'lock-overlay';
                lock.innerHTML = '\u{1F512}';
                worldItem.appendChild(lock);
            }
            grid.appendChild(worldItem);
        });
    }

    showAchievementsScreen(initialFilter = 'classic') {
        this.showScreen(this.screenAchievements);
        this.toggleGlobalHeader(false);

        if (!this.achievements) return;

        // Store current filter
        this.currentAchievementFilter = initialFilter;

        // Setup tab filters (remove old listeners first)
        const tabs = document.querySelectorAll('.achievements-tab');
        tabs.forEach(tab => {
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
        });

        // Add new listeners
        document.querySelectorAll('.achievements-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                document.querySelectorAll('.achievements-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Get filter and update
                const filter = tab.dataset.filter;
                this.currentAchievementFilter = filter;

                // Update stats for this mode
                this.updateAchievementStats(filter);

                // Render filtered achievements
                this.renderAchievementsList(filter);

                // Play click sound
                if (this.audio) this.audio.playClick();
            });
        });

        // Initial render
        this.updateAchievementStats(initialFilter);
        this.renderAchievementsList(initialFilter);
    }

    updateAchievementStats(mode) {
        if (!this.achievements) return;

        const allAchievements = this.achievements.getAll();

        // Filter by mode
        const filtered = allAchievements.filter(ach => ach.mode === mode);

        // Calculate stats for this mode
        const total = filtered.length;
        const unlocked = filtered.filter(ach => ach.unlocked).length;
        const percentage = total > 0 ? Math.floor((unlocked / total) * 100) : 0;

        // Update UI
        const unlockedEl = document.getElementById('achievements-unlocked');
        const totalEl = document.getElementById('achievements-total');
        const progressFillEl = document.getElementById('achievements-progress-fill');

        if (unlockedEl) unlockedEl.textContent = unlocked;
        if (totalEl) totalEl.textContent = total;
        if (progressFillEl) {
            progressFillEl.style.width = percentage + '%';
        }
    }

    renderAchievementsList(mode) {
        const listEl = document.getElementById('achievements-list');
        if (!listEl || !this.achievements) return;

        const allAchievements = this.achievements.getAll();

        // Filter achievements by mode
        const filtered = allAchievements.filter(ach => ach.mode === mode);

        listEl.innerHTML = filtered.map(ach => {
            const isUnlocked = ach.unlocked;
            const progress = ach.progress || 0;
            const target = ach.requirement.target || 1;
            const percentage = Math.min((progress / target) * 100, 100);

            // Calculate reward (diamonds based on tier)
            const rewardMap = { bronze: 10, silver: 25, gold: 50, platinum: 100 };
            const rewardAmount = rewardMap[ach.tier] || 10;

            return `
                <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}" data-category="${ach.category}">
                    <div class="achievement-item-icon">${ach.icon}</div>
                    <div class="achievement-item-content">
                        <div class="achievement-item-header">
                            <div class="achievement-item-title">${this.i18n.t(ach.title_key)}</div>
                            <div class="achievement-item-tier ${ach.tier}">${ach.tier}</div>
                        </div>
                        <div class="achievement-item-desc">${this.i18n.t(ach.desc_key)}</div>
                        ${!isUnlocked ? `
                            <div class="achievement-item-progress">
                                <div class="achievement-progress-bar-small">
                                    <div class="achievement-progress-fill-small" style="width: ${percentage}%"></div>
                                </div>
                                <div class="achievement-progress-text-small">${progress}/${target}</div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="achievement-item-reward">
                        <div class="achievement-reward-icon">\u{1F48E}</div>
                        <div class="achievement-reward-amount">x${rewardAmount}</div>
                    </div>
                    ${isUnlocked ? '<div class="achievement-item-checkmark">\u{2713}</div>' : ''}
                </div>
            `;
        }).join('');
    }

    // ============================================
    // LOJA DE MESTRES
    // ============================================

    showStoreScreen() {
        this.showScreen(this.screenStore);
        this.toggleGlobalHeader(false);
        this.updateCrystalDisplay(); // Atualiza badge de cristais
        this.updateStoreUnlockablesUI();
    }

    setupStoreListeners() {
    if (this._storeListenersBound) return;
    const storeGrids = document.querySelectorAll('.store-grid');

    if (!storeGrids || storeGrids.length === 0) {
        console.warn('[STORE] .store-grid nÃ£o encontrado no DOM');
        return;
    }

    storeGrids.forEach((storeGrid) => {
        // Event delegation - um Ãºnico listener por container
        storeGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-buy');

            if (!btn || btn.hasAttribute('disabled')) return;

            e.preventDefault();
            e.stopPropagation();

            const unlockableId = btn.getAttribute('data-unlockable-id')
                || btn.closest('[data-unlockable-id]')?.getAttribute('data-unlockable-id');

            if (unlockableId) {
                this.handleUnlockableSelection(unlockableId);
                return;
            }

            const productId = btn.getAttribute('data-product-id');
            if (RUNTIME_LOGS) console.log('[STORE] Tentando comprar:', productId);

            if (productId && STORE_PRODUCTS[productId]) {
                if (this.audio) this.audio.playClick();
                this.showPurchaseModal(STORE_PRODUCTS[productId]);
            } else {
                console.error('[STORE] Produto nÃ£o encontrado:', productId, STORE_PRODUCTS);
            }
        });
    });

    this._storeListenersBound = true;
    if (RUNTIME_LOGS) console.log('[STORE] Event listeners configurados com event delegation');
}

    setupStoreTabs() {
        if (this._storeTabsBound) return;
        const tabs = document.querySelectorAll('.store-tab');
        const categories = document.querySelectorAll('.store-category');

        if (!tabs || tabs.length === 0 || !categories || categories.length === 0) {
            console.warn('[STORE] Tabs/categorias nÃ£o encontrados');
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
        this._storeTabsBound = true;
    }


    showPurchaseModal(product) {
        // Cria modal de confirmaÃ§Ã£o
        const modal = document.createElement('div');
        modal.className = 'store-modal active';

        const newBalance = this.crystals - product.price;
        const canAfford = this.crystals >= product.price;

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon">${product.icon}</div>
                <h3 class="modal-title">${this.i18n.t('store.confirm_title')}</h3>
                <p class="modal-description">${this.i18n.t(product.descKeyModal || product.descKey || 'store.magnet_pack_desc')}</p>

                <div class="modal-price-info">
                    <div class="modal-price-row">
                        <span class="modal-price-label">${this.i18n.t('store.price_label')}</span>
                        <span class="modal-price-value">\u{1F48E} ${product.price}</span>
                    </div>
                    <div class="modal-price-row">
                        <span class="modal-price-label">${this.i18n.t('store.balance_label')}</span>
                        <span class="modal-price-value">\u{1F48E} ${this.crystals}</span>
                    </div>
                    <div class="modal-price-row">
                        <span class="modal-price-label">${this.i18n.t('store.new_balance_label')}</span>
                        <span class="modal-price-value ${canAfford ? '' : 'text-danger'}">
                            \u{1F48E} ${canAfford ? newBalance : '---'}
                        </span>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-cancel">${this.i18n.t('store.btn_cancel')}</button>
                    <button class="modal-btn modal-btn-confirm" ${!canAfford ? 'disabled' : ''}>
                        ${canAfford ? this.i18n.t('store.btn_confirm') : this.i18n.t('store.insufficient_funds')}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listener para cancelar
        const btnCancel = modal.querySelector('.modal-btn-cancel');
        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                if (RUNTIME_LOGS) console.log('[STORE] Compra cancelada');
                if (this.audio) this.audio.playBack();
                modal.remove();
            });
        }

        // Event listener para confirmar
        const btnConfirm = modal.querySelector('.modal-btn-confirm');
        if (btnConfirm) {
            if (RUNTIME_LOGS) console.log('[STORE] Botao confirmar encontrado. canAfford:', canAfford);

            btnConfirm.addEventListener('click', (e) => {
                if (RUNTIME_LOGS) console.log('[STORE] Botao confirmar clicado');

                if (!canAfford) {
                    console.warn('[STORE] Tentativa de compra sem saldo suficiente');
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                if (this.audio) this.audio.playClick();

                if (RUNTIME_LOGS) console.log('[STORE] Executando purchaseProduct...');
                const success = this.purchaseProduct(product);

                if (success) {
                    if (RUNTIME_LOGS) console.log('[STORE] Compra bem-sucedida, fechando modal');
                    modal.remove();
                } else {
                    console.error('[STORE] Compra falhou, mantendo modal aberto');
                }
            });
        } else {
            console.error('[STORE] BotÃ£o confirmar nÃ£o encontrado no modal!');
        }

        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (this.audio) this.audio.playBack();
                modal.remove();
            }
        });
    }

    purchaseProduct(product) {
        const oldCrystals = this.crystals;
        const oldPowerUps = { ...this.powerUps };

        try {
            // Validar saldo
            if (this.crystals < product.price) {
                this.showStoreToast(this.i18n.t('store.insufficient_crystals'), 'error');
                return false;
            }

            // Validar produto
            if (!product || !product.type) {
                throw new Error('Produto invÃ¡lido');
            }

            // === FASE 1: Aplicar mudanÃ§as aos power-ups ===
            if (product.type === 'powerup') {
                if (!product.powerupType) {
                    throw new Error('Tipo de power-up n?o especificado');
                }
                const currentCount = this.powerUps[product.powerupType] || 0;
                if (currentCount + product.quantity > MAX_POWERUP_COUNT) {
                    this.showStoreToast(this.i18n.t('store.powerup_cap_reached'), 'error');
                    return false;
                }
                this.powerUps[product.powerupType] = (this.powerUps[product.powerupType] || 0) + product.quantity;
            } else if (product.type === 'bundle') {
                if (!product.items || product.items.length === 0) {
                    throw new Error('Bundle sem itens');
                }
                for (const item of product.items) {
                    if (!item.powerupType) {
                        throw new Error('Item do bundle sem tipo');
                    }
                    const currentCount = this.powerUps[item.powerupType] || 0;
                    if (currentCount + item.quantity > MAX_POWERUP_COUNT) {
                        this.showStoreToast(this.i18n.t('store.powerup_cap_reached'), 'error');
                        return false;
                    }
                }
                product.items.forEach(item => {
                    if (!item.powerupType) {
                        throw new Error('Item do bundle sem tipo');
                    }
                    this.powerUps[item.powerupType] = (this.powerUps[item.powerupType] || 0) + item.quantity;
                });
            } else {
                throw new Error(`Tipo de produto desconhecido: ${product.type}`);
            }

            // === FASE 2: Deduzir cristais (apenas apÃ³s confirmar que itens foram aplicados) ===
            this.crystals -= product.price;

            // === FASE 3: Persistir no localStorage (apenas apÃ³s tudo validado) ===
            localStorage.setItem('blocklands_crystals', this.crystals.toString());

            if (product.type === 'powerup') {
                localStorage.setItem(`blocklands_powerup_${product.powerupType}`, this.powerUps[product.powerupType].toString());
                if (RUNTIME_LOGS) console.log(`[STORE] Comprou ${product.quantity}x ${product.powerupType}. Total: ${this.powerUps[product.powerupType]}`);
            } else if (product.type === 'bundle') {
                product.items.forEach(item => {
                    localStorage.setItem(`blocklands_powerup_${item.powerupType}`, this.powerUps[item.powerupType].toString());
                    if (RUNTIME_LOGS) console.log(`[STORE] Comprou ${item.quantity}x ${item.powerupType}. Total: ${this.powerUps[item.powerupType]}`);
                });
            }

            // === FASE 4: Atualizar UI ===
            this.updateCrystalDisplay();

            if (this.powers && typeof this.powers.updateCounts === 'function') {
                this.powers.updateCounts(this.powerUps);
            }

            // === FASE 5: Feedback de sucesso ===
            this.showStoreToast(`${product.icon} ${this.i18n.t('store.purchase_success')}`, 'success');
            if (this.audio) this.audio.playClick();

            // Track achievement
            if (this.achievements && typeof this.achievements.trackEvent === 'function') {
                try {
                    this.achievements.trackEvent('store_purchase', { productId: product.id, price: product.price });
                } catch (e) {
                    console.warn('[STORE] Erro ao trackear achievement:', e);
                }
            }

            if (RUNTIME_LOGS) console.log(`[STORE] COMPRA CONCLUIDA: ${product.id} | Cristais: ${oldCrystals} -> ${this.crystals}`);
            return true;

        } catch (error) {
            // === ROLLBACK: Reverter TODAS as mudanÃ§as ===
            console.error('[STORE] ERRO em purchaseProduct:', error);
            if (RUNTIME_LOGS) console.warn('[STORE] Revertendo transacao...');

            this.crystals = oldCrystals;
            this.powerUps = oldPowerUps;

            // Reverter localStorage
            localStorage.setItem('blocklands_crystals', this.crystals.toString());
            Object.keys(this.powerUps).forEach(key => {
                localStorage.setItem(`blocklands_powerup_${key}`, this.powerUps[key].toString());
            });

            this.updateCrystalDisplay();

            if (this.powers && typeof this.powers.updateCounts === 'function') {
                this.powers.updateCounts(this.powerUps);
            }

            this.showStoreToast(this.i18n.t('store.purchase_error'), 'error');
            if (RUNTIME_LOGS) console.log(`[STORE] Rollback completo. Cristais restaurados: ${this.crystals}`);
            return false;
        }
    }

    showStoreToast(message, type = 'success') {
        // Remove toast anterior se existir
        const oldToast = document.querySelector('.store-toast');
        if (oldToast) oldToast.remove();

        // Cria novo toast
        const toast = document.createElement('div');
        toast.className = `store-toast ${type}`;

        const icon = type === 'success' ? 'âœ“' : 'âš ï¸';

        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        document.body.appendChild(toast);

        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 10);

        // Remover apÃ³s 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    setWorldMapBackground(mapElement, worldConfig) {
        if (!mapElement) return;
        const fallback = 'assets/img/bg_world_select.webp';
        const preferred = worldConfig?.bgImage || fallback;

        // Apply a safe fallback immediately to avoid a blank screen.
        mapElement.style.backgroundImage = `url('${fallback}')`;

        if (!preferred || preferred === fallback) return;

        this.preloadImage(preferred).then((ok) => {
            if (ok) {
                mapElement.style.backgroundImage = `url('${preferred}')`;
            }
        });
    }

    openWorldMap(worldConfig) {
        const container = document.getElementById('levels-container');
        if(!container) return;
        
        this.toggleGlobalHeader(false);

        // Limpa estilos antigos para garantir tela cheia
        container.className = ''; 
        container.style = ''; 
        container.style.display = 'block';

        // --- ATUALIZADO: BotÃ£o AAA com Z-Index alto ---
        container.innerHTML = `
            <button id="btn-map-back" class="btn-aaa-back pos-absolute-top-left" style="z-index: 2000;">
                <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            
            <div id="world-map-bg" class="world-map-container full-screen-mode">
            </div>
        `;

        // Configura a imagem de fundo com fallback seguro
        const mapBg = document.getElementById('world-map-bg');
        this.setWorldMapBackground(mapBg, worldConfig);

        // Configura o botÃ£o de voltar
        const mapBackBtn = document.getElementById('btn-map-back');
        if(mapBackBtn) {
            mapBackBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(this.audio) this.audio.playBack();
                
                // Limpa o HTML ao sair
                container.innerHTML = ''; 
                this.showWorldSelect(); 
            });
        }

        const currentSave = this.loadProgress();

        // --- FUNÃ‡ÃƒO AUXILIAR: BOTÃ•ES SVG (RACHADOS) ---
        // (O resto da funÃ§Ã£o openWorldMap continua exatamente igual daqui para baixo...)
        // ... (Mantenha o cÃ³digo do createSvgButton e o loop forEach igual ao que vocÃª jÃ¡ tem)
        
        // --- CÃ“DIGO REPETIDO PARA CONTEXTO (NÃƒO PRECISA COPIAR SE JÃ TIVER) ---
        const createSvgButton = (levelData) => {
            const pos = levelData.mapPos || { x: 50, y: 50 }; 
            const levelNum = levelData.id;
            const isFireWorld = worldConfig?.id === 'fire_world';
            
            let state = 'locked';
            if (levelData.id < currentSave) state = 'completed';
            else if (levelData.id === currentSave) state = 'current';
            else state = 'locked';

            let type = 'normal';
            let emojiIcon = null; 

            if (levelData.type === 'boss') {
                if (levelData.id === 20) {
                    type = 'final-boss';
                    emojiIcon = '\u{1F451}'; 
                } else {
                    type = 'elite';
                    emojiIcon = '\u{1F480}'; 
                }
            }
            
            if (state === 'current' && emojiIcon === null) {
                emojiIcon = '\u{2694}\u{FE0F}'; 
            }

            // Piloto de sprites customizados para o mapa do Mundo do Fogo.
            // Mantemos o escudo e os estados; trocamos apenas o conteúdo central.
            let phaseSpritePath = '';
            if (isFireWorld) {
                if (type === 'final-boss') phaseSpritePath = 'assets/enemies/fire_world/phase_boss.webp';
                else if (type === 'elite') phaseSpritePath = 'assets/enemies/fire_world/phase_elite.webp';
                else phaseSpritePath = 'assets/enemies/fire_world/phase_normal.webp';
            }

            const onNodeClick = () => {
                if (state === 'locked') {
                    if(this.audio) this.audio.vibrate(50);
                    return;
                }
                if(this.audio) this.audio.playClick();
                this.toggleGlobalHeader(true);
                const container = document.getElementById('levels-container');
                container.style.display = 'none';
                document.body.className = '';
                this.startAdventureLevel(levelData);
            };

            // Mundo do Fogo: usa apenas sprite customizado (sem escudo SVG).
            if (isFireWorld) {
                const spriteBtn = document.createElement('button');
                spriteBtn.type = 'button';

                let cssClasses = `map-node-sprite floating-node ${state} ${type}`;
                if (type === 'normal' && levelNum >= 1 && levelNum <= 5) {
                    cssClasses += ' very-early-normal';
                }
                if (type === 'normal' && levelNum >= 1 && levelNum <= 9) {
                    cssClasses += ' early-normal';
                }
                if (state === 'current') cssClasses += ' current';
                spriteBtn.className = cssClasses;
                spriteBtn.style.left = `${pos.x}%`;
                spriteBtn.style.top = `${pos.y}%`;
                spriteBtn.style.setProperty('--i', Math.random() * 5);
                if (phaseSpritePath) {
                    const resolvedSpritePath = new URL(phaseSpritePath, window.location.href).href;
                    spriteBtn.style.setProperty('--node-sprite', `url('${resolvedSpritePath}')`);
                }
                spriteBtn.setAttribute('aria-label', `Fase ${levelNum}`);

                spriteBtn.addEventListener('click', onNodeClick);
                return spriteBtn;
            }

            const palettes = {
                'normal':     { top: '#2563eb', bot: '#172554', stroke: '#60a5fa' },
                'elite':      { top: '#dc2626', bot: '#7f1d1d', stroke: '#fca5a5' },
                'final-boss': { top: '#f59e0b', bot: '#92400e', stroke: '#fcd34d' },
                'completed':  { top: '#475569', bot: '#0f172a', stroke: '#1e293b' }
            };

            const p = (state === 'completed') ? palettes['completed'] : palettes[type];

            let finalStroke = p.stroke;
            let finalStrokeWidth = "2";
            
            if (state === 'current') {
                finalStroke = "#fbbf24"; 
                finalStrokeWidth = "4";  
            }

            const svgNS = "http://www.w3.org/2000/svg";
            const svgBtn = document.createElementNS(svgNS, "svg");
            const uniqueId = `btn-${levelData.id}`;
            
            let cssClasses = `map-node-svg style-shield floating-node ${state} ${type}`;
            
            if (state === 'current') cssClasses += ' current';
            
            svgBtn.setAttribute("class", cssClasses);
            svgBtn.setAttribute("viewBox", "0 0 100 100");
            svgBtn.style.left = `${pos.x}%`;
            svgBtn.style.top = `${pos.y}%`;
            
            svgBtn.style.setProperty('--i', Math.random() * 5);

            const defs = document.createElementNS(svgNS, "defs");
            defs.innerHTML = `
                <linearGradient id="gradMain-${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${p.top}" stop-opacity="1" />
                    <stop offset="100%" stop-color="${p.bot}" stop-opacity="1" />
                </linearGradient>
                <linearGradient id="gradShine-${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="white" stop-opacity="0.3" />
                    <stop offset="60%" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <radialGradient id="gradShadow-${uniqueId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stop-color="black" stop-opacity="0.6" />
                    <stop offset="100%" stop-color="black" stop-opacity="0" />
                </radialGradient>
                <clipPath id="clipShield-${uniqueId}">
                    <path d="M 50 5 L 90 20 v 25 c 0 30 -25 50 -40 55 c -15 -5 -40 -25 -40 -55 v -25 Z"/>
                </clipPath>
            `;
            svgBtn.appendChild(defs);

            const shadow = document.createElementNS(svgNS, "ellipse");
            shadow.setAttribute("cx", "50"); shadow.setAttribute("cy", "95");
            shadow.setAttribute("rx", "25"); shadow.setAttribute("ry", "6");
            shadow.setAttribute("fill", state === 'completed' ? "rgba(0,0,0,0.8)" : `url(#gradShadow-${uniqueId})`);
            svgBtn.appendChild(shadow);

            const shieldPath = "M 50 5 L 90 20 v 25 c 0 30 -25 50 -40 55 c -15 -5 -40 -25 -40 -55 v -25 Z";
            const pathBase = document.createElementNS(svgNS, "path");
            pathBase.setAttribute("d", shieldPath);
            pathBase.setAttribute("fill", `url(#gradMain-${uniqueId})`);
            pathBase.setAttribute("stroke", finalStroke);
            pathBase.setAttribute("stroke-width", finalStrokeWidth);
            svgBtn.appendChild(pathBase);

            if (isFireWorld && phaseSpritePath && state !== 'completed') {
                const iconImage = document.createElementNS(svgNS, "image");
                iconImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', phaseSpritePath);
                iconImage.setAttribute('x', '20');
                iconImage.setAttribute('y', '18');
                iconImage.setAttribute('width', '60');
                iconImage.setAttribute('height', '60');
                iconImage.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                iconImage.setAttribute('clip-path', `url(#clipShield-${uniqueId})`);
                iconImage.style.pointerEvents = "none";
                svgBtn.appendChild(iconImage);
            }

            if (state === 'completed') {
                const crackD = "M 35 30 L 50 50 L 40 65 M 60 40 L 50 50 L 55 70";
                
                const crackShadow = document.createElementNS(svgNS, "path");
                crackShadow.setAttribute("d", crackD);
                crackShadow.setAttribute("fill", "none");
                crackShadow.setAttribute("stroke", "black");
                crackShadow.setAttribute("stroke-width", "4");
                crackShadow.setAttribute("opacity", "0.8");
                svgBtn.appendChild(crackShadow);

                const crackHighlight = document.createElementNS(svgNS, "path");
                crackHighlight.setAttribute("d", crackD);
                crackHighlight.setAttribute("fill", "none");
                crackHighlight.setAttribute("stroke", "rgba(255,255,255,0.3)");
                crackHighlight.setAttribute("stroke-width", "1");
                crackHighlight.setAttribute("transform", "translate(1, 1)");
                svgBtn.appendChild(crackHighlight);
            }

            const shinePath = "M 50 10 L 80 22 v 20 c 0 20 -15 35 -30 40 c -15 -5 -30 -20 -30 -40 v -20 Z";
            const pathShine = document.createElementNS(svgNS, "path");
            pathShine.setAttribute("d", shinePath);
            pathShine.setAttribute("fill", `url(#gradShine-${uniqueId})`);
            pathShine.style.pointerEvents = "none";
            svgBtn.appendChild(pathShine);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", "50");
            text.setAttribute("y", "62");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("class", "glossy-text");
            text.style.pointerEvents = "none";
            
            text.style.fill = (state === 'completed') ? '#94a3b8' : '#ffffff';
            text.style.fontSize = isFireWorld ? "16px" : (emojiIcon ? "34px" : "28px");
            text.style.textShadow = "0 2px 4px rgba(0,0,0,0.8)";
            if (isFireWorld) {
                text.setAttribute("y", "86");
            }
            
            text.textContent = isFireWorld ? levelNum : (emojiIcon || levelNum);
            svgBtn.appendChild(text);

            svgBtn.addEventListener('click', onNodeClick);

            return svgBtn;
        };

        worldConfig.levels.forEach(level => {
            mapBg.appendChild(createSvgButton(level));
        });

        
    }

    // --- GAMEPLAY CORE ---

    setupGoalsUI(goalsConfig) {
        if(!this.goalsArea) return;
        const isBossFight = this.currentMode === 'adventure' && this.currentLevelConfig?.type === 'boss';
        if (isBossFight) {
            if (DEBUG_BOSS_HUD) {
                console.log('[HUD] Skipping normal goals UI for boss/elite fight:', this.currentLevelConfig?.id);
            }
            return;
        }
        this.currentGoals = { ...goalsConfig }; 
        this.collected = {};
        Object.keys(this.currentGoals).forEach(key => this.collected[key] = 0);

        let html = '<div class="goals-container">';
        Object.keys(this.currentGoals).forEach(key => {
            const emoji = EMOJI_MAP[key] || 'â“';
            const spritePath = this.getItemSpritePathByKey(key);
            const goalVisual = spritePath
                ? `<span class="goal-emoji goal-sprite" style="background-image: url('${spritePath}');" aria-hidden="true"></span>`
                : `<span class="goal-emoji">${emoji}</span>`;
            html += `
                <div class="goal-item" id="goal-item-${key}">
                    <div class="goal-circle type-${key}-glow">${goalVisual}</div>
                    <div class="goal-info"><span class="goal-counter" id="goal-val-${key}">0/${this.currentGoals[key]}</span></div>
                </div>`;
        });
        html += '</div>';
        this.goalsArea.innerHTML = html;
        if (DEBUG_BOSS_HUD) {
            console.log('[HUD] Normal goals UI rendered. Fight type:', this.currentLevelConfig?.type || 'none');
        }
    }

    ensureBoardFrameOnBoard() {
        const board = document.querySelector('#game-board');
        if (!board) return;

        // Frame asset removed; keep function as no-op to avoid 404s.
        return;

        const existingFrames = board.querySelectorAll(':scope > .board-frame');
        existingFrames.forEach((frame) => frame.remove());

        const frameEl = document.createElement('img');
        frameEl.className = 'board-frame';
        frameEl.alt = '';
        frameEl.setAttribute('aria-hidden', 'true');
        frameEl.src = './assets/img/frame-board-fire-elite.webp';

        board.insertBefore(frameEl, board.firstChild);
    }

    removeBoardFrameFromBoard() {
        const board = document.querySelector('#game-board');
        if (!board) return;

        const existingFrames = board.querySelectorAll(':scope > .board-frame');
        existingFrames.forEach((frame) => frame.remove());
    }

    queueLayoutGeometryLog(tag) {
        if (!DEBUG_LAYOUT_GEOMETRY) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.logLayoutGeometry(tag);
            });
        });
    }

    logLayoutGeometry(tag) {
        if (!DEBUG_LAYOUT_GEOMETRY) return;

        const board = document.querySelector('#game-board');
        const dock = document.querySelector('#dock');
        const tray = document.querySelector('#powerups-area');
        const goals = document.querySelector('#goals-area');

        const round = (value) => Math.round(value);
        const rect = (el) => {
            if (!el) return null;
            const box = el.getBoundingClientRect();
            return {
                x: round(box.x),
                y: round(box.y),
                w: round(box.width),
                h: round(box.height)
            };
        };

        console.log('[layout-geom]', tag, {
            levelId: this.currentLevelConfig?.id ?? null,
            levelType: this.currentLevelConfig?.type ?? null,
            board: rect(board),
            dock: rect(dock),
            tray: rect(tray),
            goals: rect(goals)
        });
    }

    queueDockGeometryLog(tag) {
        if (!DEBUG_DOCK_GEOMETRY) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.logDockGeometry(tag);
            });
        });
    }

    logDockGeometry(tag) {
        if (!DEBUG_DOCK_GEOMETRY) return;

        const dock = document.querySelector('#powerups-area');
        const slot = dock ? dock.querySelector('.btn-powerup') : null;
        if (!dock || !slot) return;

        const round = (value) => Math.round(value);
        const rect = (el) => {
            const box = el.getBoundingClientRect();
            return {
                x: round(box.x),
                y: round(box.y),
                w: round(box.width),
                h: round(box.height)
            };
        };

        console.log('[dock-geom]', tag, {
            levelId: this.currentLevelConfig?.id ?? null,
            levelType: this.currentLevelConfig?.type ?? null,
            dock: rect(dock),
            button: rect(slot)
        });
    }
	
	beginGoalsBatch() {
    this._goalsBatchDepth = (this._goalsBatchDepth || 0) + 1;
    this._goalsDirty = false;
}

endGoalsBatch() {
    if (!this._goalsBatchDepth) return;
    this._goalsBatchDepth--;

    // SÃ³ atualiza quando sair do Ãºltimo batch
    if (this._goalsBatchDepth === 0 && this._goalsDirty) {
        this._goalsDirty = false;
        this.updateGoalsUI();
    }
}


    updateGoalsUI() {
    if (!this.currentGoals) return;

    for (const key of Object.keys(this.currentGoals)) {
        const el = document.getElementById(`goal-val-${key}`);
        if (!el) continue;

        const target = this.currentGoals[key];
        const current = this.collected[key] || 0;

        const newText = `${current}/${target}`;
        if (el.textContent !== newText) el.textContent = newText;

        const parent = document.getElementById(`goal-item-${key}`);
        if (parent && current >= target) parent.classList.add('completed');
    }
}


    checkVictoryConditions() {
        if (!this.currentGoals || Object.keys(this.currentGoals).length === 0) return false;

        // LÃ“GICA ESPECIAL PARA FASE BÃ”NUS (SALA DO TESOURO)
        if (false) {
            const winners = [];
            
            // 1. Carrega inventÃ¡rio atualizado (AGORA COM MAGNET)
            const inventory = {
                magnet: parseInt(localStorage.getItem('blocklands_powerup_magnet') || '0'),
                rotate: parseInt(localStorage.getItem('blocklands_powerup_rotate') || '0'),
                swap: parseInt(localStorage.getItem('blocklands_powerup_swap') || '0')
            };

            // Verifica se o inventÃ¡rio estÃ¡ cheio (Max 3 de cada)
            const isFullInventory = (inventory.magnet >= 3 && inventory.rotate >= 3 && inventory.swap >= 3);

            // 2. Verifica metas
            Object.keys(this.currentGoals).forEach(key => {
                const currentAmount = this.collected[key] || 0;
                const targetAmount = this.currentGoals[key];

                if (currentAmount >= targetAmount) {
                    // SÃ³ ganha o item se tiver menos de 3, ou se estiver tudo cheio (pra nÃ£o travar o jogo)
                    // Como 'key' agora Ã© 'magnet', 'inventory[key]' vai funcionar corretamente
                    if (inventory[key] < 3 || isFullInventory) {
                        winners.push(key);
                    }
                }
            });

            // Se ganhou algo, encerra a fase
            if (winners.length > 0) {
                const rewardsList = [];

                winners.forEach(powerUp => {
                    const currentAmount = parseInt(localStorage.getItem(`powerup_${powerUp}`) || '0');
                    const newAmount = Math.min(currentAmount + 1, 3);
                    localStorage.setItem(`powerup_${powerUp}`, newAmount);
                    
                    rewardsList.push({ type: powerUp, count: 1 });
                });
                
                this.loadPowerUps(); // Atualiza visualmente os botÃµes

                setTimeout(() => {
                    this.gameWon(this.collected, rewardsList);
                }, 300);
                
                return true; 
            }
            return false;
        }

        // LÃ“GICA PADRÃƒO (Fases Normais e Boss)
        const allMet = Object.keys(this.currentGoals).every(key => {
            return (this.collected[key] || 0) >= this.currentGoals[key];
        });

        if (allMet) {
            setTimeout(() => {
                this.gameWon(this.collected, []); 
            }, 300);
            return true;
        }
        return false;
    }

    startBlitzMode() {
        this.currentMode = 'blitz';
        this.currentLevelConfig = null;
        this._matchRewardsActive = false;
        this._blitzStartTime = Date.now();
        this._blitzMatchXp = 0;
        this._blitzXpActive = true;
        this._blitzLinesCleared = 0;
        this._blitzMaxCombo = 0;
        this._blitzBlocksDone = 0;
        this._blitzBlocksTotal = 0;
        this.currentGoals = {};
        this.collected = {};
        if (this.bossState) this.bossState.active = false;

        const statsPanel = document.getElementById('classic-stats');
        if (statsPanel) statsPanel.classList.add('hidden');
        const missionsContainer = document.getElementById('classic-missions');
        if (missionsContainer) missionsContainer.classList.add('hidden');
        const classicScoreHero = document.getElementById('classic-score-hero');
        if (classicScoreHero) {
            classicScoreHero.classList.add('hidden');
            classicScoreHero.style.display = 'none';
        }

        this.showScreen(this.screenGame);
        this.resetGame();

        if (this.blitz) {
            this.blitz.enter();
            this.blitz.startRun();
        }
    }

    startClassicMode() {
        this.currentMode = 'classic';
        this.currentLevelConfig = null;
        // Recarrega recorde para evitar estado desatualizado
        this.classicState.bestScore = parseInt(localStorage.getItem('classic_best_score') || '0');
        this._classicBestAtStart = this.classicState.bestScore;
        this._classicStartTime = Date.now();
        this._classicMatchXp = 0;
        this._classicXpActive = true;
        this._classicMaxCombo = 0;
        this._matchRewardsActive = false;
        const classicModal = document.getElementById('modal-classic-result');
        if (classicModal) classicModal.classList.add('hidden');

        // ========================================
        // REMOVE CLASSES DE MUNDO (Modo ClÃ¡ssico nÃ£o usa mundos)
        // ========================================
        this.updateWorldClass();
        this.updateClassicThemeClass();
        this.updateInfoHelpIcon();

        // Reseta estado do modo clÃ¡ssico
        this.classicState.score = 0;
        this.classicState.level = 1;
        this.classicState.linesCleared = 0;
        this.classicState.comboStreak = 0;
        this.classicState.recordBeaten = false; // Reseta flag de recorde
        if (this.classicState.comboTimer) {
            clearTimeout(this.classicState.comboTimer);
            this.classicState.comboTimer = null;
        }

        // Reset da animaÃ§Ã£o do score hero (somente modo clÃ¡ssico)
        if (this._classicScoreRaf) {
            cancelAnimationFrame(this._classicScoreRaf);
            this._classicScoreRaf = 0;
        }
        if (this._classicScorePopTimer) {
            clearTimeout(this._classicScorePopTimer);
            this._classicScorePopTimer = 0;
        }
        if (this._classicScoreDeltaTimer) {
            clearTimeout(this._classicScoreDeltaTimer);
            this._classicScoreDeltaTimer = 0;
        }
        if (this._classicScoreGlowTimer) {
            clearTimeout(this._classicScoreGlowTimer);
            this._classicScoreGlowTimer = 0;
        }
        if (this._classicScoreMilestoneTimer) {
            clearTimeout(this._classicScoreMilestoneTimer);
            this._classicScoreMilestoneTimer = 0;
        }
        this._classicScoreDisplayed = this.classicState.score;
        this._classicScoreTarget = this.classicState.score;
        this._classicBestDisplay = this.classicState.bestScore;

        const deltaEl = document.getElementById('classic-score-hero-delta');
            if (deltaEl) {
            deltaEl.textContent = '';
            deltaEl.classList.remove('is-visible');
        }

        // MissÃµes/objetivos desativados no modo clÃ¡ssico (topo limpo)
        this.classicState.missions = [];
        this.classicState.missionRewardActive = false;
        this.classicState.missionRewardMultiplier = 1.0;
        if (RUNTIME_LOGS) console.log('[MISSIONS] Modo clÃ¡ssico sem missÃµes/objetivos.');

        this.clearTheme();
        this.showScreen(this.screenGame);
        this.resetGame();
        this.queueDockGeometryLog('classic-start');

        // Esconder Ã¡rea de objetivos do modo aventura
        const goalsArea = document.getElementById('goals-area');
        if (goalsArea) {
            goalsArea.style.display = 'none';
        }

        this.hideBossHud();

        // Esconder AMBAS as barras de power-ups (antiga e nova)
        const powerupsArea = document.getElementById('powerups-area');
        if (powerupsArea) {
            powerupsArea.style.display = 'none';
        }

        const controlsBar = document.getElementById('controls-bar');
        if (controlsBar) {
            controlsBar.style.display = 'none';
        }

        // Mostrar UI do modo clÃ¡ssico
        const statsPanel = document.getElementById('classic-stats');
        if (statsPanel) {
            statsPanel.classList.remove('hidden');
            statsPanel.style.display = ''; // Remove display: none se existir
            this.updateClassicUI();
        }

        // Mostrar e atualizar missÃµes
        const missionsContainer = document.getElementById('classic-missions');
        if (missionsContainer) {
            missionsContainer.classList.remove('hidden');
            missionsContainer.style.display = ''; // Remove display: none
            this.updateMissionsUI();
        }

        // Mostrar placar hero do modo clÃ¡ssico
        const classicScoreHero = document.getElementById('classic-score-hero');
        if (classicScoreHero) {
            classicScoreHero.classList.remove('hidden');
            classicScoreHero.style.display = '';
            this.updateClassicUI();
        }
    }

    startAdventureLevel(levelConfig) {
        if (RUNTIME_LOGS) console.log('[START-ADVENTURE] \u{1F3AE} Iniciando nivel:', levelConfig);

        this.currentMode = 'adventure';
        this.currentLevelConfig = levelConfig;
        this._bossNameIntroPlayed = false;
        this._bossNameIntroAnimating = false;
        this._bossNameIntroKey = null;
        this._bossNameIntroActiveKey = null;
        if (this._bossNameIntroAnim) {
            try { this._bossNameIntroAnim.cancel(); } catch (e) {}
            this._bossNameIntroAnim = null;
        }
        if (this._bossNameIntroTimer) {
            clearTimeout(this._bossNameIntroTimer);
            this._bossNameIntroTimer = null;
        }
        if (this._bossNameIntroRetryRaf) {
            cancelAnimationFrame(this._bossNameIntroRetryRaf);
            this._bossNameIntroRetryRaf = 0;
        }
        this.clearBossNameLetterIntro();
        this.resetMatchRewards();
		this._saveDisabled = false;
        this._pendingSyncedBossImpacts = 0;
        this._postImpactMoveCheckNeeded = false;
        this._postImpactBossTurnEndNeeded = false;
        this._resultResolved = false;
        this.showScreen(this.screenGame);

        if (RUNTIME_LOGS) console.log('[START-ADVENTURE] âœ… currentMode:', this.currentMode);
        if (RUNTIME_LOGS) console.log('[START-ADVENTURE] âœ… currentLevelConfig:', this.currentLevelConfig);

        // ========================================
        // ATUALIZA CLASSE DE MUNDO NO #APP
        // ========================================
        this.updateWorldClass();
        this.updateInfoHelpIcon();
        this.maybeShowInfoCard();

        // Esconder UI do modo clÃ¡ssico (FORÃ‡A ESCONDER)
        const statsPanel = document.getElementById('classic-stats');
        if (statsPanel) {
            statsPanel.classList.add('hidden');
            statsPanel.style.display = 'none'; // Garante que fique escondido
        }

        const missionsContainer = document.getElementById('classic-missions');
        if (missionsContainer) {
            missionsContainer.classList.add('hidden');
            missionsContainer.style.display = 'none'; // Garante que fique escondido
        }

        const classicScoreHero = document.getElementById('classic-score-hero');
        if (classicScoreHero) {
            classicScoreHero.classList.add('hidden');
            classicScoreHero.style.display = 'none';
        }

        // Mostrar Ã¡rea de objetivos do modo aventura
        const goalsArea = document.getElementById('goals-area');
        if (goalsArea) {
            goalsArea.style.display = '';
        }

        // Mostrar barra de power-ups no modo aventura
        const powerupsArea = document.getElementById('powerups-area');
        if (powerupsArea) {
            powerupsArea.style.display = '';
        }

        const controlsBar = document.getElementById('controls-bar');
        if (controlsBar) {
            controlsBar.style.display = '';
        }

        if (this.audio) {
            if (levelConfig.musicId) {
                this.audio.playMusic(levelConfig.musicId);
            } 
            else if (levelConfig.type === 'boss') {
                this.audio.playBossMusic();
            } 
            else {
                this.audio.stopMusic();
            }
        }

        // TENTATIVA DE RESTAURAR JOGO SALVO
        if (this.restoreGameState(levelConfig.id)) {
            // REMOVIDO: A mensagem visual "JOGO RESGATADO" nÃ£o aparece mais.
            // O jogo apenas continua silenciosamente.
            this.queueLayoutGeometryLog('adventure-restore');
            this.queueDockGeometryLog('adventure-restore');
            return;
        }

        // Se nÃ£o tinha save, inicia do zero normalmente
        if (levelConfig.type === 'boss') {
            const bossData = levelConfig.boss || { id: 'dragon', name: 'Dragao', emoji: '\u{1F409}', maxHp: 50 };
            this.setupBossUI(bossData);
            this.ensureBossHud(bossData);
            this.bossState = { active: true, maxHp: bossData.maxHp, currentHp: bossData.maxHp, attackRate: 3, movesWithoutDamage: 0 };
            this.currentGoals = {}; 
        } else {
            this.hideBossHud();
            this.bossState.active = false;
            const goals = (levelConfig.goals && Object.keys(levelConfig.goals).length > 0) 
                ? levelConfig.goals 
                : { bee: 10 }; 
            
            this.setupGoalsUI(goals);
        }
        this.resetGame();
        this.queueLayoutGeometryLog('adventure-start');
        this.queueDockGeometryLog('adventure-start');
    }

    setupBossUI(bossData) {
    if (!this.goalsArea) return;

    // Adicionamos o <span id="boss-hp-text"> dentro da barra
    this.goalsArea.innerHTML = `
        <div class="boss-ui-container">
            <div id="boss-target" class="boss-avatar">${bossData.emoji}</div>
            <div class="boss-stats">
                <div class="boss-name">${bossData.name}</div>
                <div class="hp-bar-bg">
                    <div class="hp-bar-fill" id="boss-hp-bar" style="width: 100%"></div>
                    <span id="boss-hp-text" class="hp-text">${bossData.maxHp}/${bossData.maxHp}</span>
                </div>
            </div>
        </div>`;

    // âœ… IMPORTANTE: invalida cache de elementos do boss UI
    this._bossUI = null;
	const bossAvatar = document.getElementById('boss-target');
	this.applyBossSprite(bossAvatar);
	this.updateIgnisBossUiOverride();
    if (DEBUG_BOSS_HUD) {
        console.log('[HUD] Boss UI created. Fight type:', this.currentLevelConfig?.type || 'none');
    }
  }

    ensureBossHud(bossData) {
    const host = document.getElementById('screen-game');
    if (!host) return;

    let hud = document.getElementById('boss-hp-hud');
    const needsBuild = !hud
        || !hud.querySelector('#boss-hp-avatar')
        || !hud.querySelector('#boss-hp-name')
        || !hud.querySelector('#boss-hp-bar-fill')
        || !hud.querySelector('#boss-hp-hud-text');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'boss-hp-hud';
    }
    if (needsBuild) {
        hud.innerHTML = `
            <div class="boss-hp-row">
                <div class="boss-avatar" id="boss-hp-avatar"></div>
                <div class="boss-hp-wrapper">
                    <div class="boss-hp-name" id="boss-hp-name"></div>
                    <div class="boss-hp-bar-bg">
                        <div class="boss-hp-bar-fill" id="boss-hp-bar-fill" style="width: 100%"></div>
                        <span class="hp-text" id="boss-hp-hud-text"></span>
                    </div>
                </div>
            </div>`;
        if (DEBUG_BOSS_HUD) {
            console.log('[HUD] Boss HUD built/rebuilt. Fight type:', this.currentLevelConfig?.type || 'none');
        }
        this._bossHudRefs = null;
    }
    if (!hud.parentNode) host.insertBefore(hud, host.firstChild);

    const data = bossData || this.currentLevelConfig?.boss;
    if (!data) return;

    const refs = this.getBossHudRefs();
    if (!refs) return;
    const avatar = refs.avatar;
    const name = refs.name;
    const bar = refs.bar;
    if (avatar) avatar.textContent = data.emoji || '\u{1F409}';
	this.applyBossSprite(avatar);
	this.updateIgnisBossUiOverride();
    if (name) name.textContent = data.name || 'Boss';
    if (bar) bar.style.width = '100%';
    this._bossHudLastPct = '100%';

    if (this.goalsArea) this.goalsArea.style.display = 'none';
    refs.hud.style.display = 'block';
}

	hideBossHud() {
    const refs = this.getBossHudRefs();
    if (refs?.hud) refs.hud.style.display = 'none';
    if (this.goalsArea) this.goalsArea.style.display = '';
    this._bossHudLastPct = null;
	this.teardownIgnisSpriteOverlay();
}

    getBossHudRefs() {
    if (this._bossHudRefs?.hud && this._bossHudRefs.hud.isConnected) {
        return this._bossHudRefs;
    }

    const hud = document.getElementById('boss-hp-hud');
    if (!hud) return null;

    const refs = {
        hud,
        bar: hud.querySelector('#boss-hp-bar-fill'),
        name: hud.querySelector('#boss-hp-name'),
        avatar: hud.querySelector('#boss-hp-avatar'),
        text: hud.querySelector('#boss-hp-hud-text')
    };

    if (!refs.bar) return null;
    this._bossHudRefs = refs;
    return refs;
}

    updateBossHud() {
    const refs = this.getBossHudRefs();
    if (!refs?.bar) return;
    const bar = refs.bar;
    const name = refs.name;
    const avatar = refs.avatar;
    const hud = refs.hud;

    const pct = (this.bossState.currentHp / this.bossState.maxHp) * 100;
    const pctStr = `${pct}%`;
    if (this._bossHudLastPct !== pctStr) {
        bar.style.width = pctStr;
        this._bossHudLastPct = pctStr;
    }
    if (hud) {
        hud.style.setProperty('--boss-hp-pct', pctStr);

        // Flash ao receber dano + chip damage com atraso
        const prev = (typeof this._lastBossHp === 'number') ? this._lastBossHp : this.bossState.maxHp;
        if (this.bossState.currentHp < prev) {
            this.restartCssAnimationClass(hud, 'damage-flash');
            if (this._bossFlashTimer) clearTimeout(this._bossFlashTimer);
            this._bossFlashTimer = setTimeout(() => {
                hud.classList.remove('damage-flash');
            }, 180);

            hud.style.setProperty('--boss-hp-pct-lag', pctStr);
            this._bossHpLagPct = pct;
        } else if (this._bossHpLagPct == null) {
            hud.style.setProperty('--boss-hp-pct-lag', pctStr);
        }
    }
    if (this._bossHpLagPct == null) this._bossHpLagPct = pct;
    this._lastBossHp = this.bossState.currentHp;

    const data = this.currentLevelConfig?.boss;
    if (data) {
        if (name) name.textContent = data.name || name.textContent;
        if (avatar) avatar.textContent = data.emoji || avatar.textContent;
    }

    const text = refs.text;
    if (text) {
        const current = Math.ceil(this.bossState.currentHp);
        const newText = `${current}/${this.bossState.maxHp}`;
        if (text.textContent !== newText) text.textContent = newText;
    }
}

	
	// --- LÃ“GICA DE UI DOS HERÃ“IS ---

    renderHeroUI() {
        // Remove container antigo se existir
        const oldContainer = document.getElementById('hero-powers-area');
        if (oldContainer) oldContainer.remove();

        // SÃ³ mostra no Modo Aventura
        if (this.currentMode !== 'adventure') return;

        // Cria o container
        const container = document.createElement('div');
        container.id = 'hero-powers-area';
        container.className = 'hero-powers-container';
        
        // THALION (Elfo) - Requer Combo x2
        const thalionBtn = document.createElement('div');
        thalionBtn.id = 'btn-hero-thalion';
        thalionBtn.innerHTML = `\u{1F9DD}\u{200D}\u{2642}\u{FE0F}<div class="hero-badge">Combo x2</div>`;
        thalionBtn.onclick = () => this.activateHeroPower('thalion');

        // NYX (Lobo) - Requer Combo x3
        const nyxBtn = document.createElement('div');
        nyxBtn.id = 'btn-hero-nyx';
        nyxBtn.innerHTML = `\u{1F43A}<div class="hero-badge">Combo x3</div>`;
        nyxBtn.onclick = () => this.activateHeroPower('nyx');

        container.appendChild(thalionBtn);
        container.appendChild(nyxBtn);

        // Insere ANTES da Ã¡rea de dock (peÃ§as)
        // Se preferir ao lado dos powerups, troque o insertBefore
        const dock = document.getElementById('dock');
        if (dock && dock.parentNode) {
            dock.parentNode.insertBefore(container, dock);
        }
        
        // Atualiza o estado visual inicial
        this.updateHeroButtonsUI();
    }

    activateHeroPower(hero) {
        const state = this.heroState[hero];
        if (state.used || !state.unlocked) {
            if(this.audio) this.audio.vibrate(50);
            return;
        }
        if (this.interactionMode === `hero_${hero}`) {
            this.interactionMode = null;
            this.updateControlsVisuals();
            return;
        }
        
        this.interactionMode = `hero_${hero}`;
        if(this.audio) this.audio.playClick();
        this.updateControlsVisuals();
        
        // --- ATUALIZADO: Textos corretos dos poderes (com traduÃ§Ã£o) ---
        let msg = this.i18n.t('game.aim_single'); // "MIRAR: ALVO ÃšNICO"
        if (hero === 'thalion') msg = this.i18n.t('game.aim_thalion'); // "MIRAR: 3 BLOCOS"
        if (hero === 'nyx') msg = this.i18n.t('game.aim_nyx'); // "MIRAR: COLUNA INTEIRA"
        if (hero === 'player') msg = this.i18n.t('game.aim_player'); // "MIRAR: CORTE EM X"
		if (hero === 'mage') msg = this.i18n.t('game.aim_mage'); // <--- NOVO
        
        this.effects.showFloatingTextCentered(msg, "feedback-gold");
    }

    updateHeroButtonsUI() {
        ['thalion', 'nyx'].forEach(hero => {
            const btn = document.getElementById(`btn-hero-${hero}`);
            if (!btn) return;
            
            // Reseta classes
            btn.className = 'hero-btn';
            
            const state = this.heroState[hero];
            
            if (state.used) {
                btn.classList.add('used');
            } else if (state.unlocked) {
                btn.classList.add('ready');
            } else {
                btn.classList.add('locked');
            }
            
            // Estado de mira ativa
            if (this.interactionMode === `hero_${hero}`) {
                btn.classList.add('active-aim');
            }
        });
    }

    clearTheme() { document.body.className = ''; }

    retryGame() {
    this.modalOver.classList.add('hidden');
    this.modalWin.classList.add('hidden');
    this._resultResolved = false;

    if (this.audio) this.audio.stopMusic();

    // âœ… cancela qualquer save pendente do ciclo anterior
    this.cancelPendingSaveGameState();

    // âœ… reabilita save no restart
    this._saveDisabled = false;

    // âœ… invalida cache de vazios (novo jogo / novo grid)
    this._emptyCells = null;
    this._emptyCellsDirty = true;

    if (this.currentMode === 'adventure' && this.currentLevelConfig) {
        // Pode ser 0 tambÃ©m, mas 10ms estÃ¡ ok
        setTimeout(() => {
            this.startAdventureLevel(this.currentLevelConfig);
        }, 10);
    } else if (this.currentMode === 'classic') {
        // Reinicia o modo clÃ¡ssico do zero
        this.startClassicMode();
    } else {
        this.resetGame();
    }
}



    resetGame() {
    this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(null));
    this.score = 0;
    this.interactionMode = null;
    this.comboState = { count: 0, lastClearTime: 0 };
    this._pendingSyncedBossImpacts = 0;
    this._postImpactMoveCheckNeeded = false;
    this._postImpactBossTurnEndNeeded = false;
    this._resultResolved = false;

    this.heroState = {
        thalion: { unlocked: false, used: false },
        nyx: { unlocked: false, used: false },
        player:  { unlocked: false, used: false, lineCounter: 0 },
        mage: { unlocked: false, used: false, lineCounter: 0 }
    };

    this.bossState.active = (this.currentLevelConfig?.type === 'boss');

    // Achievement tracking: reset power usage flag
    this.powerUsedThisLevel = false;

    this.loadPowerUps(); // Carrega o magnet aqui
    
    this.renderControlsUI(); 

    if(!this.bossState.active) {
        const goals = (this.currentMode === 'casual') ? { bee: 10, ghost: 10, cop: 10 } : this.currentGoals;
        this.setupGoalsUI(goals); 
    } else {
        if (!document.getElementById('boss-hp-bar')) {
            const bossData = this.currentLevelConfig?.boss || { id: 'dragon', name: 'Dragao', emoji: '\u{1F409}', maxHp: 50 };
            this.setupBossUI(bossData);
        }
        this.ensureBossHud(this.currentLevelConfig?.boss);
        this.bossState.currentHp = this.bossState.maxHp;
        this.updateBossUI();
    }

    if (this.currentMode === 'adventure' && this.currentLevelConfig?.gridConfig) {
        this.currentLevelConfig.gridConfig.forEach(cfg => {
            if(this.grid[cfg.r]) {
                this.grid[cfg.r][cfg.c] = { 
                    type: cfg.type, 
                    key: cfg.key, 
                    emoji: cfg.emoji 
                }; 
            }
        });
    }

    // âœ… Grid foi recriado/alterado: invalida cache de vazios
    this._emptyCells = null;
    this._emptyCellsDirty = true;

    this.renderGrid();
    this.spawnNewHand();
}


    // --- EFEITO VISUAL: PartÃ­culas ---
    spawnExplosion(rect, colorClass) {
        // Delega a explosÃ£o para o sistema de efeitos (que usa Object Pooling)
        if (this.effects) {
            this.effects.spawnExplosion(rect, colorClass);
        }
    }
	
	ensureFlyerPool() {
  if (this._flyerPool) return;

  this._flyerPool = [];
  this._flyerPoolBusy = new Set();
  this._flyerAnimCancel = new Map();

  const POOL_SIZE = 16; // suficiente pra spam (ajuste 12~24)

  for (let i = 0; i < POOL_SIZE; i++) {
    const flyer = document.createElement('div');
    flyer.className = 'flying-item';
    flyer.style.position = 'fixed';
    flyer.style.left = '0px';
    flyer.style.top = '0px';
    flyer.style.zIndex = '9999';
    flyer.style.pointerEvents = 'none';
    flyer.style.opacity = '0';

    // NÃ£o append agora: deixamos â€œforaâ€ atÃ© precisar
    this._flyerPool.push(flyer);
  }
}

getFlySpritePathByKey(key) {
  return this.getItemSpritePathByKey(key);
}

getItemSpritePathByKey(key) {
  const normalized = String(key || '').toLowerCase();
  return ITEM_SPRITE_PATHS[normalized] || '';
}

_acquireFlyer(emoji, key = '') {
  this.ensureFlyerPool();
  const spritePath = this.getFlySpritePathByKey(key);

  // pega um que nÃ£o estÃ¡ ocupado
  for (const flyer of this._flyerPool) {
    if (!this._flyerPoolBusy.has(flyer)) {
      this._flyerPoolBusy.add(flyer);
      if (spritePath) {
        flyer.innerText = '';
        flyer.style.width = '40px';
        flyer.style.height = '40px';
        flyer.style.backgroundImage = `url('${spritePath}')`;
        flyer.style.backgroundRepeat = 'no-repeat';
        flyer.style.backgroundPosition = 'center';
        flyer.style.backgroundSize = 'contain';
        flyer.style.fontSize = '0';
        flyer.style.textShadow = 'none';
      } else {
        flyer.innerText = emoji;
        flyer.style.width = '';
        flyer.style.height = '';
        flyer.style.backgroundImage = 'none';
        flyer.style.backgroundRepeat = '';
        flyer.style.backgroundPosition = '';
        flyer.style.backgroundSize = '';
        flyer.style.fontSize = '';
        flyer.style.textShadow = '';
      }
      return flyer;
    }
  }

  // Sem disponÃ­vel: cria um extra (fallback), mas isso Ã© raro
  const extra = document.createElement('div');
  extra.className = 'flying-item';
  extra.style.position = 'fixed';
  extra.style.left = '0px';
  extra.style.top = '0px';
  extra.style.zIndex = '9999';
  extra.style.pointerEvents = 'none';
  extra.style.opacity = '0';
  if (spritePath) {
    extra.innerText = '';
    extra.style.width = '40px';
    extra.style.height = '40px';
    extra.style.backgroundImage = `url('${spritePath}')`;
    extra.style.backgroundRepeat = 'no-repeat';
    extra.style.backgroundPosition = 'center';
    extra.style.backgroundSize = 'contain';
    extra.style.fontSize = '0';
    extra.style.textShadow = 'none';
  } else {
    extra.innerText = emoji;
  }

  this._flyerPool.push(extra);
  this._flyerPoolBusy.add(extra);
  return extra;
}

_releaseFlyer(flyer) {
  // cancela animaÃ§Ã£o se ainda existir
  const anim = this._flyerAnimCancel.get(flyer);
  if (anim && anim.cancel) anim.cancel();
  this._flyerAnimCancel.delete(flyer);

  flyer.style.opacity = '0';
  flyer.style.transform = 'translate3d(0px,0px,0) scale(1)';
  if (flyer.parentNode) flyer.parentNode.removeChild(flyer);

  this._flyerPoolBusy.delete(flyer);
}


      // --- EFEITO VISUAL: Voo ---
    runFlyAnimation(r, c, key, emoji, onImpact = null) {
      const idx = r * 8 + c;
      const cells = this._boardCells || this.boardEl.children;
      const cell = cells[idx];
      if (!cell) {
          if (typeof onImpact === 'function') onImpact();
          return;
      }

    const startRect = cell.getBoundingClientRect();

      let targetEl = null;
      let isBossBarTarget = false;
      if (this.bossState.active) {
          if (this.shouldSyncBossDamageOnFlyImpact()) {
              targetEl =
                  document.querySelector('#boss-hp-hud .boss-hp-bar-bg') ||
                  document.querySelector('#boss-hp-hud .hp-bar-bg') ||
                  document.querySelector('.boss-hp-bar-bg') ||
                  document.querySelector('.hp-bar-bg') ||
                  document.getElementById('boss-hp-bar-fill') ||
                  document.getElementById('boss-hp-bar') ||
                  document.getElementById('boss-hp-hud') ||
                  document.getElementById('boss-hp-avatar') ||
                  document.getElementById('boss-target');
              isBossBarTarget = !!targetEl && (
                  targetEl.classList.contains('boss-hp-bar-bg') ||
                  targetEl.classList.contains('hp-bar-bg') ||
                  targetEl.id === 'boss-hp-bar-fill' ||
                  targetEl.id === 'boss-hp-bar'
              );
          } else {
              targetEl = document.getElementById('boss-hp-avatar') || document.getElementById('boss-target');
          }
      } else {
          targetEl = document.getElementById(`goal-item-${key}`);
      }
    if (!targetEl) {
        if (typeof onImpact === 'function') onImpact();
        return;
    }

    const targetRect = targetEl.getBoundingClientRect();

    const flyer = this._acquireFlyer(emoji, key);
    flyer.classList.add('flying-item');
    flyer.style.position = 'fixed';
    flyer.style.zIndex = '9999';
    flyer.style.pointerEvents = 'none';
    flyer.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)';
    flyer.style.transformOrigin = 'center';
    flyer.style.opacity = '1';

    // PosiÃ§Ã£o inicial (mesma ideia do seu left/top original)
    const startX = startRect.left + startRect.width / 4;
    const startY = startRect.top + startRect.height / 4;

    // Destino (mesmo cÃ¡lculo)
    const bossImpactOffsetX = (this.bossState?.active && !isBossBarTarget) ? 63 : 0;
    const bossImpactOffsetY = this.bossState?.active ? 0 : 0;
    const destX = targetRect.left + targetRect.width / 2 - 20 + bossImpactOffsetX;
    const destY = targetRect.top + targetRect.height / 2 - 20 + bossImpactOffsetY;

    // Em fixed + transform: definimos a Ã¢ncora em (0,0) e movemos via translate
    flyer.style.left = '0px';
    flyer.style.top = '0px';

    // Estado inicial: translate + scale grande
    flyer.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(1.5)`;

    if (!flyer.parentNode) {
        document.body.appendChild(flyer);
    }

    // Sem reflow forÃ§ado: usa dois frames para garantir commit do estilo inicial
    let raf1 = 0;
    let raf2 = 0;
    let timer = 0;
    let released = false;

    const finish = () => {
        if (released) return;
        released = true;
        this._releaseFlyer(flyer);
        if (typeof onImpact === 'function') {
            try { onImpact(); } catch (e) { console.warn('Impact callback error', e); }
        }
        const impactEl = this.getBossImpactTarget(targetEl);
        this.triggerPop(impactEl);
    };

    const cancel = () => {
        if (raf1) cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
        if (timer) clearTimeout(timer);
        finish();
    };

    this._flyerAnimCancel.set(flyer, { cancel });

    raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
            flyer.style.transform = `translate3d(${destX}px, ${destY}px, 0) scale(0.8)`;
        });
    });

    // Remove ao fim
      timer = setTimeout(() => {
        this._flyerAnimCancel.delete(flyer);
        finish();
      }, 1200);
  }

    shouldSyncBossDamageOnFlyImpact() {
    if (this.currentMode !== 'adventure' || !this.bossState?.active) return false;
    return !!this.getFireBossOverlayConfig();
  }

    hasPendingBossResolution() {
    return !!(
        (this._pendingSyncedBossImpacts || 0) > 0 ||
        (this._pendingBossDamage || 0) > 0 ||
        this._bossDamageRaf ||
        this._bossWinScheduled
    );
  }

    flushDeferredBossPostChecks() {
    if (this._resultResolved) return;
    if (!this.bossState?.active) {
        this._postImpactMoveCheckNeeded = false;
        this._postImpactBossTurnEndNeeded = false;
        return;
    }
    if (this.hasPendingBossResolution()) return;
    if (this.bossState.currentHp <= 0) return;

    if (this._postImpactBossTurnEndNeeded) {
        this._postImpactBossTurnEndNeeded = false;
        const bossId = this.currentLevelConfig?.boss?.id;
        if (typeof BOSS_LOGIC !== 'undefined' && BOSS_LOGIC && BOSS_LOGIC[bossId] && BOSS_LOGIC[bossId].onTurnEnd) {
            BOSS_LOGIC[bossId].onTurnEnd(this);
        }
    }

    if (this._resultResolved) return;
    if (this._postImpactMoveCheckNeeded) {
        this._postImpactMoveCheckNeeded = false;
        if (!this.checkMovesAvailable()) this.gameOver();
    }
  }

    beginSyncedBossImpact() {
    this._pendingSyncedBossImpacts = (this._pendingSyncedBossImpacts || 0) + 1;
  }

    completeSyncedBossImpact() {
    this._pendingSyncedBossImpacts = Math.max(0, (this._pendingSyncedBossImpacts || 0) - 1);
    this.flushDeferredBossPostChecks();
  }

    getBossImpactTarget(targetEl) {
    if (this.bossState?.active && this.getFireBossOverlayConfig() && this._ignisOverlayImgEl) {
        return this._ignisOverlayImgEl;
    }
    return targetEl;
  }

    triggerPop(el) {
    if (!el) return;
    if (!this._popTimers) this._popTimers = new WeakMap();

    const prevTimer = this._popTimers.get(el);
    if (prevTimer) clearTimeout(prevTimer);

    this.restartCssAnimationClass(el, 'hit-pop');

    const timer = setTimeout(() => {
        el.classList.remove('hit-pop');
        this._popTimers.delete(el);
    }, 220);
    this._popTimers.set(el, timer);
  }

	
	ensureBoardClickDelegation() {
  if (this._boardClickDelegationInstalled) return;
  this._boardClickDelegationInstalled = true;

  this.boardEl.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell || !this.boardEl.contains(cell)) return;

    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    if (Number.isNaN(r) || Number.isNaN(c)) return;

    this.handleBoardClick(r, c);
  });
}

ensureBoardCells() {
  if (this._boardCells && this._boardCells.length === this.gridSize * this.gridSize) return;

  this.ensureBoardClickDelegation();

  this.boardEl.innerHTML = '';
  this._boardCells = new Array(this.gridSize * this.gridSize);

  const frag = document.createDocumentFragment();
  for (let r = 0; r < this.gridSize; r++) {
    for (let c = 0; c < this.gridSize; c++) {
      const div = document.createElement('div');
      div.className = 'cell';
      div.dataset.r = r;
      div.dataset.c = c;
      this._boardCells[r * this.gridSize + c] = div;
      frag.appendChild(div);
    }
  }
  this.boardEl.appendChild(frag);
}

renderCell(div, cellData) {
  const prevKey = div._rk;

  // VAZIO: sempre garantir que visual estÃ¡ limpo
  if (!cellData) {
    // Se jÃ¡ estÃ¡ realmente limpo e cache confirma, nÃ£o faz nada
    // (evita trabalho repetido)
    if (prevKey === 'E' && div.className === 'cell' && div.textContent === '') return;

    // ForÃ§a reset visual (corrige desync quando outro trecho mexeu no DOM)
    div.className = 'cell';
    if (div.textContent) div.textContent = '';
    div._rk = 'E';
    return;
  }

  // LAVA: caminho rÃ¡pido
  if (cellData.type === 'LAVA') {
    const key = 'L';
    if (prevKey !== key || div.className !== 'cell lava' || div.textContent !== '\u{1F30B}') {
      div.className = 'cell lava';
      div.textContent = '\u{1F30B}';
      div._rk = key;
    }
    return;
  }

  const type = cellData.type || '';
  const keyLower = cellData.key ? String(cellData.key).toLowerCase() : '';
  const hasKey = !!keyLower;

  let emoji = '';
  if (type === 'ITEM' || type === 'OBSTACLE') {
    emoji = this.getItemGlyph(cellData);
  }

  const useClassicColor =
    this.currentMode === 'classic' &&
    this.classicState.visualV1 &&
    cellData.colorId;

  const colorId = useClassicColor ? cellData.colorId : 0;

  const nextKey = `F|${type}|${keyLower}|${emoji}|${colorId}`;

  // Se estado visual igual, nÃ£o mexe
  if (prevKey === nextKey) return;

  // Reset controlado e redesenha
  div.className = 'cell filled';

  if (hasKey) {
    div.classList.add('type-' + keyLower);
  } else {
    this.applyColorClass(div, cellData);
  }

  if (colorId) {
    div.classList.add(`classic-color-${colorId}`);
  }

  if (emoji) div.textContent = emoji;
  else if (div.textContent) div.textContent = '';

  div._rk = nextKey;
}




   renderGrid() {
  const perfStart = this.perfStart('renderGrid');
  // Coalescing leve: se jÃ¡ renderizou neste frame, agenda 1 atualizaÃ§Ã£o futura
  if (this._renderGridLocked) {
    this._renderGridPending = true;
    this.perfEnd('renderGrid', perfStart);
    return;
  }

  this._renderGridLocked = true;
  if (!this._renderGridUnlockScheduled) {
    this._renderGridUnlockScheduled = true;
    requestAnimationFrame(() => {
      this._renderGridLocked = false;
      this._renderGridUnlockScheduled = false;
      if (this._renderGridPending) {
        this._renderGridPending = false;
        this.renderGrid();
      }
    });
  }

  this.ensureBoardCells();

  const size = this.gridSize;
  const cells = this._boardCells; // jÃ¡ existe no seu cÃ³digo
  const grid = this.grid;

  for (let r = 0; r < size; r++) {
    const row = grid[r];
    const base = r * size;
    for (let c = 0; c < size; c++) {
      this.renderCell(cells[base + c], row[c]);
    }
  }

  // Antes vocÃª marcava em toda cÃ©lula; isso Ã© custo inÃºtil
  this._emptyCellsDirty = true;
  this.perfEnd('renderGrid', perfStart);
}



    applyColorClass(element, cellData) {
        // Remove apenas a classe de tipo anterior (evita regex em className)
        if (element._typeClass) {
            element.classList.remove(element._typeClass);
        }

        if (!element.classList.contains('filled')) {
            element.classList.add('filled');
        }

        let typeClass = 'type-normal';
        if (cellData?.type === 'ITEM' && cellData.key) {
            typeClass = 'type-' + String(cellData.key).toLowerCase();
        }

        element.classList.add(typeClass);
        element._typeClass = typeClass;
    }

    getItemGlyph(cellData) {
        if (!cellData || !cellData.key) return '';
        const keyLower = String(cellData.key).toLowerCase();
        if (keyLower.startsWith('letter_')) {
            return keyLower.replace('letter_', '').toUpperCase();
        }
        // Itens/obstaculos que usam sprite dedicado no CSS.
        if (this.getItemSpritePathByKey(keyLower)) {
            return '';
        }
        return cellData.emoji || EMOJI_MAP[keyLower] || EMOJI_MAP[cellData.key] || '?';
    }

    spawnNewHand() {
    if (!this.dockEl) return;

    const config = this.currentLevelConfig;
    const customItems = (this.currentMode === 'adventure' && config)
        ? config.items
        : (this.currentMode === 'blitz' ? BLITZ_LETTER_KEYS : null);

    const isBoss = !!(config && config.type === 'boss');
    const useRPGStats = isBoss;
    const isClassic = this.currentMode === 'classic';

    let forceEasy = false;

    // 1) CONTAGEM DE ESPAÃ‡OS VAZIOS (Smart RNG) â€” otimizada (early exit)
    // Precisamos sÃ³ saber:
    // - se emptyCount < 15 (emergency)
    // - e, se bÃ´nus: se emptyCount > 30 (forceEasy)
    const N = this.gridSize;
    let emptyCount = 0;

    const stopAt = 15; // se chegar em 15 jÃ¡ sabemos que NÃƒO Ã© emergÃªncia

    outer:
    for (let r = 0; r < N; r++) {
        const row = this.grid[r];
        for (let c = 0; c < N; c++) {
            if (!row[c]) {
                emptyCount++;
                if (emptyCount >= stopAt) break outer;
            }
        }
    }

    const isEmergency = emptyCount < 15;

    // Anti-frustraÃ§Ã£o baseado em encaixe real (nÃ£o em quantidade de vazios)
    const blockSquare3x3 = isClassic && !this.canPlaceSquare3x3Anywhere();
    const pieceOptions = blockSquare3x3 ? { excludeShapes: ['square-3x3'] } : undefined;

    // Regra original: no bÃ´nus, se emptyCount > 30, forÃ§a peÃ§a fÃ¡cil
    // Como usamos early-exit em 31, isso continua equivalente.
    // 2) GeraÃ§Ã£o da mÃ£o (sem alocar arrays desnecessariamente)
    if (!this.currentHand) this.currentHand = [];
    this.currentHand.length = 0;
    const classicNamesInHand = isClassic ? new Set() : null;

    for (let i = 0; i < 3; i++) {
        const forceSimple = ((isEmergency && i === 0) || (forceEasy && i === 0));
        let piece = null;

        // No modo clÃ¡ssico, evita peÃ§as com o mesmo "name" na mesma rodada
        const maxAttempts = isClassic ? 6 : 1;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let optionsForRoll = pieceOptions;

            if (isClassic) {
                const exclude = [];
                if (pieceOptions?.excludeShapes) exclude.push(...pieceOptions.excludeShapes);
                if (classicNamesInHand.size > 0) exclude.push(...classicNamesInHand);
                optionsForRoll = exclude.length > 0 ? { excludeShapes: exclude } : undefined;
            }

            if (this.currentMode === 'blitz') {
                optionsForRoll = { ...(optionsForRoll || {}), itemChance: BLITZ_ITEM_CHANCE };
            }

            piece = getRandomPiece(customItems, useRPGStats, forceSimple, optionsForRoll);

            if (!isClassic || !classicNamesInHand.has(piece.name)) {
                break;
            }
        }

        // SeguranÃ§a extra: se vier 3x3 e ele nÃ£o encaixa em lugar nenhum, refaz
        if (isClassic && piece.name === 'square-3x3' && !this.canPlacePieceAnywhere(piece)) {
            piece = getRandomPiece(customItems, useRPGStats, true, { excludeShapes: ['square-3x3'] });
        }

        if (isClassic && piece?.name) {
            classicNamesInHand.add(piece.name);
        }
        this.currentHand.push(piece);
    }


    this.renderDock();

    // 4) Save (agora jÃ¡ estÃ¡ â€œdeboouncedâ€ pela versÃ£o otimizada)
    this.saveGameState();

    // 5) Check de game over sem travar frame
    // MantÃ©m a ideia do delay (antes era 100ms), mas tenta rodar em idle.
    const doCheck = () => {
        if (this._resultResolved) return;

        const shouldDeferMoveCheck =
            this.currentMode === 'adventure' &&
            this.bossState?.active &&
            this.hasPendingBossResolution();

        if (shouldDeferMoveCheck) {
            this._postImpactMoveCheckNeeded = true;
            return;
        }

        if (!this.checkMovesAvailable()) this.gameOver();
    };

    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(doCheck, { timeout: 150 });
    } else {
        // Fallback compatÃ­vel com o comportamento antigo
        setTimeout(doCheck, 100);
    }
}

    attachDockFallbackDragEvents() {
    if (!this.dockEl || this.dockEl._dockFallbackDragAttached) return;
    this.dockEl._dockFallbackDragAttached = true;

    const HAS_POINTER = typeof window.PointerEvent !== 'undefined';
    const getPoint = (evt) => {
        const t = evt.touches ? evt.touches[0] : evt;
        return { x: t.clientX, y: t.clientY };
    };

    const onDockStart = (e) => {
        if (!this._dockSlots || this._dockSlots.length === 0) return;
        const target = e.target;
        let chosenSlot = null;
        if (target && typeof target.closest === 'function') {
            chosenSlot = target.closest('.dock-slot');
        }

        if (!chosenSlot) {
            const p = getPoint(e);
            const HIT_MARGIN = 12;

            for (let i = 0; i < this._dockSlots.length; i++) {
                const slot = this._dockSlots[i];
                const r = slot.getBoundingClientRect();
                if (
                    p.x >= (r.left - HIT_MARGIN) &&
                    p.x <= (r.right + HIT_MARGIN) &&
                    p.y >= (r.top - HIT_MARGIN) &&
                    p.y <= (r.bottom + HIT_MARGIN)
                ) {
                    chosenSlot = slot;
                    break;
                }
            }
        }
        if (!chosenSlot) return;

        const pieceEl = chosenSlot.querySelector('.draggable-piece');
        if (!pieceEl || typeof pieceEl._dragStartFromExternal !== 'function') return;
        pieceEl._dragStartFromExternal(e);
    };

    if (HAS_POINTER) {
        this.dockEl.addEventListener('pointerdown', onDockStart, { passive: false });
    } else {
        this.dockEl.addEventListener('mousedown', onDockStart, { passive: false });
        this.dockEl.addEventListener('touchstart', onDockStart, { passive: false });
    }

    // Fallback global para fases elite/boss no aventura:
    // mesmo se alguma camada estiver sobre o dock, o toque dentro da Ã¡rea do dock inicia o drag.
    if (this._globalDockFallbackAttached) return;
    this._globalDockFallbackAttached = true;

    const onGlobalStart = (e) => {
        if (!this.dockEl || !this._dockSlots || this._dockSlots.length === 0) return;
        if (this.currentMode !== 'adventure') return;
        if (!this.currentLevelConfig || this.currentLevelConfig.type !== 'boss') return;
        if (!this.screenGame || !this.screenGame.classList.contains('active-screen')) return;

        const p = getPoint(e);
        const dockRect = this.dockEl.getBoundingClientRect();
        const MARGIN = 10;

        const insideDock =
            p.x >= (dockRect.left - MARGIN) &&
            p.x <= (dockRect.right + MARGIN) &&
            p.y >= (dockRect.top - MARGIN) &&
            p.y <= (dockRect.bottom + MARGIN);

        if (!insideDock) return;

        let chosenSlot = null;
        for (let i = 0; i < this._dockSlots.length; i++) {
            const slot = this._dockSlots[i];
            const r = slot.getBoundingClientRect();
            if (
                p.x >= (r.left - MARGIN) &&
                p.x <= (r.right + MARGIN) &&
                p.y >= (r.top - MARGIN) &&
                p.y <= (r.bottom + MARGIN)
            ) {
                chosenSlot = slot;
                break;
            }
        }
        if (!chosenSlot) return;

        const pieceEl = chosenSlot.querySelector('.draggable-piece');
        if (!pieceEl || typeof pieceEl._dragStartFromExternal !== 'function') return;
        pieceEl._dragStartFromExternal(e);
    };

    if (HAS_POINTER) {
        window.addEventListener('pointerdown', onGlobalStart, { passive: false, capture: true });
    } else {
        window.addEventListener('mousedown', onGlobalStart, { passive: false, capture: true });
        window.addEventListener('touchstart', onGlobalStart, { passive: false, capture: true });
    }
}

    attachDockSlotDragEvents(slot) {
    if (!slot || slot._dragZoneAttached) return;
    slot._dragZoneAttached = true;

    const HAS_POINTER = typeof window.PointerEvent !== 'undefined';
    const onSlotStart = (e) => {
        const pieceEl = slot.querySelector('.draggable-piece');
        if (!pieceEl || typeof pieceEl._dragStartFromExternal !== 'function') return;
        pieceEl._dragStartFromExternal(e);
    };

    if (HAS_POINTER) {
        slot.addEventListener('pointerdown', onSlotStart, { passive: false });
    } else {
        slot.addEventListener('mousedown', onSlotStart, { passive: false });
        slot.addEventListener('touchstart', onSlotStart, { passive: false });
    }
}

    canPlacePieceAnywhere(piece) {
        if (!piece || !piece.layout) return false;

        const rows = piece.layout.length;
        const cols = piece.layout[0]?.length || 0;
        if (!rows || !cols) return false;

        const maxR = this.gridSize - rows;
        const maxC = this.gridSize - cols;
        if (maxR < 0 || maxC < 0) return false;

        for (let r = 0; r <= maxR; r++) {
            for (let c = 0; c <= maxC; c++) {
                if (this.canPlace(r, c, piece)) return true;
            }
        }

        return false;
    }

    canPlaceSquare3x3Anywhere() {
        if (!this._classicSquare3x3TestPiece) {
            const layout3x3 = [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]
            ];

            this._classicSquare3x3TestPiece = {
                name: 'square-3x3',
                layout: layout3x3,
                matrix: layout3x3
            };
        }

        return this.canPlacePieceAnywhere(this._classicSquare3x3TestPiece);
    }


    createDraggablePiece(piece, index, parentContainer) {
    // Reuso do container se existir
    let container = parentContainer.querySelector('.draggable-piece');

    const rows = piece.matrix.length;
    const cols = piece.matrix[0].length;

    if (!container) {
        container = document.createElement('div');
        container.className = 'draggable-piece';
        parentContainer.appendChild(container);

        // Click delegation local: um handler sÃ³ por container (nÃ£o por bloco)
        container.addEventListener('click', () => {
            this.handlePieceClick(Number(container.dataset.index));
        });

        // Drag listeners (guardados por _dragAttached)
        this.attachDragEvents(container, piece);
    }

    // Atualiza Ã­ndice (importante quando reusa)
    container.dataset.index = index;

    // Guarda referÃªncia da peÃ§a atual (Ãºtil para debug e futuras otimizaÃ§Ãµes)
    container._pieceRef = piece;

    // Atualiza grid template (sÃ³ estilo)
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // --- Pool de blocks dentro do container ---
    const needed = rows * cols;

    // Se o nÃºmero de filhos nÃ£o bate, reconstrÃ³i sÃ³ os blocos (nÃ£o o container)
    if (container.children.length !== needed) {
        container.innerHTML = '';
        const frag = document.createDocumentFragment();
        for (let i = 0; i < needed; i++) {
            frag.appendChild(document.createElement('div'));
        }
        container.appendChild(frag);
    }

    // Preenche os blocos sem recriar DOM
    let k = 0;
    for (let i = 0; i < piece.layout.length; i++) {
        const row = piece.layout[i];
        for (let j = 0; j < row.length; j++) {
            const cellData = row[j];
            const block = container.children[k++];

            // Reset barato do bloco
            block.className = '';
            block.innerText = '';
            block.style.visibility = '';

            if (cellData) {
                block.classList.add('block-unit');
                this.applyColorClass(block, cellData);

                // Visual V1: Usa o colorId da PEÃ‡A (todos os blocos mesma cor)
                if (this.currentMode === 'classic' && this.classicState.visualV1 && piece.colorId) {
                    block.classList.add(`classic-color-${piece.colorId}`);
                    block.classList.add('classic-piece-glow');
                }

                // Emoji para ITEM no deck
                if (typeof cellData === 'object' && cellData.type === 'ITEM') {
                    const emoji = this.getItemGlyph(cellData);
                    block.innerText = emoji;
                }
            } else {
                block.style.visibility = 'hidden';
            }
        }
    }

    // Garantia: se layout for menor que rows*cols por algum motivo
    // (normalmente nÃ£o acontece), escondemos o resto
    while (k < container.children.length) {
        const block = container.children[k++];
        block.className = '';
        block.innerText = '';
        block.style.visibility = 'hidden';
    }
}


    getBoardMetrics(padding = 0) {
        if (!this.boardEl) return { rect: null, cellSize: 0 };

        if (!this._boardMetrics || this._boardMetricsDirty) {
            const rect = this.boardEl.getBoundingClientRect();
            let cellSize = 0;

            const firstCell = this.boardEl.querySelector('.cell');
            if (firstCell) {
                const cellRect = firstCell.getBoundingClientRect();
                cellSize = cellRect.width || ((rect.width - (padding * 2)) / this.gridSize);
            } else {
                cellSize = (rect.width - (padding * 2)) / this.gridSize;
            }

            this._boardMetrics = { rect, cellSize };
            this._boardMetricsDirty = false;
        }

        return this._boardMetrics;
    }


    attachDragEvents(el, piece) {
    if (el._dragAttached) return;
    el._dragAttached = true;

    let isDragging = false;
    let clone = null;
    let activePointerId = null;

    let cellPixelSize = 0;
    let boardRect = null;

    let halfW = 0;
    let halfH = 0;
    let activePiece = null;

    let rafId = 0;
    let lastClientX = 0;
    let lastClientY = 0;
    let hasMovedSinceStart = false;

    const GAP = 4;
    const PADDING = 8;
    const VISUAL_OFFSET_Y = DRAG_VISUAL_OFFSET_Y;
    const MOVE_EPS = 0.5;
    const HAS_POINTER = typeof window.PointerEvent !== 'undefined';

    const getPoint = (evt) => {
        const t = evt.touches ? evt.touches[0] : evt;
        return { x: t.clientX, y: t.clientY };
    };
    const getChangedPoint = (evt) => {
        const t = evt.changedTouches ? evt.changedTouches[0] : evt;
        return { x: t.clientX, y: t.clientY };
    };

    const cleanupGlobalListeners = () => {
        if (HAS_POINTER) {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onEnd);
            window.removeEventListener('pointercancel', onEnd);
        } else {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('touchcancel', onEnd);
        }
        window.removeEventListener('blur', onEnd);
    };

    const ensureGlobalListeners = () => {
        if (HAS_POINTER) {
            window.addEventListener('pointermove', onMove, { passive: false });
            window.addEventListener('pointerup', onEnd, { passive: true });
            window.addEventListener('pointercancel', onEnd, { passive: true });
        } else {
            window.addEventListener('mousemove', onMove, { passive: false });
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('mouseup', onEnd, { passive: true });
            window.addEventListener('touchend', onEnd, { passive: true });
            window.addEventListener('touchcancel', onEnd, { passive: true });
        }
        window.addEventListener('blur', onEnd, { passive: true });
    };

    const moveCloneToPointer = () => {
        // Top-left do clone baseado no ponteiro
        const x = (lastClientX - halfW);
        const y = (lastClientY - halfH - VISUAL_OFFSET_Y);

        // âœ… NÃƒO sobrescreve transform (preserva scale/rotate do CSS)
        // translate = propriedade individual de transform
        clone.style.translate = `${x}px ${y}px`;
    };

    const scheduleMove = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            rafId = 0;
            if (!isDragging || !clone) return;

            moveCloneToPointer();

            // Fonte do ghost (para updateGhostPreview otimizado)
            this._lastPointerX = lastClientX;
            this._lastPointerY = lastClientY - VISUAL_OFFSET_Y;

            this.updateGhostPreview(clone, boardRect, cellPixelSize, activePiece);
        });
    };

    const onStart = (e) => {
        if (HAS_POINTER && e.type !== 'pointerdown') return;
        if (this.interactionMode === 'rotate') return;
        if (isDragging) return;
        if (e.cancelable) e.preventDefault();

        activePiece = el._pieceRef || piece;
        if (!activePiece || !activePiece.matrix || !Array.isArray(activePiece.matrix)) return;
        hasMovedSinceStart = false;

        if (this.audio) this.audio.playDrag();

        isDragging = true;
        this.activeSnap = null;
        activePointerId = (e.pointerId != null) ? e.pointerId : null;

        ensureGlobalListeners();

        const metrics = this.getBoardMetrics(PADDING);
        boardRect = metrics.rect;
        cellPixelSize = metrics.cellSize;

        if (!boardRect || !cellPixelSize) {
            isDragging = false;
            cleanupGlobalListeners();
            return;
        }

        clone = el.cloneNode(true);
        clone.classList.add('dragging-active');
        clone.style.display = 'grid';

        const cols = activePiece.matrix[0].length;
        const rows = activePiece.matrix.length;

        clone.style.width = (cols * cellPixelSize) + 'px';
        clone.style.height = (rows * cellPixelSize) + 'px';
        clone.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        clone.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        clone.style.gap = `${GAP}px`;

        // Base fixa na viewport; movimento via translate
        clone.style.position = 'fixed';
        clone.style.left = '0px';
        clone.style.top = '0px';
        clone.style.margin = '0';
        clone.style.willChange = 'translate, transform, opacity';

        // PosiÃ§Ã£o inicial offscreen (sem mexer em transform)
        clone.style.translate = `-9999px -9999px`;

        document.body.appendChild(clone);

        // Mede 1x
        halfW = (cols * cellPixelSize) * 0.5;
        halfH = (rows * cellPixelSize) * 0.5;

        const p = getPoint(e);
        lastClientX = p.x;
        lastClientY = p.y;

        // Atualiza ponteiro (ghost)
        this._lastPointerX = lastClientX;
        this._lastPointerY = lastClientY - VISUAL_OFFSET_Y;

        // Primeira posiÃ§Ã£o imediata
        moveCloneToPointer();
        this.updateGhostPreview(clone, boardRect, cellPixelSize, activePiece);

        el.style.opacity = '0';
    };

    const onMove = (e) => {
        if (!isDragging || !clone) return;
        if (HAS_POINTER && activePointerId != null && e.pointerId !== activePointerId) return;
        if (e.cancelable) e.preventDefault();

        const p = getPoint(e);
        const dx = Math.abs(p.x - lastClientX);
        const dy = Math.abs(p.y - lastClientY);
        if (dx < MOVE_EPS && dy < MOVE_EPS) return;

        hasMovedSinceStart = true;
        lastClientX = p.x;
        lastClientY = p.y;

        scheduleMove();
    };

    const onEnd = (e) => {
        if (!isDragging) return;
        if (HAS_POINTER && activePointerId != null && e.pointerId !== activePointerId) return;

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
        }

        cleanupGlobalListeners();
        activePointerId = null;

        this.clearPredictionHighlights();
        isDragging = false;

        const p = getChangedPoint(e);
        const dropX = p.x;
        const dropY = p.y;

        // Evita "tap" acidental no dock virar drop no tabuleiro.
        if (!hasMovedSinceStart) {
            el.style.opacity = '1';
            if (clone) {
                clone.remove();
                clone = null;
            }
            this.clearGhostPreview();
            this.activeSnap = null;
            this._lastGhostR = null;
            this._lastGhostC = null;
            this._lastGhostValid = null;
            this._lastPredR = null;
            this._lastPredC = null;
            return;
        }

        let placed = false;
        if (this.activeSnap && this.activeSnap.valid) {
            placed = this.placePiece(this.activeSnap.r, this.activeSnap.c, activePiece);
        }

        if (placed) {
            if (this.audio) {
                this.audio.playDrop();
                this.audio.vibrate(20);
            }

            el.remove();

            const index = parseInt(el.dataset.index, 10);
            if (!isNaN(index)) this.currentHand[index] = null;

            let hasWon = false;

            try {
                const damageDealt = this.checkLines(dropX, dropY);
                const linesCleared = this._lastLinesCleared || 0;

                if (this.currentMode === 'blitz' && this.blitz) {
                    this.blitz.onLinesCleared(linesCleared);
                }

                if (this.currentMode === 'classic') {
                    this.updateMissionProgress('placement', {});
                }

                if (this.currentMode === 'adventure') {
                    if (this.bossState.active) {
                        this.processBossTurn(damageDealt);
                        if (this.bossState.currentHp <= 0) hasWon = true;
                    } else {
                        hasWon = this.checkVictoryConditions();
                    }
                } else {
                    hasWon = this.checkVictoryConditions();
                }
            } catch (err) {
                console.error(err);
            }

            if (this.bossState.active && !hasWon) {
                if (this.hasPendingBossResolution()) {
                    this._postImpactBossTurnEndNeeded = true;
                } else {
                    const bossId = this.currentLevelConfig.boss?.id;
                    if (typeof BOSS_LOGIC !== 'undefined' && BOSS_LOGIC && BOSS_LOGIC[bossId] && BOSS_LOGIC[bossId].onTurnEnd) {
                        BOSS_LOGIC[bossId].onTurnEnd(this);
                    }
                }
            }

            if (!hasWon) {
                const remainingPieces = this.dockEl.querySelectorAll('.draggable-piece');
                if (remainingPieces.length === 0) {
                    this.spawnNewHand();
                } else {
                    this.saveGameState();
                    const shouldDeferMoveCheck =
                        this.currentMode === 'adventure' &&
                        this.bossState.active &&
                        this.hasPendingBossResolution();

                    if (shouldDeferMoveCheck) {
                        this._postImpactMoveCheckNeeded = true;
                    } else if (!this.checkMovesAvailable()) {
                        this.gameOver();
                    }
                }
            }
        } else {
            el.style.opacity = '1';
        }

        if (clone) {
            clone.remove();
            clone = null;
        }

        this.clearGhostPreview();
        this.activeSnap = null;
        this._lastGhostR = null;
        this._lastGhostC = null;
        this._lastGhostValid = null;
        this._lastPredR = null;
        this._lastPredC = null;
    };

    el._dragStartFromExternal = onStart;

    // SeguranÃ§a extra caso a peÃ§a seja removida no meio do drag por troca de tela
    el._dragCleanup = cleanupGlobalListeners;
}


    
    moveClone(clone, clientX, clientY) {
        const VISUAL_OFFSET_Y = DRAG_VISUAL_OFFSET_Y;
        const x = clientX - (clone.offsetWidth / 2);
        const y = clientY - (clone.offsetHeight / 2) - VISUAL_OFFSET_Y; 
        clone.style.left = x + 'px';
        clone.style.top = y + 'px';
    }

    updateGhostPreview(clone, boardRect, cellSize, piece) {
    const perfStart = this.perfStart('ghost');
    const GAP = 4;
    const PADDING = 8;

    // Se por algum motivo ainda nÃ£o houve move (primeiro frame), nÃ£o faz nada
    const px = this._lastPointerX;
    const py = this._lastPointerY;
    if (px == null || py == null) {
        this.perfEnd('ghost', perfStart);
        return;
    }

    // Centro lÃ³gico = ponteiro (evita getBoundingClientRect)
    const relativeX = px - (boardRect.left + PADDING);
    const relativeY = py - (boardRect.top + PADDING);

    const effectiveSize = cellSize + GAP;
    const invSize = 1 / effectiveSize;

    const exactCol = (relativeX * invSize) - (piece.matrix[0].length * 0.5);
    const exactRow = (relativeY * invSize) - (piece.matrix.length * 0.5);

    const baseR = Math.round(exactRow);
    const baseC = Math.round(exactCol);

    // Mesmo conjunto de candidatos (mesma jogabilidade)
    let bestR = 0, bestC = 0;
    let bestValid = false;
    let minDist2 = Infinity;
    let found = false;

    for (let i = 0; i < 5; i++) {
        let r = baseR;
        let c = baseC;
        if (i === 1) r = baseR + 1;
        else if (i === 2) r = baseR - 1;
        else if (i === 3) c = baseC + 1;
        else if (i === 4) c = baseC - 1;

        const dr = r - exactRow;
        const dc = c - exactCol;
        const dist2 = (dr * dr) + (dc * dc);

        const valid = this.canPlace(r, c, piece);

        if (valid) {
            if (!found || !bestValid || dist2 < minDist2) {
                bestR = r; bestC = c; bestValid = true;
                minDist2 = dist2;
                found = true;
            }
        } else if (!found && dist2 < 0.36) {
            // Mesmo limiar visual (0.6Â²)
            bestR = r; bestC = c; bestValid = false;
            found = true;
        }
    }

        if (!found) {
            if (this.activeSnap !== null) {
                this.activeSnap = null;
                this.clearGhostPreview();
                this.clearPredictionHighlights();
            this._lastGhostR = null;
            this._lastGhostC = null;
            this._lastGhostValid = null;
            this._lastPredR = null;
            this._lastPredC = null;
            }
        this.perfEnd('ghost', perfStart);
            return;
        }

    if (this._lastGhostR === bestR && this._lastGhostC === bestC && this._lastGhostValid === bestValid) {
        this.activeSnap = { r: bestR, c: bestC, valid: bestValid };
        return;
    }

    this._lastGhostR = bestR;
    this._lastGhostC = bestC;
    this._lastGhostValid = bestValid;
    this.activeSnap = { r: bestR, c: bestC, valid: bestValid };

    this.clearGhostPreview();
    this.clearPredictionHighlights();

    this.drawGhost(bestR, bestC, piece, bestValid);

    if (bestValid) {
        if (this._lastPredR !== bestR || this._lastPredC !== bestC) {
            this._lastPredR = bestR;
            this._lastPredC = bestC;

            const prediction = this.predictClears(bestR, bestC, piece);
            if (
                (prediction.rows && prediction.rows.length > 0) ||
                (prediction.cols && prediction.cols.length > 0)
            ) {
                this.drawPredictionHighlights(prediction);
            }
        }
    } else {
        this._lastPredR = null;
        this._lastPredC = null;
    }
    this.perfEnd('ghost', perfStart);
}


    
    // --- PREVISÃƒO DE LINHAS (EFEITO DOURADO) ---

    // 1. Simula a jogada e retorna quais linhas/colunas seriam limpas
    predictClears(r, c, piece) {
    const perfStart = this.perfStart('predictClears');
    const N = this.gridSize;
    const grid = this.grid;
    const layout = piece.layout;

    // Conta quantos vazios existem em cada linha/coluna no grid atual
    // Reutiliza buffers para evitar GC
    // DEPENDÃŠNCIAS INTERNAS (auto-criadas):
    // this._predEmptyRows = Int16Array(N)
    // this._predEmptyCols = Int16Array(N)
    if (!this._predEmptyRows || this._predEmptyRows.length !== N) {
        this._predEmptyRows = new Int16Array(N);
        this._predEmptyCols = new Int16Array(N);
    }

    const emptyRows = this._predEmptyRows;
    const emptyCols = this._predEmptyCols;

    // Zera contadores
    for (let i = 0; i < N; i++) {
        emptyRows[i] = 0;
        emptyCols[i] = 0;
    }

    // Conta vazios atuais
    for (let row = 0; row < N; row++) {
        const gRow = grid[row];
        for (let col = 0; col < N; col++) {
            if (gRow[col] === null) {
                emptyRows[row]++;
                emptyCols[col]++;
            }
        }
    }

    // Marca quais cÃ©lulas vazias serÃ£o cobertas pela peÃ§a (para nÃ£o decrementar 2x)
    // Usamos bitmap 64 (Uint8Array) e reaproveitamos
    // this._predMark = Uint8Array(N*N)
    if (!this._predMark || this._predMark.length !== N * N) {
        this._predMark = new Uint8Array(N * N);
    }
    const mark = this._predMark;

    // Reset rÃ¡pido do mark (64 bytes no N=8)
    for (let i = 0; i < mark.length; i++) mark[i] = 0;

    // Aplica a peÃ§a virtualmente: se ela cobrir uma cÃ©lula que estava vazia,
    // decrementa os vazios daquela linha/coluna.
    for (let i = 0, rows = layout.length; i < rows; i++) {
        const lRow = layout[i];
        for (let j = 0, cols = lRow.length; j < cols; j++) {
            if (!lRow[j]) continue;

            const tr = r + i;
            const tc = c + j;

            // respeita o mesmo bound-check do original (nÃ£o assume canPlace)
            if (tr < 0 || tr >= N || tc < 0 || tc >= N) continue;

            // sÃ³ importa se era vazio antes
            if (grid[tr][tc] !== null) continue;

            const idx = tr * N + tc;
            if (mark[idx]) continue; // evita duplicata (seguranÃ§a)
            mark[idx] = 1;

            emptyRows[tr]--;
            emptyCols[tc]--;
        }
    }

    // Coleta linhas/colunas que ficaram sem vazios
    const rowsToClear = [];
    const colsToClear = [];

    for (let row = 0; row < N; row++) {
        if (emptyRows[row] === 0) rowsToClear.push(row);
    }
    for (let col = 0; col < N; col++) {
        if (emptyCols[col] === 0) colsToClear.push(col);
    }

    this.perfEnd('predictClears', perfStart);
    return { rows: rowsToClear, cols: colsToClear };
}


    // 2. Cria barras contÃ­nuas sobre as linhas/colunas detectadas
    drawPredictionHighlights({ rows, cols }) {
    // Inicializa pool uma vez (8 horizontais + 8 verticais)
    // DEPENDÃŠNCIAS INTERNAS CRIADAS AQUI:
    // this._predLinesH = Array(8)
    // this._predLinesV = Array(8)
    if (!this._predLinesH || !this._predLinesV) {
        this._predLinesH = new Array(8);
        this._predLinesV = new Array(8);

        for (let i = 0; i < 8; i++) {
            const h = document.createElement('div');
            h.className = 'prediction-line';
            // Horizontal: ocupa a largura toda
            h.style.gridColumnStart = 1;
            h.style.gridColumnEnd = -1;
            h.style.gridRowEnd = 'span 1';
            h.style.display = 'none';
            this.boardEl.appendChild(h);
            this._predLinesH[i] = h;

            const v = document.createElement('div');
            v.className = 'prediction-line';
            // Vertical: ocupa a altura toda
            v.style.gridRowStart = 1;
            v.style.gridRowEnd = -1;
            v.style.gridColumnEnd = 'span 1';
            v.style.display = 'none';
            this.boardEl.appendChild(v);
            this._predLinesV[i] = v;
        }
    }

    // Normaliza entradas para evitar exceÃ§Ãµes
    const rList = Array.isArray(rows) ? rows : [];
    const cList = Array.isArray(cols) ? cols : [];

    // Oculta tudo primeiro (custo constante: 16 elementos)
    // (bem mais barato que querySelectorAll + remove + GC)
    for (let i = 0; i < 8; i++) {
        const h = this._predLinesH[i];
        if (h.style.display !== 'none') h.style.display = 'none';

        const v = this._predLinesV[i];
        if (v.style.display !== 'none') v.style.display = 'none';
    }

    // Desenha horizontais (cap em 8)
    const rh = rList.length < 8 ? rList.length : 8;
    for (let i = 0; i < rh; i++) {
        const rowIndex = rList[i];
        if (rowIndex < 0 || rowIndex > 7) continue;

        const line = this._predLinesH[i];
        line.style.gridRowStart = (rowIndex + 1);
        line.style.display = 'block';
    }

    // Desenha verticais (cap em 8)
    const cv = cList.length < 8 ? cList.length : 8;
    for (let i = 0; i < cv; i++) {
        const colIndex = cList[i];
        if (colIndex < 0 || colIndex > 7) continue;

        const line = this._predLinesV[i];
        line.style.gridColumnStart = (colIndex + 1);
        line.style.display = 'block';
    }
}

    // 3. Remove as barras criadas
    clearPredictionHighlights() {
    // Se pool ainda nÃ£o existe, cai no mÃ©todo antigo (seguranÃ§a)
    if (!this._predLinesH || !this._predLinesV) {
        const lines = this.boardEl.querySelectorAll('.prediction-line');
        lines.forEach(el => el.remove());
        return;
    }

    // Apenas oculta (zero GC, zero DOM churn)
    for (let i = 0; i < 8; i++) {
        const h = this._predLinesH[i];
        if (h && h.style.display !== 'none') h.style.display = 'none';

        const v = this._predLinesV[i];
        if (v && v.style.display !== 'none') v.style.display = 'none';
    }
}

    drawGhost(r, c, piece, isValid) {
    const className = isValid ? 'ghost-valid' : 'ghost-invalid';

    // Cache de Ã­ndices usados pelo ghost
    // Mantido por compatibilidade com clearGhostPreview
    if (!this._ghostIdxs) this._ghostIdxs = [];
    const ghostIdxs = this._ghostIdxs;

    const layout = piece.layout;
    const gridSize = this.gridSize;
    const boardChildren = this._boardCells || this.boardEl.children;

    // Cache de flags (evita if repetido em loop)
    const useClassicColor =
        this.currentMode === 'classic' &&
        this.classicState.visualV1 &&
        piece.colorId;

    const colorClass = useClassicColor
        ? `classic-color-${piece.colorId}`
        : null;

    // Loop direto, sem alocaÃ§Ãµes
    for (let i = 0, rows = layout.length; i < rows; i++) {
        const row = layout[i];
        for (let j = 0, cols = row.length; j < cols; j++) {
            if (!row[j]) continue;

            const targetR = r + i;
            const targetC = c + j;

            // Bound check rÃ¡pido
            if (
                targetR < 0 ||
                targetR >= gridSize ||
                targetC < 0 ||
                targetC >= gridSize
            ) {
                continue;
            }

            const idx = (targetR << 3) + targetC; // r * 8 + c (bitshift)
            const cell = boardChildren[idx];
            if (!cell) continue;

            // Classe base do ghost
            cell.classList.add('ghost', className);

            // Visual clÃ¡ssico (somente se ativo)
            if (colorClass) {
                cell.classList.add(colorClass);
            }

            ghostIdxs.push(idx);
        }
    }
}


clearGhostPreview() {
    const idxs = this._ghostIdxs;
    if (!idxs || idxs.length === 0) return;

    const boardChildren = this._boardCells || this.boardEl.children;
    const grid = this.grid;
    const gridSize = this.gridSize;

    const isClassicVisual =
        this.currentMode === 'classic' &&
        this.classicState.visualV1;

    for (let k = 0; k < idxs.length; k++) {
        const idx = idxs[k];
        const cell = boardChildren[idx];
        if (!cell) continue;

        // Remove estado base do ghost
        cell.classList.remove('ghost', 'ghost-valid', 'ghost-invalid');

        // Calcula r/c sem divisÃ£o cara repetida
        const r = (idx / gridSize) | 0; // floor
        const c = idx - (r * gridSize);

        // Se a cÃ©lula virou preenchida de verdade, nÃ£o mexe na cor
        if (grid[r]?.[c] !== null) continue;

        // Visual clÃ¡ssico: remove SOMENTE a cor aplicada ao ghost
        if (isClassicVisual) {
            // Procura rapidamente pela classe classic-color-*
            // (bem mais barato que loop fixo 1..8)
            const classList = cell.classList;
            for (let i = 0; i < classList.length; i++) {
                const cls = classList[i];
                if (cls.startsWith('classic-color-')) {
                    classList.remove(cls);
                    break; // sÃ³ uma cor possÃ­vel
                }
            }
        }
    }

    // Limpa lista para o prÃ³ximo frame
    idxs.length = 0;
}




    canPlace(r, c, piece) {
    // Cache da forma da peÃ§a (feito uma vez por peÃ§a)
    // MantÃ©m o formato filled = [[dr,dc], ...] para compatibilidade
    let cache = piece._placeCache;

    // Recria cache se estiver ausente OU incompleto/invÃ¡lido
    // (evita bugs se outro trecho mexeu em _placeCache)
    const layout = piece.layout;
    if (
        !cache ||
        !cache.filled ||
        !Array.isArray(cache.filled) ||
        cache.rows == null ||
        cache.cols == null ||
        cache._layoutRef !== layout
    ) {
        const filled = [];
        const rows = layout.length;
        const cols = layout[0]?.length || 0;

        for (let i = 0; i < rows; i++) {
            const row = layout[i];
            for (let j = 0; j < cols; j++) {
                if (row[j]) filled.push([i, j]);
            }
        }

        cache = piece._placeCache = {
            rows,
            cols,
            filled,
            _layoutRef: layout // garante consistÃªncia se layout mudar (rotaÃ§Ã£o, etc.)
        };
    }

    const gridSize = this.gridSize;

    // Bounds check rÃ¡pido
    if (r < 0 || c < 0) return false;
    if (r + cache.rows > gridSize) return false;
    if (c + cache.cols > gridSize) return false;

    // Verifica apenas as cÃ©lulas preenchidas
    const g = this.grid;
    const filled = cache.filled;

    for (let k = 0; k < filled.length; k++) {
        const pos = filled[k];
        if (g[r + pos[0]][c + pos[1]] !== null) return false;
    }

    return true;
}


    placePiece(r, c, piece) {
    if (!this.canPlace(r, c, piece)) return false;

    const layout = piece.layout;
    const grid = this.grid;
    const size = this.gridSize;

    const isClassicV1 =
        this.currentMode === 'classic' &&
        this.classicState.visualV1 &&
        piece.colorId;

    const pieceColorId = isClassicV1 ? piece.colorId : 0;

    // Para remover o classic-pop em batch (1 timer ao invÃ©s de N)
    // DEPENDÃŠNCIA INTERNA (auto-criada):
    // this._classicPopCells = []
    let popCells = null;
    if (isClassicV1) {
        popCells = this._classicPopCells || (this._classicPopCells = []);
    }

    // Atualiza grid + render incremental
    for (let i = 0, rows = layout.length; i < rows; i++) {
        const row = layout[i];
        for (let j = 0, cols = row.length; j < cols; j++) {
            const cellData = row[j];
            if (!cellData) continue;

            const targetR = r + i;
            const targetC = c + j;

            // bounds safety (canPlace jÃ¡ garante, mas mantÃ©m robustez)
            if (targetR < 0 || targetR >= size || targetC < 0 || targetC >= size) continue;

            // Propaga o colorId da peÃ§a para o dado no grid (somente no clÃ¡ssico V1)
            if (pieceColorId) {
                cellData.colorId = pieceColorId;
            }

            grid[targetR][targetC] = cellData;

            // Render incremental: mantÃ©m consistÃªncia com cache do renderCell
            const idx = (targetR * size) + targetC;
            const cellEl = this._boardCells
                ? this._boardCells[idx]
                : this.boardEl.children[idx];

            if (cellEl) {
                // Importante: invalida cache dessa cÃ©lula para renderCell redesenhar
                cellEl._rk = null;
                this.renderCell(cellEl, cellData);

                // Visual V1: pop (sem N setTimeouts)
                if (pieceColorId) {
                    cellEl.classList.add('classic-pop');
                    popCells.push(cellEl);
                }
            }
        }
    }

    // Remove classic-pop em batch (1 timer total)
    if (popCells && popCells.length) {
        if (this._classicPopTimer) clearTimeout(this._classicPopTimer);
        this._classicPopTimer = setTimeout(() => {
            for (let i = 0; i < popCells.length; i++) {
                popCells[i].classList.remove('classic-pop');
            }
            popCells.length = 0;
            this._classicPopTimer = 0;
        }, 300);
    }

    this._emptyCellsDirty = true;
    return true;
}


    checkLines(dropX, dropY) {
    let linesCleared = 0;
    let damageDealt = false;

    const size = this.gridSize;
    const grid = this.grid;

    // 1) Identifica linhas/colunas completas (sem .every e sem closures)
    const rowsToClear = [];
    const colsToClear = [];

    for (let r = 0; r < size; r++) {
        const row = grid[r];
        let full = true;
        for (let c = 0; c < size; c++) {
            if (row[c] === null) { full = false; break; }
        }
        if (full) rowsToClear.push(r);
    }

    for (let c = 0; c < size; c++) {
        let full = true;
        for (let r = 0; r < size; r++) {
            if (grid[r][c] === null) { full = false; break; }
        }
        if (full) colsToClear.push(c);
    }

    // Se nada a limpar, sai cedo (mantÃ©m retorno original)
    if (rowsToClear.length === 0 && colsToClear.length === 0) {
        this._lastLinesCleared = 0;
        return false;
    }

    // 2) CAPTURA VISUAL (sem getBoundingClientRect por cÃ©lula)
    const visualExplosions = [];

    const boardChildren = this._boardCells || this.boardEl.children;

    // Estes valores precisam estar coerentes com o CSS do board:
    const GAP = 4;
    const PADDING = 8;

    const boardRect = this.boardEl.getBoundingClientRect();

    // mede 1x (ok) para ter o tamanho real da cÃ©lula
    let cellSizePx = 0;
    const firstCell = this.boardEl.querySelector('.cell');
    if (firstCell) {
        cellSizePx = firstCell.getBoundingClientRect().width;
    } else {
        // fallback seguro
        cellSizePx = (boardRect.width - (PADDING * 2) - (GAP * (size - 1))) / size;
    }

    const step = cellSizePx + GAP;

    // Evita duplicatas em cruzamentos usando bitmap (64) em vez de Set de strings
    const seen = new Uint8Array(size * size);

    // Para o Visual V1: remover a classe em batch (1 timer)
    const isClassicV1 = (this.currentMode === 'classic' && this.classicState.visualV1);
    const classicCellsToPulse = isClassicV1 ? [] : null;
    const isLiteEffects = this.performanceProfile === 'lite' || this._runtimePerfDowngrade;

    const computeRectForCell = (r, c) => {
        const left = boardRect.left + PADDING + (c * step);
        const top = boardRect.top + PADDING + (r * step);
        return { left, top, width: cellSizePx, height: cellSizePx };
    };

    const extractColorClass = (cell) => {
        const cl = cell.classList;
        for (let i = 0; i < cl.length; i++) {
            const s = cl[i];
            if (s === 'lava') return 'lava';
            if (s.length >= 5 && s[0] === 't' && s[1] === 'y' && s[2] === 'p' && s[3] === 'e' && s[4] === '-') return s;
            if (s.startsWith('classic-color-')) return s;
        }
        return 'type-normal';
    };

    const addVisual = (r, c) => {
        const idx = (r * size) + c;
        if (seen[idx]) return;
        seen[idx] = 1;

        const cell = boardChildren[idx];
        if (!cell) return;
        if (!(cell.classList.contains('filled') || cell.classList.contains('lava'))) return;

        if (isClassicV1) {
            cell.classList.add('classic-line-clear');
            classicCellsToPulse.push(cell);
        }

        const rect = computeRectForCell(r, c);
        let clone = null;

        if (!isLiteEffects) {
            clone = cell.cloneNode(true);
            clone.classList.add('cell-explosion');
            clone.style.position = 'fixed';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            clone.style.margin = '0';
            clone.style.zIndex = '9999';
            clone.style.pointerEvents = 'none';
            clone.style.transition = 'none';
            clone.style.transform = 'none';
            clone.style.willChange = 'transform, opacity';
        }

        const colorClass = extractColorClass(cell);

        visualExplosions.push({ clone, rect, colorClass });
    };

    for (let i = 0; i < rowsToClear.length; i++) {
        const r = rowsToClear[i];
        for (let c = 0; c < size; c++) addVisual(r, c);
    }
    for (let i = 0; i < colsToClear.length; i++) {
        const c = colsToClear[i];
        for (let r = 0; r < size; r++) addVisual(r, c);
    }

    if (isClassicV1 && classicCellsToPulse.length) {
        setTimeout(() => {
            for (let i = 0; i < classicCellsToPulse.length; i++) {
                classicCellsToPulse[i].classList.remove('classic-line-clear');
            }
        }, 400);
    }

    // 3) LIMPEZA LÃ“GICA (mantida)
    this.beginGoalsBatch();
    for (let i = 0; i < rowsToClear.length; i++) {
        if (this.clearRow(rowsToClear[i])) damageDealt = true;
        linesCleared++;
    }
    for (let i = 0; i < colsToClear.length; i++) {
        if (this.clearCol(colsToClear[i])) damageDealt = true;
        linesCleared++;
    }
    this.endGoalsBatch();

    if (linesCleared > 0) {
        this.renderGrid();

        const lineXp = linesCleared * XP_REWARDS.lineClear;
        this.awardXP(lineXp, 'Limpeza de linhas');

        // 4) EXECUÃ‡ÃƒO DA ANIMAÃ‡ÃƒO (wave via rAF, sem N timeouts)
        const WAVE_STEP_MS = isLiteEffects ? 8 : 20;
        const REMOVE_AFTER_MS = 400;

        let startTime = performance.now();
        let nextIndex = 0;

        // âœ… CorreÃ§Ã£o: remoÃ§Ã£o robusta (sem bug de pop/swap)
        const removals = []; // { node, removeAt }

        const tick = (t) => {
            const shouldHave = Math.min(
                visualExplosions.length,
                Math.floor((t - startTime) / WAVE_STEP_MS) + 1
            );

            while (nextIndex < shouldHave) {
                const item = visualExplosions[nextIndex++];

                if (item.clone) {
                    document.body.appendChild(item.clone);

                    requestAnimationFrame(() => {
                        item.clone.classList.add('explode');
                        this.spawnExplosion(item.rect, item.colorClass);

                        if (isClassicV1 && !isLiteEffects) {
                            this.spawnClassicParticles(item.rect, item.colorClass);
                        }
                    });

                    removals.push({ node: item.clone, removeAt: t + REMOVE_AFTER_MS });
                } else {
                    this.spawnExplosion(item.rect, item.colorClass);
                }
            }

            // âœ… RemoÃ§Ã£o correta por Ã­ndice (lista pequena â†’ custo irrelevante)
            for (let i = removals.length - 1; i >= 0; i--) {
                if (t >= removals[i].removeAt) {
                    const n = removals[i].node;
                    if (n && n.parentNode) n.remove();
                    removals.splice(i, 1);
                }
            }

            if (nextIndex < visualExplosions.length || removals.length > 0) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);

        // 5) LÃ³gica de Score/Combos (mantida igual)
        const now = Date.now();
        if (now - (this.comboState.lastClearTime || 0) <= 5000) this.comboState.count++;
        else this.comboState.count = 1;
        this.comboState.lastClearTime = now;

        if (this.currentMode === 'classic') {
            const previousScore = this.classicState.score;
            const baseScore = this.calculateClassicScore(linesCleared);
            const comboMultiplier = 1 + (Math.min(this.classicState.comboStreak, 5) * 0.5);
            const missionsEnabled = !!(this.classicState.missions && this.classicState.missions.length > 0);

            if (!missionsEnabled) {
                this.classicState.missionRewardActive = false;
                this.classicState.missionRewardMultiplier = 1.0;
                this.classicState.missionRewardEndTime = null;
            }

            const missionMultiplier = missionsEnabled && this.classicState.missionRewardActive
                ? this.classicState.missionRewardMultiplier
                : 1.0;
            const totalScore = Math.floor(baseScore * comboMultiplier * missionMultiplier);

            this.classicState.score += totalScore;
            this.classicState.linesCleared += linesCleared;
            this.classicState.comboStreak++;
            if (this.classicState.comboStreak > this._classicMaxCombo) {
                this._classicMaxCombo = this.classicState.comboStreak;
            }

            const crossedMilestone = Math.floor(previousScore / 1000) < Math.floor(this.classicState.score / 1000);
            this.showClassicScoreDelta(totalScore, crossedMilestone);

            if (crossedMilestone) {
                this.triggerClassicScoreMilestone();
            } else if (totalScore >= 1000) {
                this.triggerClassicScoreGlow();
            }

            if (this.classicState.score > this.classicState.bestScore) {
                this.classicState.bestScore = this.classicState.score;
                localStorage.setItem('classic_best_score', this.classicState.bestScore.toString());

                if (!this.classicState.recordBeaten) {
                    this.classicState.recordBeaten = true;
                    this._classicBestDisplay = this.classicState.bestScore;
                    if (RUNTIME_LOGS) console.log(`[CLASSIC] \u{1F3C6} NEW RECORD! ${this.classicState.bestScore} pontos`);

                    // Recompensa por novo recorde
                    this.rewardNewRecord();

                    if (this.effects && this.effects.showFloatingTextCentered) {
                        this.effects.showFloatingTextCentered('NEW RECORD! \u{1F3C6}', 'feedback-gold');
                    }
                }
            }

            // Verifica marcos de pontuaÃ§Ã£o para cristais (a cada 500 pontos)
            if (this.currentMode === 'classic') {
                this.checkClassicScoreRewards();
            }

            const newLevel = Math.floor(this.classicState.linesCleared / 10) + 1;
            if (newLevel > this.classicState.level) {
                this.classicState.level = newLevel;
                if (RUNTIME_LOGS) console.log(`[CLASSIC] LEVEL UP! NÃ­vel ${this.classicState.level}`);

                if (this.effects && this.effects.triggerScreenFlash) {
                    this.effects.triggerScreenFlash('#a855f7');
                }
            }

            if (RUNTIME_LOGS) console.log(`[CLASSIC] Score: ${this.classicState.score}, Lines: ${this.classicState.linesCleared}, Combo: ${this.classicState.comboStreak}x, +${totalScore}pts`);

            this.updateClassicUI();

            this.updateMissionProgress('line_clear', { count: linesCleared });
            this.updateMissionProgress('combo', {});
            this.updateMissionProgress('score', {});

            // Achievement tracking (batched, optimized)
            if (this.achievements) {
                this.achievements.trackEvent('classic_score', { score: this.classicState.score });
                this.achievements.trackEvent('combo_streak', { streak: this.classicState.comboStreak });
                this.achievements.trackEvent('line_clear', { count: linesCleared });

                // Quad clear (Perfect Clear)
                if (linesCleared === 4) {
                    this.achievements.trackEvent('line_clear', { count: 4 });
                }
            }

            this.showClassicFeedback();
            this.resetClassicComboTimer();

            if (this.isPerfectClear()) {
                this.classicState.score += 2000;
                if (RUNTIME_LOGS) console.log('[CLASSIC] \u{1F48E} PERFECT CLEAR! +2000 pontos');

                if (this.effects && this.effects.triggerScreenFlash) {
                    this.effects.triggerScreenFlash('#fbbf24');
                }
                if (this.effects && this.effects.showFloatingTextCentered) {
                    this.effects.showFloatingTextCentered('PERFECT CLEAR! +2000', 'feedback-epic');
                }

                this.updateClassicUI();
            }
        }
        else if (this.currentMode === 'blitz') {
            this._blitzLinesCleared += linesCleared;
            if (this.comboState.count > this._blitzMaxCombo) {
                this._blitzMaxCombo = this.comboState.count;
            }
        }

        const comboCount = this.comboState.count;

        if (comboCount >= 2) {
            const comboXp = (comboCount - 1) * XP_REWARDS.comboStep;
            this.awardXP(comboXp, `Combo x${comboCount}`);
        }

        if (this.currentMode === 'adventure' && this.heroState) {
            let unlockedSomething = false;

            if (comboCount >= 2 && (!this.heroState.thalion.unlocked || this.heroState.thalion.used)) {
                this.heroState.thalion.unlocked = true; this.heroState.thalion.used = false;
                unlockedSomething = true;
            }
            if (comboCount >= 3 && (!this.heroState.nyx.unlocked || this.heroState.nyx.used)) {
                this.heroState.nyx.unlocked = true; this.heroState.nyx.used = false;
                unlockedSomething = true;
            }

            this.heroState.player.lineCounter = (this.heroState.player.lineCounter || 0) + linesCleared;
            if ((this.heroState.player.lineCounter >= 5 || comboCount >= 4) && (!this.heroState.player.unlocked || this.heroState.player.used)) {
                if (this.heroState.player.lineCounter >= 5) this.heroState.player.lineCounter = 0;
                this.heroState.player.unlocked = true; this.heroState.player.used = false;
                unlockedSomething = true;
            }

            this.heroState.mage.lineCounter = (this.heroState.mage.lineCounter || 0) + linesCleared;
            if ((this.heroState.mage.lineCounter >= 5 || comboCount >= 4) && (!this.heroState.mage.unlocked || this.heroState.mage.used)) {
                if (this.heroState.mage.lineCounter >= 5) this.heroState.mage.lineCounter = 0;
                this.heroState.mage.unlocked = true; this.heroState.mage.used = false;
                unlockedSomething = true;
            }

            if (unlockedSomething) {
                this.updateControlsVisuals();
                if (this.audio) this.audio.playTone(600, 'sine', 0.2);
            }
        }

        if (this.bossState.active) {
            this.effects.showComboFeedback(linesCleared, comboCount, 'normal');
            if (this.audio) this.audio.playBossClear(linesCleared);
        } else {
            let soundToPlay = null; let textType = 'normal';
            if (comboCount === 1) {
                textType = 'normal';
                soundToPlay = linesCleared === 1 ? 'clear1' : linesCleared === 2 ? 'clear2' : linesCleared === 3 ? 'clear3' : 'clear4';
            } else if (comboCount === 2) { textType = 'wow'; soundToPlay = 'wow'; }
            else if (comboCount === 3) { textType = 'holycow'; soundToPlay = 'holycow'; }
            else { textType = 'unreal'; soundToPlay = 'unreal'; }

            this.effects.showComboFeedback(linesCleared, comboCount, textType);
            if (this.audio) {
                this.audio.playSound(soundToPlay);
                const vibIntensity = Math.min(comboCount * 30, 200);
                this.audio.vibrate([vibIntensity, 50, vibIntensity]);
            }
        }

        this.score += (linesCleared * 10 * linesCleared) * comboCount;
    }
        this._lastLinesCleared = linesCleared;
        return damageDealt;
}





    calculateClassicScore(linesCleared) {
        switch(linesCleared) {
            case 1: return 100;
            case 2: return 300;
            case 3: return 600;
            case 4: return 1000;
            default: return 1000 + (linesCleared - 4) * 400;
        }
    }

    updateClassicUI() {
        const scoreEl = document.getElementById('classic-score');
        const levelEl = document.getElementById('classic-level');
        const bestEl = document.getElementById('classic-best');
        const heroValueEl = document.getElementById('classic-score-hero-value');
        const heroBestEl = document.getElementById('classic-score-hero-best');

        if (!this._classicUiCache) {
            this._classicUiCache = { score: null, level: null, best: null, heroBest: null };
        }

        if (scoreEl && this._classicUiCache.score !== this.classicState.score) {
            this._classicUiCache.score = this.classicState.score;
            scoreEl.textContent = this.classicState.score.toLocaleString();
        }
        if (levelEl && this._classicUiCache.level !== this.classicState.level) {
            this._classicUiCache.level = this.classicState.level;
            levelEl.textContent = String(this.classicState.level);
        }
        if (bestEl && this._classicUiCache.best !== this.classicState.bestScore) {
            this._classicUiCache.best = this.classicState.bestScore;
            bestEl.textContent = this.classicState.bestScore.toLocaleString();
        }
        if (heroValueEl) this.animateClassicScoreHero(this.classicState.score, heroValueEl);
        if (heroBestEl) {
            const bestLabel = this.i18n?.t ? this.i18n.t('classic.best') : 'Recorde';
            const bestDisplay = Number.isFinite(this._classicBestDisplay) ? this._classicBestDisplay : this.classicState.bestScore;
            const heroBestText = `${bestLabel}: ${bestDisplay.toLocaleString()}`;
            if (this._classicUiCache.heroBest !== heroBestText) {
                this._classicUiCache.heroBest = heroBestText;
                heroBestEl.textContent = heroBestText;
            }
        }
    }

    animateClassicScoreHero(targetScore, heroValueEl) {
        if (this.currentMode !== 'classic') {
            heroValueEl.textContent = targetScore.toLocaleString();
            return;
        }

        const startScore = Number.isFinite(this._classicScoreDisplayed)
            ? this._classicScoreDisplayed
            : targetScore;

        if (this._classicScoreRaf) {
            cancelAnimationFrame(this._classicScoreRaf);
            this._classicScoreRaf = 0;
        }

        if (startScore === targetScore) {
            heroValueEl.textContent = targetScore.toLocaleString();
            return;
        }

        const delta = targetScore - startScore;
        const magnitude = Math.abs(delta);
        const duration = Math.min(900, Math.max(320, 320 + Math.sqrt(magnitude) * 18));
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = easeOutCubic(progress);
            const nextValue = Math.round(startScore + (delta * eased));

            if (nextValue !== this._classicScoreDisplayed) {
                this._classicScoreDisplayed = nextValue;
                heroValueEl.textContent = nextValue.toLocaleString();
            }

            if (progress < 1) {
                this._classicScoreRaf = requestAnimationFrame(tick);
                return;
            }

            this._classicScoreRaf = 0;
            this._classicScoreDisplayed = targetScore;
            heroValueEl.textContent = targetScore.toLocaleString();

            if (delta > 0) {
                const popScale = Math.min(1.16, 1.04 + (Math.min(delta, 2000) / 2000) * 0.12);
                heroValueEl.style.setProperty('--score-pop-scale', popScale.toFixed(3));
                this.restartCssAnimationClass(heroValueEl, 'score-pop');

                if (this._classicScorePopTimer) clearTimeout(this._classicScorePopTimer);
                this._classicScorePopTimer = setTimeout(() => {
                    heroValueEl.classList.remove('score-pop');
                    this._classicScorePopTimer = 0;
                }, 200);
            }
        };

        this._classicScoreTarget = targetScore;
        this._classicScoreRaf = requestAnimationFrame(tick);
    }

    showClassicScoreDelta(amount, crossedMilestone = false) {
        if (this.currentMode !== 'classic') return;
        if (!amount || amount <= 0) return;

        const deltaEl = document.getElementById('classic-score-hero-delta');
        if (!deltaEl) return;

        const baseIntensity = Math.min(1.6, 1 + (Math.min(amount, 2000) / 2000) * 0.6);
        const intensity = crossedMilestone ? Math.min(1.9, baseIntensity + 0.2) : baseIntensity;
        const risePx = Math.round(18 * intensity);
        const durationMs = Math.round(680 + ((intensity - 1) * 220));
        const peakScale = (1 + ((intensity - 1) * 0.6)).toFixed(3);

        deltaEl.style.setProperty('--delta-rise', `${risePx}px`);
        deltaEl.style.setProperty('--delta-duration', `${durationMs}ms`);
        deltaEl.style.setProperty('--delta-scale', peakScale);

        deltaEl.textContent = `+${Math.floor(amount).toLocaleString()}`;
        this.restartCssAnimationClass(deltaEl, 'is-visible');

        if (this._classicScoreDeltaTimer) clearTimeout(this._classicScoreDeltaTimer);
        this._classicScoreDeltaTimer = setTimeout(() => {
            deltaEl.classList.remove('is-visible');
            this._classicScoreDeltaTimer = 0;
        }, 740);
    }

    triggerClassicScoreGlow() {
        if (this.currentMode !== 'classic') return;

        const heroValueEl = document.getElementById('classic-score-hero-value');
        if (!heroValueEl) return;

        this.restartCssAnimationClass(heroValueEl, 'score-glow');

        if (this._classicScoreGlowTimer) clearTimeout(this._classicScoreGlowTimer);
        this._classicScoreGlowTimer = setTimeout(() => {
            heroValueEl.classList.remove('score-glow');
            this._classicScoreGlowTimer = 0;
        }, 420);
    }

    triggerClassicScoreMilestone() {
        if (this.currentMode !== 'classic') return;

        const heroValueEl = document.getElementById('classic-score-hero-value');
        if (!heroValueEl) return;

        this.restartCssAnimationClass(heroValueEl, 'score-milestone');

        if (this._classicScoreMilestoneTimer) clearTimeout(this._classicScoreMilestoneTimer);
        this._classicScoreMilestoneTimer = setTimeout(() => {
            heroValueEl.classList.remove('score-milestone');
            this._classicScoreMilestoneTimer = 0;
        }, 560);
    }

    updateMissionsUI() {
        const container = document.getElementById('classic-missions');
        if (!container) return;

        this.classicState.missions.forEach((mission, idx) => {
            const chip = container.children[idx];
            if (!chip) return;

            const textEl = chip.querySelector('.mission-text');
            const progressEl = chip.querySelector('.mission-progress');

            textEl.textContent = mission.text;
            progressEl.textContent = `${mission.progress}/${mission.target}`;

            if (mission.completed) {
                chip.classList.add('completed');
            } else {
                chip.classList.remove('completed');
            }
        });
    }

    updateMissionProgress(eventType, eventData) {
        if (this.currentMode !== 'classic') return;
        if (!this.classicState.missions || this.classicState.missions.length === 0) return;

        this.classicState.missions.forEach(mission => {
            if (mission.completed) return;

            let shouldUpdate = false;

            switch (mission.type) {
                case 'line_clear':
                    // BUG FIX: Conta QUANTAS VEZES limpou N linhas (ex: limpar 2 linhas 2x = 2/2)
                    if (eventType === 'line_clear' && eventData.count >= mission.lineTarget) {
                        mission.progress = Math.min(mission.progress + 1, mission.target);
                        shouldUpdate = true;
                    }
                    break;

                case 'combo_achievement':
                    // Detecta quando o combo atinge o alvo (ex: combo 3x = comboStreak >= 3)
                    if (eventType === 'combo') {
                        const target = mission.comboTarget || mission.target;
                        if (this.classicState.comboStreak >= target) {
                            mission.progress = 1;
                            shouldUpdate = true;
                        }
                    }
                    break;

                case 'score':
                    if (eventType === 'score') {
                        mission.progress = Math.min(this.classicState.score, mission.target);
                        shouldUpdate = true;
                    }
                    break;

                case 'placements':
                    if (eventType === 'placement') {
                        mission.progress = Math.min(mission.progress + 1, mission.target);
                        shouldUpdate = true;
                    }
                    break;

                case 'line_clear_count':
                    // BUG FIX: Soma QUANTAS linhas foram limpadas, nÃ£o apenas +1
                    if (eventType === 'line_clear') {
                        mission.progress = Math.min(mission.progress + eventData.count, mission.target);
                        shouldUpdate = true;
                    }
                    break;
            }

            if (shouldUpdate && mission.progress >= mission.target && !mission.completed) {
                mission.completed = true;
                this.onMissionCompleted(mission);
                if (RUNTIME_LOGS) console.log(`[MISSIONS] MissÃ£o concluÃ­da: ${mission.text}`);
            }
        });

        this.updateMissionsUI();
    }

    onMissionCompleted(mission) {
        if (this.currentMode !== 'classic') return;
        if (!this.classicState.missions || this.classicState.missions.length === 0) return;
        const reward = mission.reward;

        this.awardXP(XP_REWARDS.missionComplete, 'ConclusÃ£o de missÃ£o');

        // ============================================
        // RECOMPENSA DE CRISTAIS POR MISSÃƒO
        // ============================================
        this.rewardMissionComplete();

        // Verifica se todas as 3 missÃµes foram completadas
        const allCompleted = this.classicState.missions.every(m => m.completed);
        if (allCompleted) {
            this.rewardAllMissionsComplete();
        }

        // Feedback visual e sonoro
        if (this.audio) {
            this.audio.playMissionComplete(); // Som customizado de missÃ£o completada
        }

        if (this.effects && this.effects.triggerScreenFlash) {
            this.effects.triggerScreenFlash('#22c55e');
        }

        if (reward.type === 'score') {
            this.classicState.score += reward.value;
            if (RUNTIME_LOGS) console.log(`[MISSIONS] Recompensa: +${reward.value} pontos`);

            if (this.effects && this.effects.showFloatingTextCentered) {
                const text = this.i18n.t('missions.reward_score').replace('{value}', reward.value);
                this.effects.showFloatingTextCentered(text, 'feedback-gold');
            }
        } else if (reward.type === 'multiplier') {
            this.classicState.missionRewardActive = true;
            this.classicState.missionRewardMultiplier = reward.value;
            this.classicState.missionRewardEndTime = Date.now() + reward.duration;

            if (RUNTIME_LOGS) console.log(`[MISSIONS] Recompensa: Multiplicador ${reward.value}x por ${reward.duration / 1000}s`);

            if (this.effects && this.effects.showFloatingTextCentered) {
                const text = this.i18n.t('missions.reward_multiplier').replace('{value}', reward.value);
                this.effects.showFloatingTextCentered(text, 'feedback-purple');
            }

            // Timer para desativar multiplicador
            setTimeout(() => {
                if (Date.now() >= this.classicState.missionRewardEndTime) {
                    this.classicState.missionRewardActive = false;
                    this.classicState.missionRewardMultiplier = 1.0;
                    if (RUNTIME_LOGS) console.log('[MISSIONS] Multiplicador expirado');
                }
            }, reward.duration);
        }

        // Atualizar estatÃ­sticas
        this.classicState.missionsTotal++;
        localStorage.setItem('classic_missions_total', this.classicState.missionsTotal.toString());

        // Verificar streak (3 missÃµes concluÃ­das)
        const completedCount = this.classicState.missions.filter(m => m.completed).length;
        if (completedCount > this.classicState.missionsBestStreak) {
            this.classicState.missionsBestStreak = completedCount;
            localStorage.setItem('classic_missions_best_streak', completedCount.toString());
            if (RUNTIME_LOGS) console.log(`[MISSIONS] Nova melhor sequÃªncia: ${completedCount}/3`);
        }

        // Achievement tracking for missions
        if (this.achievements) {
            this.achievements.trackEvent('mission_complete', {});

            // Perfect run (all 3 missions completed)
            if (completedCount === 3) {
                this.achievements.trackEvent('mission_perfect_run', {});
            }
        }

        this.updateClassicUI();
    }

    spawnClassicParticles(rect, colorClass) {
    let particleCount = 15;
    const perfMode = this.settings?.performanceMode || 'auto';
    const effectiveFps = this._fpsSmoothed > 0 ? this._fpsSmoothed : 60;

    if (perfMode === 'stable60' || this.performanceProfile === 'lite' || this._runtimePerfDowngrade) {
        particleCount = 8;
    } else if (effectiveFps < 45) {
        particleCount = 9;
    } else if (effectiveFps < 55) {
        particleCount = 12;
    }

    // Cache do colorMap (cria uma vez)
    if (!this._classicColorMap) {
        this._classicColorMap = {
            'classic-color-1': '#667eea',
            'classic-color-2': '#f093fb',
            'classic-color-3': '#4facfe',
            'classic-color-4': '#43e97b',
            'classic-color-5': '#fa709a',
            'classic-color-6': '#feca57',
            'classic-color-7': '#ee5a6f',
            'classic-color-8': '#c471ed'
        };
    }

    const baseColor = this._classicColorMap[colorClass] || '#667eea';
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;

    // Pool de partÃ­culas (reutiliza divs)
    // DEPENDÃŠNCIAS INTERNAS (auto-criadas):
    // this._classicParticlePool = []
    // this._classicParticlesActive = []
    // this._classicParticlesTicking = false
    // this._classicParticlesNow = 0
    if (!this._classicParticlePool) this._classicParticlePool = [];
    if (!this._classicParticlesActive) this._classicParticlesActive = [];

    const pool = this._classicParticlePool;
    const active = this._classicParticlesActive;

    if (active.length > 40) {
        particleCount = Math.max(6, Math.floor(particleCount * 0.6));
    }

    // FunÃ§Ã£o para pegar/criar partÃ­cula
    const acquire = () => {
        const p = pool.pop();
        if (p) return p;

        const el = document.createElement('div');
        el.className = 'classic-particle';
        // ajuda o compositor (melhor em mobile)
        el.style.willChange = 'transform, opacity';
        return el;
    };

    // AnimaÃ§Ã£o: mantemos a distribuiÃ§Ã£o circular e o jitter
    const twoPi = Math.PI * 2;

    const lifeMs = 800;
    const now = performance.now();

    for (let i = 0; i < particleCount; i++) {
        const particle = acquire();

        // Posiciona
        // (mantÃ©m left/top como no seu original; se seu CSS suportar,
        // dÃ¡ pra migrar para transform translate3d no futuro)
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.background = baseColor;

        const angle = (twoPi * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const speed = 50 + Math.random() * 100;

        const tx = Math.cos(angle) * speed;
        const ty = Math.sin(angle) * speed;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        // Reinicia animaÃ§Ã£o CSS de forma confiÃ¡vel
        // (sem ler layout: sÃ³ alterna classe e usa rAF)
        particle.classList.remove('active');
        document.body.appendChild(particle);

        // Marca como ativo (para remoÃ§Ã£o em batch)
        active.push({ el: particle, killAt: now + lifeMs });

        // Dispara animaÃ§Ã£o no prÃ³ximo frame (garante transiÃ§Ã£o)
        requestAnimationFrame(() => {
            particle.classList.add('active');
        });
    }

    // Scheduler Ãºnico para recolher partÃ­culas (sem 15 timeouts)
    if (!this._classicParticlesTicking) {
        this._classicParticlesTicking = true;

        const tick = (t) => {
            // Remove expirados (itera de trÃ¡s pra frente)
            for (let i = active.length - 1; i >= 0; i--) {
                if (t >= active[i].killAt) {
                    const el = active[i].el;
                    if (el && el.parentNode) el.remove();

                    // Retorna para o pool (reuso)
                    pool.push(el);

                    // Remove item do active
                    active.splice(i, 1);
                }
            }

            if (active.length > 0) {
                requestAnimationFrame(tick);
            } else {
                this._classicParticlesTicking = false;
            }
        };

        requestAnimationFrame(tick);
    }
}

    resetClassicComboTimer() {
        if (this.classicState.comboTimer) {
            clearTimeout(this.classicState.comboTimer);
        }

        this.classicState.comboTimer = setTimeout(() => {
            if (this.classicState.comboStreak > 0) {
                if (RUNTIME_LOGS) console.log('[CLASSIC] Combo quebrado!');
                this.classicState.comboStreak = 0;
            }
        }, 3000);
    }

    showClassicFeedback() {
        const streak = this.classicState.comboStreak;
        let text = '';

        if (streak === 1) text = this.i18n.t('classic.feedback_good');
        else if (streak === 2) text = this.i18n.t('classic.feedback_great');
        else if (streak === 3) text = this.i18n.t('classic.feedback_excellent');
        else if (streak === 4) text = this.i18n.t('classic.feedback_perfect');
        else if (streak >= 5) text = this.i18n.t('classic.feedback_unreal');

        if (text && this.effects && this.effects.showFloatingText) {
            this.effects.showFloatingText(text, {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                size: 48,
                color: '#fbbf24',
                duration: 800
            });
        }
    }

    generateMissionPool() {
        return [
            { id: 'clear_2x', type: 'line_clear', target: 2, lineTarget: 2, text: this.i18n.t('missions.clear_2x'), progress: 0, completed: false, reward: { type: 'score', value: 200 } },
            { id: 'combo_3x', type: 'combo_achievement', target: 1, comboTarget: 3, text: this.i18n.t('missions.combo_3x'), progress: 0, completed: false, reward: { type: 'multiplier', value: 1.1, duration: 30000 } },
            { id: 'score_500', type: 'score', target: 500, text: this.i18n.t('missions.score_500'), progress: 0, completed: false, reward: { type: 'score', value: 100 } },
            { id: 'placements_5', type: 'placements', target: 5, text: this.i18n.t('missions.placements_5'), progress: 0, completed: false, reward: { type: 'multiplier', value: 1.1, duration: 30000 } },
            { id: 'clear_1x_5', type: 'line_clear_count', target: 5, text: this.i18n.t('missions.clear_1x_5'), progress: 0, completed: false, reward: { type: 'score', value: 300 } }
        ];
    }

    generateRandomMissions() {
        const pool = this.generateMissionPool();
        const shuffled = pool.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3).map(m => ({ ...m })); // Clone para evitar referÃªncia
    }

    isPerfectClear() {
        return this.grid.every(row => row.every(cell => cell === null));
    }

    clearRow(r) {
    let foundDamage = false;
    for (let c = 0; c < this.gridSize; c++) {
        if (this.grid[r][c]) {
            if (this.collectItem(r, c, this.grid[r][c])) foundDamage = true;
            this.grid[r][c] = null;
        }
    }

    // âœ… Grid mudou: cÃ©lulas ficaram vazias
    this._emptyCellsDirty = true;

    return foundDamage;
}


    clearCol(c) {
    let foundDamage = false;
    for (let r = 0; r < this.gridSize; r++) {
        if (this.grid[r][c]) {
            if (this.collectItem(r, c, this.grid[r][c])) foundDamage = true;
            this.grid[r][c] = null;
        }
    }

    // âœ… Grid mudou: cÃ©lulas ficaram vazias
    this._emptyCellsDirty = true;

    return foundDamage;
}

    collectItem(r, c, cellData) {
    if (!cellData) return false;

    if (cellData.type === 'ITEM') {
        const key = cellData.key.toLowerCase();
        const emoji = this.getItemGlyph(cellData);

        const shouldSyncDamage = this.currentMode === 'adventure'
            && this.bossState.active
            && this.shouldSyncBossDamageOnFlyImpact();
        const stats = ITEM_STATS[key] || ITEM_STATS['default'];
        const damage = stats ? stats.damage : 1;
        if (shouldSyncDamage) this.beginSyncedBossImpact();

        this.runFlyAnimation(
            r,
            c,
            key,
            emoji,
            shouldSyncDamage ? (() => {
                this.damageBoss(damage);
                this.completeSyncedBossImpact();
            }) : null
        );

        // Goals (batched)
        if (this.currentGoals && this.currentGoals[key] !== undefined) {
            this.collected[key] = (this.collected[key] || 0) + 1;

            // Se estamos em batch, sÃ³ marca dirty.
            // Se nÃ£o, atualiza como antes (imediato).
            if (this._goalsBatchDepth > 0) {
                this._goalsDirty = true;
            } else {
                this.updateGoalsUI();
            }
        }

        // DANO NO BOSS (RPG)
        if (this.currentMode === 'adventure' && this.bossState.active) {
            if (!shouldSyncDamage) {
                this.damageBoss(damage);
            }
            return true;
        }
    }

    return false;
}


    processBossTurn(damageDealt) {
        if (damageDealt) {
            this.bossState.movesWithoutDamage = 0;
        } else {
            this.bossState.movesWithoutDamage++;
            if (this.bossState.movesWithoutDamage >= this.bossState.attackRate) {
                this.triggerBossAttack();
                this.bossState.movesWithoutDamage = 0;
            }
        }
    }

    triggerBossAttack() {
        this.effects.shakeScreen();
        const bossId = (this.currentLevelConfig.boss?.id) || 'dragon_ignis';
        
        try {
            const behavior = BOSS_LOGIC ? BOSS_LOGIC[bossId] : null;
            if (behavior?.onAttack) behavior.onAttack(this);
        } catch(e) { console.warn("Boss logic error", e); }
    }

    triggerScreenFlash(color) {
        document.body.style.transition = 'background-color 0.1s';
        const oldBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = color; 
        setTimeout(() => { document.body.style.backgroundColor = oldBg; }, 200);
    }

    transformCell(r, c, newData) {
        this.grid[r][c] = newData;
        const idx = r * 8 + c;
        const cells = this._boardCells || this.boardEl.children;
        const el = cells[idx];
        if (el) {
            el.style.transform = 'scale(0)';
            setTimeout(() => {
                this.renderGrid(); 
                const refreshCells = this._boardCells || this.boardEl.children;
                const newEl = refreshCells[idx];
                if(newEl) {
                    newEl.style.transform = 'scale(1.2)';
                    setTimeout(() => newEl.style.transform = 'scale(1)', 150);
                }
            }, 100);
        }
    }

    damageBoss(amount) {
    if (!amount) return;

    // Acumula dano no frame atual
    this._pendingBossDamage = (this._pendingBossDamage || 0) + amount;

    // Agenda aplicaÃ§Ã£o 1x por frame
    if (this._bossDamageRaf) return;

    this._bossDamageRaf = requestAnimationFrame(() => {
        this._bossDamageRaf = 0;

        const dmg = this._pendingBossDamage || 0;
        this._pendingBossDamage = 0;

        if (dmg <= 0) return;

        this.bossState.currentHp = Math.max(0, this.bossState.currentHp - dmg);

        // Atualiza UI uma vez
        this.updateBossUI();

        // Dispara win uma Ãºnica vez
        if (this.bossState.currentHp <= 0 && !this._bossWinScheduled) {
            this._bossWinScheduled = true;
            setTimeout(() => {
                this._bossWinScheduled = false;
                this.gameWon({}, []);
            }, 500);
            return;
        }

        this.flushDeferredBossPostChecks();
    });
}


    updateBossUI() {
    // Cacheia elementos (evita getElementById repetido)
    if (!this._bossUI) {
        this._bossUI = {
            bar: document.getElementById('boss-hp-bar'),
            text: document.getElementById('boss-hp-text')
        };
    }

    const bar = this._bossUI.bar;
    const text = this._bossUI.text;

    const pct = (this.bossState.currentHp / this.bossState.maxHp) * 100;

    if (bar) {
        const w = pct + '%';
        if (bar.style.width !== w) bar.style.width = w;
    }

    if (text) {
        const current = Math.ceil(this.bossState.currentHp);
        const newText = `${current}/${this.bossState.maxHp}`;
        if (text.textContent !== newText) text.textContent = newText;
    }

    this.updateBossHud();
}


    getMovesAvailabilityCacheKey() {
    let hash = 2166136261;
    const grid = this.grid;
    const N = this.gridSize;

    for (let r = 0; r < N; r++) {
        const row = grid[r];
        for (let c = 0; c < N; c++) {
            const cell = row[c];
            if (cell === null) {
                hash ^= 31;
                hash = Math.imul(hash, 16777619);
                continue;
            }
            hash ^= 131;
            hash = Math.imul(hash, 16777619);
            const key = cell.key || cell.type || '';
            for (let i = 0; i < key.length; i++) {
                hash ^= key.charCodeAt(i);
                hash = Math.imul(hash, 16777619);
            }
        }
    }

    const hand = this.currentHand || [];
    for (let i = 0; i < hand.length; i++) {
        const piece = hand[i];
        if (!piece) {
            hash ^= 7;
            hash = Math.imul(hash, 16777619);
            continue;
        }
        const name = piece.name || '';
        for (let k = 0; k < name.length; k++) {
            hash ^= name.charCodeAt(k);
            hash = Math.imul(hash, 16777619);
        }
        const layout = piece.layout || piece.matrix || [];
        hash ^= layout.length || 0;
        hash = Math.imul(hash, 16777619);
        hash ^= layout[0]?.length || 0;
        hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(36);
}

    checkMovesAvailable() {
    if (!this.dockEl) return true;

    const hand = this.currentHand;
    if (!hand || hand.length === 0) return true;

    const cacheKey = this.getMovesAvailabilityCacheKey();
    if (this._movesAvailabilityCache?.key === cacheKey) {
        return this._movesAvailabilityCache.result;
    }

    const pieces = [];
    for (let i = 0; i < hand.length; i++) {
        const p = hand[i];
        if (p) pieces.push(p);
    }
    if (pieces.length === 0) return true;

    const N = this.gridSize;
    const grid = this.grid;

    // Cache de vazios como idx
    if (!this._emptyCellsIdx || this._emptyCellsDirty) {
        const emptiesIdx = [];
        for (let r = 0; r < N; r++) {
            const row = grid[r];
            for (let c = 0; c < N; c++) {
                if (row[c] === null) emptiesIdx.push(r * N + c);
            }
        }
        this._emptyCellsIdx = emptiesIdx;
        this._emptyCellsDirty = false;
        if (emptiesIdx.length === 0) return false;
    }

    const emptiesIdx = this._emptyCellsIdx;

    // visited stamping (sem Set)
    const visitedSize = N * N;
    if (!this._movesVisited || this._movesVisited.length !== visitedSize) {
        this._movesVisited = new Int32Array(visitedSize);
        this._movesVisitedStamp = 1;
    }
    const visited = this._movesVisited;

    for (let pi = 0; pi < pieces.length; pi++) {
        const piece = pieces[pi];

        const layout = piece.layout || piece.matrix;
        const rows = layout?.length || 0;
        const cols = layout?.[0]?.length || 0;
        if (!rows || !cols) continue;

        // Reuso por peÃ§a para evitar reconstruir o mesmo flat em checks seguidos
        let movesCache = piece._movesFilledFlatCache;
        if (!movesCache || movesCache._layoutRef !== layout) {
            const filledFlatBuilt = [];
            for (let dr = 0; dr < rows; dr++) {
                const row = layout[dr];
                for (let dc = 0; dc < cols; dc++) {
                    if (row[dc]) filledFlatBuilt.push(dr, dc);
                }
            }
            movesCache = {
                _layoutRef: layout,
                filledFlat: filledFlatBuilt
            };
            piece._movesFilledFlatCache = movesCache;
        }
        const filledFlat = movesCache.filledFlat;
        if (filledFlat.length === 0) continue;

        // stamp por peÃ§a
        let stamp = (this._movesVisitedStamp | 0) + 1;
        if (stamp === 0x7fffffff) {
            visited.fill(0);
            stamp = 1;
        }
        this._movesVisitedStamp = stamp;

        for (let e = 0; e < emptiesIdx.length; e++) {
            const empty = emptiesIdx[e];
            const er = (empty / N) | 0;
            const ec = empty - (er * N);

            for (let k = 0; k < filledFlat.length; k += 2) {
                const dr = filledFlat[k];
                const dc = filledFlat[k + 1];

                const baseR = er - dr;
                const baseC = ec - dc;

                if (baseR < 0 || baseC < 0) continue;
                if (baseR + rows > N) continue;
                if (baseC + cols > N) continue;

                const key = baseR * N + baseC;
                if (visited[key] === stamp) continue;
                visited[key] = stamp;

                if (this.canPlace(baseR, baseC, piece)) {
                    this._movesAvailabilityCache = { key: cacheKey, result: true };
                    return true;
                }
            }
        }
    }

    this._movesAvailabilityCache = { key: cacheKey, result: false };
    return false;
}




    getResultImageSrc(type) {
        const lang = this.i18n?.currentLang || 'en';
        const isPt = lang === 'pt-BR';
        if (type === 'victory') {
            return isPt
                ? 'assets/images/modal_victory_pt.webp'
                : 'assets/images/modal_victory_en.webp';
        }
        if (type === 'defeat') {
            return isPt
                ? 'assets/images/modal_defeat_pt.webp'
                : 'assets/images/modal_defeat_en.webp';
        }
        return null;
    }

    applyResultImage(type) {
        if (this.currentMode !== 'adventure' || !this.currentLevelConfig) return;
        const modalId = type === 'victory' ? 'modal-victory' : 'modal-gameover';
        const modal = document.getElementById(modalId);
        const img = modal?.querySelector('.result-header-image img');
        if (!img) return;

        const src = this.getResultImageSrc(type);
        if (src) img.src = src;
    }

    gameWon(collectedGoals = {}, earnedRewards = []) {
        if (this._resultResolved) return;
        this._resultResolved = true;
        if (this.modalOver) this.modalOver.classList.add('hidden');

        this.clearSavedGame();

        // Achievement tracking for level/boss completion
        if (this.achievements && this.currentLevelConfig) {
            const levelId = this.currentLevelConfig.id;

            // Track level complete
            this.achievements.trackEvent('level_complete', { level: levelId });

            // Track boss defeat
            if (this.bossState.active && this.currentLevelConfig.boss) {
                const bossId = this.currentLevelConfig.boss.id;
                const noPowers = !this.powerUsedThisLevel;

                this.achievements.trackEvent('boss_defeat', {
                    boss: bossId,
                    noPowers: noPowers
                });

                // Track world completion (final bosses of each world)
                const worldBosses = ['ignis', 'ent_ancient', 'golem_king', 'warlord_grok', 'dark_wizard'];
                if (worldBosses.includes(bossId)) {
                    const worldId = this.getCurrentWorld();
                    if (worldId) {
                        this.achievements.trackEvent('world_complete', { world: worldId });
                    }
                }
            }
        }

        if (this.currentMode === 'adventure') {
            this.awardXP(XP_REWARDS.levelComplete, 'ConclusÃ£o de fase');

            if (this.bossState.active && this.currentLevelConfig?.boss) {
                this.awardXP(XP_REWARDS.bossDefeat, 'Derrota de boss');
            }
        }

        // ============================================
        // RECOMPENSAS DE CRISTAIS (Modo Aventura)
        // ============================================
        if (this.currentMode === 'adventure') {
            // Calcula estrelas baseado no score (vocÃª pode ter lÃ³gica especÃ­fica)
            let stars = 1;
            if (this.score >= 1000) stars = 3;
            else if (this.score >= 500) stars = 2;

            // Recompensa por completar o nÃ­vel
            this.rewardAdventureLevel(stars);
        }

        if(this.audio) {
            this.audio.stopMusic();
            this.audio.playClear(3);
            if(this.audio.playSound && this.audio.playVictory) this.audio.playVictory();
            this.audio.vibrate([100, 50, 100, 50, 200]);
        }
        
        const modal = document.getElementById('modal-victory');
        const rewardsGrid = document.getElementById('victory-rewards-grid');
        const rewardsSection = document.getElementById('victory-rewards-section');
        this.applyResultImage('victory');
        const guardianRewardsSection = document.getElementById('victory-guardian-rewards');
        const guardianCrystalsEl = document.getElementById('guardian-reward-crystals');
        const guardianXpEl = document.getElementById('guardian-reward-xp');
        const guardianPowerupSlot = document.getElementById('guardian-reward-powerup');
        const guardianPowerupIcon = document.getElementById('guardian-reward-powerup-icon');
        const guardianPowerupText = document.getElementById('guardian-reward-powerup-text');

        if(rewardsGrid) rewardsGrid.innerHTML = '';


        if (earnedRewards && earnedRewards.length > 0 && rewardsSection) {
            rewardsSection.classList.remove('hidden');
            earnedRewards.forEach(item => {
                const emoji = EMOJI_MAP[item.type] || '\u{1F381}';
                rewardsGrid.innerHTML += `
                    <div class="result-slot reward">
                        <div class="slot-icon">${emoji}</div>
                        <div class="slot-count">+${item.count}</div>
                    </div>`;
            });
        } else if (rewardsSection) {
            rewardsSection.classList.add('hidden');
        }

        if (guardianRewardsSection && this.currentMode === 'adventure') {
            if (rewardsSection) {
                rewardsSection.classList.add('hidden');
                rewardsSection.style.display = 'none';
            }
            const crystalsEarned = this._matchRewards?.crystals || 0;
            const xpEarned = this._matchRewards?.xp || 0;
            if (guardianCrystalsEl) guardianCrystalsEl.textContent = `+${crystalsEarned}`;
            if (guardianXpEl) guardianXpEl.textContent = `+${xpEarned} XP`;

            if (guardianPowerupSlot) {
                const drop = this.rollAdventurePowerupReward();
                if (drop) {
                    const icon = EMOJI_MAP[drop.type] || 'âœ¨';
                    if (guardianPowerupIcon) guardianPowerupIcon.textContent = icon;
                    if (drop.isFull) {
                        guardianPowerupSlot.classList.add('reward-locked');
                        if (guardianPowerupText) guardianPowerupText.textContent = this.getSlotFullLabel();
                    } else {
                        guardianPowerupSlot.classList.remove('reward-locked');
                        if (guardianPowerupText) guardianPowerupText.textContent = '+1';
                    }
                    guardianPowerupSlot.style.display = '';
                } else {
                    guardianPowerupSlot.style.display = 'none';
                }
            }

            guardianRewardsSection.classList.remove('hidden');
            guardianRewardsSection.style.display = '';
        } else if (guardianRewardsSection) {
            guardianRewardsSection.classList.add('hidden');
            guardianRewardsSection.style.display = 'none';
        }

        let nextLevelId = 0;
        if (this.currentMode === 'adventure' && this.currentLevelConfig) {
            nextLevelId = this.currentLevelConfig.id + 1;
            this.saveProgress(nextLevelId);
        }

        const currentWorld = WORLDS.find(w => w.levels.some(l => l.id === this.currentLevelConfig.id));
        let nextLevelConfig = null;
        
        // CORREÃ‡ÃƒO: Ignora busca de prÃ³xima fase se for o GuardiÃ£o (ID 0)
        // Isso garante que ele vÃ¡ para a seleÃ§Ã£o de mundo ver o desbloqueio
        if (currentWorld && this.currentLevelConfig.id !== 0) {
            nextLevelConfig = currentWorld.levels.find(l => l.id === nextLevelId);
        }

        const btnContinue = document.getElementById('btn-next-level');
        if (btnContinue) {
            const newBtn = btnContinue.cloneNode(true);
            btnContinue.parentNode.replaceChild(newBtn, btnContinue);

            newBtn.addEventListener('click', () => {
                if(this.audio) this.audio.playClick();
                modal.classList.add('hidden'); 

                const levelId = this.currentLevelConfig?.id;
                if (levelId === 0 && localStorage.getItem('blocklands_story_guardian_seen') !== 'true') {
                    localStorage.setItem('blocklands_story_guardian_seen', 'true');
                    this.showSingleStory({
                        textKey: 'story_guardian_gate_opening',
                        imageSrc: 'assets/img/story_guardian_gate_opening.webp',
                        onDone: () => {
                            this.showScreen(this.screenLevels);
                            this.showWorldSelect();
                        }
                    });
                    return;
                }

                if (levelId === 20 && localStorage.getItem('blocklands_story_fire_ignis_seen') !== 'true') {
                    localStorage.setItem('blocklands_story_fire_ignis_seen', 'true');
                    this.showSingleStory({
                        textKey: 'story_fire_ignis_aftermath',
                        imageSrc: 'assets/img/story_fire_ignis_aftermath.webp',
                        onDone: () => {
                            this.showScreen(this.screenLevels);
                            this.showWorldSelect();
                        }
                    });
                    return;
                }

                if (levelId === 40 && localStorage.getItem('blocklands_story_forest_aracna_seen') !== 'true') {
                    localStorage.setItem('blocklands_story_forest_aracna_seen', 'true');
                    this.showSingleStory({
                        textKey: 'story_forest_aracna_aftermath',
                        imageSrc: 'assets/img/story_forest_aracna_aftermath.webp',
                        onDone: () => {
                            this.showScreen(this.screenLevels);
                            this.showWorldSelect();
                        }
                    });
                    return;
                }

                if (levelId === 60 && localStorage.getItem('blocklands_story_mountain_golem_seen') !== 'true') {
                    localStorage.setItem('blocklands_story_mountain_golem_seen', 'true');
                    this.showSingleStory({
                        textKey: 'story_mountain_golem_aftermath',
                        imageSrc: 'assets/img/story_mountain_golem_aftermath.webp',
                        onDone: () => {
                            this.showScreen(this.screenLevels);
                            this.showWorldSelect();
                        }
                    });
                    return;
                }

                if (levelId === 80 && localStorage.getItem('blocklands_story_desert_grok_seen') !== 'true') {
                    localStorage.setItem('blocklands_story_desert_grok_seen', 'true');
                    this.showSingleStory({
                        textKey: 'story_desert_grok_aftermath',
                        imageSrc: 'assets/img/story_desert_grok_aftermath.webp',
                        onDone: () => {
                            this.showScreen(this.screenLevels);
                            this.showWorldSelect();
                        }
                    });
                    return;
                }

                if (levelId === 100 && localStorage.getItem('blocklands_story_castle_dark_wizard_seen') !== 'true') {
                    localStorage.setItem('blocklands_story_castle_dark_wizard_seen', 'true');
                    this.showSingleStory({
                        textKey: 'story_castle_dark_wizard_aftermath',
                        imageSrc: 'assets/img/story_castle_dark_wizard_aftermath.webp',
                        onDone: () => {
                            this.showScreen(this.screenLevels);
                            this.showWorldSelect();
                        }
                    });
                    return;
                }

                if (nextLevelConfig) {
                    document.body.className = ''; 
                    this.startAdventureLevel(nextLevelConfig);
                } else {
                    this.showScreen(this.screenLevels); 
                    this.showWorldSelect(); // Vai para a seleÃ§Ã£o de mundos
                }
            });
        }

        const btnBack = document.getElementById('btn-victory-back');
        if (btnBack) {
            const newBack = btnBack.cloneNode(true);
            btnBack.parentNode.replaceChild(newBack, btnBack);

            newBack.addEventListener('click', () => {
                if(this.audio) this.audio.playClick();
                modal.classList.add('hidden'); 
                
                // --- CORREÃ‡ÃƒO DO BOTÃƒO VOLTAR ---
                // Se for o GuardiÃ£o (NÃ­vel 0), volta para o MENU PRINCIPAL
                if (this.currentLevelConfig && this.currentLevelConfig.id === 0) {
                    this.showScreen(this.screenMenu);
                } 
                else {
                    // Se for qualquer outro nÃ­vel, volta para o Mapa
                    this.showScreen(this.screenLevels); 
                    if (currentWorld) {
                        this.openWorldMap(currentWorld);
                    } else {
                        this.showWorldSelect();
                    }
                }
            });
        }

        modal.classList.remove('hidden');
        this._matchRewardsActive = false;
    }
	
    gameOver() {
    if (this._resultResolved) return;
    this._resultResolved = true;
    if (this.modalWin) this.modalWin.classList.add('hidden');

    // Impede qualquer flush/debounce de ressuscitar o save depois da derrota
    this._saveDisabled = true;
    this.cancelPendingSaveGameState();

    if (this.currentMode === 'classic' || this.currentMode === 'casual') {
        if (this.audio) this.audio.stopMusic();
        this._classicXpActive = false;
        this.showClassicResult();
        return;
    }

    // Limpa o save game na derrota para obrigar reinÃ­cio
    this.clearSavedGame();

    // Opcional seguro: invalida cache de vazios (evita qualquer restauraÃ§Ã£o indevida)
    this._emptyCells = null;
    this._emptyCellsDirty = true;

    if (this.audio) this.audio.stopMusic();

    const defeatRewardsSection = document.getElementById('defeat-guardian-rewards');
    const defeatCrystalsEl = document.getElementById('defeat-reward-crystals');
    const defeatXpEl = document.getElementById('defeat-reward-xp');
    const defeatPowerupSlot = document.getElementById('defeat-reward-powerup');
    const defeatPowerupIcon = document.getElementById('defeat-reward-powerup-icon');
    const defeatPowerupText = document.getElementById('defeat-reward-powerup-text');

    if (defeatRewardsSection && this.currentMode === 'adventure') {
        const crystalsEarned = this._matchRewards?.crystals || 0;
        const xpEarned = this._matchRewards?.xp || 0;
        if (defeatCrystalsEl) defeatCrystalsEl.textContent = `+${crystalsEarned}`;
        if (defeatXpEl) defeatXpEl.textContent = `+${xpEarned} XP`;
        if (defeatPowerupSlot) {
            defeatPowerupSlot.style.display = 'none';
            defeatPowerupSlot.classList.remove('reward-locked');
            if (defeatPowerupIcon) defeatPowerupIcon.textContent = 'âœ¨';
            if (defeatPowerupText) defeatPowerupText.textContent = '+1';
        }
        defeatRewardsSection.classList.remove('hidden');
        defeatRewardsSection.style.display = '';
    } else if (defeatRewardsSection) {
        defeatRewardsSection.classList.add('hidden');
        defeatRewardsSection.style.display = 'none';
    }

    this.applyResultImage('defeat');
    this._matchRewardsActive = false;
    if (this.modalOver) this.modalOver.classList.remove('hidden');
}

}



