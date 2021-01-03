/*
 * --------------------------------------------------
 * MNKR_templete Ver.1.0.1
 * Copyright (c) 2020 Munokura
 * This software is released under the MIT license.
 * http://opensource.org/licenses/mit-license.php
 * --------------------------------------------------
 */

/*:

 */


(() => {
  "use strict";

  Window_SavefileList.prototype.drawContents = function (info, rect) {
    const bottom = rect.y + rect.height;
    // if (rect.width >= 420) {
    //   this.drawPartyCharacters(info, rect.x + 220, bottom - 8);
    // }
    const lineHeight = this.lineHeight();
    const y2 = bottom - lineHeight - 4;
    if (y2 >= lineHeight) {
      this.drawPlaytime(info, rect.x, y2, rect.width);
    }
  };

})();