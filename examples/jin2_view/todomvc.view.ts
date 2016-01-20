// Application component
@ $mol_replace
class $jin2_demo_todomvc extends $mol.$jin2_demo_todomvc {
	
	@ $jin2_grab
	tasksAll() {
        var state = $jin2_state_local.item( this.objectPath + '.tasksAll_' )
        return new $jin2_atom_list<$jin2_demo_todomvc_task>(
            () => {
                var val = state.get()
                if( !val ) return []
                return val.split( ',' ).map( id => this.task( id ).get() )
            } ,
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
            () => Number( state.get() ) || 0
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
		return new $jin2_atom_own( () => new $jin2_demo_todomvc_task )
	}

	allCompleted() {
        return new $jin2_prop(
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
	
    pendingCount() {
        return new $jin2_prop( () => this.groupsByCompleted().get()[ 'false' ].length )
    }
	
    pendingTail() {
        return new $jin2_prop( () => ( this.pendingCount().get() === 1 ? ' item left' : ' items left' ) )
    }
	
    taskNewTitle() {
        return new $jin2_prop( () => '' , next => {
            var id = this.tasksSeed().get()
            this.tasksSeed().set( id + 1 )
            var task = this.task( id ).get()
            task.title().set( next )
            var tasks = this.tasksAll().get()
            tasks = tasks.concat( task )
            this.tasksAll().set( tasks )
        } )
    }
	
    taskDrop() {
        return new $jin2_prop( () => null , next => {
            var tasks = this.tasksAll().get()
            var index = tasks.indexOf( next )
            if( index >= 0 ) {
                tasks = tasks.slice( 0 , index ).concat( tasks.slice( index + 1 ) )
                this.tasksAll().set( tasks )
                next.data().set({ title : void 0 , completed : void 0 }) 
                //next.destroy()
            }
        } )
    }
	
	taskRows() {
        return new $jin2_prop(
            () => this.tasks().get().map( task => this.taskRow( task.id().get() ).get() ) ,
            next => null
        )
    }
	
	@$jin2_grab
	taskRow( id ) { return new $jin2_atom_own( () => {
		var next = new $jin2_demo_todomvc_task_view_row
		next.task = () => this.task( id )
		next.eventDrop = () => new $jin2_prop( () => null, next => this.taskDrop().set( this.task( id ).get() ) )
		return next
	} ) }
    
}

// Task row component
@ $mol_replace
class $jin2_demo_todomvc_task_view_row extends $mol.$jin2_demo_todomvc_task_view_row {

	task() { return new $jin2_prop<$jin2_demo_todomvc_task>() }
	taskCompleted() { return this.task().get().completed() }
	taskTitle() { return this.task().get().title() }
    
}

// Completer control
@ $mol_replace
class $jin2_demo_todomvc_completer extends $mol.$jin2_demo_todomvc_completer {

	eventClick() {
		return new $jin2_prop( () => null, next => {
            var completed = this.completed()
            completed.set( !completed.get() )
        } )
	}
	
}

// Adder control
@ $mol_replace
class $jin2_demo_todomvc_adder extends $mol.$jin2_demo_todomvc_adder {

	eventKeyPress() {
        return new $jin2_prop( () => null , next => {
            if( next.keyCode === 13 ) {
                var text = next.target.value.trim()
                if( !text ) return
                this.text().set( text )
                next.target.value = ''
            }
	    } )
    }
	
}
