export default class {
	constructor() {
		this._events = {};
	}

	on(name, fn) {
		(this._events[name] || (this._events[name] = [])).push(fn);
	}

	off(name, fn) {
		if (this._events[name]) {
			const idx = this._events[name].indexOf(fn);

			if (idx > -1) {
				this._events[name].splice(idx, 1);
			}
		}
	}

	emit(name, data) {
		this._events[name] && this._events[name].forEach(fn => fn(data));
	}
}
