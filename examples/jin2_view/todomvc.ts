class $jin2_demo_todomvc extends $jin2_view {
	
	@$jin2_lazy
	static app( id : string ) {
		return new this()
	}

	@$jin2_lazy
	tasks() {
		return new $jin2_atom<$jin2_demo_todomvc_task[]>( prev => [ ] )
	}

	child() {
		return { get : () => {
			return this.tasks().get().map( task => this.taskRow( task.objectId ))
		} }
	}

	@$jin2_lazy
	task( id ) { 
		return new $jin2_demo_todomvc_task
	}

	@$jin2_lazy
	taskRow( id ) {
		var next = new $jin2_demo_todomvc_task_view_row
		next.task = () => ({ get : () => this.task( id ) })
		return next
	}
	
	taskSeed = 0
	taskAdd() {
		this.tasks().mutate( prev => prev.concat( this.task( this.taskSeed++ ) ) )
	}

}

class $jin2_demo_todomvc_task extends $jin2_object {

	id() {
		return { get : () => this.objectId }
	}
	
	@ $jin2_lazy
	title() {
		return new $jin2_atom( () => '' )
	}
	
	@ $jin2_lazy
	completed() {
		return new $jin2_atom( () => false )
	}
	
}

class $jin2_demo_todomvc_task_view_row extends $jin2_view {

	task() {
		return { get : () => <$jin2_demo_todomvc_task> null }
	}
	
	attr() {
		return { get : () => ({
			'jin2_demo_todomvc_task_view_row_completed' : this.task().get().completed().get() + ''
		}) }
	}
	
	child() {
		return { get : () => [ this.task().get().title().get() + 'eakvubwy  ortyer vtueybwey' ] }
	}

}
