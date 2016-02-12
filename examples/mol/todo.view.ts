// Application component
@ $mol_replace
class $mol_app_todo extends $mol.$mol_app_todo {
	
	@ $jin2_grab
	tasksAll() {
		var state = $jin2_state_local.item( this.objectPath + '.tasksAll_' )
		return new $jin2_atom_list<$mol_app_todo_task>(
			() =>  ( state.get() || [] ).map( id => this.task( id ).get() ) ,
			next => {
				state.set( next.map( task => task.id().get() ) )
			}
		)
	}

	@ $jin2_grab
	tasks() {
		return new $jin2_atom( () => {
			var completed = $jin2_state_arg.item( 'completed' ).get()
			if( !completed || !completed.length ) {
				var tasks = this.tasksAll().get()
			} else {
				var tasks = this.groupsByCompleted().get()[ completed[0] ] || []
			}
			
			var query = this.searchQuery().get() 
			if( query ) tasks = tasks.filter( task => !!task.title().get().match( query ) )
			
			return tasks
		} )
	}
	
	@ $jin2_grab
	task( id ) { 
		return new $mol_app_todo_task
	}

	@ $jin2_grab
	allCompleted() {
		return new $jin2_atom(
			() => this.pendingCount().get() === 0,
			next => { this.tasksAll().get().forEach( task => task.completed().set( next ) ) }
		)
	}
	
	@ $jin2_grab
	groupsByCompleted() {
		return new $jin2_atom( () => {
			var groups = <{ [ index : string ] : $mol_app_todo_task[] }> { 'true' : [] , 'false' : [] }
			this.tasksAll().get().forEach( task => {
				groups[ task.completed().get() + '' ].push( task )
			} )
			return groups
		} )
	}

	@ $jin2_grab
	pendingCount() {
		return new $jin2_atom( () => this.groupsByCompleted().get()[ 'false' ].length )
	}

	@ $jin2_grab
	completedCount() {
		return new $jin2_atom( () => this.groupsByCompleted().get()[ 'true' ].length )
	}

	@ $jin2_grab
	pendingTail() {
		return new $jin2_atom( () => ( this.pendingCount().get() === 1 ? ' item left' : ' items left' ) )
	}

	@ $jin2_grab
	taskNewTitle() {
		return new $jin2_atom( () => '' , next => {
			if( next ) {
				var tasks = this.tasksAll().get()
				var task = this.task( tasks.length ? tasks[ tasks.length - 1 ].id().get() + 1 : 1 ).get()
				task.title().set( next )
				tasks = tasks.concat( task )
				this.tasksAll().set( tasks )
			}
			return ''
		} )
	}

	@ $jin2_grab
	taskRows() {
		return new $jin2_atom(
			() => this.tasks().get().map( task => this.taskRow( task.id().get() ).get() ) ,
			next => null
		)
	}

	@$jin2_grab
	taskRow( id ) {
		var next = new $mol_app_todo_task_view_row
		next.task = () => this.task( id )
		next.taskDrops = () => this.taskDrops( id )
		return next
	}

	@$jin2_grab
	taskDrops( id ) { return new $jin2_atom(
		() => null,
		next => {
			var task = this.task( id ).get()
			var tasks = this.tasksAll().get()
			var index = tasks.indexOf( task )
			if( index >= 0 ) {
				tasks = tasks.slice( 0 , index ).concat( tasks.slice( index + 1 ) )
				this.tasksAll().set( tasks )
				task.data().set(void 0)
				//next.destroy()
			}
		}
	) }

	@$jin2_grab
	sanitizes() { return new $jin2_atom(
		() => null,
		next => {
			var tasks = this.tasksAll().get()
			
			tasks = tasks.filter( task => {
				if( !task.completed().get() ) return true
				
				task.data().set(void 0)
				return false
			} )
			
			this.tasksAll().set( tasks )
		}
	) }

	@ $jin2_grab
	sanitizerMessage() {
		return new $jin2_atom( () => 'Clear completed (' + this.completedCount().get() + ')' )
	}
	
	@ $jin2_grab
	footerContent() {
		return new $jin2_atom( () => {
			return [
				this.pendingCount().get() ? this.pendinger().get() : null ,
				this.completedCount().get() ? this.sanitizer().get() : null ,
			]
		} )
	}
	
}

// Task row component
@ $mol_replace
class $mol_app_todo_task_view_row extends $mol.$mol_app_todo_task_view_row {

	@ $jin2_grab
	task() { return new $jin2_atom<$mol_app_todo_task>() }

	taskCompleted() { return this.task().get().completed() }

	taskTitle() { return this.task().get().title() }
	
}
