/*:
 * @target MZ
 * @plugindesc 指定した変数の値をメッセージウィンドウのフォントサイズにします。
 * @help
 * 指定した変数の値をメッセージウィンドウのフォントサイズにします。
 * 文章の内容に制御文字 \FS[xx] を使用して変更することも出来ます。
 * 
 * 利用規約
 *   このプラグインはCC0です。
 *   著作権を放棄します。
 * 
 * @param textVariable
 * @text フォントサイズ変数ID
 * @type variable
 * @desc 指定した変数の値をメッセージウィンドウのフォントサイズにします。
 * @default 0
 */

(() => {
  "use strict";

  const pluginName = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
  const parameters = PluginManager.parameters(pluginName);
  const textVariable = Number(parameters['textVariable'] || 0);

  const _Game_Message_add = Game_Message.prototype.add;
  Game_Message.prototype.add = function (text) {
    const baseSize = '\\FS[' + String($gameVariables.value(textVariable)) + ']';
    text = baseSize + text;
    _Game_Message_add.call(this, text);
  };

})();
