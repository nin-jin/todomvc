interface $mol_app_todo_task {
	id : number
	completed : boolean
	title : string
}

// Application component
@ $mol_replace
class $mol_app_todo extends $mol.$mol_app_todo {
	
	@ $jin2_grab
	tasksAll() {
		var state = () => this.persist<$mol_app_todo_task[]>( 'tasksAll' )
		return this.atom<$mol_app_todo_task[]>(
			() => ( state().get() || [] ).map( id => this.task( id ).get() ) ,
			next => { state().set( next.map( task => task.id ) ) }
		)
	}

	@ $jin2_grab
	task( id : number ) {
		var state = () => this.persist<$mol_app_todo_task>( 'task=' + id )
		return this.atom<$mol_app_todo_task>(
			() => state().get() || { id : id , completed : false , title : '' } ,
			next => { state().set( next ) }
		)
	}

	argCompleted() { return this.argument().item( 'completed' ) }

	@ $jin2_grab
	groupsByCompleted() { return this.atom( () => {
		var groups = { 'true' : <$mol_app_todo_task[]>[] , 'false' : <$mol_app_todo_task[]>[] }
		this.tasksAll().get().forEach( task => {
			groups[ String( task.completed ) ].push( task )
		} )
		return groups
	} ) }

	@ $jin2_grab
	tasks() { return $jin2_atom_list.prop( () => {
		var completed = this.argCompleted().get()
		if( completed ) {
			var tasks : $mol_app_todo_task[] = this.groupsByCompleted().get()[ completed ] || []
		} else {
			var tasks = this.tasksAll().get()
		}
		
		// var query = this.searchQuery().get() 
		// if( query ) tasks = tasks.filter( task => !!task.title.match( query ) )
		
		return tasks
	} ) }
	
	@ $jin2_grab
	itemsCount() { return this.prop( () => this.tasks().get().length + 2 ) }
	
	@ $jin2_grab
	pendingCount() { return this.prop( () => this.groupsByCompleted().get()[ 'false' ].length ) }

	@ $jin2_grab
	completedCount() { return this.prop( () => this.groupsByCompleted().get()[ 'true' ].length ) }

	@ $jin2_grab
	allCompleted() { return this.atom(
		() => this.pendingCount().get() === 0,
		next => {
			var tasks = this.tasksAll().get()
			tasks.forEach( task => {
				if( task.completed ) return
				this.task( task.id ).set({ id : task.id , completed : true , title : task.title }) 
			} )
		}
	) }
	
	@ $jin2_grab
	pendingTail() { return this.prop( () => {
		return ( this.pendingCount().get() === 1 ? ' item left' : ' items left' )
	} ) }

	@ $jin2_grab
	taskNewTitle() { return this.prop( '' , next => {
		if( next ) {
			var tasks = this.tasksAll().get()
			var maxId = 0
			tasks.forEach( task => {
				if( task.id > maxId ) maxId = task.id
			} )
			var task = { id : maxId + 1 , completed : false , title : next }
			this.task( task.id ).set( task )
			tasks = tasks.concat([ task ])
			this.tasksAll().set( tasks )
		}
	} ) }

	@ $jin2_grab
	items() { return $jin2_atom_list.prop(
		() => {
			var items = this.tasks().get()
			var limit = Math.min( items.length , this.panel().limitEnd().get() )
			var rows = [ this.header().get() ].concat( items.slice( 0 , limit ).map( task => this.taskRow( task.id ).get() ) )
			if( limit === items.length ) rows.push( this.footer().get() )
			return rows
		},
		next => null
	) }

	@$jin2_grab
	taskRow( id : number ) {
		var next = new $mol.$mol_app_todo_task_view_row
		next.taskCompleted = () => this.prop(
			() => this.task( id ).get().completed ,
			next => {
				var task = this.task( id ).get()
				this.task( task.id ).set({ id : task.id , completed : next , title : task.title }) 
			}
		)
		next.taskTitle = () => this.prop(
			() => this.task( id ).get().title ,
			next => {
				var task = this.task( id ).get()
				this.task( task.id ).set({ id : task.id , completed : task.completed , title : next }) 
			}
		)
		next.taskDrops = () => this.taskDrops( id )
		return next
	}

	@$jin2_grab
	taskDrops( id : number ) { return this.prop( null , next => {
		this.task( id ).set( null )
		var tasks = this.tasksAll().get().filter( task => task.id !== id )
		this.tasksAll().set( tasks )
	} ) }

	@$jin2_grab
	sanitizes() { return this.prop( null , next => {
		var tasks = this.tasksAll().get().filter( task => !task.completed )
		this.tasksAll().set( tasks )
	} ) }

	sanitizerMessage() { return this.prop( () => `Clear completed (${this.completedCount().get()})` ) }
	
	footerVisible() { return this.prop( () => this.tasksAll().get().length > 0 ) }
	actionerVisible() { return this.prop( () => this.completedCount().get() > 0 ) }
	
}
