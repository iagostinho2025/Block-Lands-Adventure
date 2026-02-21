import { getRandomPiece, ITEM_STATS } from './modules/shapes.js';
import { EffectsSystem } from './modules/effects.js';
import { AudioSystem } from './modules/audio.js';
import { PowersSystem } from './modules/powers.js';
import { WORLDS } from './modules/data/levels.js';
import { BOSS_LOGIC } from './modules/logic/bosses.js';
import { I18nSystem } from './modules/i18n.js'; // ADICIONADO: Importacao do sistema de idiomas
import { AchievementSystem } from './modules/achievements.js';
import { PlayerProgression, getRomanNumeral } from './modules/progression.js';
import { BlitzModeController } from './modules/modes/blitz-mode.js';
import {
    saveGameState as persistSaveGameState,
    cancelPendingSaveGameState as persistCancelPendingSaveGameState,
    flushSaveGameState as persistFlushSaveGameState,
    restoreGameState as persistRestoreGameState,
    clearSavedGame as persistClearSavedGame
} from './modules/game/persistence.js';
import {
    showScreen as routeShowScreen,
    toggleGlobalHeader as routeToggleGlobalHeader
} from './modules/game/screen-router.js';
import {
    startBlitzMode as runStartBlitzMode,
    startClassicMode as runStartClassicMode,
    startAdventureLevel as runStartAdventureLevel
} from './modules/game/mode-starters.js';
import {
    getClassicResultImageSrc as runGetClassicResultImageSrc,
    formatDuration as runFormatDuration,
    showClassicResult as runShowClassicResult,
    getResultImageSrc as runGetResultImageSrc,
    applyResultImage as runApplyResultImage,
    gameWon as runGameWon,
    gameOver as runGameOver
} from './modules/game/results.js';
import {
    setupBossUI as runSetupBossUI,
    ensureBossHud as runEnsureBossHud,
    hideBossHud as runHideBossHud,
    getBossHudRefs as runGetBossHudRefs,
    updateBossHud as runUpdateBossHud
} from './modules/game/boss-hud.js';
import {
    showCampfireScene as runShowCampfireScene,
    buildStorySequence as runBuildStorySequence,
    renderStorySlide as runRenderStorySlide,
    showSingleStory as runShowSingleStory,
    showHeroSelection as runShowHeroSelection,
    selectHero as runSelectHero,
    runHeroTransition as runRunHeroTransition,
    checkAdventureIntro as runCheckAdventureIntro,
    playStory as runPlayStory
} from './modules/game/story-flow.js';
import {
    showWorldSelect as runShowWorldSelect,
    setWorldMapBackground as runSetWorldMapBackground
} from './modules/game/world-select.js';
import { openWorldMap as runOpenWorldMap } from './modules/game/world-map.js';
import {
    showAchievementsScreen as runShowAchievementsScreen,
    updateAchievementStats as runUpdateAchievementStats,
    renderAchievementsList as runRenderAchievementsList,
    showStoreScreen as runShowStoreScreen
} from './modules/game/ui-screens.js';
import {
    setupStoreListeners as runSetupStoreListeners,
    setupStoreTabs as runSetupStoreTabs,
    showPurchaseModal as runShowPurchaseModal,
    purchaseProduct as runPurchaseProduct,
    showStoreToast as runShowStoreToast
} from './modules/game/store-actions.js';
import {
    setupGoalsUI as runSetupGoalsUI,
    ensureBoardFrameOnBoard as runEnsureBoardFrameOnBoard,
    removeBoardFrameFromBoard as runRemoveBoardFrameFromBoard
} from './modules/game/gameplay-ui.js';
import {
    queueLayoutGeometryLog as runQueueLayoutGeometryLog,
    logLayoutGeometry as runLogLayoutGeometry,
    queueDockGeometryLog as runQueueDockGeometryLog,
    logDockGeometry as runLogDockGeometry
} from './modules/game/debug-geometry.js';
import {
    beginGoalsBatch as runBeginGoalsBatch,
    endGoalsBatch as runEndGoalsBatch,
    updateGoalsUI as runUpdateGoalsUI,
    checkVictoryConditions as runCheckVictoryConditions
} from './modules/game/goals-flow.js';
import {
    renderHeroUI as runRenderHeroUI,
    activateHeroPower as runActivateHeroPower,
    updateHeroButtonsUI as runUpdateHeroButtonsUI
} from './modules/game/hero-ui.js';
import {
    clearTheme as runClearTheme,
    retryGame as runRetryGame,
    resetGame as runResetGame
} from './modules/game/game-cycle.js';
import {
    ensureFlyerPool as runEnsureFlyerPool,
    getFlySpritePathByKey as runGetFlySpritePathByKey,
    getItemSpritePathByKey as runGetItemSpritePathByKey,
    acquireFlyer as runAcquireFlyer,
    releaseFlyer as runReleaseFlyer
} from './modules/game/flyer-pool.js';
import {
    runFlyAnimation as runRunFlyAnimation,
    shouldSyncBossDamageOnFlyImpact as runShouldSyncBossDamageOnFlyImpact,
    hasPendingBossResolution as runHasPendingBossResolution,
    flushDeferredBossPostChecks as runFlushDeferredBossPostChecks,
    beginSyncedBossImpact as runBeginSyncedBossImpact,
    completeSyncedBossImpact as runCompleteSyncedBossImpact,
    getBossImpactTarget as runGetBossImpactTarget,
    triggerPop as runTriggerPop
} from './modules/game/fly-impact.js';
import {
    ensureBoardClickDelegation as runEnsureBoardClickDelegation,
    ensureBoardCells as runEnsureBoardCells,
    renderCell as runRenderCell
} from './modules/game/board-render.js';
import { renderGrid as runRenderGrid } from './modules/game/render-grid.js';
import { spawnNewHand as runSpawnNewHand } from './modules/game/hand-spawn.js';
import {
    getMovesAvailabilityCacheKey as runGetMovesAvailabilityCacheKey,
    checkMovesAvailable as runCheckMovesAvailable
} from './modules/game/moves-availability.js';
import {
    attachDockFallbackDragEvents as runAttachDockFallbackDragEvents,
    attachDockSlotDragEvents as runAttachDockSlotDragEvents,
    canPlacePieceAnywhere as runCanPlacePieceAnywhere,
    canPlaceSquare3x3Anywhere as runCanPlaceSquare3x3Anywhere
} from './modules/game/dock-placement.js';
import {
    createDraggablePiece as runCreateDraggablePiece,
    getBoardMetrics as runGetBoardMetrics,
    attachDragEvents as runAttachDragEvents,
    moveClone as runMoveClone
} from './modules/game/drag-core.js';
import {
    updateGhostPreview as runUpdateGhostPreview,
    predictClears as runPredictClears,
    drawPredictionHighlights as runDrawPredictionHighlights,
    clearPredictionHighlights as runClearPredictionHighlights,
    drawGhost as runDrawGhost,
    clearGhostPreview as runClearGhostPreview
} from './modules/game/ghost-preview.js';
import {
    canPlace as runCanPlace,
    placePiece as runPlacePiece
} from './modules/game/placement-core.js';
import {
    clearRow as runClearRow,
    clearCol as runClearCol,
    collectItem as runCollectItem
} from './modules/game/line-collection.js';
import {
    processBossTurn as runProcessBossTurn,
    triggerBossAttack as runTriggerBossAttack,
    triggerScreenFlash as runTriggerScreenFlash,
    transformCell as runTransformCell,
    damageBoss as runDamageBoss,
    updateBossUI as runUpdateBossUI
} from './modules/game/boss-combat.js';
import { checkLines as runCheckLines } from './modules/game/line-clear-resolution.js';
import {
    calculateClassicScore as runCalculateClassicScore,
    updateClassicUI as runUpdateClassicUI,
    animateClassicScoreHero as runAnimateClassicScoreHero,
    showClassicScoreDelta as runShowClassicScoreDelta,
    triggerClassicScoreGlow as runTriggerClassicScoreGlow,
    triggerClassicScoreMilestone as runTriggerClassicScoreMilestone,
    updateMissionsUI as runUpdateMissionsUI,
    updateMissionProgress as runUpdateMissionProgress,
    onMissionCompleted as runOnMissionCompleted,
    spawnClassicParticles as runSpawnClassicParticles,
    resetClassicComboTimer as runResetClassicComboTimer,
    showClassicFeedback as runShowClassicFeedback,
    generateMissionPool as runGenerateMissionPool,
    generateRandomMissions as runGenerateRandomMissions,
    isPerfectClear as runIsPerfectClear
} from './modules/game/classic-mode.js';
import {
    updatePowerUpsUI as runUpdatePowerUpsUI,
    activatePowerUp as runActivatePowerUp,
    renderControlsUI as runRenderControlsUI,
    updateControlsVisuals as runUpdateControlsVisuals,
    handleBoardClick as runHandleBoardClick,
    handlePieceClick as runHandlePieceClick,
    isLeftDockSealed as runIsLeftDockSealed,
    sealLeftDock as runSealLeftDock,
    unsealLeftDock as runUnsealLeftDock,
    renderDock as runRenderDock
} from './modules/game/controls-dock.js';
import {
    loadDailyStats as runLoadDailyStats,
    saveDailyStats as runSaveDailyStats,
    resetMatchRewards as runResetMatchRewards,
    getSlotFullLabel as runGetSlotFullLabel,
    rollAdventurePowerupReward as runRollAdventurePowerupReward,
    addCrystals as runAddCrystals,
    updateCrystalDisplay as runUpdateCrystalDisplay,
    animateCrystalCounter as runAnimateCrystalCounter,
    showCrystalNotification as runShowCrystalNotification,
    getCrystalReasonText as runGetCrystalReasonText,
    checkFirstWinOfDay as runCheckFirstWinOfDay,
    rewardAdventureLevel as runRewardAdventureLevel,
    checkClassicScoreRewards as runCheckClassicScoreRewards,
    rewardNewRecord as runRewardNewRecord,
    rewardMissionComplete as runRewardMissionComplete,
    rewardAllMissionsComplete as runRewardAllMissionsComplete,
    rewardWorldUnlocked as runRewardWorldUnlocked
} from './modules/game/economy-rewards.js';
import {
    preloadImage as runPreloadImage,
    preloadImageList as runPreloadImageList,
    preloadDeferredAssets as runPreloadDeferredAssets,
    loadPowerUps as runLoadPowerUps,
    savePowerUps as runSavePowerUps
} from './modules/game/assets-powerups.js';
import {
    startLoadingSequence as runStartLoadingSequence,
    setupMenuEvents as runSetupMenuEvents,
    setupSettingsLogic as runSetupSettingsLogic,
    buildDiagnosticsReport as runBuildDiagnosticsReport,
    copyDiagnosticsReport as runCopyDiagnosticsReport
} from './modules/game/menu-settings.js';
import {
    updateClassicThemeClass as runUpdateClassicThemeClass,
    setClassicTheme as runSetClassicTheme,
    handleUnlockableSelection as runHandleUnlockableSelection,
    updateStoreUnlockablesUI as runUpdateStoreUnlockablesUI,
    updateWorldClass as runUpdateWorldClass,
    getInfoCardId as runGetInfoCardId,
    updateInfoHelpIcon as runUpdateInfoHelpIcon,
    renderInfoCard as runRenderInfoCard,
    openInfoCard as runOpenInfoCard,
    closeInfoCard as runCloseInfoCard,
    maybeShowInfoCard as runMaybeShowInfoCard
} from './modules/game/world-info-theme.js';
import {
    perfStart as runPerfStart,
    perfEnd as runPerfEnd,
    initPerformanceMode as runInitPerformanceMode,
    applyPerformancePreference as runApplyPerformancePreference,
    applyPerformanceClass as runApplyPerformanceClass,
    ensurePerfIndicator as runEnsurePerfIndicator,
    updatePerfIndicator as runUpdatePerfIndicator,
    startFpsMonitor as runStartFpsMonitor,
    stopFpsMonitor as runStopFpsMonitor,
    restartCssAnimationClass as runRestartCssAnimationClass
} from './modules/game/performance-runtime.js';
import {
    getCurrentWorld as runGetCurrentWorld,
    getCurrentWorldConfig as runGetCurrentWorldConfig,
    applyBossSprite as runApplyBossSprite,
    applyGuardianBossSprite as runApplyGuardianBossSprite
} from './modules/game/boss-sprite.js';
import {
    getFireBossOverlayConfig as runGetFireBossOverlayConfig,
    isIgnisBossPhase20 as runIsIgnisBossPhase20,
    updateIgnisBossUiOverride as runUpdateIgnisBossUiOverride,
    ensureIgnisSpriteOverlay as runEnsureIgnisSpriteOverlay,
    teardownIgnisSpriteOverlay as runTeardownIgnisSpriteOverlay,
    syncIgnisSpriteOverlay as runSyncIgnisSpriteOverlay,
    clearBossNameLetterIntro as runClearBossNameLetterIntro,
    buildBossNameOffsets as runBuildBossNameOffsets,
    getBossNameFirstVisibleOffset as runGetBossNameFirstVisibleOffset,
    playBossNameIntroToHud as runPlayBossNameIntroToHud
} from './modules/game/boss-overlay-intro.js';
import {
    loadSettings as runLoadSettings,
    saveSettings as runSaveSettings,
    applySettings as runApplySettings,
    loadProgress as runLoadProgress,
    saveProgress as runSaveProgress,
    isAdventureLevelUnlocked as runIsAdventureLevelUnlocked,
    getCompletedAdventureLevels as runGetCompletedAdventureLevels,
    markAdventureLevelCompleted as runMarkAdventureLevelCompleted,
    initProgressionUI as runInitProgressionUI,
    updateProgressionUI as runUpdateProgressionUI,
    awardXP as runAwardXP,
    showLevelUpToast as runShowLevelUpToast,
    showRankUpModal as runShowRankUpModal
} from './modules/game/settings-progression.js';
import './modules/enemy-sprites.js';

