import React, { useState } from "react";

import type { Todo } from "./types";

import TodoList from "./components/TodoList";

import AddTodo from "./components/AddTodo";

import Filter from "./components/Filter";

const App: React.FC = () => {

const [todos, setTodos] = useState<Todo[]>([]);

const [filter, setFilter] = useState<string>("all");

const addTodo = (text: string) => {

const newTodo: Todo = {

 id: todos.length + 1,

 text,

 completed: false,

 };

 setTodos([...todos, newTodo]);

 };

const toggleTodo = (id: number) => {

 setTodos(

 todos.map((todo) =>

 todo.id === id ? { ...todo, completed: !todo.completed } : todo

 )

 );

 };

const deleteTodo = (id: number) => {

 setTodos(todos.filter((todo) => todo.id !== id));

 };

const filteredTodos = todos.filter((todo) => {

if (filter === "completed") {

return todo.completed;

 }

if (filter === "active") {

return !todo.completed;

 }

return true;

 });

return (

<div>

<h1>Todo List</h1>

<AddTodo addTodo={addTodo} />

<Filter filter={filter} setFilter={setFilter} />

<TodoList

todos={filteredTodos}

toggleTodo={toggleTodo}

deleteTodo={deleteTodo}

/>

</div>

 );

};

export default App;