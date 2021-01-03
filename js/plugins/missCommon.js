(() => {
  "use strict";

  const _Window_BattleLog_performMiss = Window_BattleLog.prototype.performMiss;
  Window_BattleLog.prototype.performMiss = function (target) {
    _Window_BattleLog_performMiss.call(this, target);
    const CommonEventId = 1;  //コモンイベントID
    $gameTemp.reserveCommonEvent(CommonEventId);
  };
})();
