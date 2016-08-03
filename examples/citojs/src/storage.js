const PREFIX = 'citojs-example';

let _pid;
let _storeData;

class Storage {
	constructor(name, engine) {
		this.name = PREFIX + name;
		this.engine = engine;
	}

	get() {
		return JSON.parse(this.engine.getItem(this.name));
	}

	set(data) {
		_storeData = data;

		if (!_pid) {
			_pid = setTimeout(() => {
				_pid = null;
				this.engine.setItem(this.name, JSON.stringify(_storeData));
			}, 0);
		}
	}
}

export function createLocal(name) {
	return new Storage(name, window.localStorage);
}
