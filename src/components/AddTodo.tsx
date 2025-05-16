import React, { useState } from "react";

interface Props {

 addTodo: (text: string) => void;

}

const AddTodo: React.FC<Props> = ({ addTodo }) => {

const [text, setText] = useState("");

const handleSubmit = (e: React.FormEvent) => {

 e.preventDefault();

 addTodo(text);

 setText("");

 };

return (

<form onSubmit={handleSubmit}>

<input

type="text"

value={text}

onChange={(e) => setText(e.target.value)}

/>

<button type="submit">Add Todo</button>

</form>

 );

};

export default AddTodo;