const DEBUG_BOSS_HUD = false;
const DEBUG_LAYOUT_GEOMETRY = false;
const DEBUG_DOCK_GEOMETRY = false;
const DEBUG_UNLOCK_ALL_ADVENTURE = true;
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
    'power_thorns': '\u{1F33F}',
    'claw': '\u{1F43E}',
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
    stone: 'assets/enemies/fire_world/obstacle_stone.webp',
    // Forest world
    leaf: 'assets/enemies/forest_world/item_leaf.webp',
    poison: 'assets/enemies/forest_world/item_poison.webp',
    mushroom: 'assets/enemies/forest_world/item_mushroom.webp',
    thorns: 'assets/enemies/forest_world/obstacle_thorns.webp',
    power_thorns: 'assets/enemies/forest_world/power_thorns.webp',
    claw: 'assets/enemies/forest_world/item_claw.webp',
    web: 'assets/enemies/forest_world/obstacle_web.webp',
    // Mountain world (fallback default)
    gold: 'assets/enemies/mountain_world/item_collect_common.webp',
    pickaxe: 'assets/enemies/mountain_world/item_collect_rare.webp',
    iron: 'assets/enemies/mountain_world/item_collect_epic.webp',
    rocks: 'assets/enemies/mountain_world/item_obstaculo.webp',
    debris: 'assets/enemies/mountain_world/item_obstaculo.webp',
    // Desert world (fallback default)
    bone: 'assets/enemies/desert_world/item_collect_common.webp',
    sand: 'assets/enemies/desert_world/item_collect_rare.webp',
    skull: 'assets/enemies/desert_world/item_collect_epic.webp',
    quicksand: 'assets/enemies/desert_world/item_obstaculo.webp',
    sandstorm: 'assets/enemies/desert_world/item_obstaculo.webp'
};

