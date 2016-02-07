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
				return next
			}
		)
	}

	@ $jin2_grab
	tasksSeed() {
		var state = $jin2_state_local.item( this.objectPath + '.tasksSeed_' )
		return new $jin2_atom(
			() => state.get() || 0 ,
			next => state.set( next )
		)
	}

	@ $jin2_grab
	tasks() {
		return new $jin2_atom( () => {
			var completed = $jin2_state_arg.item( 'completed' ).get()
			if( !completed || !completed.length ) return this.tasksAll().get()
			return this.groupsByCompleted().get()[ completed[0] ] || []
		} )
	}
	
	@ $jin2_grab
	task( id ) { 
		return new $jin2_atom_own( () => new $mol_app_todo_task )
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
			var groups = { 'true' : [] , 'false' : [] }
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
	pendingTail() {
		return new $jin2_atom( () => ( this.pendingCount().get() === 1 ? ' item left' : ' items left' ) )
	}

	@ $jin2_grab
	taskNewTitle() {
		return new $jin2_atom( () => '' , next => {
			if( next ) {
				var id = this.tasksSeed().get()
				this.tasksSeed().set( id + 1 )
				var task = this.task( id ).get()
				task.title().set( next )
				var tasks = this.tasksAll().get()
				tasks = tasks.concat( task )
				this.tasksAll().set( tasks )
			}
			return ''
		} )
	}

	@ $jin2_grab
	taskRowsAll() {
		return new $jin2_atom(
			() => this.tasks().get().map( task => this.taskRow( task.id().get() ).get() ) ,
			next => null
		)
	}

	@ $jin2_grab
	taskRows() {
		return new $jin2_atom(
			() => this.taskRowsAll().get(),//.slice( 0 , 20 ) ,
			next => null
		)
	}

	@$jin2_grab
	taskRow( id ) { return new $jin2_atom_own( () => {
		var next = new $mol_app_todo_task_view_row
		next.task = () => this.task( id )
		next.taskDrops = () => this.taskDrops( id )
		return next
	} ) }

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
				task.data().set({ title : void 0 , completed : void 0 })
				//next.destroy()
			}
		}
	) }

}

// Task row component
@ $mol_replace
class $mol_app_todo_task_view_row extends $mol.$mol_app_todo_task_view_row {

	@ $jin2_grab
	task() { return new $jin2_atom<$mol_app_todo_task>() }

	taskCompleted() { return this.task().get().completed() }

	taskTitle() { return this.task().get().title() }
	
}
