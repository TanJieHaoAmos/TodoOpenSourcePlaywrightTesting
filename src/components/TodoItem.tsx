import React from "react";

import type { Todo } from "../types";

interface Props {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoItem: React.FC<Props> = ({ todo, toggleTodo, deleteTodo }) => {

return (
  <li>
    <label>
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => toggleTodo(todo.id)}
    />
    {todo.text}
    </label>
  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
  </li>
 );
};

export default TodoItem;