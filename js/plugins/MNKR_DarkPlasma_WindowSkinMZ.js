/*
 * --------------------------------------------------
 * MNKR_DarkPlasma_WindowSkinMZ Ver.0.0.1
 * Copyright (c) 2020 Munokura
 * This software is released under the MIT license.
 * http://opensource.org/licenses/mit-license.php
 * --------------------------------------------------
 */

// DarkPlasma_AltWindowFramePatch
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/*:
 * @target MZ
 * @url https://raw.githubusercontent.com/munokura/MNKR-MZ-plugins/master/MNKR_DarkPlasma_WindowSkinMZ.js
 * @plugindesc MADO作成素材を使用するためのプラグインRPGツクールMZ版
 * @author DarkPlasma (改変 munokura)
 * @license MIT
 *
 * @help
 * このプラグインは DarkPlasma_AltWindowFramePatch.js を改変したものです。
 * https://github.com/elleonard/RPGtkoolMV-Plugins/blob/master/plugins/DarkPlasma_AltWindowFramePatch.js
 * 
 * ゲーム内ウィンドウ毎に、別のウィンドウ画像を指定できます。
 * ウィンドウ画像の仕様はデフォルトのWindow.pngと同じです。
 * 使用ファイルは /img/system/ 内に保存してください。
 * 
 * 
 * RPGツクールMZデフォルトにあるシーン名は
 * プラグインパラメーターのコンボボックスで選択できます。
 * ウィンドウ名は大量なので、下記からコピーして利用してください。
 * 
 * Window_ActorCommand
 * Window_BattleActor
 * Window_BattleEnemy
 * Window_BattleItem
 * Window_BattleLog
 * Window_BattleSkill
 * Window_BattleStatus
 * Window_ChoiceList
 * Window_Command
 * Window_EquipCommand
 * Window_EquipItem
 * Window_EquipSlot
 * Window_EquipStatus
 * Window_EventItem
 * Window_GameEnd
 * Window_Gold
 * Window_Help
 * Window_HorzCommand
 * Window_ItemCategory
 * Window_ItemList
 * Window_MapName
 * Window_MenuActor
 * Window_MenuCommand
 * Window_MenuStatus
 * Window_Message
 * Window_NameBox
 * Window_NameEdit
 * Window_NameInput
 * Window_NumberInput
 * Window_Options
 * Window_PartyCommand
 * Window_SavefileList
 * Window_Scrollable
 * Window_ScrollText
 * Window_Selectable
 * Window_ShopBuy
 * Window_ShopCommand
 * Window_ShopNumber
 * Window_ShopSell
 * Window_ShopStatus
 * Window_SkillList
 * Window_SkillStatus
 * Window_SkillType
 * Window_Status
 * Window_StatusBase
 * Window_StatusEquip
 * Window_StatusParams
 * Window_TitleCommand
 * 
 * @param Custom Windowskins By Window
 * @desc ウィンドウごとのスキン設定
 * @text ウィンドウごとのスキン
 * @type struct<CustomWindowskin>[]
 * @default []
 *
 * @param Custom Windowskins By Scene
 * @desc シーンごとのスキン設定
 * @text シーンごとのスキン
 * @type struct<CustomWindowskin>[]
 * @default []
 *

 */
/*~struct~CustomWindowskin:
 *
 * @param Class Name
 * @desc ウィンドウまたはシーンのクラス名（例: Window_TitleCommand, Scene_Shop）
 * @text クラス名
 * @type combo
 * @option Scene_Battle
 * @option Scene_GameEnd
 * @option Scene_Gameover
 * @option Scene_Item
 * @option Scene_Load
 * @option Scene_Map
 * @option Scene_Menu
 * @option Scene_Name
 * @option Scene_Options
 * @option Scene_Save
 * @option Scene_Shop
 * @option Scene_Title
 * @option Window_Message
 * @default
 *
 * @param Windowskin
 * @desc ウィンドウスキン
 * @text ウィンドウスキン
 * @type file
 * @require 1
 * @dir img/system
 * @default window
 */

