from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse
import time

class Action(BaseModel):
    action_type_id: str
    description: str


app = FastAPI()
action_queue: list = []
global current_executing_action_id
current_executing_action_id: str = None
global latest_execution_tick
global execution_start
global make_time_measure
make_time_measure: bool = False
execution_start: float = None
latest_execution_tick: float = None

global time_measure_estimates_ms
time_measure_estimates_ms: dict = {}

@app.on_event("startup")
async def startup_event() -> None:
    """tasks to do at server startup"""
    pass

@app.get("/")
def root():
    return read_static_content(asset_type="html", path="main.html")

@app.get("/pollNextAction")
def poll_next_action() -> Action:
    global current_executing_action_id
    global latest_execution_tick
    global execution_start
    global make_time_measure

    if len(action_queue) > 0 and make_time_measure: # There must be at least an action in the cue to make a correct time measurement
        latest_execution_tick = time.time()
        elapsed_time = (latest_execution_tick - execution_start)*1000
        if current_executing_action_id in time_measure_estimates_ms.keys():
            # Moving averaging
            n: float = 5.0
            current_value = time_measure_estimates_ms[current_executing_action_id]
            new_value = ((n - 1) * current_value + elapsed_time)/n
            time_measure_estimates_ms[current_executing_action_id] = new_value
        else:
            time_measure_estimates_ms.update({current_executing_action_id:elapsed_time})

    action = action_queue.pop(0)
    if len(action_queue) > 0: # If there is a directly following action, then it's possible to make a time measure. Othewise there could be a gap of idle time which is also measured.
        make_time_measure = True
    else:
        make_time_measure = False
    current_executing_action_id = action.action_type_id
    latest_execution_tick = time.time()
    execution_start = time.time()
    return action

@app.get("/hasNextAction")
def has_next_action():
    if len(action_queue) <= 0:
        return False
    return True

@app.post("/putNextAction")
def put_next_action(action: Action):
    action_queue.append(action)
    return action

@app.get("/getActionStatus/{action_id}")
def action_status(action_id: str):
    global time_measure_estimates_ms
    global latest_execution_tick
    global execution_start
    if current_executing_action_id == action_id:
        remaining_execution_duration: int = 10000 # 10s as a default value
        if action_id in time_measure_estimates_ms.keys():
            remaining_execution_duration = time_measure_estimates_ms[action_id] - (time.time() - execution_start)*1000
        else:
            remaining_execution_duration = remaining_execution_duration - (time.time() - execution_start)*1000
        if remaining_execution_duration > 0:
            return {
                        "action_id": action_id,
                        "status": "executing",
                        "remaining_execution_duration": remaining_execution_duration
                    }
    for action in action_queue:
        if action.action_type_id == action_id:
            remaining_execution_duration: int = 10000 # 10s as a default value
            if action_id in time_measure_estimates_ms.keys():
                remaining_execution_duration = time_measure_estimates_ms[action_id]
            return {
                        "action_id": action_id,
                        "status": "waiting",
                        "remaining_execution_duration": remaining_execution_duration
                    }
    return {
                "action_id": action_id,
                "status": "free",
                "remaining_execution_duration": 0
            }
    
    
@app.get("/{asset_type}/{path}")
def read_static_content(asset_type: str, path: str):
    return FileResponse("../static/{}/{}".format(asset_type, path))
