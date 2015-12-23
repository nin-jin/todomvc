'use strict';

function TodoApp(scope) {
    scope.todos = [];
    scope.newTodo = '';
    scope.editedTodo = null;
    scope.remainingCount = 0;
    scope.allChecked = false;

    scope.addTodo = function() {
        scope.todos.push({
            title: scope.newTodo,
            completed: false
        });
        scope.newTodo = '';
        scope.remainingCount++;
    };

    scope.markTodo = function(todo) {
        if(todo.completed) scope.remainingCount--;
        else scope.remainingCount++
    };

    scope.markAll = function(value) {
        console.log(value);
        scope.todos.map(function(todo) {
            todo.completed = value
        })
    };

    scope.removeTodo = function(todo) {
        scope.todos.splice(scope.todos.indexOf(todo), 1);
        if(!todo.completed) scope.remainingCount--;
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
            return !d.completed
        })
    };

    var prevTitle = '';
    scope.editTodo = function(todo) {
        scope.editedTodo = todo;
        prevTitle = todo.title
    };

    scope.doneEditing = function(todo) {
        scope.editedTodo = null
    };

    scope.revertEditing = function(todo) {
        todo.title = prevTitle;
        return prevTitle
    };

};
