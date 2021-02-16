import React from "react";
import line from "./Line.png";
function TaskItems({ p }) {
    return (
        <div id="rectangle" className="smcard m-2">
            <div className="d-flex">
                <span>{p.type}</span>
            </div>
            <div className="row m-0">
                <img
                    style={{ width: "107%", marginLeft: "-10px" }}
                    src={line}
                    alt="img"
                />
            </div>
            <div className="d-flex justify-content-between mt-3">
                <div>
                    <span>Work</span>
                    <br />
                    <span>{p.title}</span>
                </div>
                <div>
                    <span>Timer</span>
                    <br />
                    <span>{p.timer}</span>
                </div>
            </div>
        </div>
    );
}

export default TaskItems;
