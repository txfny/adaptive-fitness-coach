"""
Azure Functions HTTP triggers for the coach pipeline.
Each endpoint is a deterministic tool that Claude can call.
"""

import azure.functions as func
import json
import os
from datetime import date, datetime

from shared.weekly_template import get_session_type
from shared.readiness import compute_readiness
from shared.ivg import run_ivg
from shared.ovg import run_ovg
from shared.working_weights import get_working_weights
from shared.save_session import save_snapshot, save_session_log
from functions.coach_pipeline import run_pre_session, run_post_session

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)


@app.route(route="session-type")
def session_type(req: func.HttpRequest) -> func.HttpResponse:
    """GET /api/session-type?date=2026-03-26 → deterministic session type"""
    date_str = req.params.get("date", date.today().isoformat())
    target = date.fromisoformat(date_str)
    result = get_session_type(target)
    return func.HttpResponse(json.dumps(result), mimetype="application/json")


@app.route(route="readiness", methods=["POST"])
def readiness(req: func.HttpRequest) -> func.HttpResponse:
    """POST /api/readiness { snapshot } → deterministic readiness tier"""
    snapshot = req.get_json()
    result = compute_readiness(snapshot)
    return func.HttpResponse(json.dumps(result), mimetype="application/json")


@app.route(route="ivg")
def ivg(req: func.HttpRequest) -> func.HttpResponse:
    """GET /api/ivg?date=2026-03-26 → gap check for this week"""
    date_str = req.params.get("date", date.today().isoformat())
    target = date.fromisoformat(date_str)
    result = run_ivg(target)
    return func.HttpResponse(json.dumps(result), mimetype="application/json")


@app.route(route="ovg", methods=["POST"])
def ovg(req: func.HttpRequest) -> func.HttpResponse:
    """POST /api/ovg { session_plan, date } → validate before output"""
    body = req.get_json()
    target = date.fromisoformat(body["date"])
    weights = get_working_weights()
    result = run_ovg(body.get("session_plan", {}), target, weights.get("weights", {}))
    return func.HttpResponse(json.dumps(result), mimetype="application/json")


@app.route(route="working-weights")
def working_weights(req: func.HttpRequest) -> func.HttpResponse:
    """GET /api/working-weights → latest weights from exercise_history"""
    result = get_working_weights()
    return func.HttpResponse(json.dumps(result), mimetype="application/json")


@app.route(route="save-snapshot", methods=["POST"])
def snapshot_save(req: func.HttpRequest) -> func.HttpResponse:
    """POST /api/save-snapshot { snapshot } → persist to Supabase"""
    snapshot = req.get_json()
    result = save_snapshot(snapshot)
    return func.HttpResponse(json.dumps(result), mimetype="application/json")


@app.route(route="save-session", methods=["POST"])
def session_save(req: func.HttpRequest) -> func.HttpResponse:
    """POST /api/save-session { session_data } → persist to Supabase"""
    body = req.get_json()
    result = save_session_log(body)
    return func.HttpResponse(json.dumps(result), mimetype="application/json")


@app.route(route="pre-session", methods=["POST"])
def pre_session(req: func.HttpRequest) -> func.HttpResponse:
    """
    POST /api/pre-session { date, snapshot }
    → Full pre-session pipeline: session type + readiness + IVG + weights
    This is the main tool Claude calls before building a session plan.
    """
    body = req.get_json()
    target = date.fromisoformat(body["date"])
    snapshot = body["snapshot"]
    result = run_pre_session(target, snapshot)
    return func.HttpResponse(json.dumps(result, default=str), mimetype="application/json")


@app.route(route="post-session", methods=["POST"])
def post_session(req: func.HttpRequest) -> func.HttpResponse:
    """
    POST /api/post-session { date, session_data }
    → Full post-session pipeline: save + OVG
    This is the main tool Claude calls after logging a session.
    """
    body = req.get_json()
    target = date.fromisoformat(body["date"])
    session_data = body["session_data"]
    result = run_post_session(session_data, target)
    return func.HttpResponse(json.dumps(result, default=str), mimetype="application/json")
