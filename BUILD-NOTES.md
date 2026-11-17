# Star Slinger build notes

Original canvas/WebAudio gravity slingshot puzzle. No external assets, packages, network references, repository creation, or submission. LICENSE and vendor/makefun-game.ts match the kit byte for byte.

## Files

- main.ts: copies the static game and captures, then calls the unchanged dossier library with the required caps.
- serve.ts: Node standard-library static server on port 8080.
- game/index.html and game/src/{config,random,levels,physics,world,input,render,audio,shots,main}.js: full game.
- shots.json: four deterministic browser capture queries.
- solver.mjs: angle × power grid search using the real predictor.
- verify.mjs: four autopilot stages and the complete ten-level rules flow.

## Solver results

All routes collect every star and enter the goal in one shot. Angles are degrees from rightward, negative upwards; power is pixels/second.

| Level | Name | Result | Angle | Power | Flight | Stars |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | First Light | SOLVED | -16 | 180 | 5.08 s | 1/1 |
| 2 | Coral Current | SOLVED | -25 | 200 | 4.68 s | 1/1 |
| 3 | Twin Suns | SOLVED | -14 | 180 | 4.75 s | 2/2 |
| 4 | Violet Bend | SOLVED | -23 | 240 | 3.73 s | 2/2 |
| 5 | Mint Passage | SOLVED | -11 | 210 | 4.12 s | 2/2 |
| 6 | The Long Arc | SOLVED | -18 | 260 | 3.45 s | 3/3 |
| 7 | Three Sisters | SOLVED | -14 | 210 | 3.95 s | 3/3 |
| 8 | Needle of Light | SOLVED | -22 | 220 | 3.78 s | 3/3 |
| 9 | Amber Relay | SOLVED | -17 | 210 | 3.80 s | 3/3 |
| 10 | Homeward Halo | SOLVED | -19 | 240 | 3.33 s | 3/3 |

## Verification

Every game JavaScript file passes both node --check and module-mode stdin syntax checking. The rules test verifies title, launch, collection, goal, complete, next, all ten levels, victory (19,575 points / 30 medals), new journey, pause/resume, replay, out-of-shots failure, and retry. The screenshot pilot verifies TITLE, PLAY (still flying after two seconds with a collected star), COMPLETE, and FAILED.

Node 22 executes main.ts and copies game/ to /tmp/game-out/game. The canonical buildDossier call then refuses the empty screenshots directory: `buildDossier: screenshots/ holds no image: the first is the cover`. Thus there is no valid dossier.json yet, and its Game block cannot yet be confirmed. The kit's requirement for actual captures takes precedence over the brief's expectation of a valid dossier with screenshots empty. Do not fabricate a dossier or images. Capture the four shots externally, then rerun main.ts.

The static server cannot bind in this sandbox (`listen EPERM`). Automatic approval review for local serving failed because its configured reviewer model is unavailable (404), so no server was started. Curl could not connect; HTTP 200 checks remain pending.

Chromium was attempted with a profile inside this directory. It aborts with crashpad `setsockopt: Operation not permitted`. screenshots/ is intentionally empty. Visual layout, browser pointer behavior, and audible sound still require a browser check outside this restricted sandbox.

The authoritative kit states an entries deadline of 2026-11-18T18:10:00Z, rather than the brief's 18:00:00Z. No entry was submitted.

## Local commands after capture

```
node solver.mjs
node verify.mjs
node serve.ts
MAKEFUN_OUTPUT_DIR=/tmp/game-out node main.ts
```
