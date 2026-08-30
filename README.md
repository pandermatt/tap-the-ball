# Tap The Ball

A browser game built over the 2017/18 new-year break: tap a ball to keep it climbing against a
gravity simulation, and see how high it gets before it reaches the floor.

## No longer hosted

The GitHub Pages deployment was retired in August 2026, and the Play Store listing
(`ch.pandermatt.taptheball`) is gone. The game is plain static files with no build step, so it still
runs locally:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## How it works

The ball falls under a Popmotion `physics` simulation. Every tap resets its velocity to 1200 pixels
per second upward, and the landing is a `spring` on the ball's scale, so it squashes on impact and
bounces again if it hits hard enough. A green ring flashes on each tap and a red one when the ball is
left to reach the floor, which resets the count to zero.

The playfield is a single 3000-pixel column and the viewport does not follow the ball, so playing
means scrolling as well as tapping — `SCROLL UP` and `SCROLL DOWN` badges appear whenever the ball
leaves the window.

Two numbers are tracked, each stored per mode in `localStorage`: height, read off the ball's Y
position and shown in metres, and the tap count. Reaching the top of the column records the fewest
taps it took to get there.

### Modes

One constant changes between modes — the gravity acceleration — along with the background gradient
and the high score being tracked:

| Mode | Acceleration |
| ---------- | ------------ |
| Easy | 2500 |
| Hard | 4000 |
| Impossible | 6000 |

## Built with

- [Popmotion](https://popmotion.io/) — the gravity and spring simulation
- [Tone.js](https://tonejs.github.io/) — a looped track per mode, plus a PolySynth note on every tap
  that rises five hertz with the count
- [SweetAlert2](https://limonte.github.io/sweetalert2/) — the dialogs
- jQuery, an appcache manifest and a web app manifest, which made it installable on a phone home
  screen

## Music

"Andreas Theme", "Jet Fueled Vixen", "Miami Nights - Extended Theme"

Kevin MacLeod ([incompetech.com](http://incompetech.com))

Licensed under Creative Commons: By Attribution 3.0 —
<http://creativecommons.org/licenses/by/3.0/>

## License

MIT — see [LICENSE](LICENSE).
