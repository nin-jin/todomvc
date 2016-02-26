'use strict';

//alight.debug.scan = 1;

alight.d.al.header = {
    scope: 'root',
    link: function(scope) {
        scope.newTodo = ''

        scope.addTodo = function() {
            scope.$parent.todos.push({
                title: scope.newTodo,
                completed: false
            });
            scope.newTodo = '';
            scope.$parent.save();
            scope.$parent.$scan()
        }
    }
};


function editComponent(todo, element, parentCD) {
    return new Promise(function(resolve, reject) {
        var dom = document.createElement('div');
        dom.innerHTML = '<form @submit="done()"> \
                            <input class="edit" al-value="title" @blur="done()"\
                            @keydown.esc="cancel()" al-init="$element.focus()"> \
                        </form>'
        var form = dom.childNodes[0];

        var scope = alight.Scope({childFromChangeDetector: parentCD})
        var childCD = scope.$changeDetector;
        scope.title = todo.title;

        function destroy() {
            var e = form;
            form = null;
            if(e) element.removeChild(e);
            if(childCD) childCD.destroy();
            childCD = null;
        }

        scope.done = function() {
            if(!form) return;
            todo.title = scope.title;
            destroy();
            resolve();
        };
        scope.cancel = function() {
            if(!form) return;
            destroy();
            reject();
        };

        element.appendChild(form);
        alight.bind(scope, form);
    })
}


alight.d.al.task = {
    stopBinding: true,
    link: function(scope, element, _v, env) {
        var label = element.querySelector('label');
        var input = element.querySelector('input');
        var button = element.querySelector('button');
        var todo = scope.todo;

        label.innerText = todo.title;
        todoChecked(todo.completed);

        function todoChecked(checked) {
            todo.completed = checked;
            if(checked) element.classList.add('completed')
            else element.classList.remove('completed')
        }

        button.addEventListener('click', function() {
            scope.removeTodo(todo);
            scope.$scan()
        })

        input.addEventListener('change', function(e) {
            todoChecked(e.target.checked);
            scope.$scan()
            scope.save();
        })

        label.addEventListener('dblclick', function(e) {
            element.classList.add('editing');
            label.hidden = true;

            editComponent(todo, element, env.changeDetector).then(function() {
                element.classList.remove('editing');
                label.hidden = false;
                label.innerText = todo.title;
                scope.save();
            }, function() {
                element.classList.remove('editing');
                label.hidden = false;
            })
        })
    }
}


function TodoApp(scope) {
    scope.newTodo = '';
    scope.editedTodo = null;
    scope.allChecked = false;

    var t = null;
    scope.save = function() {  // deferred save, don't test JSON.stringify
        if(t) clearTimeout(t);
        t = setTimeout(function() {
            t = null;
            localStorage['todos-alight'] = JSON.stringify( scope.todos )
        }, 30)
    }

    scope.load = function() {
        scope.todos = JSON.parse( localStorage['todos-alight'] || '[]' )
    }

    scope.load();

    scope.markTodo = function(todo) {
        scope.save()
    };

    scope.markAll = function(value) {
        scope.todos.map(function(todo) {
            todo.completed = value
        })
        scope.save()
    };

    scope.removeTodo = function(todo) {
        scope.todos.splice(scope.todos.indexOf(todo), 1);
        scope.save()
    };

    scope.filteredList = function() {
        if(!scope.path) return scope.todos;
        if(scope.path === 'active') return scope.todos.filter(function(d) {
            return !d.completed
        })
        // completed
        return scope.todos.filter(function(d) {
            return d.completed
        })
    };

    scope.remainingCount = function() {
        var count = 0
        scope.todos.forEach(function(d) {
            if( !d.completed ) ++count
        })
        return count
    };

    scope.completedCount = function() {
        var count = 0
        scope.todos.forEach(function(d) {
            if( d.completed ) ++count
        })
        return count
    };

    scope.clearCompletedTodos = function() {
        scope.todos = scope.todos.filter(function(d) {
            return !d.completed
        })
        scope.save()
    };

    var prevTitle = '';
    scope.editTodo = function(todo) {
        scope.editedTodo = todo;
        prevTitle = todo.title
    };

    scope.doneEditing = function(todo) {
        scope.editedTodo = null
        scope.save()
    };

    scope.revertEditing = function(e, todo) {
        todo.title = prevTitle;
        e.value = prevTitle;
        e.blur()
    };

};