const MOUNTAIN_COLLECT_SPRITES = {
    gold: 'assets/enemies/mountain_world/item_collect_common.webp',
    pickaxe: 'assets/enemies/mountain_world/item_collect_rare.webp',
    iron: 'assets/enemies/mountain_world/item_collect_epic.webp'
};

const MOUNTAIN_DAMAGE_SPRITES = {
    gold: 'assets/enemies/mountain_world/item_damage_common.webp',
    pickaxe: 'assets/enemies/mountain_world/item_damage_rare.webp',
    iron: 'assets/enemies/mountain_world/item_damage_epic.webp'
};

const DESERT_COLLECT_SPRITES = {
    bone: 'assets/enemies/desert_world/item_collect_common.webp',
    sand: 'assets/enemies/desert_world/item_collect_rare.webp',
    skull: 'assets/enemies/desert_world/item_collect_epic.webp'
};

const DESERT_DAMAGE_SPRITES = {
    bone: 'assets/enemies/desert_world/item_damage_common.webp',
    sand: 'assets/enemies/desert_world/item_damage_rare.webp',
    skull: 'assets/enemies/desert_world/item_damage_epic.webp'
};

const WORLD_CONTEXTUAL_ITEM_SPRITES = {
    mountain_world: {
        normal: MOUNTAIN_COLLECT_SPRITES,
        combat: MOUNTAIN_DAMAGE_SPRITES
    },
    desert_world: {
        normal: DESERT_COLLECT_SPRITES,
        combat: DESERT_DAMAGE_SPRITES
    }
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
        sealFallback: 'assets/img/icon_world_fire.webp',
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
        sealFallback: 'assets/img/icon_world_fire.webp',
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
        sealFallback: 'assets/img/icon_world_fire.webp',
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
        sealFallback: 'assets/img/icon_world_forest.webp',
        sealAltKey: 'forest_info.elite30.title',
        titleKey: 'forest_info.elite30.title',
        subtitleKey: 'forest_info.elite30.subtitle',
        storyKey: 'forest_info.elite30.story',
        bossPowers: [
            { iconImage: 'assets/enemies/forest_world/item_claw.webp', iconAlt: 'Garras Selvagens', titleKey: 'forest_info.elite30.boss.thorns_title', descKey: 'forest_info.elite30.boss.thorns_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/forest_world/item_leaf.webp', iconAlt: 'Adaga magica', titleKey: 'forest_info.items.leaf_title', descKey: 'forest_info.items.leaf_desc' },
            { iconImage: 'assets/enemies/forest_world/item_poison.webp', iconAlt: 'Clava de Sylvaris', titleKey: 'forest_info.items.poison_title', descKey: 'forest_info.items.poison_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    forest_elite_35: {
        sealImage: 'assets/enemies/forest_world/elite_15.webp',
        sealFallback: 'assets/img/icon_world_forest.webp',
        sealAltKey: 'forest_info.elite35.title',
        titleKey: 'forest_info.elite35.title',
        subtitleKey: 'forest_info.elite35.subtitle',
        storyKey: 'forest_info.elite35.story',
        bossPowers: [
            { iconImage: 'assets/enemies/forest_world/obstacle_web.webp', iconAlt: 'Teias Paralizantes', titleKey: 'forest_info.elite35.boss.roots_title', descKey: 'forest_info.elite35.boss.roots_desc' },
            { icon: '\u{1FA79}', titleKey: 'forest_info.elite35.boss.regen_title', descKey: 'forest_info.elite35.boss.regen_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/forest_world/item_leaf.webp', iconAlt: 'Adaga magica', titleKey: 'forest_info.items.leaf_title', descKey: 'forest_info.items.leaf_desc' },
            { iconImage: 'assets/enemies/forest_world/item_poison.webp', iconAlt: 'Clava de Sylvaris', titleKey: 'forest_info.items.poison_title', descKey: 'forest_info.items.poison_desc' },
            { iconImage: 'assets/enemies/forest_world/item_mushroom.webp', iconAlt: 'Espinho Mortal', titleKey: 'forest_info.items.mushroom_title', descKey: 'forest_info.items.mushroom_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    forest_boss_40: {
        sealImage: 'assets/enemies/forest_world/boss.webp',
        sealFallback: 'assets/img/icon_world_forest.webp',
        sealAltKey: 'forest_info.boss40.title',
        titleKey: 'forest_info.boss40.title',
        subtitleKey: 'forest_info.boss40.subtitle',
        storyKey: 'forest_info.boss40.story',
        bossPowers: [
            { iconImage: 'assets/enemies/forest_world/obstacle_thorns.webp', iconAlt: 'Arvores Antigas', titleKey: 'forest_info.boss40.boss.thorns_title', descKey: 'forest_info.boss40.boss.thorns_desc' },
            { icon: '\u{1FA79}', titleKey: 'forest_info.boss40.boss.roots_title', descKey: 'forest_info.boss40.boss.roots_desc' },
            { iconImage: 'assets/enemies/forest_world/power_thorns.webp', iconAlt: 'Selo Espinhoso', titleKey: 'forest_info.boss40.boss.web_title', descKey: 'forest_info.boss40.boss.web_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/forest_world/item_leaf.webp', iconAlt: 'Adaga magica', titleKey: 'forest_info.items.leaf_title', descKey: 'forest_info.items.leaf_desc' },
            { iconImage: 'assets/enemies/forest_world/item_poison.webp', iconAlt: 'Clava de Sylvaris', titleKey: 'forest_info.items.poison_title', descKey: 'forest_info.items.poison_desc' },
            { iconImage: 'assets/enemies/forest_world/item_mushroom.webp', iconAlt: 'Espinho Mortal', titleKey: 'forest_info.items.mushroom_title', descKey: 'forest_info.items.mushroom_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    mountain_elite_50: {
        sealImage: 'assets/enemies/mountain_world/elite_10.webp',
        sealFallback: 'assets/img/icon_world_mountain.webp',
        sealAltKey: 'mountain_info.elite50.title',
        titleKey: 'mountain_info.elite50.title',
        subtitleKey: 'mountain_info.elite50.subtitle',
        storyKey: 'mountain_info.elite50.story',
        bossPowers: [
            { icon: '\u{1FAA8}', titleKey: 'mountain_info.elite50.boss.rocks_title', descKey: 'mountain_info.elite50.boss.rocks_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/mountain_world/item_damage_common.webp', iconAlt: 'Item comum de dano', titleKey: 'mountain_info.items.gold_title', descKey: 'mountain_info.items.gold_desc' },
            { iconImage: 'assets/enemies/mountain_world/item_damage_rare.webp', iconAlt: 'Item raro de dano', titleKey: 'mountain_info.items.pickaxe_title', descKey: 'mountain_info.items.pickaxe_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    mountain_elite_55: {
        sealImage: 'assets/enemies/mountain_world/elite_15.webp',
        sealFallback: 'assets/img/icon_world_mountain.webp',
        sealAltKey: 'mountain_info.elite55.title',
        titleKey: 'mountain_info.elite55.title',
        subtitleKey: 'mountain_info.elite55.subtitle',
        storyKey: 'mountain_info.elite55.story',
        bossPowers: [
            { icon: '\u{1FAA8}', titleKey: 'mountain_info.elite55.boss.crush_title', descKey: 'mountain_info.elite55.boss.crush_desc' },
            { icon: '\u{1F6E1}\u{FE0F}', titleKey: 'mountain_info.elite55.boss.armor_title', descKey: 'mountain_info.elite55.boss.armor_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/mountain_world/item_damage_common.webp', iconAlt: 'Item comum de dano', titleKey: 'mountain_info.items.gold_title', descKey: 'mountain_info.items.gold_desc' },
            { iconImage: 'assets/enemies/mountain_world/item_damage_rare.webp', iconAlt: 'Item raro de dano', titleKey: 'mountain_info.items.pickaxe_title', descKey: 'mountain_info.items.pickaxe_desc' },
            { iconImage: 'assets/enemies/mountain_world/item_damage_epic.webp', iconAlt: 'Item epico de dano', titleKey: 'mountain_info.items.iron_title', descKey: 'mountain_info.items.iron_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    mountain_boss_60: {
        sealImage: 'assets/enemies/mountain_world/boss.webp',
        sealFallback: 'assets/img/icon_world_mountain.webp',
        sealAltKey: 'mountain_info.boss60.title',
        titleKey: 'mountain_info.boss60.title',
        subtitleKey: 'mountain_info.boss60.subtitle',
        storyKey: 'mountain_info.boss60.story',
        bossPowers: [
            { icon: '\u{1FAA8}', titleKey: 'mountain_info.boss60.boss.rocks_title', descKey: 'mountain_info.boss60.boss.rocks_desc' },
            { icon: '\u{1FAA8}', titleKey: 'mountain_info.boss60.boss.crush_title', descKey: 'mountain_info.boss60.boss.crush_desc' },
            { icon: '\u{1F4A5}', titleKey: 'mountain_info.boss60.boss.quake_title', descKey: 'mountain_info.boss60.boss.quake_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/mountain_world/item_damage_common.webp', iconAlt: 'Item comum de dano', titleKey: 'mountain_info.items.gold_title', descKey: 'mountain_info.items.gold_desc' },
            { iconImage: 'assets/enemies/mountain_world/item_damage_rare.webp', iconAlt: 'Item raro de dano', titleKey: 'mountain_info.items.pickaxe_title', descKey: 'mountain_info.items.pickaxe_desc' },
            { iconImage: 'assets/enemies/mountain_world/item_damage_epic.webp', iconAlt: 'Item epico de dano', titleKey: 'mountain_info.items.iron_title', descKey: 'mountain_info.items.iron_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    desert_elite_70: {
        sealImage: 'assets/enemies/desert_world/elite_10.webp',
        sealFallback: 'assets/img/icon_world_desert.webp',
        sealAltKey: 'desert_info.elite70.title',
        titleKey: 'desert_info.elite70.title',
        subtitleKey: 'desert_info.elite70.subtitle',
        storyKey: 'desert_info.elite70.story',
        bossPowers: [
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.elite70.boss.quicksand_title', descKey: 'desert_info.elite70.boss.quicksand_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/desert_world/item_damage_common.webp', iconAlt: 'Item comum de dano', titleKey: 'desert_info.items.bone_title', descKey: 'desert_info.items.bone_desc' },
            { iconImage: 'assets/enemies/desert_world/item_damage_rare.webp', iconAlt: 'Item raro de dano', titleKey: 'desert_info.items.sand_title', descKey: 'desert_info.items.sand_desc' },
            { iconImage: 'assets/enemies/desert_world/item_damage_epic.webp', iconAlt: 'Item epico de dano', titleKey: 'desert_info.items.skull_title', descKey: 'desert_info.items.skull_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    desert_elite_75: {
        sealImage: 'assets/enemies/desert_world/elite_15.webp',
        sealFallback: 'assets/img/icon_world_desert.webp',
        sealAltKey: 'desert_info.elite75.title',
        titleKey: 'desert_info.elite75.title',
        subtitleKey: 'desert_info.elite75.subtitle',
        storyKey: 'desert_info.elite75.story',
        bossPowers: [
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.elite75.boss.sand_poison_title', descKey: 'desert_info.elite75.boss.sand_poison_desc' },
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.elite75.boss.quicksand_title', descKey: 'desert_info.elite75.boss.quicksand_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/desert_world/item_damage_common.webp', iconAlt: 'Item comum de dano', titleKey: 'desert_info.items.bone_title', descKey: 'desert_info.items.bone_desc' },
            { iconImage: 'assets/enemies/desert_world/item_damage_rare.webp', iconAlt: 'Item raro de dano', titleKey: 'desert_info.items.sand_title', descKey: 'desert_info.items.sand_desc' },
            { iconImage: 'assets/enemies/desert_world/item_damage_epic.webp', iconAlt: 'Item epico de dano', titleKey: 'desert_info.items.skull_title', descKey: 'desert_info.items.skull_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    desert_boss_80: {
        sealImage: 'assets/enemies/desert_world/boss.webp',
        sealFallback: 'assets/img/icon_world_desert.webp',
        sealAltKey: 'desert_info.boss80.title',
        titleKey: 'desert_info.boss80.title',
        subtitleKey: 'desert_info.boss80.subtitle',
        storyKey: 'desert_info.boss80.story',
        bossPowers: [
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.boss80.boss.bone_quicksand_title', descKey: 'desert_info.boss80.boss.bone_quicksand_desc' },
            { icon: '\u{1F3DC}\u{FE0F}', titleKey: 'desert_info.boss80.boss.sand_quicksand_title', descKey: 'desert_info.boss80.boss.sand_quicksand_desc' },
            { icon: '\u{1F32A}\u{FE0F}', titleKey: 'desert_info.boss80.boss.sandstorm_title', descKey: 'desert_info.boss80.boss.sandstorm_desc' }
        ],
        items: [
            { iconImage: 'assets/enemies/desert_world/item_damage_common.webp', iconAlt: 'Item comum de dano', titleKey: 'desert_info.items.bone_title', descKey: 'desert_info.items.bone_desc' },
            { iconImage: 'assets/enemies/desert_world/item_damage_rare.webp', iconAlt: 'Item raro de dano', titleKey: 'desert_info.items.sand_title', descKey: 'desert_info.items.sand_desc' },
            { iconImage: 'assets/enemies/desert_world/item_damage_epic.webp', iconAlt: 'Item epico de dano', titleKey: 'desert_info.items.skull_title', descKey: 'desert_info.items.skull_desc' }
        ],
        heroes: INFO_CARD_HEROES
    },
    castle_elite_90: {
        sealImage: 'assets/enemies/castle_world/elite_10.webp',
        sealFallback: 'assets/img/icon_world_castle.webp',
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
        sealFallback: 'assets/img/icon_world_castle.webp',
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
        sealFallback: 'assets/img/icon_world_castle.webp',
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
        icon: '\u{1F4CE}',
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
        
        // Configuracoes Padrao
        this.settings = {
            music: true,
            sfx: true,
            haptics: true,
            performanceMode: 'auto'
        };
        this.loadSettings(); 
        
        // --- NOVO: Carrega a classe do jogador (se ja escolheu) ---
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

        // Estado do modo classico
        this.classicState = {
            score: 0,
            level: 1,
            linesCleared: 0,
            bestScore: parseInt(localStorage.getItem('classic_best_score') || '0'),
            comboStreak: 0,
            comboTimer: null,
            recordBeaten: false, // Flag para controlar se ja mostrou mensagem de recorde
            visualV1: true, // Feature flag para efeitos visuais premium (true = ativado)
            missions: [],
            missionsBestStreak: parseInt(localStorage.getItem('classic_missions_best_streak') || '0'),
            missionsTotal: parseInt(localStorage.getItem('classic_missions_total') || '0'),
            missionRewardActive: false,
            missionRewardMultiplier: 1.0,
            missionRewardEndTime: null
        };

        // Tema visual do modo classico (liberado para troca livre)
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

        // Power-Ups (inicializado vazio, sera carregado do localStorage)
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

        // Estatisticas para economia
        this.dailyStats = this.loadDailyStats();
        this.classicState.lastScoreMilestone = 0; // Controla cristais por pontuacao
        // Controle da Historia
        this.storyStep = 0; // Para controlar os slides

        this.setupMenuEvents();
        this.startLoadingSequence();
        this.updateCrystalDisplay();

        this.initProgressionUI();

        // Cache de metricas do tabuleiro (para evitar layout reads frequentes no drag)
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

        // Resultado do modo classico
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
        return runPerfStart(this, label);
    }

    perfEnd(label, startTime) {
        runPerfEnd(this, label, startTime);
    }

    initPerformanceMode() {
        runInitPerformanceMode(this);
    }

    applyPerformancePreference() {
        runApplyPerformancePreference(this);
    }

    applyPerformanceClass() {
        runApplyPerformanceClass(this);
    }

    ensurePerfIndicator() {
        return runEnsurePerfIndicator(this, { fpsIndicatorEnabled: FPS_INDICATOR_ENABLED });
    }

    updatePerfIndicator(fpsValue) {
        runUpdatePerfIndicator(this, fpsValue);
    }

    startFpsMonitor() {
        runStartFpsMonitor(this, {
            perfLiteFpsDowngrade: PERF_LITE_FPS_DOWNGRADE,
            perfLiteFpsRecover: PERF_LITE_FPS_RECOVER,
            perfLiteDowngradeFrames: PERF_LITE_DOWNGRADE_FRAMES,
            perfLiteRecoverFrames: PERF_LITE_RECOVER_FRAMES,
            fpsIndicatorEnabled: FPS_INDICATOR_ENABLED
        });
    }

    stopFpsMonitor() {
        runStopFpsMonitor(this);
    }

    restartCssAnimationClass(el, className) {
        runRestartCssAnimationClass(this, el, className);
    }
	
    // --- PERSISTENCIA DE ESTADO (SAVE GAME) ---

    saveGameState() {
        persistSaveGameState(this);
    }

cancelPendingSaveGameState() {
        persistCancelPendingSaveGameState(this);
    }

flushSaveGameState() {
        persistFlushSaveGameState(this);
    }

	// --- HELPER: GET CURRENT WORLD ---
	getCurrentWorld() {
		return runGetCurrentWorld(this);
	}

	getCurrentWorldConfig() {
		return runGetCurrentWorldConfig(this);
	}



	applyBossSprite(avatarElement) {
		runApplyBossSprite(this, avatarElement);
	}

    getFireBossOverlayConfig() {
        return runGetFireBossOverlayConfig(this);
    }

    isIgnisBossPhase20() {
        return runIsIgnisBossPhase20(this);
    }

    updateIgnisBossUiOverride() {
        runUpdateIgnisBossUiOverride(this);
    }

    ensureIgnisSpriteOverlay() {
        runEnsureIgnisSpriteOverlay(this);
    }

    teardownIgnisSpriteOverlay() {
        runTeardownIgnisSpriteOverlay(this);
    }

    syncIgnisSpriteOverlay() {
        runSyncIgnisSpriteOverlay(this);
    }


    clearBossNameLetterIntro() {
        runClearBossNameLetterIntro(this);
    }


    buildBossNameOffsets(text, advance) {
        return runBuildBossNameOffsets(this, text, advance);
    }


    getBossNameFirstVisibleOffset(text, advance) {
        return runGetBossNameFirstVisibleOffset(this, text, advance);
    }

    playBossNameIntroToHud({ bossName, targetX, targetY, overlayCfg, nameEl, introKey }) {
        runPlayBossNameIntroToHud(this, { bossName, targetX, targetY, overlayCfg, nameEl, introKey });
    }

	applyGuardianBossSprite(avatarElement) {
		runApplyGuardianBossSprite(this, avatarElement);
	}

	// --- NOVO SISTEMA DE HISTORIA E SELECAO ---

	showCampfireScene() {
        runShowCampfireScene(this);
    }

    playStory() {
        runPlayStory(this);
    }

    buildStorySequence(includeAfter = false) {
        return runBuildStorySequence(this, includeAfter);
    }

    renderStorySlide() {
        runRenderStorySlide(this);
    }

    showSingleStory({ textKey, imageSrc, onDone }) {
        runShowSingleStory(this, { textKey, imageSrc, onDone });
    }

    showHeroSelection() {
        runShowHeroSelection(this);
    }

    selectHero(heroId) {
        runSelectHero(this, heroId);
    }
	
	runHeroTransition(heroId) {
        runRunHeroTransition(this, heroId);
    }

    restoreGameState(targetLevelId) {
        return persistRestoreGameState(this, targetLevelId);
    }


    clearSavedGame() {
        persistClearSavedGame(this);
    }


    loadSettings() {
        runLoadSettings(this);
    }

    saveSettings() {
        runSaveSettings(this);
    }

    applySettings() {
        runApplySettings(this);
    }

    loadProgress() {
        return runLoadProgress(this);
    }

    saveProgress(levelId) {
        runSaveProgress(this, levelId);
    }

    isAdventureLevelUnlocked(levelId) {
        return runIsAdventureLevelUnlocked(this, levelId, {
            debugUnlockAllAdventure: DEBUG_UNLOCK_ALL_ADVENTURE
        });
    }

    usesAdventureUnlockDebug() {
        return DEBUG_UNLOCK_ALL_ADVENTURE === true;
    }

    getCompletedAdventureLevels() {
        return runGetCompletedAdventureLevels(this);
    }

    markAdventureLevelCompleted(levelId) {
        runMarkAdventureLevelCompleted(this, levelId);
    }

    // ============================================
    // SISTEMA DE CRISTAIS - ECONOMIA DO JOGO
    // ============================================

    /**
     * Carrega estatisticas diarias para controle de primeira vitoria do dia
     */
    loadDailyStats() {
        return runLoadDailyStats(this);
    }

    /**
     * Salva estatisticas diarias
     */
    saveDailyStats(stats) {
        runSaveDailyStats(this, stats);
    }

    resetMatchRewards() {
        runResetMatchRewards(this);
    }

    getSlotFullLabel() {
        return runGetSlotFullLabel(this);
    }

    rollAdventurePowerupReward() {
        return runRollAdventurePowerupReward(this, { maxPowerupCount: MAX_POWERUP_COUNT });
    }

    /**
     * Adiciona cristais ao saldo do jogador
     * @param {number} amount - Quantidade de cristais a adicionar
     * @param {string} reason - Motivo do ganho (para log/analytics)
     * @param {boolean} animated - Se deve mostrar animacao
     */
    addCrystals(amount, reason = 'unknown', animated = true) {
        runAddCrystals(this, amount, reason, animated, { runtimeLogs: RUNTIME_LOGS });
    }

    /**
     * Atualiza o display de cristais na UI (menu + tela de jogo)
     * @param {number|null} fromValue - Valor inicial para animacao (null = sem animacao)
     */
    updateCrystalDisplay(fromValue = null) {
        runUpdateCrystalDisplay(this, fromValue);
    }

    initProgressionUI() {
        runInitProgressionUI(this);
    }

    updateProgressionUI(snapshot) {
        runUpdateProgressionUI(this, snapshot, { getRomanNumeral });
    }

    awardXP(amount, reason) {
        runAwardXP(this, amount, reason);
    }

    showLevelUpToast(snapshot) {
        runShowLevelUpToast(this, snapshot);
    }

    showRankUpModal(snapshot) {
        runShowRankUpModal(this, snapshot);
    }


    /**
     * Anima o contador de cristais de um valor para outro
     */
    animateCrystalCounter(from, to) {
        runAnimateCrystalCounter(this, from, to);
    }

    /**
     * Mostra notificacao visual de ganho de cristais
     * DESABILITADO: Notificacoes popup causam conflito com fluxo do jogo
     */
    showCrystalNotification(amount, reason) {
        runShowCrystalNotification(this, amount, reason, { runtimeLogs: RUNTIME_LOGS });
    }

    /**
     * Retorna texto traduzido para o motivo do ganho
     */
    getCrystalReasonText(reason) {
        return runGetCrystalReasonText(this, reason);
    }

    /**
     * Verifica e recompensa cristais por primeira vitoria do dia
     */
    checkFirstWinOfDay() {
        return runCheckFirstWinOfDay(this);
    }

    /**
     * Processa recompensas de cristais por completar nivel (Modo Aventura)
     */
    rewardAdventureLevel(stars) {
        runRewardAdventureLevel(this, stars);
    }

    /**
     * Processa recompensas de cristais por pontuacao (modo classico)
     */
    checkClassicScoreRewards() {
        runCheckClassicScoreRewards(this);
    }

    /**
     * Processa recompensas por novo recorde (modo classico)
     */
    rewardNewRecord() {
        runRewardNewRecord(this);
    }

    /**
     * Processa recompensas por completar missao (modo classico)
     */
    rewardMissionComplete() {
        runRewardMissionComplete(this);
    }

    /**
     * Processa recompensas por completar todas as 3 missoes (Modo Classico)
     */
    rewardAllMissionsComplete() {
        runRewardAllMissionsComplete(this);
    }

    /**
     * Processa recompensas por desbloquear novo mundo
     */
    rewardWorldUnlocked() {
        runRewardWorldUnlocked(this);
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
                'assets/img/icon_world_tutorial.webp',
                'assets/img/icon_world_fire.webp',
                'assets/img/icon_world_forest.webp',
                'assets/img/icon_world_desert.webp',
                'assets/img/icon_world_castle.webp',
                'assets/img/icon_world_mountain.webp'
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
        return runPreloadImage(this, src);
    }

    preloadImageList(list = []) {
        return runPreloadImageList(this, list);
    }

    preloadDeferredAssets(scope = 'background_all') {
        runPreloadDeferredAssets(this, scope);
    }
    
    // --- Carregar PowerUps ---
    loadPowerUps() {
        runLoadPowerUps(this, { maxPowerupCount: MAX_POWERUP_COUNT });
    }

    savePowerUps() {
        runSavePowerUps(this);
    }
	
	// --- SEQUENCIA VISUAL INTELIGENTE ---
    startLoadingSequence() {
        runStartLoadingSequence(this);
    }

    setupMenuEvents() {
        runSetupMenuEvents(this);
    }

    // --- NOVO: Logica da tela de configuracoes ---
    setupSettingsLogic() {
        runSetupSettingsLogic(this);
    }

    buildDiagnosticsReport() {
        return runBuildDiagnosticsReport(this);
    }

    async copyDiagnosticsReport(report) {
        return runCopyDiagnosticsReport(this, report);
    }

    // --- NOVO: Verifica se o jogador ja viu a intro ---
    checkAdventureIntro() {
        runCheckAdventureIntro(this);
    }

    // --- NOVO: Exibe a tela de historia ---
    playStory(options = {}) {
        runPlayStory(this, options);
    }

    // --- POWER-UP LOGIC ---

    updatePowerUpsUI() {
        runUpdatePowerUpsUI(this);
    }

    activatePowerUp(type) {
        runActivatePowerUp(this, type);
    }
	
	renderControlsUI() {
        runRenderControlsUI(this);
    }


    updateControlsVisuals() {
        runUpdateControlsVisuals(this);
    }

	

    handleBoardClick(r, c) {
        runHandleBoardClick(this, r, c);
    }

    handlePieceClick(index) {
        runHandlePieceClick(this, index);
    }

    isLeftDockSealed() {
        return runIsLeftDockSealed(this);
    }

    sealLeftDock() {
        return runSealLeftDock(this);
    }

    unsealLeftDock() {
        return runUnsealLeftDock(this);
    }

    
    renderDock() {
        runRenderDock(this);
    }


    // --- GERENCIAMENTO DE TELAS ---
    showScreen(screenEl) {
        routeShowScreen(this, screenEl);
    }

    toggleGlobalHeader(show) {
        routeToggleGlobalHeader(show);
    }

    // ========================================
    // TEMAS DO modo classico
    // ========================================
    updateClassicThemeClass() {
        runUpdateClassicThemeClass(this, {
            classicThemeClasses: CLASSIC_THEME_CLASSES,
            classicDefaultTheme: CLASSIC_DEFAULT_THEME,
            classicThemeStorageKey: CLASSIC_THEME_STORAGE_KEY
        });
    }

    setClassicTheme(themeId) {
        runSetClassicTheme(this, themeId, {
            classicThemeClasses: CLASSIC_THEME_CLASSES,
            classicThemeStorageKey: CLASSIC_THEME_STORAGE_KEY
        });
    }

    handleUnlockableSelection(unlockableId) {
        runHandleUnlockableSelection(this, unlockableId, {
            classicThemeUnlockables: CLASSIC_THEME_UNLOCKABLES
        });
    }

    updateStoreUnlockablesUI() {
        runUpdateStoreUnlockablesUI(this, {
            classicThemeUnlockables: CLASSIC_THEME_UNLOCKABLES
        });
    }

    // ========================================
    // ATUALIZA CLASSE DE MUNDO NO #APP
    // ========================================
    updateWorldClass() {
        runUpdateWorldClass(this, {
            runtimeLogs: RUNTIME_LOGS,
            debugBossHud: DEBUG_BOSS_HUD
        });
    }

    getInfoCardId() {
        return runGetInfoCardId(this);
    }

    updateInfoHelpIcon() {
        runUpdateInfoHelpIcon(this);
    }

    renderInfoCard(infoId) {
        runRenderInfoCard(this, infoId, { infoCardData: INFO_CARD_DATA });
    }

    openInfoCard() {
        runOpenInfoCard(this);
    }

    closeInfoCard() {
        runCloseInfoCard(this);
    }

    getClassicResultImageSrc() {
        return runGetClassicResultImageSrc(this);
    }

    formatDuration(ms) {
        return runFormatDuration(ms);
    }

    showClassicResult() {
        runShowClassicResult(this);
    }

    maybeShowInfoCard() {
        runMaybeShowInfoCard(this);
    }

    // --- MUNDOS E N?VEIS ---

    showWorldSelect() {
        runShowWorldSelect(this);
    }

    showAchievementsScreen(initialFilter = 'classic') {
        runShowAchievementsScreen(this, initialFilter);
    }

    updateAchievementStats(mode) {
        runUpdateAchievementStats(this, mode);
    }

    renderAchievementsList(mode) {
        runRenderAchievementsList(this, mode);
    }

    // ============================================
    // LOJA DE MESTRES
    // ============================================

    showStoreScreen() {
        runShowStoreScreen(this);
    }

    setupStoreListeners() {
        runSetupStoreListeners(this, {
            storeProducts: STORE_PRODUCTS,
            runtimeLogs: RUNTIME_LOGS
        });
    }

    setupStoreTabs() {
        runSetupStoreTabs(this);
    }


    showPurchaseModal(product) {
        runShowPurchaseModal(this, product, { runtimeLogs: RUNTIME_LOGS });
    }

    purchaseProduct(product) {
        return runPurchaseProduct(this, product, {
            maxPowerupCount: MAX_POWERUP_COUNT,
            runtimeLogs: RUNTIME_LOGS
        });
    }

    showStoreToast(message, type = 'success') {
        runShowStoreToast(this, message, type);
    }

    setWorldMapBackground(mapElement, worldConfig) {
        runSetWorldMapBackground(this, mapElement, worldConfig);
    }

    openWorldMap(worldConfig) {
        runOpenWorldMap(this, worldConfig);
    }

    // --- GAMEPLAY CORE ---

    setupGoalsUI(goalsConfig) {
        runSetupGoalsUI(this, goalsConfig, {
            debugBossHud: DEBUG_BOSS_HUD,
            emojiMap: EMOJI_MAP
        });
    }

    ensureBoardFrameOnBoard() {
        runEnsureBoardFrameOnBoard();
    }

    removeBoardFrameFromBoard() {
        runRemoveBoardFrameFromBoard();
    }

    queueLayoutGeometryLog(tag) {
        runQueueLayoutGeometryLog(this, tag, {
            debugLayoutGeometry: DEBUG_LAYOUT_GEOMETRY
        });
    }

    logLayoutGeometry(tag) {
        runLogLayoutGeometry(this, tag, {
            debugLayoutGeometry: DEBUG_LAYOUT_GEOMETRY
        });
    }

    queueDockGeometryLog(tag) {
        runQueueDockGeometryLog(this, tag, {
            debugDockGeometry: DEBUG_DOCK_GEOMETRY
        });
    }

    logDockGeometry(tag) {
        runLogDockGeometry(this, tag, {
            debugDockGeometry: DEBUG_DOCK_GEOMETRY
        });
    }
	
	beginGoalsBatch() {
        runBeginGoalsBatch(this);
    }

    endGoalsBatch() {
        runEndGoalsBatch(this);
    }

    updateGoalsUI() {
        runUpdateGoalsUI(this);
    }

    checkVictoryConditions() {
        return runCheckVictoryConditions(this);
    }

    startBlitzMode() {
        runStartBlitzMode(this);
    }

    startClassicMode() {
        runStartClassicMode(this, { runtimeLogs: RUNTIME_LOGS });
    }

    startAdventureLevel(levelConfig) {
        runStartAdventureLevel(this, levelConfig, { runtimeLogs: RUNTIME_LOGS });
    }

    setupBossUI(bossData) {
        runSetupBossUI(this, bossData, { debugBossHud: DEBUG_BOSS_HUD });
    }

    ensureBossHud(bossData) {
        runEnsureBossHud(this, bossData, { debugBossHud: DEBUG_BOSS_HUD });
    }

	hideBossHud() {
        runHideBossHud(this);
    }

    getBossHudRefs() {
        return runGetBossHudRefs(this);
    }

    updateBossHud() {
        runUpdateBossHud(this);
    }

	
    // --- LOGICA DE UI DOS HEROIS ---

    renderHeroUI() {
        runRenderHeroUI(this);
    }

    activateHeroPower(hero) {
        runActivateHeroPower(this, hero);
    }

    updateHeroButtonsUI() {
        runUpdateHeroButtonsUI(this);
    }

    clearTheme() {
        runClearTheme();
    }

    retryGame() {
        runRetryGame(this);
    }



    resetGame() {
        runResetGame(this);
    }


    // --- EFEITO VISUAL: Particulas ---
    spawnExplosion(rect, colorClass) {
        // Delega a explosao para o sistema de efeitos (que usa Object Pooling)
        if (this.effects) {
            this.effects.spawnExplosion(rect, colorClass);
        }
    }
	
	ensureFlyerPool() {
        runEnsureFlyerPool(this);
    }

getFlySpritePathByKey(key) {
        return runGetFlySpritePathByKey(this, key);
    }

getItemSpritePathByKey(key) {
        const normalized = String(key || '').toLowerCase();
        const world = this.getCurrentWorldConfig();
        const contextualWorldMap = world?.id ? WORLD_CONTEXTUAL_ITEM_SPRITES[world.id] : null;
        if (this.currentMode === 'adventure' && contextualWorldMap) {
            const levelType = this.currentLevelConfig?.type || 'normal';
            const profile = levelType === 'normal' ? 'normal' : 'combat';
            const contextualSprites = contextualWorldMap[profile] || contextualWorldMap.normal;
            if (contextualSprites && contextualSprites[normalized]) {
                return contextualSprites[normalized];
            }
        }
        return runGetItemSpritePathByKey(this, key, { spritePaths: ITEM_SPRITE_PATHS });
    }

_acquireFlyer(emoji, key = '') {
        return runAcquireFlyer(this, emoji, key);
    }

_releaseFlyer(flyer) {
        runReleaseFlyer(this, flyer);
    }


      // --- EFEITO VISUAL: Voo ---
    runFlyAnimation(r, c, key, emoji, onImpact = null) {
        runRunFlyAnimation(this, r, c, key, emoji, onImpact);
    }

    shouldSyncBossDamageOnFlyImpact() {
        return runShouldSyncBossDamageOnFlyImpact(this);
    }

    hasPendingBossResolution() {
        return runHasPendingBossResolution(this);
    }

    flushDeferredBossPostChecks() {
        runFlushDeferredBossPostChecks(this, { bossLogic: BOSS_LOGIC });
    }

    beginSyncedBossImpact() {
        runBeginSyncedBossImpact(this);
    }

    completeSyncedBossImpact() {
        runCompleteSyncedBossImpact(this);
    }

    getBossImpactTarget(targetEl) {
        return runGetBossImpactTarget(this, targetEl);
    }

    triggerPop(el) {
        runTriggerPop(this, el);
    }

	
	ensureBoardClickDelegation() {
        runEnsureBoardClickDelegation(this);
    }

ensureBoardCells() {
        runEnsureBoardCells(this);
    }

renderCell(div, cellData) {
        runRenderCell(this, div, cellData);
    }




   renderGrid() {
        runRenderGrid(this);
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
        runSpawnNewHand(this, {
            randomPieceFn: getRandomPiece,
            blitzLetterKeys: BLITZ_LETTER_KEYS,
            blitzItemChance: BLITZ_ITEM_CHANCE
        });
    }

    attachDockFallbackDragEvents() {
        runAttachDockFallbackDragEvents(this);
    }

    attachDockSlotDragEvents(slot) {
        runAttachDockSlotDragEvents(slot);
    }

    canPlacePieceAnywhere(piece) {
        return runCanPlacePieceAnywhere(this, piece);
    }

    canPlaceSquare3x3Anywhere() {
        return runCanPlaceSquare3x3Anywhere(this);
    }


    createDraggablePiece(piece, index, parentContainer) {
        runCreateDraggablePiece(this, piece, index, parentContainer);
    }


    getBoardMetrics(padding = 0) {
        return runGetBoardMetrics(this, padding);
    }


    attachDragEvents(el, piece) {
        runAttachDragEvents(this, el, piece, {
            dragVisualOffsetY: DRAG_VISUAL_OFFSET_Y,
            bossLogic: BOSS_LOGIC
        });
    }


    
    moveClone(clone, clientX, clientY) {
        runMoveClone(this, clone, clientX, clientY, { dragVisualOffsetY: DRAG_VISUAL_OFFSET_Y });
    }

    updateGhostPreview(clone, boardRect, cellSize, piece) {
        runUpdateGhostPreview(this, clone, boardRect, cellSize, piece);
    }


    
    // --- PREVISAO DE LINHAS (EFEITO DOURADO) ---

    // 1. Simula a jogada e retorna quais linhas/colunas seriam limpas
    predictClears(r, c, piece) {
        return runPredictClears(this, r, c, piece);
    }


    // 2. Cria barras continuas sobre as linhas/colunas detectadas
    drawPredictionHighlights({ rows, cols }) {
        runDrawPredictionHighlights(this, { rows, cols });
    }

    // 3. Remove as barras criadas
    clearPredictionHighlights() {
        runClearPredictionHighlights(this);
    }

    drawGhost(r, c, piece, isValid) {
        runDrawGhost(this, r, c, piece, isValid);
    }


clearGhostPreview() {
    runClearGhostPreview(this);
}




    canPlace(r, c, piece) {
        return runCanPlace(this, r, c, piece);
    }


    placePiece(r, c, piece) {
        return runPlacePiece(this, r, c, piece);
    }


    checkLines(dropX, dropY) {
        return runCheckLines(this, dropX, dropY, {
            xpRewards: XP_REWARDS,
            runtimeLogs: RUNTIME_LOGS
        });
    }





    calculateClassicScore(linesCleared) {
        return runCalculateClassicScore(this, linesCleared);
    }

    updateClassicUI() {
        runUpdateClassicUI(this);
    }

    animateClassicScoreHero(targetScore, heroValueEl) {
        runAnimateClassicScoreHero(this, targetScore, heroValueEl);
    }

    showClassicScoreDelta(amount, crossedMilestone = false) {
        runShowClassicScoreDelta(this, amount, crossedMilestone);
    }

    triggerClassicScoreGlow() {
        runTriggerClassicScoreGlow(this);
    }

    triggerClassicScoreMilestone() {
        runTriggerClassicScoreMilestone(this);
    }

    updateMissionsUI() {
        runUpdateMissionsUI(this);
    }

    updateMissionProgress(eventType, eventData) {
        runUpdateMissionProgress(this, eventType, eventData, { runtimeLogs: RUNTIME_LOGS });
    }

    onMissionCompleted(mission) {
        runOnMissionCompleted(this, mission, {
            xpRewards: XP_REWARDS,
            runtimeLogs: RUNTIME_LOGS
        });
    }

    spawnClassicParticles(rect, colorClass) {
        runSpawnClassicParticles(this, rect, colorClass);
    }

    resetClassicComboTimer() {
        runResetClassicComboTimer(this, { runtimeLogs: RUNTIME_LOGS });
    }

    showClassicFeedback() {
        runShowClassicFeedback(this);
    }

    generateMissionPool() {
        return runGenerateMissionPool(this);
    }

    generateRandomMissions() {
        return runGenerateRandomMissions(this);
    }

    isPerfectClear() {
        return runIsPerfectClear(this);
    }

    clearRow(r) {
        return runClearRow(this, r);
    }


    clearCol(c) {
        return runClearCol(this, c);
    }

    collectItem(r, c, cellData) {
        return runCollectItem(this, r, c, cellData, { itemStats: ITEM_STATS });
    }


    processBossTurn(damageDealt) {
        runProcessBossTurn(this, damageDealt);
    }

    triggerBossAttack() {
        runTriggerBossAttack(this, { bossLogic: BOSS_LOGIC });
    }

    triggerScreenFlash(color) {
        runTriggerScreenFlash(this, color);
    }

    transformCell(r, c, newData) {
        runTransformCell(this, r, c, newData);
    }

    damageBoss(amount) {
        runDamageBoss(this, amount);
    }


    updateBossUI() {
        runUpdateBossUI(this);
    }


    getMovesAvailabilityCacheKey() {
        return runGetMovesAvailabilityCacheKey(this);
    }

    checkMovesAvailable() {
        return runCheckMovesAvailable(this);
    }




    getResultImageSrc(type) {
        return runGetResultImageSrc(this, type);
    }

    applyResultImage(type) {
        runApplyResultImage(this, type);
    }

    gameWon(collectedGoals = {}, earnedRewards = []) {
        runGameWon(this, collectedGoals, earnedRewards, {
            worlds: WORLDS,
            emojiMap: EMOJI_MAP,
            xpRewards: XP_REWARDS
        });
    }
	
    gameOver() {
        runGameOver(this);
    }

}










