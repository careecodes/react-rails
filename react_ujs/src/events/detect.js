var nativeEvents = require("./native")
var pjaxEvents = require("./pjax")
var turbolinksEvents = require("./turbolinks")
var turbolinksClassicDeprecatedEvents = require("./turbolinksClassicDeprecated")
var turbolinksClassicEvents = require("./turbolinksClassic")

// see what things are globally available
// and setup event handlers to those things
module.exports = function(ujs) {
  if (ujs.jQuery) {
    ujs.handleEvent = function(eventName, callback) {
      ujs.jQuery(document).on(eventName, callback);
    };
  } else {
    ujs.handleEvent = function(eventName, callback) {
      document.addEventListener(eventName, callback);
    };
  }

  // Detect which kind of events to set up:
  if (typeof Turbolinks !== 'undefined' && Turbolinks.supported) {
    if (typeof Turbolinks.EVENTS !== 'undefined') {
      // Turbolinks.EVENTS is in classic version 2.4.0+
      turbolinksClassicEvents.setup(ujs)
    } else if (typeof Turbolinks.controller !== "undefined") {
      // Turbolinks.controller is in version 5+
      turbolinksEvents.setup(ujs);
    } else {
      turbolinksClassicDeprecatedEvents.setup(ujs);
    }
  } else if (typeof $ !== "undefined" && typeof $.pjax === 'function') {
    pjaxEvents.setup(ujs);
  } else {
    nativeEvents.setup(ujs);
  }
}
