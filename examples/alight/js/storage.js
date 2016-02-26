
window.storage = (function(){
    var index = 1;
    var prefix = 'todo-alight-';
    var all = {};
    var count = 0;
    var completed = 0;
    function clone(todo) { // Object.assign
        return {
            id: todo.id,
            title: todo.title,
            completed: todo.completed
        }
    }
    return {
        getCompleted: function() {
            return completed
        },
        getRemaining: function() {
            return count - completed
        },
        newId: function() {
            return index++
        },
        loadAll: function() {
            var result = [];
            completed = 0;
            for(var k in localStorage) {
                if(k.slice(0, 12) == prefix) {
                    var todo = JSON.parse(localStorage.getItem(k))
                    result.push(todo);
                    all[todo.id] = clone(todo);
                    if(todo.id >= index) index = todo.id + 1
                    if(todo.completed) completed++;
                }
            }
            count = result.length;
            return result;
        },
        saveItem: function(todo) {
            localStorage.setItem(prefix + todo.id, JSON.stringify(todo));
            if(all[todo.id]) {
                if(all[todo.id].completed !== todo.completed) {
                    if(todo.completed) completed++
                    else completed--
                }
            } else count++
            all[todo.id] = clone(todo)
        },
        removeItem: function(todo)
        {
            localStorage.removeItem(prefix + todo.id);
            count--;
            if(all[todo.id].completed) completed--;
            delete all[todo.id];
        }
    }
})();
