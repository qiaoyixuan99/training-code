"""
Squad Distance Meter
--------------------
Background tool for measuring distances on Squad's in-game map.

Hotkeys:
  i  - Mark a reference point (press twice; the pair = 300 m)
  o  - Mark a measurement point (press twice; distance shown)
  r  - Reset all points
  Esc - Quit

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

# ── shared state (written by listener thread, read by tkinter) ────────────

class State:
    def __init__(self):
        self.lock = threading.Lock()
        self.i_points = []  # [(x,y), (x,y)]
        self.o_points = []  # [(x,y), (x,y)]

state = State()
mouse_ctrl = mouse.Controller()

# ── geometry helpers ──────────────────────────────────────────────────────

def pixel_dist(a, b):
    """Euclidean distance between two (x, y) pixel coordinates."""
    return math.hypot(a[0] - b[0], a[1] - b[1])

def compute_text(s: State) -> str:
    with s.lock:
        if len(s.i_points) < 2:
            return "Press 'i' twice to set 300m reference"
        d_i = pixel_dist(s.i_points[0], s.i_points[1])
        if d_i == 0:
            return "i points overlap — press 'r' and try again"
        scale = 300.0 / d_i  # metres per pixel
        if len(s.o_points) == 0:
            return f"i: 300m calibrated | Press 'o' to measure"
        if len(s.o_points) == 1:
            return f"i: 300m calibrated | Press 'o' once more"
        d_o = pixel_dist(s.o_points[0], s.o_points[1])
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

def make_click_through(widget):
    """Make a tkinter window click-through using Win32 API."""
    hwnd = ctypes.windll.user32.GetParent(widget.winfo_id())
    style = ctypes.windll.user32.GetWindowLongW(hwnd, GWL_EXSTYLE)
    ctypes.windll.user32.SetWindowLongW(
        hwnd, GWL_EXSTYLE,
        style | WS_EX_TRANSPARENT | WS_EX_LAYERED | WS_EX_TOPMOST
    )

def tick():
    label.config(text=compute_text(state))
    root.after(100, tick)

# apply click-through after window is mapped
root.update_idletasks()
make_click_through(root)
tick()

# ── start keyboard listener in background thread ─────────────────────────

listener = keyboard.Listener(on_press=on_press)
listener.daemon = True
listener.start()

# ── run ───────────────────────────────────────────────────────────────────

root.mainloop()
