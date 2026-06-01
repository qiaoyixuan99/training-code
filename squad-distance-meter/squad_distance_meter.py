"""
Squad Distance Meter
--------------------
Background tool for measuring distances on Squad's in-game map.

Hotkeys:
  i  - Mark a reference point (press twice; the pair = 300 m)
  o  - Mark a measurement point (press twice; distance shown)
  r  - Reset all points
  Esc - Quit

Behaviour:
  - Overlay is hidden by default
  - Appears when you first press 'i'
  - Shows distance for 10 seconds after both 'o' points are set, then fades out
  - Click-through: does not block any mouse input

Skills / Libraries used:
  - pynput       : global keyboard & mouse listener (works even when game has focus)
  - tkinter      : transparent always-on-top overlay for displaying the result
  - math.hypot   : Euclidean distance between two pixel points
  - ctypes       : Win32 API to make the overlay click-through (WS_EX_TRANSPARENT)
  - pyinstaller  : packages the script into a single .exe

Algorithm:
  scale = 300 / pixel_distance(i1, i2)   # metres per pixel
  real  = pixel_distance(o1, o2) * scale  # real metres
"""

import ctypes
import math
import threading
import tkinter as tk
from pynput import keyboard, mouse

# ── Win32 constants for click-through overlay ─────────────────────────────

GWL_EXSTYLE = -20
WS_EX_TRANSPARENT = 0x00000020
WS_EX_LAYERED = 0x00080000
WS_EX_TOPMOST = 0x00000008

# ── shared state ──────────────────────────────────────────────────────────

class State:
    def __init__(self):
        self.lock = threading.Lock()
        self.i_points = []          # [(x,y), (x,y)]
        self.o_points = []          # [(x,y), (x,y)]
        self.show_overlay = False   # True once first 'i' is pressed
        self.result_ready = False   # True when both o points are set

state = State()
mouse_ctrl = mouse.Controller()

# ── geometry helpers ──────────────────────────────────────────────────────

def pixel_dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])

def compute_text(s: State) -> str:
    with s.lock:
        if len(s.i_points) < 2:
            return "Press 'i' twice to set 300m reference"
        d_i = pixel_dist(s.i_points[0], s.i_points[1])
        if d_i == 0:
            return "i points overlap — press 'r' and try again"
        scale = 300.0 / d_i
        if len(s.o_points) == 0:
            return f"i: 300m calibrated | Press 'o' to measure"
        if len(s.o_points) == 1:
            return f"i: 300m calibrated | Press 'o' once more"
        d_o = pixel_dist(s.o_points[0], s.o_points[1])
        real = d_o * scale
        return f"{real:.1f} m"

# ── keyboard handler ──────────────────────────────────────────────────────

def on_press(key):
    try:
        ch = key.char
    except AttributeError:
        if key == keyboard.Key.esc:
            root.after(0, root.destroy)
            return False
        return

    pos = mouse_ctrl.position

    with state.lock:
        if ch == 'i':
            # show overlay on first 'i' press
            if not state.show_overlay:
                state.show_overlay = True
                root.after(0, show_overlay)
            if len(state.i_points) >= 2:
                state.i_points.clear()
                state.o_points.clear()
                state.result_ready = False
            state.i_points.append(pos)
        elif ch == 'o':
            if len(state.i_points) < 2:
                return
            if state.result_ready:
                # previous result still showing — reset o points
                state.o_points.clear()
                state.result_ready = False
            if len(state.o_points) >= 2:
                state.o_points.clear()
            state.o_points.append(pos)
            if len(state.o_points) == 2:
                state.result_ready = True
                root.after(0, on_result_ready)
        elif ch == 'r':
            state.i_points.clear()
            state.o_points.clear()
            state.result_ready = False
            state.show_overlay = False
            root.after(0, hide_overlay)

# ── tkinter overlay ──────────────────────────────────────────────────────

OVERLAY_ALPHA = 0.85
FADE_DURATION_MS = 1000   # fade-out takes 1 second
FADE_STEPS = 20
HOLD_DURATION_MS = 10000  # show result for 10 seconds

TRANSPARENT_COLOR = "#010101"   # any rare colour — made fully invisible by -transparentcolor

root = tk.Tk()
root.title("Squad Distance Meter")
root.overrideredirect(True)
root.attributes("-topmost", True)
root.attributes("-alpha", 0.0)                  # start fully hidden
root.attributes("-transparentcolor", TRANSPARENT_COLOR)
root.configure(bg=TRANSPARENT_COLOR)

sw = root.winfo_screenwidth()
root.geometry(f"{sw}x40+0+0")

label = tk.Label(
    root,
    text="",
    font=("Consolas", 14, "bold"),
    fg="#00ff88",
    bg=TRANSPARENT_COLOR,          # same as window bg → invisible
    anchor="center",
)
label.pack(fill=tk.BOTH, expand=True)

# ── click-through (Win32) ─────────────────────────────────────────────────

def make_click_through(widget):
    hwnd = ctypes.windll.user32.GetParent(widget.winfo_id())
    style = ctypes.windll.user32.GetWindowLongW(hwnd, GWL_EXSTYLE)
    ctypes.windll.user32.SetWindowLongW(
        hwnd, GWL_EXSTYLE,
        style | WS_EX_TRANSPARENT | WS_EX_LAYERED | WS_EX_TOPMOST
    )

# ── overlay visibility control ────────────────────────────────────────────

_fade_job = None    # pending fade-out job (so we can cancel it)
_hold_job = None    # pending hold-then-fade job

def _cancel_jobs():
    global _fade_job, _hold_job
    if _fade_job is not None:
        root.after_cancel(_fade_job)
        _fade_job = None
    if _hold_job is not None:
        root.after_cancel(_hold_job)
        _hold_job = None

def show_overlay():
    """Show the overlay bar (called when first 'i' is pressed)."""
    _cancel_jobs()
    root.attributes("-alpha", OVERLAY_ALPHA)

def hide_overlay():
    """Instantly hide the overlay."""
    _cancel_jobs()
    root.attributes("-alpha", 0.0)

def fade_out(step=FADE_STEPS):
    """Gradually decrease alpha to 0 over FADE_DURATION_MS."""
    global _fade_job
    alpha = OVERLAY_ALPHA * (step / FADE_STEPS)
    root.attributes("-alpha", max(alpha, 0.0))
    if step > 0:
        _fade_job = root.after(FADE_DURATION_MS // FADE_STEPS, fade_out, step - 1)
    else:
        _fade_job = None

def on_result_ready():
    """Called when both o points are set — hold for 10 s then fade out."""
    global _hold_job
    # cancel any previous hold timer
    if _hold_job is not None:
        root.after_cancel(_hold_job)
    # make sure overlay is fully visible while showing the result
    root.attributes("-alpha", OVERLAY_ALPHA)
    _hold_job = root.after(HOLD_DURATION_MS, fade_out)

# ── tick: update text periodically ────────────────────────────────────────

def tick():
    label.config(text=compute_text(state))
    root.after(100, tick)

root.update_idletasks()
make_click_through(root)
tick()

# ── start keyboard listener ───────────────────────────────────────────────

listener = keyboard.Listener(on_press=on_press)
listener.daemon = True
listener.start()

root.mainloop()
