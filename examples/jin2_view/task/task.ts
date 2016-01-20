// Task model
class $jin2_demo_todomvc_task extends $jin2_object {

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
    
	title() {
		return this.data().wrap( val => val.title || '' , next => ({ title : next }) )
	}
	
	completed() {
		return this.data().wrap( val => !!val.completed , next => ({ completed : next }) )
	}
	
}
