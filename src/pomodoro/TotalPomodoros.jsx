import React from "react";
import TaskItems from "./TaskItems";

function TotalPomodoros({ pomodoros }) {
    return (
        <div className="col-3 left">
            <span>Today's Pomodoro</span>
            <div className="scrollGroup">
                {pomodoros.map((p) => (
                    <TaskItems p={p} />
                ))}
            </div>
        </div>
    );
}

export default TotalPomodoros;
