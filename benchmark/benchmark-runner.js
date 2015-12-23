(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;

    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }

    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function installNextTickImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }

    function installSetTimeoutImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));


// FIXME: Use the real promise if available.
// FIXME: Make sure this interface is compatible with the real Promise.
function SimplePromise() {
    this._chainedPromise = null;
    this._callback = null;
}

SimplePromise.prototype.then = function (callback) {
    if (this._callback)
        throw "SimplePromise doesn't support multiple calls to then";
    this._callback = callback;
    this._chainedPromise = new SimplePromise;
    
    if (this._resolved)
        this.resolve(this._resolvedValue);

    return this._chainedPromise;
}

SimplePromise.prototype.resolve = function (value) {
    if (!this._callback) {
        this._resolved = true;
        this._resolvedValue = value;
        return;
    }

    var result = this._callback(value);
    if (result instanceof SimplePromise) {
        var chainedPromise = this._chainedPromise;
        result.then(function (result) { chainedPromise.resolve(result); });
    } else
        this._chainedPromise.resolve(result);
}

function BenchmarkTestStep(testName, testFunction) {
    this.name = testName;
    this.run = testFunction;
}

function BenchmarkRunner(suites, client) {
    this._suites = suites;
    this._prepareReturnValue = null;
    this._measuredValues = {};
    this._client = client;
}

BenchmarkRunner.prototype.waitForElement = function (selector) {
    var promise = new SimplePromise;
    var contentDocument = this._frame.contentDocument;

    function resolveIfReady() {
        var element = contentDocument.querySelector(selector);
        if (element)
            return promise.resolve(element);
        setTimeout(resolveIfReady, 50);
    }

    resolveIfReady();
    return promise;
}

BenchmarkRunner.prototype._removeFrame = function () {
    if (this._frame) {
        this._frame.parentNode.removeChild(this._frame);
        this._frame = null;
    }
}

BenchmarkRunner.prototype._appendFrame = function (src) {
    var frame = document.createElement('iframe');
    frame.style.width = '800px';
    frame.style.height = '600px'
    document.body.appendChild(frame);
    this._frame = frame;
    return frame;
}

BenchmarkRunner.prototype._waitAndWarmUp = function () {
    var startTime = Date.now();

    function Fibonacci(n) {
        if (Date.now() - startTime > 100)
            return;
        if (n <= 0)
            return 0;
        else if (n == 1)
            return 1;
        return Fibonacci(n - 2) + Fibonacci(n - 1);
    }

    var promise = new SimplePromise;
    setTimeout(function () {
        Fibonacci(100);
        promise.resolve();
    }, 200);
    return promise;
}

// This function ought be as simple as possible. Don't even use SimplePromise.
BenchmarkRunner.prototype._runTest = function(suite, testFunction, prepareReturnValue, callback)
{
    var now = window.performance && window.performance.now ? function () { return window.performance.now(); } : Date.now;

    var contentWindow = this._frame.contentWindow;
    var contentDocument = this._frame.contentDocument;

    requestAnimationFrame( function(){
        var startTime = now();
        testFunction(prepareReturnValue, contentWindow, contentDocument, function(){
            setTimeout( function(){
                requestAnimationFrame(function () {
                    var endTime = now();
                    callback(0,endTime - startTime);
                });
            },0)
        });
    })
}

function BenchmarkState(suites) {
    this._suites = suites;
    this._suiteIndex = -1;
    this._testIndex = 0;
    this.next();
}

BenchmarkState.prototype.currentSuite = function() {
    return this._suites[this._suiteIndex];
}

BenchmarkState.prototype.currentTest = function () {
    var suite = this.currentSuite();
    return suite ? suite.tests[this._testIndex] : null;
}

BenchmarkState.prototype.next = function () {
    this._testIndex++;

    var suite = this._suites[this._suiteIndex];
    if (suite && this._testIndex < suite.tests.length)
        return this;

    this._testIndex = 0;
    do {
        this._suiteIndex++;
    } while (this._suiteIndex < this._suites.length && this._suites[this._suiteIndex].disabled);

    return this;
}

BenchmarkState.prototype.isFirstTest = function () {
    return !this._testIndex;
}

BenchmarkState.prototype.prepareCurrentSuite = function (runner, frame) {
    var suite = this.currentSuite();
    var promise = new SimplePromise;
    frame.onload = function () {
        suite.prepare(runner, frame.contentWindow, frame.contentDocument).then(function (result) { promise.resolve(result); });
    }
    frame.src = suite.url;
    return promise;
}

BenchmarkRunner.prototype.step = function (state) {
    if (!state)
        state = new BenchmarkState(this._suites);

    var suite = state.currentSuite();
    if (!suite) {
        this._finalize();
        var promise = new SimplePromise;
        promise.resolve();
        return promise;
    }

    if (state.isFirstTest()) {
        this._masuredValuesForCurrentSuite = {};
        var self = this;
        return state.prepareCurrentSuite(this, this._appendFrame()).then(function (prepareReturnValue) {
            self._prepareReturnValue = prepareReturnValue;
            return self._runTestAndRecordResults(state);
        });
    }

    return this._runTestAndRecordResults(state);
}

BenchmarkRunner.prototype._runTestAndRecordResults = function (state) {
    var promise = new SimplePromise;
    var suite = state.currentSuite();
    var test = state.currentTest();

    if (this._client && this._client.willRunTest)
        this._client.willRunTest(suite, test);

    var self = this;
    setTimeout(function () {
        self._runTest(suite, test.run, self._prepareReturnValue, function (syncTime, asyncTime) {
            var suiteResults = self._measuredValues[suite.name] || {tests:{}, total: 0};
            self._measuredValues[suite.name] = suiteResults;
            suiteResults.tests[test.name] = {'Sync': syncTime, 'Async': asyncTime};
            suiteResults.total += syncTime + asyncTime;

            if (self._client && self._client.willRunTest)
                self._client.didRunTest(suite, test);

            state.next();
            if (state.currentSuite() != suite)
                self._removeFrame();
            promise.resolve(state);
        });
    }, 0);
    return promise;
}

BenchmarkRunner.prototype._finalize = function () {
    this._removeFrame();

    if (this._client && this._client.didRunSuites)
        this._client.didRunSuites(this._measuredValues);

    // FIXME: This should be done when we start running tests.
    this._measuredValues = {};
}
