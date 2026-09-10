from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.analyzer import analyze_log

app = FastAPI(title="AI Make Debugger")


class DebugPayload(BaseModel):
    log: str


@app.post("/debug")
def debug(payload: DebugPayload):
    if not payload.log.strip():
        raise HTTPException(status_code=400, detail="log must not be empty")

    result = analyze_log(payload.log)
    return {"result": result}