(function () {
  'use strict';
  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });
  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    // defaultWindowskin: Number(pluginParameters['Default Windowskin'] || 0),
    defaultWindowskin: Number(0),
    customWindowskinsByWindow: JsonEx.parse(pluginParameters['Custom Windowskins By Window'] || '[]').map(customSkin => {
      const parsed = JsonEx.parse(customSkin);
      return {
        className: String(parsed['Class Name'] || ''),
        windowskin: Number(parsed['Windowskin'] || 0)
      };
    }),
    customWindowskinsByScene: JsonEx.parse(pluginParameters['Custom Windowskins By Scene'] || '[]').map(customSkin => {
      const parsed = JsonEx.parse(customSkin);
      return {
        className: String(parsed['Class Name'] || ''),
        windowskin: Number(parsed['Windowskin'] || 0)
      };
    })
  };

  // const WINDOWSKIN_TYPE = {
  //   DEFAULT: 0,
  //   TALK: 1,
  //   BATTLE: 2,
  //   STATUS: 3,
  //   OTHER: 4,
  // };

  const WINDOWSKIN_NAME = [
    'Window',
    'Window_Talk',
    'Window_Battle',
    'Window_Status',
    'Window_Other'
  ];

  const DEFAULT_WINDOWSKINS_BY_WINDOW = [
    // { className: "Window_Message", windowskin: WINDOWSKIN_TYPE.TALK },
  ];

  const DEFAULT_WINDOWSKINS_BY_SCENE = [
    // { className: "Scene_Title", windowskin: WINDOWSKIN_TYPE.OTHER },
    // { className: "Scene_Menu", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_Item", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_Skill", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_Equip", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_Status", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_Options", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_Load", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_Save", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_GameEnd", windowskin: WINDOWSKIN_TYPE.STATUS },
    // { className: "Scene_Battle", windowskin: WINDOWSKIN_TYPE.BATTLE }
  ];

  const _Scene_Boot_loadSystemWindowImage = Scene_Boot.prototype.loadSystemWindowImage;
  Scene_Boot.prototype.loadSystemWindowImage = function () {
    _Scene_Boot_loadSystemWindowImage.call(this);
    WINDOWSKIN_NAME.forEach(skin => ImageManager.reserveSystem(skin));
  };

  SceneManager.currentSceneCustomSkinName = function () {
    if (!this._scene) {
      return null;
    }
    const customSkin = settings.customWindowskinsByScene.find(skin => skin.className === this._scene.constructor.name);
    return customSkin ? WINDOWSKIN_NAME[customSkin.windowskin] : null;
  };

  SceneManager.currentSceneDefaultSkinName = function () {
    if (!this._scene) {
      return null;
    }
    const skin = DEFAULT_WINDOWSKINS_BY_SCENE.find(skin => skin.className === this._scene.constructor.name);
    return skin ? WINDOWSKIN_NAME[skin.windowskin] : null;
  };

  /**
   * ウィンドウスキンの名前を取得する
   * 設定の優先順位は
   *  ウィンドウごとのカスタムスキン
   *  シーンごとのカスタムスキン
   *  ウィンドウごとのデフォルトスキン
   *  シーンごとのデフォルトスキン
   *  デフォルトスキン
   */
  Window_Base.prototype.getWindowskinName = function () {
    const customSkin = settings.customWindowskinsByWindow.find(skin => skin.className === this.constructor.name);
    if (customSkin) {
      return WINDOWSKIN_NAME[customSkin.windowskin];
    }
    const sceneCustomSkinName = SceneManager.currentSceneCustomSkinName();
    if (sceneCustomSkinName) {
      return sceneCustomSkinName;
    }
    const windowDefaultSKin = DEFAULT_WINDOWSKINS_BY_WINDOW.find(skin => skin.className === this.constructor.name);
    if (windowDefaultSKin) {
      return WINDOWSKIN_NAME[windowDefaultSKin.windowskin];
    }
    const sceneDefaultSkinName = SceneManager.currentSceneDefaultSkinName();
    if (sceneDefaultSkinName) {
      return sceneDefaultSkinName;
    }
    return WINDOWSKIN_NAME[settings.defaultWindowskin];
  };

  Window_Base.prototype.loadWindowskin = function () {
    this.windowskin = ImageManager.loadSystem(this.getWindowskinName());
  };

  const _Scene_Title_Create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function () {
    _Scene_Title_Create.call(this);
    this._commandWindow.loadWindowskin();
  };

  const _Scene_Menu_Create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function () {
    _Scene_Menu_Create.call(this);
    this._statusWindow.loadWindowskin();
    this._commandWindow.loadWindowskin();
    this._goldWindow.loadWindowskin();
  };

  const _Scene_Item_Create = Scene_Item.prototype.create;
  Scene_Item.prototype.create = function () {
    _Scene_Item_Create.call(this);
    this._categoryWindow.loadWindowskin();
    this._itemWindow.loadWindowskin();
    this._helpWindow.loadWindowskin();
    this._actorWindow.loadWindowskin();
  }

  const _Scene_Skill_Create = Scene_Skill.prototype.create;
  Scene_Skill.prototype.create = function () {
    _Scene_Skill_Create.call(this);
    this._helpWindow.loadWindowskin();
    this._skillTypeWindow.loadWindowskin();
    this._statusWindow.loadWindowskin();
    this._itemWindow.loadWindowskin();
    this._actorWindow.loadWindowskin();
  };

  const _Scene_Equip_Create = Scene_Equip.prototype.create;
  Scene_Equip.prototype.create = function () {
    _Scene_Equip_Create.call(this);
    this._helpWindow.loadWindowskin();
    this._statusWindow.loadWindowskin();
    this._commandWindow.loadWindowskin();
    this._slotWindow.loadWindowskin();
    this._itemWindow.loadWindowskin();
  };

  const _Scene_Status_Create = Scene_Status.prototype.create;
  Scene_Status.prototype.create = function () {
    _Scene_Status_Create.call(this);
    this._statusWindow.loadWindowskin();
  };

  const _Scene_Options_Create = Scene_Options.prototype.create;
  Scene_Options.prototype.create = function () {
    _Scene_Options_Create.call(this);
    this._optionsWindow.loadWindowskin();
  };

  const _Scene_File_Create = Scene_File.prototype.create;
  Scene_File.prototype.create = function () {
    _Scene_File_Create.call(this);
    this._helpWindow.loadWindowskin();
    this._listWindow.loadWindowskin();
  };

  const _Scene_GameEnd_Create = Scene_GameEnd.prototype.create;
  Scene_GameEnd.prototype.create = function () {
    _Scene_GameEnd_Create.call(this);
    this._commandWindow.loadWindowskin();
  };

  const _Scene_Battle_Create = Scene_Battle.prototype.create;
  Scene_Battle.prototype.create = function () {
    _Scene_Battle_Create.call(this);

    this._logWindow.loadWindowskin();
    this._statusWindow.loadWindowskin();
    this._partyCommandWindow.loadWindowskin();
    this._actorCommandWindow.loadWindowskin();
    this._helpWindow.loadWindowskin();
    this._skillWindow.loadWindowskin();
    this._itemWindow.loadWindowskin();
    this._actorWindow.loadWindowskin();
    this._enemyWindow.loadWindowskin();
    this._messageWindow.loadWindowskin();
    this._scrollTextWindow.loadWindowskin();
  };

  const _Window_Message_Initialize = Window_Message.prototype.initialize;
  Window_Message.prototype.initialize = function (rect) {
    _Window_Message_Initialize.call(this, rect);
    this.loadWindowskin();
  };

})();
