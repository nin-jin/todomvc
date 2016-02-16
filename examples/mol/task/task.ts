// Task model
class $mol_app_todo_task extends $mol_model {

	id() {
		return new $jin2_prop( () => this.objectId )
	}
	
	@ $jin2_grab
	data() { return this.atom(
		() => this.persist().get() || { title : '' , completed : false } ,
		( next ) => {
			var prev = this.data().get()
			if( next && prev ) for( var key in prev ) if(!( key in next )) next[ key ] = prev[ key ]
			this.persist().set( next )
			return next 
		}
	) }

	@ $jin2_grab
	title() { return this.prop<string>(
		() => this.data().get().title ,
		next => {
			this.data().set({ title : next })
			return next
		}
	) }

	@ $jin2_grab
	completed() { return this.prop(
		() => this.data().get().completed ,
		next => {
			this.data().set({ completed : next })
			return next
		}
	) }
	
}
