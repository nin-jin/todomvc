'use strict';

function TodoApp(scope) {
    scope.newTodo = '';
    scope.editedTodo = null;
    scope.allChecked = false;
    scope.todos = storage.loadAll();

    scope.remainingCount = storage.getRemaining;
    scope.completedCount = storage.getCompleted;

    scope.addTodo = function() {
        var todo = {
            id: storage.newId(),
            title: scope.newTodo,
            completed: false
        };
        scope.todos.push(todo);
        storage.saveItem(todo)
        scope.newTodo = '';
    };

    scope.markTodo = function(todo) {
        storage.saveItem(todo)
    };

    scope.markAll = function(value) {
        scope.todos.map(function(todo) {
            todo.completed = value;
            storage.saveItem(todo)
        })
    };

    scope.removeTodo = function(todo) {
        scope.todos.splice(scope.todos.indexOf(todo), 1);
        storage.removeItem(todo)
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

    scope.clearCompletedTodos = function() {
        scope.todos = scope.todos.filter(function(d) {
            if(d.completed) {
                storage.removeItem(d);
                return false
            }
            return true
        })
    };

    var prevTitle = '';
    scope.editTodo = function(todo) {
        scope.editedTodo = todo;
        prevTitle = todo.title
    };

    scope.doneEditing = function(todo) {
        scope.editedTodo = null;
        storage.saveItem(todo)
    };

    scope.revertEditing = function(todo, element) {
        todo.title = prevTitle;
        element.value = prevTitle;
        element.blur()
    };

};
