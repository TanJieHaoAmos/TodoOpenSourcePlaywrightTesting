import React from "react";

interface Props {

 filter: string;

 setFilter: (filter: string) => void;

}

const Filter: React.FC<Props> = ({ filter, setFilter }) => {

return (

<div>

<button onClick={() => setFilter("all")} disabled={filter === "all"}>

 All

</button>

<button

onClick={() => setFilter("completed")}

disabled={filter === "completed"}

>

 Completed

</button>

<button

onClick={() => setFilter("active")}

disabled={filter === "active"}

>

 Active

</button>

</div>

 );

};

export default Filter;