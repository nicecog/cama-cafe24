#!/usr/bin/env python3
"""Backward-compatible wrapper — applies cama-patient-spa-locations.conf."""
import runpy
from pathlib import Path

runpy.run_path(str(Path(__file__).resolve().parent / "apply-patient-spa-nginx.py"), run_name="__main__")
