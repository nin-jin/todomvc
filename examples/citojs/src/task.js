let cid = 1;

export default class Task {
	static map(todos) {
		return todos.map(data => new Task(data.title, data.completed));
	}

	constructor(title, completed) {
		this.cid = cid++;
		this.title = title;
		this.completed = !!completed;
	}

	toJSON() {
		return {title: this.title, completed: this.completed};
	}
}
