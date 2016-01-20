var $jin = this.$jin = {}

;
//# sourceMappingURL=dumb.js.map
;
function $jin2_error(info) {
    var error = new Error(info.reason);
    Object.defineProperty(error, 'message', {
        get: function () {
            return JSON.stringify(this.info);
        }
    });
    error['info'] = info;
    return error;
}
//# sourceMappingURL=error.js.map
;
function $jin2_object_path(obj) {
    var path = obj.objectPath;
    if (path)
        return path;
    if (typeof obj === 'function') {
        return obj.objectPath = obj.name || Function.toString.call(obj).match(/^\s*function\s*([$\w]*)\s*\(/)[1];
    }
    throw $jin2_error({ reason: 'Field not defined', field: 'objectPath' });
}
var $jin2_object = (function () {
    function $jin2_object() {
        this._objectName = null;
        this._objectId = null;
        this._objectPath = null;
        this._objectOwner = null;
    }
    $jin2_object.prototype.destroy = function () {
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
        get: function () {
            return (this._objectName == null)
                ? (this._objectName = '')
                : this._objectName;
        },
        set: function (next) {
            if (this._objectName != null)
                throw $jin2_error({
                    reason: 'Property already defined',
                    path: this.objectPath + '.objectName',
                    next: next,
                    prev: this._objectName,
                });
            this._objectName = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectId", {
        get: function () {
            return (this._objectId == null)
                ? (this._objectId = String($jin2_object.seed++))
                : this._objectId;
        },
        set: function (next) {
            if (this._objectId != null)
                throw $jin2_error({
                    reason: 'Property already defined',
                    path: this.objectPath + '.objectId',
                    next: next,
                    prev: this._objectId,
                });
            this._objectId = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectPath", {
        get: function () {
            return (this._objectPath == null)
                ? (this._objectPath = $jin2_object_path(this.objectOwner) + '.' + this.objectName + '_' + this.objectId)
                : this._objectPath;
        },
        set: function (next) {
            if (this._objectPath != null)
                throw $jin2_error({
                    reason: 'Property already defined',
                    path: this.objectPath + '.objectPath',
                    next: next,
                    prev: this._objectPath,
                });
            this._objectPath = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectOwner", {
        get: function () {
            if (this._objectOwner)
                return this._objectOwner;
            return this.objectOwner = this.constructor;
        },
        set: function (next) {
            var ownerField = this.objectName + '_' + this.objectId;
            if (next) {
                var prev = this._objectOwner;
                if (prev)
                    throw $jin2_error({
                        reason: 'Property already defined',
                        path: this.objectPath + '.objectOwner',
                        prev: prev,
                        next: next
                    });
                var nextVal = next[ownerField];
                if (nextVal === this)
                    return;
                if (nextVal)
                    throw $jin2_error({
                        reason: 'Property already defined',
                        path: next.objectPath + '.' + ownerField,
                        prev: nextVal,
                        next: this
                    });
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
    $jin2_object.seed = 0;
    return $jin2_object;
})();
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
        if (pull)
            this.pull_ = pull;
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
        return prev;
    };
    $jin2_prop.prototype.put_ = function (next, prev) {
        throw $jin2_error({ reason: 'Read only' });
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
})($jin2_object);
//# sourceMappingURL=prop.js.map
;
function $jin2_grab(prototype, name, descr) {
    var prefix = name + '_';
    var getValue = function (id) {
        if (id === void 0) { id = ''; }
        var field = prefix + id;
        if (this[field])
            return this[field];
        var obj = makeValue.call(this, id);
        obj.objectName = name;
        obj.objectId = id;
        obj.objectOwner = this;
        return obj;
    };
    if (descr.get) {
        var makeValue = descr.get;
        descr.get = getValue;
        descr.set = function (next) {
            if (typeof next === 'function') {
                makeValue = next;
            }
            else {
                this[prefix] = next;
            }
        };
    }
    else {
        var makeValue = descr.value;
        descr.value = getValue;
    }
}
//# sourceMappingURL=grab.js.map
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
    function $jin2_atom(pull, put) {
        _super.call(this);
        this._ = void 0;
        this.error = $jin2_atom.obsolete;
        this.masters = null;
        this.mastersDeep = 0;
        this.slaves = null;
        if (pull)
            this.pull_ = pull;
        if (put)
            this.put_ = put;
    }
    $jin2_atom.prototype.wrap = function (get, set) {
        var _this = this;
        return new $jin2_prop(get ? (function () { return get(_this.get()); }) : function () { return _this.get(); }, set ? function (next, prev) { return _this.set(set(next)); } : function (next, prev) { return _this.set(next, prev); });
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
    $jin2_atom.prototype.touch = function () {
        var slave = $jin2_atom.stack[$jin2_atom.stack.length - 1];
        if (!slave)
            return;
        slave.obey(this);
        this.lead(slave);
    };
    $jin2_atom.prototype.get = function () {
        this.touch();
        if (this.error === $jin2_atom.obsolete)
            this.pull();
        if (this.error)
            throw this.error;
        return this._;
    };
    $jin2_atom.prototype.pull = function () {
        var _this = this;
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
        $jin2_atom._planReap.delete(this);
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
        })($jin2_atom);
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
        })($jin2_atom);
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
        this._planReap.add(atom);
        this.schedule();
    };
    $jin2_atom.schedule = function () {
        if (this._timer)
            return;
        this._timer = setTimeout(this.induce.bind(this));
    };
    $jin2_atom.induce = function () {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        this.schedule();
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
            this._planReap.forEach(function (atom) {
                someReaped = atom.reap();
            });
            if (!someReaped)
                break;
        }
        clearTimeout(this._timer);
        this._timer = null;
    };
    $jin2_atom.wait = new Error('Wait...');
    $jin2_atom.obsolete = new Error('Obsolate state!');
    $jin2_atom.stack = $jin2_state_stack['$jin2_atom_stack'] = [];
    $jin2_atom._planPull = [];
    $jin2_atom._planReap = new Set;
    $jin2_atom._minUpdateDeep = 0;
    return $jin2_atom;
})($jin2_object);
var $jin2_atom_own = (function (_super) {
    __extends($jin2_atom_own, _super);
    function $jin2_atom_own() {
        _super.apply(this, arguments);
    }
    $jin2_atom_own.prototype.push = function (next) {
        var prev = this._;
        next = this.norm_(next, prev);
        this.error = null;
        if (next !== prev) {
            next.objectName = '';
            next.objectId = '';
            next.objectOwner = this;
            this.notify(prev);
        }
        return next;
    };
    return $jin2_atom_own;
})($jin2_atom);
var $jin2_atom_list = (function (_super) {
    __extends($jin2_atom_list, _super);
    function $jin2_atom_list() {
        _super.apply(this, arguments);
    }
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
})($jin2_atom);
window.addEventListener('error', function (event) {
    var stack = $jin2_atom.stack;
    $jin2_atom.stack = [];
    for (var _i = 0; _i < stack.length; _i++) {
        var atom = stack[_i];
        console.debug(atom.objectPath);
    }
    for (var _a = 0; _a < stack.length; _a++) {
        var atom = stack[_a];
        atom.fail(event['error']);
    }
    $jin2_atom.induce();
});
//# sourceMappingURL=atom.js.map
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
        return new $jin2_atom(function () { return localStorage.getItem(key) || null; }, function (next) {
            if (next == null) {
                localStorage.removeItem(key);
            }
            else {
                var value = String(next);
                localStorage.setItem(key, value);
            }
        });
    };
    __decorate([
        $jin2_grab
    ], $jin2_state_local, "item", null);
    return $jin2_state_local;
})();
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
var $jin2_demo_todomvc_task = (function (_super) {
    __extends($jin2_demo_todomvc_task, _super);
    function $jin2_demo_todomvc_task() {
        _super.apply(this, arguments);
    }
    $jin2_demo_todomvc_task.prototype.id = function () {
        var _this = this;
        return new $jin2_prop(function () { return _this.objectOwner.objectId; });
    };
    $jin2_demo_todomvc_task.prototype.data = function () {
        var _this = this;
        return new $jin2_atom(function () {
            var val = $jin2_state_local.item(_this.objectPath).get();
            return val ? JSON.parse(val) : { title: '', completed: false };
        }, function (next) {
            var prev = _this.data().get();
            if (next && prev)
                for (var key in prev)
                    if (!(key in next))
                        next[key] = prev[key];
            $jin2_state_local.item(_this.objectPath).set(JSON.stringify(next));
            return next;
        });
    };
    $jin2_demo_todomvc_task.prototype.title = function () {
        return this.data().wrap(function (val) { return val.title || ''; }, function (next) { return ({ title: next }); });
    };
    $jin2_demo_todomvc_task.prototype.completed = function () {
        return this.data().wrap(function (val) { return !!val.completed; }, function (next) { return ({ completed: next }); });
    };
    __decorate([
        $jin2_grab
    ], $jin2_demo_todomvc_task.prototype, "data", null);
    return $jin2_demo_todomvc_task;
})($jin2_object);
//# sourceMappingURL=task.js.map
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
            return this.objectOwner['_' + this.objectName + '_' + this.objectId];
        },
        set: function (next) {
            this.objectOwner['_' + this.objectName + '_' + this.objectId] = next;
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
})($jin2_object);
var $jin2_vary_own = (function (_super) {
    __extends($jin2_vary_own, _super);
    function $jin2_vary_own() {
        _super.apply(this, arguments);
    }
    $jin2_vary_own.prototype.push = function (next) {
        var prev = this.value;
        next = this.norm_(next, prev);
        if (next !== prev) {
            next.objectName = '_' + this.objectName;
            next.objectId = this.objectId;
            next.objectOwner = this.objectOwner;
            this.notify(prev);
        }
        return next;
    };
    return $jin2_vary_own;
})($jin2_vary);
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
var $mol_block = (function (_super) {
    __extends($mol_block, _super);
    function $mol_block() {
        _super.call(this);
    }
    $mol_block.app = function (id) {
        var _this = this;
        return new $jin2_atom_own(function () { return new _this(); });
    };
    $mol_block.prototype.tagName = function () {
        return { get: function () { return 'div'; } };
    };
    $mol_block.prototype.nameSpace = function () {
        return { get: function () { return 'http://www.w3.org/1999/xhtml'; } };
    };
    $mol_block.prototype.child = function () {
        return { get: function () { return null; } };
    };
    $mol_block.prototype.attr = function () {
        return {};
    };
    $mol_block.prototype.field = function () {
        return {};
    };
    $mol_block.prototype.event = function () {
        return {};
    };
    $mol_block.prototype.node = function () {
        var _this = this;
        return new $jin2_vary(function () {
            var id = _this.objectPath;
            var prev = document.getElementById(id);
            if (!prev) {
                prev = document.createElementNS(_this.nameSpace().get(), _this.tagName().get());
                prev.setAttribute('id', id);
            }
            var router = prev;
            var events = _this.event();
            for (var name in events)
                (function (name) {
                    var prop = events[name];
                    router.addEventListener(name, function (event) {
                        prop.set(event);
                        requestAnimationFrame($jin2_atom.induce.bind($jin2_atom));
                    }, false);
                })(name);
            var proto1 = _this.objectOwner.objectOwner;
            while (proto1 && (proto1.constructor !== $mol_block) && (proto1.constructor !== Function)) {
                var className = $jin2_object_path(proto1.constructor);
                if (!className)
                    continue;
                prev.setAttribute(className.replace(/\$/g, '') + '_' + _this.objectOwner.objectName, '');
                proto1 = Object.getPrototypeOf(proto1);
            }
            var proto2 = _this;
            while (proto2 && (proto2.constructor !== $mol_block)) {
                var className = $jin2_object_path(proto2.constructor);
                if (!className)
                    continue;
                prev.setAttribute(className.replace(/\$/g, ''), "");
                proto2 = Object.getPrototypeOf(proto2);
            }
            var onAttach = function (event) {
                prev.removeEventListener('DOMNodeInserted', onAttach);
                _this.version().pull();
            };
            if (prev.parentNode) {
                setTimeout(onAttach);
            }
            else {
                prev.addEventListener('DOMNodeInserted', onAttach);
            }
            return prev;
        });
    };
    $mol_block.prototype.version = function () {
        var _this = this;
        var prop = new $jin2_atom(function () {
            var prev = _this.node().get();
            var attrs = _this.attr();
            for (var name in attrs) {
                var p = prev.getAttribute(name);
                var n = String(attrs[name].get());
                if (p !== n) {
                    prev.setAttribute(name, n);
                }
            }
            var childs = _this.child().get();
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
            var fields = _this.field();
            for (var path in fields) {
                var names = path.split('.');
                var obj = prev;
                for (var i = 0; i < names.length - 1; ++i) {
                    if (names[i])
                        obj = obj[names[i]];
                }
                obj[names[names.length - 1]] = fields[path].get();
            }
            prev.removeAttribute('mol_error');
            return prev;
        });
        prop.fail_ = function (error) {
            var node = _this.node().get();
            if (error === $jin2_atom.wait) {
                node.setAttribute('mol_error', 'wait');
            }
            else {
                node.setAttribute('mol_error', 'fail');
            }
            return node;
        };
        return prop;
    };
    __decorate([
        $jin2_grab
    ], $mol_block.prototype, "node", null);
    __decorate([
        $jin2_grab
    ], $mol_block.prototype, "version", null);
    __decorate([
        $jin2_grab
    ], $mol_block, "app", null);
    return $mol_block;
})($jin2_object);
function $mol_replace(Class) {
    $mol[Class.name] = Class;
    window[Class.name] = Class;
    return Class;
}
//# sourceMappingURL=block.js.map
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $jin2_state_arg = (function () {
    function $jin2_state_arg() {
    }
    $jin2_state_arg.href = function () {
        return new $jin2_atom(function () { return window.location.search + window.location.hash; }, function (next) { return document.location.href = next; });
    };
    $jin2_state_arg.dict = function () {
        var _this = this;
        return new $jin2_atom(function () {
            var href = _this.href().get();
            var chunks = href.split(/[\/\?#!&;]/g);
            var params = {};
            chunks.forEach(function (chunk) {
                if (!chunk)
                    return;
                var vals = chunk.split(/[:=]/).map(decodeURIComponent);
                params[vals.shift()] = vals;
            });
            return params;
        }, function (next) {
            _this.href().set(_this.make(next));
        });
    };
    $jin2_state_arg.item = function (key) {
        var _this = this;
        return new $jin2_atom(function () {
            return _this.dict().get()[key] || null;
        }, function (next) {
            var diff = {};
            diff[key] = next;
            _this.dict().set(diff);
        });
    };
    $jin2_state_arg.override = function (next) {
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
        return this.make(params);
    };
    $jin2_state_arg.make = function (next) {
        var chunks = [];
        for (var key in next) {
            if (!next[key])
                continue;
            chunks.push([key].concat(next[key]).map(encodeURIComponent).join('='));
        }
        return '#!' + chunks.join('/');
    };
    __decorate([
        $jin2_grab
    ], $jin2_state_arg, "href", null);
    __decorate([
        $jin2_grab
    ], $jin2_state_arg, "dict", null);
    __decorate([
        $jin2_grab
    ], $jin2_state_arg, "item", null);
    return $jin2_state_arg;
})();
window.addEventListener('hashchange', function () { return $jin2_state_arg.href().update(); });
//# sourceMappingURL=arg.env=web.js.map
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
    var $jin2_demo_todomvc = (function (_super) {
        __extends($jin2_demo_todomvc, _super);
        function $jin2_demo_todomvc() {
            _super.apply(this, arguments);
        }
        $jin2_demo_todomvc.prototype.title = function () { return new $jin2_prop(function () { return ["todos"]; }); };
        $jin2_demo_todomvc.prototype.titler = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.title(); };
                return view;
            });
        };
        $jin2_demo_todomvc.prototype.taskNewTitle = function () { return new $jin2_prop(function () { return (""); }); };
        $jin2_demo_todomvc.prototype.adder = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$jin2_demo_todomvc_adder;
                view.text = function () { return _this.taskNewTitle(); };
                return view;
            });
        };
        $jin2_demo_todomvc.prototype.allCompleted = function () { return new $jin2_prop(function () { return (false); }); };
        $jin2_demo_todomvc.prototype.allCompleter = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$jin2_demo_todomvc_completer;
                view.completed = function () { return _this.allCompleted(); };
                return view;
            });
        };
        $jin2_demo_todomvc.prototype.headerContent = function () {
            var _this = this;
            return new $jin2_prop(function () { return [_this.titler().get(), "", _this.adder().get(), "", _this.allCompleter().get(), ""]; });
        };
        $jin2_demo_todomvc.prototype.header = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.headerContent(); };
                return view;
            });
        };
        $jin2_demo_todomvc.prototype.taskRows = function () { return new $jin2_prop(function () { return (null); }); };
        $jin2_demo_todomvc.prototype.body = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.taskRows(); };
                return view;
            });
        };
        $jin2_demo_todomvc.prototype.pendingCount = function () { return new $jin2_prop(function () { return (0); }); };
        $jin2_demo_todomvc.prototype.pendingCounter = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.pendingCount(); };
                return view;
            });
        };
        $jin2_demo_todomvc.prototype.pendingTail = function () { return new $jin2_prop(function () { return ("123"); }); };
        $jin2_demo_todomvc.prototype.pendingMessage = function () {
            var _this = this;
            return new $jin2_prop(function () { return [_this.pendingCounter().get(), "", _this.pendingTail().get(), ""]; });
        };
        $jin2_demo_todomvc.prototype.pendinger = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.pendingMessage(); };
                return view;
            });
        };
        $jin2_demo_todomvc.prototype.footer = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.pendinger(); };
                return view;
            });
        };
        $jin2_demo_todomvc.prototype.child = function () {
            var _this = this;
            return new $jin2_prop(function () { return [_this.header().get(), "", _this.body().get(), "", _this.footer().get(), ""]; });
        };
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc.prototype, "titler", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc.prototype, "adder", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc.prototype, "allCompleter", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc.prototype, "header", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc.prototype, "body", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc.prototype, "pendingCounter", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc.prototype, "pendinger", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc.prototype, "footer", null);
        $jin2_demo_todomvc = __decorate([
            $mol_replace
        ], $jin2_demo_todomvc);
        return $jin2_demo_todomvc;
    })($mol_block);
    $mol.$jin2_demo_todomvc = $jin2_demo_todomvc;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $jin2_demo_todomvc_adder = (function (_super) {
        __extends($jin2_demo_todomvc_adder, _super);
        function $jin2_demo_todomvc_adder() {
            _super.apply(this, arguments);
        }
        $jin2_demo_todomvc_adder.prototype.placeHolder = function () { return new $jin2_prop(function () { return ("What needs to be done?"); }); };
        $jin2_demo_todomvc_adder.prototype.autoFocus = function () { return new $jin2_prop(function () { return (true); }); };
        $jin2_demo_todomvc_adder.prototype.text = function () { return new $jin2_prop(function () { return (""); }); };
        $jin2_demo_todomvc_adder.prototype.eventKeyPress = function () { return new $jin2_prop(function () { return (null); }); };
        $jin2_demo_todomvc_adder.prototype.tagName = function () { return new $jin2_prop(function () { return ("input"); }); };
        $jin2_demo_todomvc_adder.prototype.field = function () {
            return {
                "placeholder": this.placeHolder(),
                "autofocus": this.autoFocus(),
                "value": this.text(),
            };
        };
        $jin2_demo_todomvc_adder.prototype.event = function () {
            return {
                "keypress": this.eventKeyPress(),
            };
        };
        $jin2_demo_todomvc_adder = __decorate([
            $mol_replace
        ], $jin2_demo_todomvc_adder);
        return $jin2_demo_todomvc_adder;
    })($mol_block);
    $mol.$jin2_demo_todomvc_adder = $jin2_demo_todomvc_adder;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $jin2_demo_todomvc_task_view_row = (function (_super) {
        __extends($jin2_demo_todomvc_task_view_row, _super);
        function $jin2_demo_todomvc_task_view_row() {
            _super.apply(this, arguments);
        }
        $jin2_demo_todomvc_task_view_row.prototype.taskCompleted = function () { return new $jin2_prop(function () { return (false); }); };
        $jin2_demo_todomvc_task_view_row.prototype.completer = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$jin2_demo_todomvc_completer;
                view.completed = function () { return _this.taskCompleted(); };
                return view;
            });
        };
        $jin2_demo_todomvc_task_view_row.prototype.taskTitle = function () { return new $jin2_prop(function () { return (""); }); };
        $jin2_demo_todomvc_task_view_row.prototype.title = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.taskTitle(); };
                return view;
            });
        };
        $jin2_demo_todomvc_task_view_row.prototype.eventDrop = function () { return new $jin2_prop(function () { return (null); }); };
        $jin2_demo_todomvc_task_view_row.prototype.dropper = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$jin2_demo_todomvc_dropper;
                view.eventClick = function () { return _this.eventDrop(); };
                return view;
            });
        };
        $jin2_demo_todomvc_task_view_row.prototype.child = function () {
            var _this = this;
            return new $jin2_prop(function () { return [_this.completer().get(), "", _this.title().get(), "", _this.dropper().get(), ""]; });
        };
        $jin2_demo_todomvc_task_view_row.prototype.attr = function () {
            return {
                "jin2_demo_todomvc_task_view_row_completed": this.taskCompleted(),
            };
        };
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc_task_view_row.prototype, "completer", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc_task_view_row.prototype, "title", null);
        __decorate([
            $jin2_grab
        ], $jin2_demo_todomvc_task_view_row.prototype, "dropper", null);
        $jin2_demo_todomvc_task_view_row = __decorate([
            $mol_replace
        ], $jin2_demo_todomvc_task_view_row);
        return $jin2_demo_todomvc_task_view_row;
    })($mol_block);
    $mol.$jin2_demo_todomvc_task_view_row = $jin2_demo_todomvc_task_view_row;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $jin2_demo_todomvc_completer = (function (_super) {
        __extends($jin2_demo_todomvc_completer, _super);
        function $jin2_demo_todomvc_completer() {
            _super.apply(this, arguments);
        }
        $jin2_demo_todomvc_completer.prototype.type = function () { return new $jin2_prop(function () { return ("checkbox"); }); };
        $jin2_demo_todomvc_completer.prototype.completed = function () { return new $jin2_prop(function () { return (false); }); };
        $jin2_demo_todomvc_completer.prototype.eventClick = function () { return new $jin2_prop(function () { return (null); }); };
        $jin2_demo_todomvc_completer.prototype.tagName = function () { return new $jin2_prop(function () { return ("input"); }); };
        $jin2_demo_todomvc_completer.prototype.field = function () {
            return {
                "checked": this.completed(),
            };
        };
        $jin2_demo_todomvc_completer.prototype.attr = function () {
            return {
                "type": this.type(),
            };
        };
        $jin2_demo_todomvc_completer.prototype.event = function () {
            return {
                "click": this.eventClick(),
            };
        };
        $jin2_demo_todomvc_completer = __decorate([
            $mol_replace
        ], $jin2_demo_todomvc_completer);
        return $jin2_demo_todomvc_completer;
    })($mol_block);
    $mol.$jin2_demo_todomvc_completer = $jin2_demo_todomvc_completer;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $jin2_demo_todomvc_dropper = (function (_super) {
        __extends($jin2_demo_todomvc_dropper, _super);
        function $jin2_demo_todomvc_dropper() {
            _super.apply(this, arguments);
        }
        $jin2_demo_todomvc_dropper.prototype.eventClick = function () { return new $jin2_prop(function () { return (null); }); };
        $jin2_demo_todomvc_dropper.prototype.tagName = function () { return new $jin2_prop(function () { return ("button"); }); };
        $jin2_demo_todomvc_dropper.prototype.event = function () {
            return {
                "click": this.eventClick(),
            };
        };
        $jin2_demo_todomvc_dropper = __decorate([
            $mol_replace
        ], $jin2_demo_todomvc_dropper);
        return $jin2_demo_todomvc_dropper;
    })($mol_block);
    $mol.$jin2_demo_todomvc_dropper = $jin2_demo_todomvc_dropper;
})($mol || ($mol = {}));
//# sourceMappingURL=todomvc.view.tree.js.map
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
var $jin2_demo_todomvc = (function (_super) {
    __extends($jin2_demo_todomvc, _super);
    function $jin2_demo_todomvc() {
        _super.apply(this, arguments);
    }
    $jin2_demo_todomvc.prototype.tasksAll = function () {
        var _this = this;
        var state = $jin2_state_local.item(this.objectPath + '.tasksAll_');
        return new $jin2_atom_list(function () {
            var val = state.get();
            if (!val)
                return [];
            return val.split(',').map(function (id) { return _this.task(id).get(); });
        }, function (next) {
            state.set(next.map(function (task) { return task.id().get(); }));
            return next;
        });
    };
    $jin2_demo_todomvc.prototype.tasksSeed = function () {
        var state = $jin2_state_local.item(this.objectPath + '.tasksSeed_');
        return new $jin2_atom(function () { return Number(state.get()) || 0; });
    };
    $jin2_demo_todomvc.prototype.tasks = function () {
        var _this = this;
        return new $jin2_atom(function () {
            var completed = $jin2_state_arg.item('completed').get();
            if (!completed || !completed.length)
                return _this.tasksAll().get();
            return _this.groupsByCompleted().get()[completed[0]] || [];
        });
    };
    $jin2_demo_todomvc.prototype.task = function (id) {
        return new $jin2_atom_own(function () { return new $jin2_demo_todomvc_task; });
    };
    $jin2_demo_todomvc.prototype.allCompleted = function () {
        var _this = this;
        return new $jin2_prop(function () { return _this.pendingCount().get() === 0; }, function (next) { _this.tasksAll().get().forEach(function (task) { return task.completed().set(next); }); });
    };
    $jin2_demo_todomvc.prototype.groupsByCompleted = function () {
        var _this = this;
        return new $jin2_atom(function () {
            var groups = { 'true': [], 'false': [] };
            _this.tasksAll().get().forEach(function (task) {
                groups[task.completed().get() + ''].push(task);
            });
            return groups;
        });
    };
    $jin2_demo_todomvc.prototype.pendingCount = function () {
        var _this = this;
        return new $jin2_prop(function () { return _this.groupsByCompleted().get()['false'].length; });
    };
    $jin2_demo_todomvc.prototype.pendingTail = function () {
        var _this = this;
        return new $jin2_prop(function () { return (_this.pendingCount().get() === 1 ? ' item left' : ' items left'); });
    };
    $jin2_demo_todomvc.prototype.taskNewTitle = function () {
        var _this = this;
        return new $jin2_prop(function () { return ''; }, function (next) {
            var id = _this.tasksSeed().get();
            _this.tasksSeed().set(id + 1);
            var task = _this.task(id).get();
            task.title().set(next);
            var tasks = _this.tasksAll().get();
            tasks = tasks.concat(task);
            _this.tasksAll().set(tasks);
        });
    };
    $jin2_demo_todomvc.prototype.taskDrop = function () {
        var _this = this;
        return new $jin2_prop(function () { return null; }, function (next) {
            var tasks = _this.tasksAll().get();
            var index = tasks.indexOf(next);
            if (index >= 0) {
                tasks = tasks.slice(0, index).concat(tasks.slice(index + 1));
                _this.tasksAll().set(tasks);
                next.data().set({ title: void 0, completed: void 0 });
            }
        });
    };
    $jin2_demo_todomvc.prototype.taskRows = function () {
        var _this = this;
        return new $jin2_prop(function () { return _this.tasks().get().map(function (task) { return _this.taskRow(task.id().get()).get(); }); }, function (next) { return null; });
    };
    $jin2_demo_todomvc.prototype.taskRow = function (id) {
        var _this = this;
        return new $jin2_atom_own(function () {
            var next = new $jin2_demo_todomvc_task_view_row;
            next.task = function () { return _this.task(id); };
            next.eventDrop = function () { return new $jin2_prop(function () { return null; }, function (next) { return _this.taskDrop().set(_this.task(id).get()); }); };
            return next;
        });
    };
    __decorate([
        $jin2_grab
    ], $jin2_demo_todomvc.prototype, "tasksAll", null);
    __decorate([
        $jin2_grab
    ], $jin2_demo_todomvc.prototype, "tasksSeed", null);
    __decorate([
        $jin2_grab
    ], $jin2_demo_todomvc.prototype, "tasks", null);
    __decorate([
        $jin2_grab
    ], $jin2_demo_todomvc.prototype, "task", null);
    __decorate([
        $jin2_grab
    ], $jin2_demo_todomvc.prototype, "groupsByCompleted", null);
    __decorate([
        $jin2_grab
    ], $jin2_demo_todomvc.prototype, "taskRow", null);
    $jin2_demo_todomvc = __decorate([
        $mol_replace
    ], $jin2_demo_todomvc);
    return $jin2_demo_todomvc;
})($mol.$jin2_demo_todomvc);
var $jin2_demo_todomvc_task_view_row = (function (_super) {
    __extends($jin2_demo_todomvc_task_view_row, _super);
    function $jin2_demo_todomvc_task_view_row() {
        _super.apply(this, arguments);
    }
    $jin2_demo_todomvc_task_view_row.prototype.task = function () { return new $jin2_prop(); };
    $jin2_demo_todomvc_task_view_row.prototype.taskCompleted = function () { return this.task().get().completed(); };
    $jin2_demo_todomvc_task_view_row.prototype.taskTitle = function () { return this.task().get().title(); };
    $jin2_demo_todomvc_task_view_row = __decorate([
        $mol_replace
    ], $jin2_demo_todomvc_task_view_row);
    return $jin2_demo_todomvc_task_view_row;
})($mol.$jin2_demo_todomvc_task_view_row);
var $jin2_demo_todomvc_completer = (function (_super) {
    __extends($jin2_demo_todomvc_completer, _super);
    function $jin2_demo_todomvc_completer() {
        _super.apply(this, arguments);
    }
    $jin2_demo_todomvc_completer.prototype.eventClick = function () {
        var _this = this;
        return new $jin2_prop(function () { return null; }, function (next) {
            var completed = _this.completed();
            completed.set(!completed.get());
        });
    };
    $jin2_demo_todomvc_completer = __decorate([
        $mol_replace
    ], $jin2_demo_todomvc_completer);
    return $jin2_demo_todomvc_completer;
})($mol.$jin2_demo_todomvc_completer);
var $jin2_demo_todomvc_adder = (function (_super) {
    __extends($jin2_demo_todomvc_adder, _super);
    function $jin2_demo_todomvc_adder() {
        _super.apply(this, arguments);
    }
    $jin2_demo_todomvc_adder.prototype.eventKeyPress = function () {
        var _this = this;
        return new $jin2_prop(function () { return null; }, function (next) {
            if (next.keyCode === 13) {
                var text = next.target.value.trim();
                if (!text)
                    return;
                _this.text().set(text);
                next.target.value = '';
            }
        });
    };
    $jin2_demo_todomvc_adder = __decorate([
        $mol_replace
    ], $jin2_demo_todomvc_adder);
    return $jin2_demo_todomvc_adder;
})($mol.$jin2_demo_todomvc_adder);
//# sourceMappingURL=todomvc.view.js.map
//# sourceMappingURL=index.env=web.stage=release.js.map