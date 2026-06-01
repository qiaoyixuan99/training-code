"""
Squad Distance Meter
--------------------
Background tool for measuring distances on Squad's in-game map.

Hotkeys:
  i  - Mark a reference point (press twice; the pair = 300 m)
  o  - Mark a measurement point (press twice; distance shown)
  r  - Reset all points
  Esc - Quit

The overlay stays on top of all windows at the screen's top edge.
"""

import math
import threading
import tkinter as tk
from pynput import keyboard, mouse

# ── shared state (written by listener thread, read by tkinter) ────────────

class State:
    def __init__(self):
        self.lock = threading.Lock()
        self.i_points = []       # [(x,y), (x,y)]
        self.o_points = []       # [(x,y), (x,y)]
        self.status_text = "Press 'i' twice to set 300m reference"

state = State()
mouse_ctrl = mouse.Controller()

# ── geometry helpers ──────────────────────────────────────────────────────

def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])

def compute_text(s: State) -> str:
    with s.lock:
        if len(s.i_points) < 2:
            return "Press 'i' twice to set 300m reference"
        d_i = dist(s.i_points[0], s.i_points[1])
        if d_i == 0:
            return "i points overlap — press 'r' and try again"
        scale = 300.0 / d_i  # metres per pixel
        if len(s.o_points) == 0:
            return f"i: 300m calibrated | Press 'o' to measure"
        if len(s.o_points) == 1:
            return f"i: 300m calibrated | Press 'o' once more"
        d_o = dist(s.o_points[0], s.o_points[1])
        real = d_o * scale
        return f"i: 300m calibrated | o: {real:.1f} m"

# ── keyboard handler ──────────────────────────────────────────────────────

def on_press(key):
    try:
        ch = key.char
    except AttributeError:
        if key == keyboard.Key.esc:
            root.after(0, root.destroy)
            return False
        return

    pos = mouse_ctrl.position  # (x, y) at moment of keypress

    with state.lock:
        if ch == 'i':
            if len(state.i_points) >= 2:
                state.i_points.clear()
            state.i_points.append(pos)
        elif ch == 'o':
            if len(state.i_points) < 2:
                return  # need calibration first
            if len(state.o_points) >= 2:
                state.o_points.clear()
            state.o_points.append(pos)
        elif ch == 'r':
            state.i_points.clear()
            state.o_points.clear()

# ── tkinter overlay ──────────────────────────────────────────────────────

root = tk.Tk()
root.title("Squad Distance Meter")
root.overrideredirect(True)           # no title bar
root.attributes("-topmost", True)     # always on top
root.attributes("-alpha", 0.85)       # slight transparency
root.configure(bg="#1a1a2e")

# span full screen width, 40px tall, at top
sw = root.winfo_screenwidth()
root.geometry(f"{sw}x40+0+0")

label = tk.Label(
    root,
    text="Starting…",
    font=("Consolas", 14, "bold"),
    fg="#00ff88",
    bg="#1a1a2e",
    anchor="center",
)
label.pack(fill=tk.BOTH, expand=True)

def tick():
    label.config(text=compute_text(state))
    root.after(100, tick)

tick()

# ── start keyboard listener in background thread ─────────────────────────

listener = keyboard.Listener(on_press=on_press)
listener.daemon = True
listener.start()

# ── run ───────────────────────────────────────────────────────────────────

root.mainloop()
