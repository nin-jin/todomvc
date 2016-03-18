var $jin = this.$jin = {}

;
//# sourceMappingURL=dumb.js.map
;
function $jin2_log() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i - 0] = arguments[_i];
    }
    if (typeof console === 'undefined')
        return;
    console.log(console, arguments);
    return arguments[0];
}
function $jin2_log_info(message) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    if (typeof console === 'undefined')
        return;
    if (!$jin2_log_filter.test(message))
        return;
    console.log(message, values);
}
function $jin2_log_warn(message) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    if (typeof console === 'undefined')
        return;
    if (!$jin2_log_filter.test(message))
        return;
    return console.warn.apply(console, arguments);
}
function $jin2_log_error(error) {
    if (typeof console === 'undefined')
        return;
    if (error.jin_log_isLogged)
        return;
    var message = error.stack || error;
    if (console['exception'])
        console['exception'](error);
    else if (console.error)
        console.error(message);
    else if (console.log)
        console.log(message);
    error.jin_log_isLogged = true;
}
function $jin2_log_error_ignore(error) {
    error.jin_log_isLogged = true;
    return error;
}
var $jin2_log_filter = /^$/;
//# sourceMappingURL=log.env=web.js.map
;
function $jin2_object_path(obj) {
    var path = obj.objectPath;
    if (path)
        return path;
    if (typeof obj === 'function') {
        return obj.objectPath = obj.name || Function.toString.call(obj).match(/^\s*function\s*([$\w]*)\s*\(/)[1];
    }
    throw new Error("Field not defined (objectPath)");
}
var $jin2_object = (function () {
    function $jin2_object() {
        this._objectName = null;
        this._objectPath = null;
        this._objectOwner = null;
    }
    $jin2_object.prototype.destroy = function () {
        $jin2_log_info(this.objectPath + ' destroy');
        for (var key in this) {
            var val = this[key];
            if (!val)
                continue;
            if (val.objectOwner !== this)
                continue;
            val.destroy();
        }
        this.objectOwner = null;
    };
    $jin2_object.toString = function () {
        return this.objectPath;
    };
    $jin2_object.prototype.toString = function () {
        return this.objectPath;
    };
    Object.defineProperty($jin2_object.prototype, "objectName", {
        get: function () { return this._objectName; },
        set: function (next) {
            if (this._objectName != null)
                throw new Error("Property already defined (" + this.objectPath + ".objectName)");
            this._objectName = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectPath", {
        get: function () {
            return (this._objectPath == null)
                ? (this._objectPath = $jin2_object_path(this.objectOwner) + '.' + this.objectName)
                : this._objectPath;
        },
        set: function (next) {
            if (this._objectPath != null)
                throw new Error("Property already defined (" + this.objectPath + ".objectPath)");
            this._objectPath = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectOwner", {
        get: function () { return this._objectOwner; },
        set: function (next) {
            var ownerField = this.objectName;
            if (next) {
                var prev = this._objectOwner;
                if (prev)
                    throw new Error("Property already defined (" + this.objectPath + ".objectOwner");
                var nextVal = next[ownerField];
                if (nextVal === this)
                    return;
                if (nextVal)
                    throw new Error("Property already defined (" + next.objectPath + "." + ownerField + ")");
                this._objectOwner = next;
                next[ownerField] = this;
            }
            else {
                var prev = this._objectOwner;
                if (!prev)
                    return;
                prev[ownerField] = null;
                this._objectOwner = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    $jin2_object.prototype.objectEquals = function (other) {
        return this === other;
    };
    $jin2_object.prototype.setup = function (init) {
        init(this);
        return this;
    };
    return $jin2_object;
}());
//# sourceMappingURL=object.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $jin2_prop = (function (_super) {
    __extends($jin2_prop, _super);
    function $jin2_prop(pull, put) {
        _super.call(this);
        if (typeof pull === 'function')
            this.pull_ = pull;
        else
            this.pull_ = function () { return pull; };
        if (put)
            this.put_ = put;
    }
    Object.defineProperty($jin2_prop.prototype, "objectOwner", {
        get: function () {
            return this._objectOwner;
        },
        set: function (next) {
            this._objectOwner = next;
        },
        enumerable: true,
        configurable: true
    });
    $jin2_prop.prototype.pull_ = function (prev) {
        throw new Error("Pulling not supportetd (" + this.objectPath + ")");
    };
    $jin2_prop.prototype.put_ = function (next, prev) {
        throw new Error("Putting not supportetd (" + this.objectPath + ")");
    };
    $jin2_prop.prototype.get = function () {
        return this.pull_();
    };
    $jin2_prop.prototype.set = function (next, prev) {
        return this.put_(next, prev);
    };
    $jin2_prop.prototype.mutate = function (mutate) {
        var prev = this.get();
        var next = mutate.call(this.objectOwner, prev);
        this.set(next, prev);
        return next;
    };
    return $jin2_prop;
}($jin2_object));
//# sourceMappingURL=prop.js.map
;
var $jin2_state_stack = {};
//# sourceMappingURL=stack.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Map;
var Set;
var $jin2_atom = (function (_super) {
    __extends($jin2_atom, _super);
    function $jin2_atom(pull, put, reap) {
        _super.call(this);
        this._ = void 0;
        this.error = $jin2_atom.obsolete;
        this.masters = null;
        this.mastersDeep = 0;
        this.slaves = null;
        if (typeof pull === 'function')
            this.pull_ = pull;
        else if (pull !== void 0)
            this.push(pull);
        if (put)
            this.put_ = put;
        if (reap)
            this.reap_ = reap;
    }
    $jin2_atom.prototype.prop = function (pull, put, reap) {
        return new $jin2_atom(pull, put, reap);
    };
    $jin2_atom.prototype.wrap = function (get, set) {
        var _this = this;
        return new $jin2_atom(get ? (function () { return get(_this.get()); }) : function () { return _this.get(); }, set ? function (next, prev) { return _this.set(set(next)); } : function (next, prev) { return _this.set(next, prev); });
    };
    $jin2_atom.prototype.pull_ = function (prev) { throw $jin2_atom.wait; };
    $jin2_atom.prototype.norm_ = function (next, prev) { return next; };
    $jin2_atom.prototype.put_ = function (next, prev) { return next; };
    $jin2_atom.prototype.notify_ = function (next, prev) { };
    $jin2_atom.prototype.fail_ = function (error) { return void 0; };
    $jin2_atom.prototype.reap_ = function () { return true; };
    $jin2_atom.prototype.reap = function () {
        $jin2_atom._planReap.delete(this);
        if (this.slaves)
            return;
        if (this.reap_()) {
            this.destroy();
            return true;
        }
        return false;
    };
    $jin2_atom.prototype.destroy = function () {
        $jin2_atom._planReap.delete(this);
        this.disobeyAll();
        _super.prototype.destroy.call(this);
    };
    $jin2_atom.prototype.get = function () {
        var slave = $jin2_atom.stack[$jin2_atom.stack.length - 1];
        if (slave)
            this.lead(slave);
        if (this.error === $jin2_atom.obsolete)
            this.pull();
        if (slave)
            slave.obey(this);
        if (this.error)
            throw this.error;
        return this._;
    };
    $jin2_atom.prototype.pull = function () {
        var _this = this;
        $jin2_log_info('pull ' + (this._objectOwner && this.objectPath));
        if (this.masters) {
            this.masters.forEach(function (linked, master) {
                _this.masters.set(master, false);
            });
        }
        this.mastersDeep = 0;
        this.error = $jin2_atom.wait;
        var index = $jin2_atom.stack.length;
        $jin2_atom.stack.push(this);
        var next = this.pull_(this._);
        $jin2_atom.stack.length = index;
        if (next !== void 0)
            this.push(next);
        if (this.masters) {
            var masters = this.masters;
            this.masters.forEach(function (linked, master) {
                if (linked)
                    return;
                masters.delete(master);
                master.dislead(_this);
            });
            if (!masters.size)
                this.masters = null;
        }
        return this._;
    };
    $jin2_atom.prototype.push = function (next) {
        var prev = this._;
        next = this.norm_(next, prev);
        this.error = null;
        if (next !== prev) {
            this._ = next;
            this.notify(prev);
        }
        return next;
    };
    $jin2_atom.prototype.set = function (next, prev) {
        var value = this._;
        next = this.norm_(next, value);
        if (prev !== void 0)
            prev = this.norm_(prev, value);
        if (next !== value) {
            next = this.put_(next, prev);
            if (next !== void 0) {
                this.push(next);
            }
        }
        return this._;
    };
    $jin2_atom.prototype.clear = function () {
        var prev = this._;
        this._ = void 0;
        this.error = $jin2_atom.obsolete;
        this.notify(prev);
        return void 0;
    };
    $jin2_atom.prototype.notifySlaves = function () {
        if (this.slaves) {
            this.slaves.forEach(function (slave) { return slave.update(); });
        }
    };
    $jin2_atom.prototype.notify = function (prev) {
        $jin2_log_info('notify ' + (this._objectOwner && this.objectPath), this._, prev);
        this.notifySlaves();
        this.notify_(this._, prev);
    };
    $jin2_atom.prototype.fail = function (error) {
        if (this.error === error)
            return;
        this.error = error;
        this.notifySlaves();
        var value = this.fail_(error);
        if (value !== void 0)
            this.push(value);
    };
    $jin2_atom.prototype.update = function () {
        if (this.error === $jin2_atom.obsolete)
            return;
        this.error = $jin2_atom.obsolete;
        $jin2_atom.actualize(this);
    };
    $jin2_atom.prototype.lead = function (slave) {
        if (!this.slaves)
            this.slaves = new Set;
        this.slaves.add(slave);
    };
    $jin2_atom.prototype.dislead = function (slave) {
        if (!this.slaves)
            return;
        this.slaves.delete(slave);
        if (!this.slaves.size) {
            this.slaves = null;
            $jin2_atom.collect(this);
        }
    };
    $jin2_atom.prototype.disleadAll = function () {
        var _this = this;
        if (!this.slaves)
            return;
        this.slaves.forEach(function (slave) { return slave.disobey(_this); });
        this.slaves = null;
        $jin2_atom.collect(this);
    };
    $jin2_atom.prototype.obey = function (master) {
        if (!this.masters)
            this.masters = new Map;
        this.masters.set(master, true);
        var masterDeep = master.mastersDeep;
        if (this.mastersDeep <= masterDeep) {
            this.mastersDeep = masterDeep + 1;
        }
    };
    $jin2_atom.prototype.disobey = function (master) {
        if (!this.masters)
            return;
        this.masters.delete(master);
        if (!this.masters.size)
            this.masters = null;
    };
    $jin2_atom.prototype.disobeyAll = function () {
        var _this = this;
        if (!this.masters)
            return;
        this.masters.forEach(function (linked, master) { return master.dislead(_this); });
        this.masters = null;
        this.mastersDeep = 0;
    };
    $jin2_atom.prototype.mutate = function (mutate) {
        var next = mutate.call(this.objectOwner, this._);
        return this.set(next);
    };
    $jin2_atom.prototype.on = function (notify, fail) {
        if (!notify)
            notify = function (value) { return null; };
        if (!fail)
            fail = function (error) { return null; };
        var source = this;
        var Listener = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                _super.apply(this, arguments);
            }
            class_1.prototype.pull_ = function (prev) {
                return notify(source.get());
            };
            class_1.prototype.fail_ = function (error) {
                if (error === $jin2_atom.wait)
                    return;
                return fail(error);
            };
            return class_1;
        }($jin2_atom));
        var listener = new Listener;
        listener.objectName = 'listener';
        listener.objectOwner = this;
        listener.push(null);
        listener.update();
        return listener;
    };
    $jin2_atom.prototype.then = function (notify, fail) {
        if (!notify)
            notify = function (value) { return null; };
        if (!fail)
            fail = function (error) { return null; };
        var source = this;
        var Promise = (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                _super.apply(this, arguments);
            }
            class_2.prototype.pull_ = function (prev) {
                var val = source.get();
                if (val == void 0)
                    return;
                this.disobeyAll();
                return notify(val);
            };
            class_2.prototype.fail_ = function (error) {
                if (error === $jin2_atom.wait)
                    return;
                promise.disobeyAll();
                return fail(error);
            };
            return class_2;
        }($jin2_atom));
        var promise = new Promise;
        promise.objectName = 'promise';
        promise.objectOwner = this;
        promise.push(null);
        promise.update();
        return promise;
    };
    $jin2_atom.prototype.catch = function (fail) {
        return this.then(null, fail);
    };
    $jin2_atom.actualize = function (atom) {
        var deep = atom.mastersDeep;
        var plan = this._planPull;
        var level = plan[deep];
        if (!level)
            level = plan[deep] = [];
        level.push(atom);
        if (deep < this._minUpdateDeep)
            this._minUpdateDeep = deep;
        this.schedule();
    };
    $jin2_atom.collect = function (atom) {
        this.schedule();
    };
    $jin2_atom.schedule = function () {
        var _this = this;
        if (this._scheduled)
            return;
        requestAnimationFrame(function () {
            _this._scheduled = false;
            _this.induce();
        });
        this._scheduled = true;
    };
    $jin2_atom.induce = function () {
        while (true) {
            while (this._minUpdateDeep < this._planPull.length) {
                var level = this._planPull[this._minUpdateDeep++];
                if (!level)
                    continue;
                if (!level.length)
                    continue;
                var atom = level.shift();
                if (level.length)
                    this._minUpdateDeep--;
                if (atom.error !== this.obsolete)
                    continue;
                atom.pull();
            }
            var someReaped = false;
            if (!someReaped)
                break;
        }
    };
    $jin2_atom.wait = new Error('Wait...');
    $jin2_atom.obsolete = new Error('Obsolate state!');
    $jin2_atom.stack = $jin2_state_stack['$jin2_atom_stack'] = [];
    $jin2_atom._planPull = [];
    $jin2_atom._planReap = new Set;
    $jin2_atom._minUpdateDeep = 0;
    return $jin2_atom;
}($jin2_object));
var $jin2_atom_list = (function (_super) {
    __extends($jin2_atom_list, _super);
    function $jin2_atom_list() {
        _super.apply(this, arguments);
    }
    $jin2_atom_list.prop = function (pull, put, reap) {
        return new $jin2_atom_list(pull, put, reap);
    };
    $jin2_atom_list.prototype.norm_ = function (next, prev) {
        if (!prev || !next)
            return next;
        if (next.length !== prev.length)
            return next;
        for (var i = 0; i < next.length; ++i) {
            if (next[i] === prev[i])
                continue;
            return next;
        }
        return prev;
    };
    return $jin2_atom_list;
}($jin2_atom));
window.addEventListener('error', function (event) {
    $jin2_atom.schedule();
    var stack = $jin2_atom.stack;
    $jin2_atom.stack = [];
    for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
        var atom = stack_1[_i];
        console.debug(atom.objectPath);
    }
    for (var _a = 0, stack_2 = stack; _a < stack_2.length; _a++) {
        var atom = stack_2[_a];
        atom.fail(event['error']);
    }
});
//# sourceMappingURL=atom.js.map
;
function $jin2_grab(prototype, name, descr) {
    var makeValue = descr.value;
    descr.value = function (key) {
        var field = name + '(' + (JSON.stringify(key) || '') + ')';
        if (this[field])
            return this[field];
        var obj = makeValue.call(this, key);
        obj.objectName = field;
        obj.objectOwner = this;
        return obj;
    };
}
//# sourceMappingURL=grab.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_state_arg = (function (_super) {
    __extends($mol_state_arg, _super);
    function $mol_state_arg() {
        _super.apply(this, arguments);
    }
    $mol_state_arg.prototype.key = function () { return new $jin2_prop(''); };
    $mol_state_arg.prototype.item = function (key) {
        var prefix = this.key().get();
        return $mol_state_arg.item(prefix ? (prefix + '.' + key) : key);
    };
    $mol_state_arg.prototype.link = function (next) {
        var _this = this;
        return new $jin2_prop(function () { return $mol_state_arg.make((_a = {}, _a[_this.key().get()] = next, _a)); var _a; });
    };
    $mol_state_arg.prototype.pull_ = function () {
        return $mol_state_arg.dict().get()[this.key().get()] || null;
    };
    $mol_state_arg.prototype.put_ = function (next) {
        $mol_state_arg.dict().set((_a = {}, _a[this.key().get()] = next, _a));
        return next;
        var _a;
    };
    $mol_state_arg.item = function (key) {
        return (new this).setup(function (_) {
            _.key = function () { return new $jin2_prop(key); };
        });
    };
    $mol_state_arg.href = function () {
        return new $jin2_atom(function () { return window.location.search + window.location.hash; }, function (next) { return document.location.href = next; });
    };
    $mol_state_arg.dict = function () {
        var _this = this;
        return new $jin2_atom(function () {
            var href = _this.href().get();
            var chunks = href.split(/[\/\?#!&;]/g);
            var params = {};
            chunks.forEach(function (chunk) {
                if (!chunk)
                    return;
                var vals = chunk.split(/[:=]/).map(decodeURIComponent);
                params[vals[0]] = vals[1] || '';
            });
            return params;
        }, function (next) {
            _this.href().set(_this.make(next));
        });
    };
    $mol_state_arg.make = function (next) {
        var params = {};
        var prev = this.dict().get();
        for (var key in prev) {
            if (key in next)
                continue;
            params[key] = prev[key];
        }
        for (var key in next) {
            params[key] = next[key];
        }
        var chunks = [];
        for (var key in params) {
            if (null == params[key])
                continue;
            chunks.push([key].concat(params[key]).map(encodeURIComponent).join('='));
        }
        chunks.sort();
        return '#' + chunks.join('#');
    };
    __decorate([
        $jin2_grab
    ], $mol_state_arg.prototype, "link", null);
    __decorate([
        $jin2_grab
    ], $mol_state_arg, "item", null);
    __decorate([
        $jin2_grab
    ], $mol_state_arg, "href", null);
    __decorate([
        $jin2_grab
    ], $mol_state_arg, "dict", null);
    return $mol_state_arg;
}($jin2_atom));
window.addEventListener('hashchange', function () { return $mol_state_arg.href().update(); });
//# sourceMappingURL=arg.env=web.js.map
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $jin2_state_local = (function () {
    function $jin2_state_local() {
    }
    $jin2_state_local.item = function (key) {
        return new $jin2_atom(function () { return JSON.parse(localStorage.getItem(key) || "null"); }, function (next) {
            if (next == null) {
                localStorage.removeItem(key);
                return null;
            }
            else {
                localStorage.setItem(key, JSON.stringify(next));
                return next;
            }
        });
    };
    __decorate([
        $jin2_grab
    ], $jin2_state_local, "item", null);
    return $jin2_state_local;
}());
window.addEventListener('storage', function (event) { return $jin2_state_local.item(event.key).update(); });
//# sourceMappingURL=local.env=web.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_model = (function (_super) {
    __extends($mol_model, _super);
    function $mol_model() {
        _super.apply(this, arguments);
        this._ = this;
        this.error = null;
    }
    $mol_model.app = function (id) {
        return new this();
    };
    $mol_model.prototype.get = function () {
        return _super.prototype.get.call(this);
    };
    $mol_model.prototype.prop = function (pull, put) {
        return new $jin2_prop(pull, put);
    };
    $mol_model.prototype.atom = function (pull, put, reap) {
        return new $jin2_atom(pull, put, reap);
    };
    $mol_model.prototype.argument = function () {
        var owner = this.objectOwner;
        if (owner && owner.argument)
            return owner.argument();
        else
            return $mol_state_arg.item();
    };
    $mol_model.prototype.persist = function (path) {
        var chunk = this.objectName;
        if (path)
            chunk += '.' + path;
        var owner = this.objectOwner;
        if (owner && owner.persist)
            return owner.persist(chunk);
        else
            return $jin2_state_local.item(chunk);
    };
    __decorate([
        $jin2_grab
    ], $mol_model, "app", null);
    return $mol_model;
}($jin2_atom));
//# sourceMappingURL=model.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $jin2_vary = (function (_super) {
    __extends($jin2_vary, _super);
    function $jin2_vary(pull, put) {
        _super.call(this);
        if (pull)
            this.pull_ = pull;
        if (put)
            this.put_ = put;
    }
    Object.defineProperty($jin2_vary.prototype, "objectOwner", {
        get: function () {
            return this._objectOwner;
        },
        set: function (next) {
            this._objectOwner = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_vary.prototype, "value", {
        get: function () {
            return this.objectOwner['_' + this.objectName];
        },
        set: function (next) {
            this.objectOwner['_' + this.objectName] = next;
        },
        enumerable: true,
        configurable: true
    });
    $jin2_vary.prototype.get_ = function (value) { return value; };
    $jin2_vary.prototype.pull_ = function (prev) { return prev; };
    $jin2_vary.prototype.norm_ = function (next, prev) { return next; };
    $jin2_vary.prototype.put_ = function (next, prev) { return next; };
    $jin2_vary.prototype.notify_ = function (next, prev) { };
    $jin2_vary.prototype.get = function () {
        var value = this.value;
        if (value === undefined)
            value = this.pull();
        return this.get_(value);
    };
    $jin2_vary.prototype.pull = function () {
        var value = this.pull_(this.value);
        return this.push(value);
    };
    $jin2_vary.prototype.push = function (next) {
        var prev = this.value;
        next = this.norm_(next, prev);
        if (next !== prev) {
            this.value = next;
            this.notify(prev);
        }
        return next;
    };
    $jin2_vary.prototype.clear = function () {
        var prev = this.value;
        this.value = void 0;
        this.notify(prev);
        return void 0;
    };
    $jin2_vary.prototype.set = function (next, prev) {
        var value = this.value;
        next = this.norm_(next, value);
        if (prev !== undefined)
            prev = this.norm_(prev, value);
        if (next !== value) {
            next = this.put_(next, prev);
            if (next !== void 0)
                this.value = next;
        }
        return next;
    };
    $jin2_vary.prototype.mutate = function (mutate) {
        var next = mutate.call(this.objectOwner, this.value);
        return this.set(next);
    };
    $jin2_vary.prototype.notify = function (prev) {
        this.notify_(this.value, prev);
    };
    return $jin2_vary;
}($jin2_object));
//# sourceMappingURL=vary.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_view = (function (_super) {
    __extends($mol_view, _super);
    function $mol_view() {
        _super.apply(this, arguments);
    }
    $mol_view.prototype.tagName = function () {
        return this.prop('div');
    };
    $mol_view.prototype.nameSpace = function () {
        return this.prop('http://www.w3.org/1999/xhtml');
    };
    $mol_view.prototype.child = function () { return this.prop(null); };
    $mol_view.prototype.childNodes = function () { return this.child(); };
    $mol_view.prototype.attrNames = function () {
        if (this.hasOwnProperty('_attrNames'))
            return this._attrNames;
        var names = this._attrNames = [];
        for (var key in this) {
            if (key.substring(0, 5) !== 'attr_')
                continue;
            if (typeof this[key] !== 'function')
                continue;
            names.push(key.substring(5));
        }
        return names;
    };
    $mol_view.prototype.fieldNames = function () {
        if (this.hasOwnProperty('_fieldNames'))
            return this._fieldNames;
        var names = this._fieldNames = [];
        for (var key in this) {
            if (key.substring(0, 6) !== 'field_')
                continue;
            if (typeof this[key] !== 'function')
                continue;
            names.push(key.substring(6));
        }
        return names;
    };
    $mol_view.prototype.eventNames = function () {
        if (this.hasOwnProperty('_eventNames'))
            return this._eventNames;
        var names = this._eventNames = [];
        for (var key in this) {
            if (key.substring(0, 6) !== 'event_')
                continue;
            if (typeof this[key] !== 'function')
                continue;
            names.push(key.substring(6));
        }
        return names;
    };
    $mol_view.prototype.node = function () {
        var _this = this;
        return new $jin2_vary(function () {
            var id = _this.objectPath;
            var prev = document.getElementById(id);
            if (!prev) {
                prev = document.createElementNS(_this.nameSpace().get(), _this.tagName().get());
                prev.setAttribute('id', id);
            }
            Object.getPrototypeOf(_this).eventNames().forEach(function (name) {
                var prop = _this['event_' + name]();
                prev.addEventListener(name, function (event) {
                    prop.set(event);
                    $jin2_atom.induce();
                });
            });
            var proto1 = _this.objectOwner;
            while (proto1 && (proto1.constructor !== $mol_view) && (proto1.constructor !== Function)) {
                var className = $jin2_object_path(proto1.constructor);
                if (!className)
                    continue;
                prev.setAttribute(className.replace(/\$/g, '') + '_' + _this.objectName.replace(/\(.*/g, ''), '');
                proto1 = Object.getPrototypeOf(proto1);
            }
            var proto2 = _this;
            while (proto2 && (proto2.constructor !== $mol_view)) {
                var className = $jin2_object_path(proto2.constructor);
                if (!className)
                    continue;
                prev.setAttribute(className.replace(/\$/g, ''), "");
                proto2 = Object.getPrototypeOf(proto2);
            }
            return prev;
        });
    };
    $mol_view.prototype.version = function () {
        var _this = this;
        var prop = this.atom(function () {
            var prev = _this.node().get();
            Object.getPrototypeOf(_this).attrNames().forEach(function (name) {
                var n = _this['attr_' + name]().get();
                if (n == null) {
                    prev.removeAttribute(name);
                }
                else {
                    prev.setAttribute(name, String(n));
                }
            });
            var childs = _this.childNodes().get();
            if (childs != null) {
                var childViews = [].concat.apply([], [].concat(childs));
                var childNodes = prev.childNodes;
                var nextNode = prev.firstChild;
                for (var i = 0; i < childViews.length; ++i) {
                    var view = childViews[i];
                    if (typeof view === 'object') {
                        if (view) {
                            var existsNode = view.node().get();
                            while (true) {
                                if (!nextNode) {
                                    prev.appendChild(existsNode);
                                    break;
                                }
                                if (nextNode == existsNode) {
                                    nextNode = nextNode.nextSibling;
                                    break;
                                }
                                else {
                                    if (childViews.indexOf(nextNode) === -1) {
                                        var nn = nextNode.nextSibling;
                                        prev.removeChild(nextNode);
                                        nextNode = nn;
                                    }
                                    else {
                                        prev.insertBefore(existsNode, nextNode);
                                        break;
                                    }
                                }
                            }
                            view.version().get();
                        }
                    }
                    else {
                        if (nextNode && nextNode.nodeName === '#text') {
                            nextNode.nodeValue = String(view);
                            nextNode = nextNode.nextSibling;
                        }
                        else {
                            var textNode = document.createTextNode(String(view));
                            prev.insertBefore(textNode, nextNode);
                        }
                    }
                }
                while (nextNode) {
                    var currNode = nextNode;
                    nextNode = currNode.nextSibling;
                    prev.removeChild(currNode);
                }
            }
            Object.getPrototypeOf(_this).fieldNames().forEach(function (path) {
                var names = path.split('_');
                var obj = prev;
                for (var i = 0; i < names.length - 1; ++i) {
                    if (names[i])
                        obj = obj[names[i]];
                }
                obj[names[names.length - 1]] = _this['field_' + path]().get();
            });
            prev.removeAttribute('mol_view_error');
            return prev;
        });
        return prop;
    };
    __decorate([
        $jin2_grab
    ], $mol_view.prototype, "node", null);
    __decorate([
        $jin2_grab
    ], $mol_view.prototype, "version", null);
    return $mol_view;
}($mol_model));
function $mol_replace(Class) {
    $mol[Class.name] = Class;
    window[Class.name] = Class;
    return Class;
}
document.addEventListener('DOMContentLoaded', function (event) {
    var nodes = document.querySelectorAll('[mol_view_app]');
    for (var i = nodes.length - 1; i >= 0; --i) {
        var node = nodes[i];
        var klass = node.getAttribute('mol_view_app');
        node.id = klass + '.app()';
        var app = $mol[klass].app();
        app.node().get();
        app.version().get();
    }
});
//# sourceMappingURL=view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_rower = (function (_super) {
        __extends($mol_rower, _super);
        function $mol_rower() {
            _super.apply(this, arguments);
        }
        $mol_rower = __decorate([
            $mol_replace
        ], $mol_rower);
        return $mol_rower;
    }($mol_view));
    $mol.$mol_rower = $mol_rower;
})($mol || ($mol = {}));
//# sourceMappingURL=rower.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_clicker = (function (_super) {
        __extends($mol_clicker, _super);
        function $mol_clicker() {
            _super.apply(this, arguments);
        }
        $mol_clicker.prototype.field_tabIndex = function () { return this.prop(0, function (a) { return a; }); };
        $mol_clicker.prototype.type = function () { return this.prop("minor", function (a) { return a; }); };
        $mol_clicker.prototype.attr_mol_clicker_type = function () { return this.type(); };
        $mol_clicker.prototype.clicks = function () { return this.prop(null, function (a) { return a; }); };
        $mol_clicker.prototype.event_click = function () { return this.clicks(); };
        __decorate([
            $jin2_grab
        ], $mol_clicker.prototype, "field_tabIndex", null);
        __decorate([
            $jin2_grab
        ], $mol_clicker.prototype, "type", null);
        __decorate([
            $jin2_grab
        ], $mol_clicker.prototype, "clicks", null);
        $mol_clicker = __decorate([
            $mol_replace
        ], $mol_clicker);
        return $mol_clicker;
    }($mol_view));
    $mol.$mol_clicker = $mol_clicker;
})($mol || ($mol = {}));
//# sourceMappingURL=clicker.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_clicker = (function (_super) {
    __extends($mol_clicker, _super);
    function $mol_clicker() {
        _super.apply(this, arguments);
    }
    $mol_clicker.prototype.clicks = function () {
        var _this = this;
        return this.prop(null, function (event) {
            alert("Clicked \"" + _this.objectName + "\"");
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_clicker.prototype, "clicks", null);
    $mol_clicker = __decorate([
        $mol_replace
    ], $mol_clicker);
    return $mol_clicker;
}($mol.$mol_clicker));
//# sourceMappingURL=clicker.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_checker = (function (_super) {
        __extends($mol_checker, _super);
        function $mol_checker() {
            _super.apply(this, arguments);
        }
        $mol_checker.prototype.checked = function () { return this.prop(false, function (a) { return a; }); };
        $mol_checker.prototype.attr_mol_checker_checked = function () { return this.checked(); };
        __decorate([
            $jin2_grab
        ], $mol_checker.prototype, "checked", null);
        $mol_checker = __decorate([
            $mol_replace
        ], $mol_checker);
        return $mol_checker;
    }($mol.$mol_clicker));
    $mol.$mol_checker = $mol_checker;
})($mol || ($mol = {}));
//# sourceMappingURL=checker.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_checker = (function (_super) {
    __extends($mol_checker, _super);
    function $mol_checker() {
        _super.apply(this, arguments);
    }
    $mol_checker.prototype.clicks = function () {
        var _this = this;
        return this.prop(null, function (next) {
            _this.checked().set(!_this.checked().get());
            next.preventDefault();
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_checker.prototype, "clicks", null);
    $mol_checker = __decorate([
        $mol_replace
    ], $mol_checker);
    return $mol_checker;
}($mol.$mol_checker));
//# sourceMappingURL=checker.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_stringer = (function (_super) {
        __extends($mol_stringer, _super);
        function $mol_stringer() {
            _super.apply(this, arguments);
        }
        $mol_stringer.prototype.valueChanged = function () { return this.prop("", function (a) { return a; }); };
        $mol_stringer.prototype.hint = function () { return this.prop("", function (a) { return a; }); };
        $mol_stringer.prototype.attr_mol_stringer_hint = function () { return this.hint(); };
        $mol_stringer.prototype.field_tabIndex = function () { return this.prop(0, function (a) { return a; }); };
        $mol_stringer.prototype.editable = function () { return this.prop(true, function (a) { return a; }); };
        $mol_stringer.prototype.field_contentEditable = function () { return this.editable(); };
        $mol_stringer.prototype.value = function () { return this.prop("", function (a) { return a; }); };
        $mol_stringer.prototype.field_textContent = function () { return this.value(); };
        $mol_stringer.prototype.presses = function () { return this.prop(null, function (a) { return a; }); };
        $mol_stringer.prototype.event_keydown = function () { return this.presses(); };
        $mol_stringer.prototype.changes = function () { return this.prop(null, function (a) { return a; }); };
        $mol_stringer.prototype.event_input = function () { return this.changes(); };
        $mol_stringer.prototype.commits = function () { return this.prop(null, function (a) { return a; }); };
        $mol_stringer.prototype.blurs = function () { return this.commits(); };
        $mol_stringer.prototype.event_blur = function () { return this.blurs(); };
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "valueChanged", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "hint", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "field_tabIndex", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "editable", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "value", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "presses", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "changes", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "commits", null);
        $mol_stringer = __decorate([
            $mol_replace
        ], $mol_stringer);
        return $mol_stringer;
    }($mol_view));
    $mol.$mol_stringer = $mol_stringer;
})($mol || ($mol = {}));
//# sourceMappingURL=stringer.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_stringer = (function (_super) {
    __extends($mol_stringer, _super);
    function $mol_stringer() {
        _super.apply(this, arguments);
    }
    $mol_stringer.prototype.presses = function () {
        var _this = this;
        return this.prop(null, function (next) {
            switch (next.keyCode) {
                case 13:
                    _this.commits().set(next);
                    next.target.blur();
                    break;
                case 27:
                    _this.reverts().set(next);
                    next.target.blur();
                    break;
                default: return;
            }
            next.preventDefault();
        });
    };
    $mol_stringer.prototype.changes = function () {
        var _this = this;
        return this.prop(null, function (next) {
            _this.valueChanged().set(next.target.textContent.trim());
        });
    };
    $mol_stringer.prototype.commits = function () {
        var _this = this;
        return this.prop(null, function (next) {
            _this.value().set(next.target.textContent.trim());
            _this.reverts().set(next);
        });
    };
    $mol_stringer.prototype.reverts = function () {
        var _this = this;
        return this.prop(null, function (next) {
            next.target.textContent = _this.value().get();
            _this.changes().set(next);
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "presses", null);
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "changes", null);
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "commits", null);
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "reverts", null);
    $mol_stringer = __decorate([
        $mol_replace
    ], $mol_stringer);
    return $mol_stringer;
}($mol.$mol_stringer));
//# sourceMappingURL=stringer.view.js.map
;
//# sourceMappingURL=task.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_app_todo_task_view_row = (function (_super) {
        __extends($mol_app_todo_task_view_row, _super);
        function $mol_app_todo_task_view_row() {
            _super.apply(this, arguments);
        }
        $mol_app_todo_task_view_row.prototype.attr_mol_app_todo_task_view_row_completed = function () { return this.taskCompleted(); };
        $mol_app_todo_task_view_row.prototype.taskCompleted = function () { return this.prop(false, function (a) { return a; }); };
        $mol_app_todo_task_view_row.prototype.completer = function () {
            var _this = this;
            var view = new $mol.$mol_checker;
            view.checked = function () { return _this.taskCompleted(); };
            return view;
        };
        $mol_app_todo_task_view_row.prototype.taskTitle = function () { return this.prop("", function (a) { return a; }); };
        $mol_app_todo_task_view_row.prototype.title = function () {
            var _this = this;
            var view = new $mol.$mol_stringer;
            view.hint = function () { return _this.prop("Task title", function () { }); };
            view.value = function () { return _this.taskTitle(); };
            return view;
        };
        $mol_app_todo_task_view_row.prototype.taskDrops = function () { return this.prop(null, function (a) { return a; }); };
        $mol_app_todo_task_view_row.prototype.dropper = function () {
            var _this = this;
            var view = new $mol.$mol_clicker;
            view.child = function () { return _this.prop("✖", function () { }); };
            view.clicks = function () { return _this.taskDrops(); };
            return view;
        };
        $mol_app_todo_task_view_row.prototype.child = function () {
            var _this = this;
            return this.prop(function () { return [_this.completer().get(), _this.title().get(), _this.dropper().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_app_todo_task_view_row.prototype, "taskCompleted", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo_task_view_row.prototype, "completer", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo_task_view_row.prototype, "taskTitle", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo_task_view_row.prototype, "title", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo_task_view_row.prototype, "taskDrops", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo_task_view_row.prototype, "dropper", null);
        $mol_app_todo_task_view_row = __decorate([
            $mol_replace
        ], $mol_app_todo_task_view_row);
        return $mol_app_todo_task_view_row;
    }($mol.$mol_rower));
    $mol.$mol_app_todo_task_view_row = $mol_app_todo_task_view_row;
})($mol || ($mol = {}));
//# sourceMappingURL=task.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_scroller = (function (_super) {
        __extends($mol_scroller, _super);
        function $mol_scroller() {
            _super.apply(this, arguments);
        }
        $mol_scroller.prototype.overflowTop = function () { return this.prop(false, function (a) { return a; }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowTop = function () { return this.overflowTop(); };
        $mol_scroller.prototype.overflowBottom = function () { return this.prop(false, function (a) { return a; }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowBottom = function () { return this.overflowBottom(); };
        $mol_scroller.prototype.overflowLeft = function () { return this.prop(false, function (a) { return a; }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowLeft = function () { return this.overflowLeft(); };
        $mol_scroller.prototype.overflowRight = function () { return this.prop(false, function (a) { return a; }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowRight = function () { return this.overflowRight(); };
        $mol_scroller.prototype.scrolls = function () { return this.prop(null, function (a) { return a; }); };
        $mol_scroller.prototype.event_scroll = function () { return this.scrolls(); };
        $mol_scroller.prototype.event_overflow = function () { return this.scrolls(); };
        $mol_scroller.prototype.event_underflow = function () { return this.scrolls(); };
        $mol_scroller.prototype.scrollTop = function () { return this.prop(0, function (a) { return a; }); };
        $mol_scroller.prototype.field_scrollTop = function () { return this.scrollTop(); };
        $mol_scroller.prototype.scrollLeft = function () { return this.prop(0, function (a) { return a; }); };
        $mol_scroller.prototype.field_scrollLeft = function () { return this.scrollLeft(); };
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "overflowTop", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "overflowBottom", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "overflowLeft", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "overflowRight", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "scrolls", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "scrollTop", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "scrollLeft", null);
        $mol_scroller = __decorate([
            $mol_replace
        ], $mol_scroller);
        return $mol_scroller;
    }($mol_view));
    $mol.$mol_scroller = $mol_scroller;
})($mol || ($mol = {}));
//# sourceMappingURL=scroller.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_scroller = (function (_super) {
    __extends($mol_scroller, _super);
    function $mol_scroller() {
        _super.apply(this, arguments);
    }
    $mol_scroller.prototype.scrollTop = function () {
        var state = this.persist('scrollTop');
        return this.prop(function () { return Number(state.get()) || 0; }, function (next) { return (state.set(next), next); });
    };
    $mol_scroller.prototype.scrollLeft = function () {
        var state = this.persist('scrollLeft');
        return this.prop(function () { return Number(state.get()) || 0; }, function (next) { return (state.set(next), next); });
    };
    $mol_scroller.prototype.scrollHeight = function () {
        var _this = this;
        return this.prop(function () { return _this.node().get().scrollHeight; });
    };
    $mol_scroller.prototype.scrollWidth = function () {
        var _this = this;
        return this.prop(function () { return _this.node().get().scrollWidth; });
    };
    $mol_scroller.prototype.offsetHeight = function () {
        var _this = this;
        return this.prop(function () { return _this.node().get().offsetHeight; });
    };
    $mol_scroller.prototype.offsetWidth = function () {
        var _this = this;
        return this.prop(function () { return _this.node().get().offsetWidth; });
    };
    $mol_scroller.prototype.scrolls = function () {
        var _this = this;
        return this.prop(null, function (event) {
            _this.scrollTop().set(event.target.scrollTop);
            _this.scrollLeft().set(event.target.scrollLeft);
        });
    };
    $mol_scroller.prototype.overflowTop = function () {
        var _this = this;
        return this.prop(function () { return _this.scrollTop().get() > 0; });
    };
    $mol_scroller.prototype.overflowLeft = function () {
        var _this = this;
        return this.prop(function () { return _this.scrollLeft().get() > 0; });
    };
    $mol_scroller.prototype.overflowBottom = function () {
        var _this = this;
        return this.prop(function () { return (_this.scrollHeight().get() - _this.scrollTop().get() - _this.offsetHeight().get()) > 0; });
    };
    $mol_scroller.prototype.overflowRight = function () {
        var _this = this;
        return this.prop(function () { return (_this.scrollWidth().get() - _this.scrollLeft().get() - _this.offsetWidth().get()) > 0; });
    };
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollTop", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollLeft", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollHeight", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollWidth", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "offsetHeight", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "offsetWidth", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrolls", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "overflowTop", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "overflowLeft", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "overflowBottom", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "overflowRight", null);
    $mol_scroller = __decorate([
        $mol_replace
    ], $mol_scroller);
    return $mol_scroller;
}($mol.$mol_scroller));
//# sourceMappingURL=scroller.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_lister = (function (_super) {
        __extends($mol_lister, _super);
        function $mol_lister() {
            _super.apply(this, arguments);
        }
        $mol_lister.prototype.rowMinHeight = function () { return this.prop(36, function (a) { return a; }); };
        $mol_lister.prototype.limitStart = function () { return this.prop(0, function (a) { return a; }); };
        $mol_lister.prototype.limitEnd = function () { return this.prop(0, function (a) { return a; }); };
        $mol_lister.prototype.itemsCount = function () { return this.prop(0, function (a) { return a; }); };
        $mol_lister.prototype.fillerStartHeight = function () { return this.prop("0 ", function (a) { return a; }); };
        $mol_lister.prototype.fillerStart = function () {
            var _this = this;
            var view = new $mol.$mol_lister_filler;
            view.height = function () { return _this.fillerStartHeight(); };
            return view;
        };
        $mol_lister.prototype.items = function () { return this.prop(null, function (a) { return a; }); };
        $mol_lister.prototype.itemsVisible = function () { return this.items(); };
        $mol_lister.prototype.fillerEndHeight = function () { return this.prop("0 ", function (a) { return a; }); };
        $mol_lister.prototype.fillerEnd = function () {
            var _this = this;
            var view = new $mol.$mol_lister_filler;
            view.height = function () { return _this.fillerEndHeight(); };
            return view;
        };
        $mol_lister.prototype.child = function () {
            var _this = this;
            return this.prop(function () { return [_this.fillerStart().get(), _this.itemsVisible().get(), _this.fillerEnd().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "rowMinHeight", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "limitStart", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "limitEnd", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "itemsCount", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "fillerStartHeight", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "fillerStart", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "items", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "fillerEndHeight", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "fillerEnd", null);
        $mol_lister = __decorate([
            $mol_replace
        ], $mol_lister);
        return $mol_lister;
    }($mol_view));
    $mol.$mol_lister = $mol_lister;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_lister_filler = (function (_super) {
        __extends($mol_lister_filler, _super);
        function $mol_lister_filler() {
            _super.apply(this, arguments);
        }
        $mol_lister_filler.prototype.height = function () { return this.prop("0", function (a) { return a; }); };
        $mol_lister_filler.prototype.field_style_height = function () { return this.height(); };
        __decorate([
            $jin2_grab
        ], $mol_lister_filler.prototype, "height", null);
        $mol_lister_filler = __decorate([
            $mol_replace
        ], $mol_lister_filler);
        return $mol_lister_filler;
    }($mol_view));
    $mol.$mol_lister_filler = $mol_lister_filler;
})($mol || ($mol = {}));
//# sourceMappingURL=lister.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_lister = (function (_super) {
    __extends($mol_lister, _super);
    function $mol_lister() {
        _super.apply(this, arguments);
    }
    $mol_lister.prototype.scroller = function () {
        var _this = this;
        return this.atom(function () {
            var scroller = _this;
            while (scroller && !scroller['scrollTop'])
                scroller = scroller.objectOwner;
            return scroller;
        });
    };
    $mol_lister.prototype.limitStart = function () {
        return this.prop(function () {
            return 0;
        });
    };
    $mol_lister.prototype.limitEnd = function () {
        var _this = this;
        return this.atom(function () {
            var offset = screen.height;
            var scroller = _this.scroller().get();
            if (scroller)
                offset += scroller['scrollTop']().get();
            var limit = Math.ceil(offset / _this.rowMinHeight().get());
            return limit;
        });
    };
    $mol_lister.prototype.itemsVisible = function () {
        var _this = this;
        return $jin2_atom_list.prop(function () {
            var items = _this.items().get();
            if (!items)
                return [];
            return items.slice(_this.limitStart().get(), _this.limitEnd().get());
        });
    };
    $mol_lister.prototype.fillerStartHeight = function () {
        var _this = this;
        return this.prop(function () { return _this.limitStart().get() * _this.rowMinHeight().get() + 'px'; });
    };
    $mol_lister.prototype.itemsCount = function () {
        var _this = this;
        return this.prop(function () { return _this.items().get().length; });
    };
    $mol_lister.prototype.fillerEndHeight = function () {
        var _this = this;
        return this.prop(function () { return Math.max(0, (_this.itemsCount().get() - _this.limitEnd().get()) * _this.rowMinHeight().get()) + 'px'; });
    };
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "scroller", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "limitStart", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "limitEnd", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "itemsVisible", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "fillerStartHeight", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "itemsCount", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "fillerEndHeight", null);
    $mol_lister = __decorate([
        $mol_replace
    ], $mol_lister);
    return $mol_lister;
}($mol.$mol_lister));
//# sourceMappingURL=lister.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_switcher = (function (_super) {
        __extends($mol_switcher, _super);
        function $mol_switcher() {
            _super.apply(this, arguments);
        }
        $mol_switcher.prototype.tagName = function () { return this.prop("a", function (a) { return a; }); };
        $mol_switcher.prototype.link = function () { return this.prop("", function (a) { return a; }); };
        $mol_switcher.prototype.attr_href = function () { return this.link(); };
        $mol_switcher.prototype.value = function () { return this.prop("", function (a) { return a; }); };
        $mol_switcher.prototype.selected = function () { return this.prop("", function (a) { return a; }); };
        __decorate([
            $jin2_grab
        ], $mol_switcher.prototype, "tagName", null);
        __decorate([
            $jin2_grab
        ], $mol_switcher.prototype, "link", null);
        __decorate([
            $jin2_grab
        ], $mol_switcher.prototype, "value", null);
        __decorate([
            $jin2_grab
        ], $mol_switcher.prototype, "selected", null);
        $mol_switcher = __decorate([
            $mol_replace
        ], $mol_switcher);
        return $mol_switcher;
    }($mol.$mol_checker));
    $mol.$mol_switcher = $mol_switcher;
})($mol || ($mol = {}));
//# sourceMappingURL=switcher.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_switcher = (function (_super) {
    __extends($mol_switcher, _super);
    function $mol_switcher() {
        _super.apply(this, arguments);
    }
    $mol_switcher.prototype.checked = function () {
        var _this = this;
        return this.prop(function () { return _this.selected().get() === _this.value().get(); }, function (next) {
            _this.selected().set(next ? _this.value().get() : null);
            return next;
        });
    };
    $mol_switcher.prototype.link = function () {
        var _this = this;
        return this.prop(function () {
            var prop = _this.selected();
            return prop['link'] && prop['link'](_this.value().get()).get() || null;
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_switcher.prototype, "checked", null);
    __decorate([
        $jin2_grab
    ], $mol_switcher.prototype, "link", null);
    $mol_switcher = __decorate([
        $mol_replace
    ], $mol_switcher);
    return $mol_switcher;
}($mol.$mol_switcher));
//# sourceMappingURL=switcher.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_app_todo = (function (_super) {
        __extends($mol_app_todo, _super);
        function $mol_app_todo() {
            _super.apply(this, arguments);
        }
        $mol_app_todo.prototype.title = function () { return this.prop(function () { return ["todos"]; }); };
        $mol_app_todo.prototype.titler = function () {
            var _this = this;
            var view = new $mol_view;
            view.child = function () { return _this.title(); };
            return view;
        };
        $mol_app_todo.prototype.items = function () { return this.prop(null, function (a) { return a; }); };
        $mol_app_todo.prototype.itemsCount = function () { return this.prop(0, function (a) { return a; }); };
        $mol_app_todo.prototype.panel = function () {
            var _this = this;
            var view = new $mol.$mol_lister;
            view.rowMinHeight = function () { return _this.prop(56, function () { }); };
            view.itemsVisible = function () { return _this.items(); };
            view.itemsCount = function () { return _this.itemsCount(); };
            return view;
        };
        $mol_app_todo.prototype.child = function () {
            var _this = this;
            return this.prop(function () { return [_this.titler().get(), _this.panel().get()]; });
        };
        $mol_app_todo.prototype.allCompleted = function () { return this.prop(false, function (a) { return a; }); };
        $mol_app_todo.prototype.allCompleter = function () {
            var _this = this;
            var view = new $mol.$mol_checker;
            view.checked = function () { return _this.allCompleted(); };
            return view;
        };
        $mol_app_todo.prototype.taskNewTitle = function () { return this.prop("", function (a) { return a; }); };
        $mol_app_todo.prototype.searchQuery = function () { return this.prop("", function (a) { return a; }); };
        $mol_app_todo.prototype.taskNewHint = function () { return this.prop("What needs to be done?", function (a) { return a; }); };
        $mol_app_todo.prototype.adder = function () {
            var _this = this;
            var view = new $mol.$mol_stringer;
            view.value = function () { return _this.taskNewTitle(); };
            view.valueChanged = function () { return _this.searchQuery(); };
            view.hint = function () { return _this.taskNewHint(); };
            return view;
        };
        $mol_app_todo.prototype.headerContent = function () {
            var _this = this;
            return this.prop(function () { return [_this.allCompleter().get(), _this.adder().get()]; });
        };
        $mol_app_todo.prototype.header = function () {
            var _this = this;
            var view = new $mol.$mol_rower;
            view.child = function () { return _this.headerContent(); };
            return view;
        };
        $mol_app_todo.prototype.footerVisible = function () { return this.prop(true, function (a) { return a; }); };
        $mol_app_todo.prototype.pendingCount = function () { return this.prop(0, function (a) { return a; }); };
        $mol_app_todo.prototype.pendingCounter = function () {
            var _this = this;
            var view = new $mol_view;
            view.child = function () { return _this.pendingCount(); };
            return view;
        };
        $mol_app_todo.prototype.pendingTail = function () { return this.prop(" items left", function (a) { return a; }); };
        $mol_app_todo.prototype.pendingMessage = function () {
            var _this = this;
            return this.prop(function () { return [_this.pendingCounter().get(), _this.pendingTail().get()]; });
        };
        $mol_app_todo.prototype.pendinger = function () {
            var _this = this;
            var view = new $mol_view;
            view.child = function () { return _this.pendingMessage(); };
            return view;
        };
        $mol_app_todo.prototype.argCompleted = function () { return this.prop("", function (a) { return a; }); };
        $mol_app_todo.prototype.filterAll = function () {
            var _this = this;
            var view = new $mol.$mol_switcher;
            view.selected = function () { return _this.argCompleted(); };
            view.value = function () { return _this.prop(null, function () { }); };
            view.child = function () { return _this.prop("All", function () { }); };
            return view;
        };
        $mol_app_todo.prototype.filterActive = function () {
            var _this = this;
            var view = new $mol.$mol_switcher;
            view.selected = function () { return _this.argCompleted(); };
            view.value = function () { return _this.prop("false", function () { }); };
            view.child = function () { return _this.prop("Active", function () { }); };
            return view;
        };
        $mol_app_todo.prototype.filterCompleted = function () {
            var _this = this;
            var view = new $mol.$mol_switcher;
            view.selected = function () { return _this.argCompleted(); };
            view.value = function () { return _this.prop("true", function () { }); };
            view.child = function () { return _this.prop("Completed", function () { }); };
            return view;
        };
        $mol_app_todo.prototype.filterOptions = function () {
            var _this = this;
            return this.prop(function () { return [_this.filterAll().get(), _this.filterActive().get(), _this.filterCompleted().get()]; });
        };
        $mol_app_todo.prototype.filter = function () {
            var _this = this;
            var view = new $mol.$mol_rower;
            view.child = function () { return _this.filterOptions(); };
            return view;
        };
        $mol_app_todo.prototype.actionerVisible = function () { return this.prop(true, function (a) { return a; }); };
        $mol_app_todo.prototype.sanitizes = function () { return this.prop(null, function (a) { return a; }); };
        $mol_app_todo.prototype.sanitizerMessage = function () { return this.prop("Clear completed", function (a) { return a; }); };
        $mol_app_todo.prototype.sanitizer = function () {
            var _this = this;
            var view = new $mol.$mol_clicker;
            view.clicks = function () { return _this.sanitizes(); };
            view.child = function () { return _this.sanitizerMessage(); };
            return view;
        };
        $mol_app_todo.prototype.actioner = function () {
            var _this = this;
            var view = new $mol.$mol_app_todo_ghost;
            view.visible = function () { return _this.actionerVisible(); };
            view.child = function () { return _this.sanitizer(); };
            return view;
        };
        $mol_app_todo.prototype.footerContent = function () {
            var _this = this;
            return this.prop(function () { return [_this.pendinger().get(), _this.filter().get(), _this.actioner().get()]; });
        };
        $mol_app_todo.prototype.footer = function () {
            var _this = this;
            var view = new $mol.$mol_app_todo_ghost;
            view.visible = function () { return _this.footerVisible(); };
            view.child = function () { return _this.footerContent(); };
            return view;
        };
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "titler", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "items", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "itemsCount", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "panel", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "allCompleted", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "allCompleter", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "taskNewTitle", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "searchQuery", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "taskNewHint", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "adder", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "header", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "footerVisible", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "pendingCount", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "pendingCounter", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "pendingTail", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "pendinger", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "argCompleted", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "filterAll", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "filterActive", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "filterCompleted", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "filter", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "actionerVisible", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "sanitizes", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "sanitizerMessage", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "sanitizer", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "actioner", null);
        __decorate([
            $jin2_grab
        ], $mol_app_todo.prototype, "footer", null);
        $mol_app_todo = __decorate([
            $mol_replace
        ], $mol_app_todo);
        return $mol_app_todo;
    }($mol.$mol_scroller));
    $mol.$mol_app_todo = $mol_app_todo;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_app_todo_ghost = (function (_super) {
        __extends($mol_app_todo_ghost, _super);
        function $mol_app_todo_ghost() {
            _super.apply(this, arguments);
        }
        $mol_app_todo_ghost.prototype.visible = function () { return this.prop(true, function (a) { return a; }); };
        $mol_app_todo_ghost.prototype.attr_mol_app_todo_ghost_visible = function () { return this.visible(); };
        __decorate([
            $jin2_grab
        ], $mol_app_todo_ghost.prototype, "visible", null);
        $mol_app_todo_ghost = __decorate([
            $mol_replace
        ], $mol_app_todo_ghost);
        return $mol_app_todo_ghost;
    }($mol_view));
    $mol.$mol_app_todo_ghost = $mol_app_todo_ghost;
})($mol || ($mol = {}));
//# sourceMappingURL=todo.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_app_todo = (function (_super) {
    __extends($mol_app_todo, _super);
    function $mol_app_todo() {
        _super.apply(this, arguments);
    }
    $mol_app_todo.prototype.tasksAll = function () {
        var _this = this;
        var state = function () { return _this.persist('tasksAll'); };
        return this.atom(function () { return (state().get() || []).map(function (id) { return _this.task(id).get(); }); }, function (next) { state().set(next.map(function (task) { return task.id; })); });
    };
    $mol_app_todo.prototype.task = function (id) {
        var _this = this;
        var state = function () { return _this.persist('task=' + id); };
        return this.atom(function () { return state().get() || { id: id, completed: false, title: '' }; }, function (next) { state().set(next); });
    };
    $mol_app_todo.prototype.argCompleted = function () { return this.argument().item('completed'); };
    $mol_app_todo.prototype.groupsByCompleted = function () {
        var _this = this;
        return this.atom(function () {
            var groups = { 'true': [], 'false': [] };
            _this.tasksAll().get().forEach(function (task) {
                groups[String(task.completed)].push(task);
            });
            return groups;
        });
    };
    $mol_app_todo.prototype.tasks = function () {
        var _this = this;
        return $jin2_atom_list.prop(function () {
            var completed = _this.argCompleted().get();
            if (completed) {
                var tasks = _this.groupsByCompleted().get()[completed] || [];
            }
            else {
                var tasks = _this.tasksAll().get();
            }
            return tasks;
        });
    };
    $mol_app_todo.prototype.itemsCount = function () {
        var _this = this;
        return this.prop(function () { return _this.tasks().get().length + 2; });
    };
    $mol_app_todo.prototype.pendingCount = function () {
        var _this = this;
        return this.prop(function () { return _this.groupsByCompleted().get()['false'].length; });
    };
    $mol_app_todo.prototype.completedCount = function () {
        var _this = this;
        return this.prop(function () { return _this.groupsByCompleted().get()['true'].length; });
    };
    $mol_app_todo.prototype.allCompleted = function () {
        var _this = this;
        return this.atom(function () { return _this.pendingCount().get() === 0; }, function (next) {
            var tasks = _this.tasksAll().get();
            tasks.forEach(function (task) {
                if (task.completed)
                    return;
                _this.task(task.id).set({ id: task.id, completed: true, title: task.title });
            });
        });
    };
    $mol_app_todo.prototype.pendingTail = function () {
        var _this = this;
        return this.prop(function () {
            return (_this.pendingCount().get() === 1 ? ' item left' : ' items left');
        });
    };
    $mol_app_todo.prototype.taskNewTitle = function () {
        var _this = this;
        return this.prop('', function (next) {
            if (next) {
                var tasks = _this.tasksAll().get();
                var maxId = 0;
                tasks.forEach(function (task) {
                    if (task.id > maxId)
                        maxId = task.id;
                });
                var task = { id: maxId + 1, completed: false, title: next };
                _this.task(task.id).set(task);
                tasks = tasks.concat([task]);
                _this.tasksAll().set(tasks);
            }
        });
    };
    $mol_app_todo.prototype.items = function () {
        var _this = this;
        return $jin2_atom_list.prop(function () {
            var items = _this.tasks().get();
            var limit = Math.min(items.length, _this.panel().limitEnd().get());
            var rows = [_this.header().get()].concat(items.slice(0, limit).map(function (task) { return _this.taskRow(task.id).get(); }));
            if (limit === items.length)
                rows.push(_this.footer().get());
            return rows;
        }, function (next) { return null; });
    };
    $mol_app_todo.prototype.taskRow = function (id) {
        var _this = this;
        var next = new $mol.$mol_app_todo_task_view_row;
        next.taskCompleted = function () { return _this.prop(function () { return _this.task(id).get().completed; }, function (next) {
            var task = _this.task(id).get();
            _this.task(task.id).set({ id: task.id, completed: next, title: task.title });
        }); };
        next.taskTitle = function () { return _this.prop(function () { return _this.task(id).get().title; }, function (next) {
            var task = _this.task(id).get();
            _this.task(task.id).set({ id: task.id, completed: task.completed, title: next });
        }); };
        next.taskDrops = function () { return _this.taskDrops(id); };
        return next;
    };
    $mol_app_todo.prototype.taskDrops = function (id) {
        var _this = this;
        return this.prop(null, function (next) {
            var tasks = _this.tasksAll().get().filter(function (task) { return task.id !== id; });
            _this.tasksAll().set(tasks);
        });
    };
    $mol_app_todo.prototype.sanitizes = function () {
        var _this = this;
        return this.prop(null, function (next) {
            var tasks = _this.tasksAll().get().filter(function (task) { return !task.completed; });
            _this.tasksAll().set(tasks);
        });
    };
    $mol_app_todo.prototype.sanitizerMessage = function () {
        var _this = this;
        return this.prop(function () { return ("Clear completed (" + _this.completedCount().get() + ")"); });
    };
    $mol_app_todo.prototype.footerVisible = function () {
        var _this = this;
        return this.prop(function () { return _this.tasksAll().get().length > 0; });
    };
    $mol_app_todo.prototype.actionerVisible = function () {
        var _this = this;
        return this.prop(function () { return _this.completedCount().get() > 0; });
    };
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "tasksAll", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "task", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "groupsByCompleted", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "tasks", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "itemsCount", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "pendingCount", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "completedCount", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "allCompleted", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "pendingTail", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "taskNewTitle", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "items", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "taskRow", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "taskDrops", null);
    __decorate([
        $jin2_grab
    ], $mol_app_todo.prototype, "sanitizes", null);
    $mol_app_todo = __decorate([
        $mol_replace
    ], $mol_app_todo);
    return $mol_app_todo;
}($mol.$mol_app_todo));
//# sourceMappingURL=todo.view.js.map
//# sourceMappingURL=index.env=web.stage=release.js.map