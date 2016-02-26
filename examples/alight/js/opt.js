'use strict';

//alight.debug.scan = 1;

alight.d.al.header = {
    scope: 'root',
    link: function(scope) {
        scope.newTodo = ''

        scope.addTodo = function() {
            var todo = {
                id: storage.newId(),
                title: scope.newTodo,
                completed: false
            };
            scope.newTodo = '';
            scope.$parent.todos.push(todo);
            storage.saveItem(todo);
            scope.$parent.filterTodos();
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
        var input = element.querySelector('input');
        var label = element.querySelector('label');
        var button = element.querySelector('button');
        var todo = scope.todo;

        label.innerText = todo.title;
        input.checked = todo.completed;
        todoChecked(todo.completed);

        function todoChecked(checked) {
            todo.completed = checked;
            if(checked) element.classList.add('completed')
            else element.classList.remove('completed')
        }

        button.addEventListener('click', function() {
            scope.todos.splice(scope.todos.indexOf(todo), 1);
            storage.removeItem(todo);
            scope.$scan()
        })

        input.addEventListener('change', function(e) {
            todoChecked(e.target.checked);
            storage.saveItem(todo);
            scope.$scan()
        })

        label.addEventListener('dblclick', function(e) {
            element.classList.add('editing');
            label.hidden = true;

            editComponent(todo, element, env.changeDetector).then(function() {
                element.classList.remove('editing');
                label.hidden = false;
                label.innerText = todo.title;
                storage.saveItem(todo)
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
    scope.todos = storage.loadAll();

    scope.markAll = function(value) {
        scope.todos = storage.loadAll();
        scope.todos.map(function(todo) {
            todo.completed = value;
            storage.saveItem(todo)
        });
        filterTodos()
    };

    scope.remainingCount = storage.getRemaining;
    scope.completedCount = storage.getCompleted;

    scope.path = '';
    scope.filteredList = [];
    scope.filterTodos = filterTodos;
    filterTodos();

    scope.goPath = function(path) {
        scope.path = path;
        filterTodos();
    }

    function filterTodos(){
        if(!scope.path) scope.filteredList = scope.todos
        else if(scope.path === 'active') {
            scope.filteredList = scope.todos.filter(function(d) {
                return !d.completed
            })
        } else {
            // completed
            scope.filteredList = scope.todos.filter(function(d) {
                return d.completed
            })
        }
    }

    scope.clearCompletedTodos = function() {
        scope.todos = scope.todos.filter(function(d) {
            if(d.completed) {
                storage.removeItem(d);
                return false
            }
            return true
        })
        filterTodos();
    };

};
