// Task model
class $mol_demo_todomvc_task extends $jin2_object {

	id() {
		return new $jin2_prop( () => this.objectOwner.objectId )
	}
	
    @ $jin2_grab
    data() {
		return new $jin2_atom(
            () => {
                var val = $jin2_state_local.item( this.objectPath ).get()
                return val ? JSON.parse( val ) : { title : '' , completed : false }
            },
            ( next ) => {
                var prev = this.data().get()
                if( next && prev ) for( var key in prev ) if(!( key in next )) next[ key ] = prev[ key ]
                $jin2_state_local.item( this.objectPath ).set( JSON.stringify( next ) )
                return next 
            }
        ) 
    }

    @ $jin2_grab
	title() {
		return new $jin2_atom(
            () => this.data().get().title || '' ,
            next => ( this.data().set({ title : next }) , next )
        )
	}

    @ $jin2_grab
	completed() {
		return new $jin2_atom(
            () => !!this.data().get().completed ,
            next => {
                this.data().set({ completed : next })
                return next
            }
        )
	}
	
}
