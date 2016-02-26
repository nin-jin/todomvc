'use strict';

alight.directives.al.escape = function(scope, element, exp) {
    element.addEventListener('keydown', function(e) {
        if(e.keyCode !== 27) return;
        element.value = scope.$eval(exp);
        element.blur()
    })
};

// inherit sync al-value, because the sync-test don't accept async (default) version
var originValue = alight.d.al.value;
alight.d.al.value = function(scope, element, name, env) {
    var dir = originValue(scope, element, name, env);
    dir.updateModel = function() {
        scope.$setValue(name, element.value);
        scope.$scan();
    };
    return dir;
}
