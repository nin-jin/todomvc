// Application component
@ $mol_replace
class $mol_app_todo extends $mol.$mol_app_todo {
	
	@ $jin2_grab
	tasksAll() {
		var state = this.persist( 'tasksAll_' )
		return this.atom<$mol_app_todo_task[]>(
			() =>  ( state.get() || [] ).map( id => this.task( id ).get() ) ,
			next => {
				state.set( next.map( task => task.id().get() ) )
				//return next
			}
		)
	}

	@ $jin2_grab
	tasks() { return this.atom( () => {
		var completed = this.argument( 'completed' ).get()
		if( !completed || !completed.length ) {
			var tasks = this.tasksAll().get()
		} else {
			var tasks = this.groupsByCompleted().get()[ completed[0] ] || []
		}
		
		var query = this.searchQuery().get() 
		if( query ) tasks = tasks.filter( task => !!task.title().get().match( query ) )
		
		return tasks
	} ) }
	
	@ $jin2_grab
	task( id ) { return new $mol_app_todo_task }

	@ $jin2_grab
	allCompleted() { return this.atom(
		() => this.pendingCount().get() === 0,
		next => { this.tasksAll().get().forEach( task => task.completed().set( next ) ) }
	) }
	
	@ $jin2_grab
	groupsByCompleted() { return this.atom( () => {
		var groups = <{ [ index : string ] : $mol_app_todo_task[] }> { 'true' : [] , 'false' : [] }
		this.tasksAll().get().forEach( task => {
			groups[ task.completed().get() + '' ].push( task )
		} )
		return groups
	} ) }

	@ $jin2_grab
	pendingCount() { return this.prop( () => this.groupsByCompleted().get()[ 'false' ].length ) }

	@ $jin2_grab
	completedCount() { return this.prop( () => this.groupsByCompleted().get()[ 'true' ].length ) }

	@ $jin2_grab
	pendingTail() { return this.prop( () => {
		return ( this.pendingCount().get() === 1 ? ' item left' : ' items left' )
	} ) }

	@ $jin2_grab
	taskNewTitle() { return this.prop( '' , next => {
		if( next ) {
			var tasks = this.tasksAll().get()
			var task = this.task( tasks.length ? tasks[ tasks.length - 1 ].id().get() + 1 : 1 ).get()
			task.title().set( next )
			tasks = tasks.concat( task )
			this.tasksAll().set( tasks )
		}
	} ) }

	@ $jin2_grab
	taskRows() { return this.atom(
		() => this.tasks().get().map( task => this.taskRow( task.id().get() ).get() ) ,
		next => null
	) }

	@$jin2_grab
	taskRow( id ) {
		var next = new $mol_app_todo_task_view_row
		next.task = () => this.task( id )
		next.taskDrops = () => this.taskDrops( id )
		return next
	}

	@$jin2_grab
	taskDrops( id ) { return this.prop( null , next => {
		var task = this.task( id ).get()
		var tasks = this.tasksAll().get()
		var index = tasks.indexOf( task )
		if( index >= 0 ) {
			tasks = tasks.slice( 0 , index ).concat( tasks.slice( index + 1 ) )
			this.tasksAll().set( tasks )
			task.data().set(void 0)
			//next.destroy()
		}
	} ) }

	@$jin2_grab
	sanitizes() { return this.prop( null , next => {
		var tasks = this.tasksAll().get()
		
		tasks = tasks.filter( task => {
			if( !task.completed().get() ) return true
			
			task.data().set(void 0)
			return false
		} )
		
		this.tasksAll().set( tasks )
	} ) }

	@ $jin2_grab
	sanitizerMessage() { return this.prop( () => `Clear completed (${this.completedCount().get()})` ) }
	
	@ $jin2_grab
	footerContent() { return this.prop( () => [
		this.pendingCount().get() ? this.pendinger().get() : null ,
		this.completedCount().get() ? this.sanitizer().get() : null ,
	] ) }
	
}

// Task row component
@ $mol_replace
class $mol_app_todo_task_view_row extends $mol.$mol_app_todo_task_view_row {

	@ $jin2_grab
	task() { return this.prop<$mol_app_todo_task>() }

	taskCompleted() { return this.task().get().completed() }

	taskTitle() { return this.task().get().title() }
	
}
