import Emitter from './emitter';

class Router extends Emitter {
	constructor(initialPath) {
		super();
		this.path = initialPath;
	}

	setPath(path) {
		this.path = path;
		this.emitChange();
	}

	emitChange() {
		this.emit('change', this.path);
	}

	on(name, fn) {
		super.on(name, fn);
		fn(this.path);
	}
}

class HashRouter extends Router {
	constructor(hashbang) {
		function getHash() {
			return location.toString().split(hashbang)[1] || '/';
		}

		super(getHash());

		window.addEventListener('hashchange', () => {
			this.setPath(getHash());
		});
	}
}

export function useHash(hashbang) {
	return new HashRouter(hashbang);
}
