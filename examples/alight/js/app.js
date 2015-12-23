'use strict';

function TodoApp(scope) {
    scope.newTodo = '';
    scope.editedTodo = null;
    scope.allChecked = false;
    
    scope.save = function() {
        localStorage['todos-alight'] = JSON.stringify( scope.todos )
    }
    
    scope.load = function() {
        scope.todos = JSON.parse( localStorage['todos-alight'] || '[]' )
    }

    scope.load();
    
    scope.addTodo = function() {
        scope.todos.push({
            title: scope.newTodo,
            completed: false
        });
        scope.newTodo = '';
        scope.save()
    };

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

    scope.revertEditing = function(todo) {
        todo.title = prevTitle;
        return prevTitle
    };

};
