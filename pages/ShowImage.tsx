import { Island } from "#/arkhi/client";
import React, { useState } from "react";

function ShowState_({ ...props }) {
    const [show, setShow] = useState(false);

    return (
        <div {...props}>
            <button type="button" onClick={() => setShow(prevShow => !prevShow)}>Toggle show</button>
            {show && <img src="/artificial-island.jpg" alt="Artificial Island" />}
        </div>
    );
}

const ShowState = Island(ShowState_);

export default ShowState;
