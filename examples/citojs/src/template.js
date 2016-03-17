export default function (attrs) {
	return {
		tag: 'section',
		attrs: {class: 'todoapp'},
		children: [
			{
				tag: 'header',
				attrs: {class: 'header'},
				children: {
					tag: 'form',
					events: {
						submit: (evt) => this.handleEvent(evt, 'add', evt.target.newTodo)
					},
					children: [
						{tag: 'h1', children: 'todos'},
						{
							tag: 'input',
							attrs: {
								name: 'newTodo',
								class: 'new-todo',
								placeholder: 'What needs to be done?',
								autocomplete: 'off'
							}
						}
					]
				}
			},
			{
				tag: 'section',
				attrs: {class: 'main'},
				children:
					(attrs.todos.length ? [
						{
							tag: 'input',
							attrs: {id: 'toggle-all', checked: attrs.allCompleted, class: 'toggle-all', type: 'checkbox'},
							events: {
								change: (evt) => this.handleEvent(evt, 'markall', evt.target.checked)
							}
						},
						{tag: 'label', attrs: {for: 'toggle-all'}, children: 'Mark all as complete'}
					] : [])
					.concat({
						tag: 'ul',
						attrs: {class: 'todo-list'},
						children: attrs.filteredTodos.map((todo) => ({
							tag: 'li',
							key: todo.cid,
							attrs: {class: (todo.completed ? 'completed' : '')},
							children: [{
								tag: 'div',
								attrs: {class: 'view'},
								children: [
									{
										tag: 'input',
										attrs: {checked: todo.completed, class: 'toggle', type: 'checkbox'},
										events: {
											change: (evt) => this.handleEvent(evt, 'toggle', todo)
										}
									},
									{tag: 'label', children: todo.title},
									{
										tag: 'button',
										attrs: {class: 'destroy'},
										events: {
											click: (evt) => this.handleEvent(evt, 'remove', todo)
										}
									}
								]
							}]
						}))
					})
			},

			(attrs.todos.length ? {
				tag: 'footer',
				attrs: {class: 'footer'},
				children: [
					{
						tag: 'span',
						attrs: {class: 'todo-count'},
						children: `${attrs.activeTodos.length} items left`
					},
					{
						tag: 'ul',
						attrs: {class: 'filters'},
						children: [
							{
								tag: 'li',
								children: {
									tag: 'a',
									attrs: {href: '#/', class: (attrs.filter === 'all' ? 'selected' : '')},
									children: 'All'
								}
							},
							{
								tag: 'li',
								children: {
									tag: 'a',
									attrs: {href: '#/active', class: (attrs.filter === 'active' ? 'selected' : '')},
									children: 'Active'
								}
							},
							{
								tag: 'li',
								children: {
									tag: 'a',
									attrs: {href: '#/completed', class: (attrs.filter === 'completed' ? 'selected' : '')},
									children: 'Completed'
								}
							}
						]
					},

					(attrs.todos.length != attrs.activeTodos.length ? {
						tag: 'button',
						attrs: {class: 'clear-completed'},
						events: {
							click: (evt) => this.handleEvent(evt, 'clear')
						},
						children: 'Clear completed'
					} : {tag: '!'})
				]
			} : {tag: '!'})
		]
	};
}
