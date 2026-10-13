# Reverse-engineering evidence and design provenance

This document records the evidence discussed during development of the Bomberman/Game of Bombs bot. It separates **direct evidence from the included v5.2 script** from **historical findings reported in earlier project discussions**. Historical findings are **not a claim that the original compiled client or dumps are in this repository**.

## Source hierarchy

1. **Included and auditable:** `src/intelligent-bot.user.js` (v5.2, 14,798 lines) and `research/` (canvas probes, input prototypes). Search these files for the symbols in the tables below.
2. **Derived from client during prior work (not distributed here):** versioned `client/<version>/app/app.nocache.js`, `data.js` / `data.json`, decompiled client classes and functions, screenshot/canvas captures and runtime entity dumps. These are third-party game materials and were not silently copied into this project.
3. **Prior project iterations (not in this archive):** runtime hooks and v5.3–v5.11 bot builds; these evolved after the archived v5.2 script. Their findings are recorded for historical context, **not assumed to be implemented in v5.2**.
4. **Network / user-provided logs:** packet probes and console traces from test sessions; the raw original attachments must be supplied again if byte-for-byte reproductions are required.

## Client mechanics: extracted observations

| Topic | Evidence and exact observation | Where used / status |
| --- | --- | --- |
| Bootstrapping | Page loader references `client/<version>/app/app.nocache.js`; game DOM has `<canvas id="bg">` and a `play.tmpl` template (historical pasted loader). | The userscript runs at `document-start`, before compiled game initialization. |
| Compiled BombModel | Initialization observed in order: `_.He`, `_.xb` (contains `Bomb{ strength=`), `_.q = 0`, `_.r = 0`, `_.s = 0`, `_.t = 0`. | **Included in v5.2:** an early BombModel prototype capture uses `q` to install an `s` strength accessor before initialization; cleans up its temporary prototype hook. |
| Bomb strength | `DefaultBombFactory` initializes bomb power; `OP(a,b)` assigns `a.s = b`; `StandardBombUnit` provides bomb power for explosion behavior. | **Included:** distinguish maximum strength from actual directional reach. User-requested earlier versions mistakenly drew maximum reach everywhere. |
| Fuse | `BombModel` starts with `N=40`; `jQ()` decrements the countdown to explosion. | **Included:** approximate 4,000 ms fuse; visual stage bounds explicitly treated as estimates. |
| Fuse animation | `BmStandardBombView` uses `floor((40-N)/13)`, clamped to stages 0–2. | **Included:** remaining time is bounded approximately as 2.8–4.0, 1.5–2.7, or 0–1.4 seconds, not claimed exact for unseen bombs. |
| Cardinal explosion rays | `XP()` propagates in 4 directions, one 32 px tile per step, starting at `BombModel.s`; terrain, other bombs and solid units change each direction's effective length. | **Included:** separate `actual` from `maximum`, `stoppedBy` and affected `cells` per ray. |
| Tile collisions | Source numeric collision classes 3/5 attenuate a ray; classes >=7 terminate it. `VaultUnit` entity type 85 is a distinct solid entity, not an ordinary breakable tile. | **Included with limitation:** canvas alone yields sprite names, **not** the compiled config numeric `.s` collision class. Do not invent collision-class mappings from graphics. |
| Ordinary destructible bricks | Later runtime hook work identified names `brick_empty`, `brick_scate`, `brick_bomb`, `brick_power`, `brick_kick`, `brick_bat`, `brick_key`. | **Historical post-v5.2 evidence:** useful for test fixtures; verify exact aliases/classes per current client before changes. |
| Rendered grid | 32 px gameplay tiles; canvas renderer uses offscreen tile/chunk buffers and `createPattern`/`drawImage`; cached chunks can be 8×8 tiles. | **Included:** instrumentation of visible `layer0`/`layer1`, tile sources, chunk expansion, viewport positioning and world separation. |
| World/plane isolation | Different planes/worlds can occupy analogous screen/tile coordinates (including offsets 32 tiles apart). | **Included:** avoid mixing hazards from distinct worlds; later v5.3+ explicitly filtered bombs by `bomb.position.plane === player.position.plane`. |
| Bomb observations | Later source-derived runtime dumps expose `StandardBombUnit` fields `unitId`, `playerId`, `position.plane`, `position.tileX`, `position.tileY`, `N` (countdown), `s` (strength), and `kb`; a local `CharacterUnit` identifies active plane. | **Historical later bot builds:** live model state is more authoritative than bomb sprite guesses, but exact object shapes may change by client version. |
| Chain behavior | Bombs contacted by an explosion may be triggered earlier; bricks absorb/modify rays based on collision rules. | **Included:** explosion and chain-reaction planning; subsequent v5.9 patches improved runtime event interpretation. |
| Player movement | Canvas-observed movement plus synthetic keyboard events; controller tries to avoid using the stop/Q input bit `16` as an ordinary release state. | **Included:** key handling, motion tracking, escape decisions and anti-idle. Network packet-order experiments are **separate research**, not required for the v5.2 userscript. |
| Powerups | Named sprites and canvas group children give pickup/object detections; more recent bot builds used explicit runtime item-unit scans. | **Included:** collection/planning uses observed game layer; don't treat an occluded tile as a confirmed pickup. |

## Related network reverse engineering (separate from current v5.2 bot)

Earlier packet logs recognized `VisionOrder`, `KeyboardOrder`, and `PutBombOrder` (order type 3). One reported form of `PutBombOrder` serialized `uint8 plane`, `int16 little-endian tileX`, `int16 little-endian tileY`. One composite `Vision + PutBomb + Keyboard` payload measured 60 bytes; other captured Vision/Keyboard samples measured 50 bytes with two orders. Those lengths describe **specific captures**, not universal message sizes.

Other later work showed that rewriting client-side coordinates did not guarantee a server-authoritative teleport; moving afterward could snap the character back. This repository does **not** incorporate movement or server-validation bypass logic. The packet work is provided as historical architecture context only.

## Coordinate representations — do not mix

There have been multiple coordinate types in the project:

- **Canvas/tile presentation:** world tiles are rendered in 32 px steps by the observed client.
- **Player/model fixed-point coordinates (later runtime probes):** one `CharacterModel` path used `fb.e/f >> 8`, corresponding to 256 internal units/tile.
- **Item-unit position (separate later code path):** an `ItemUnit` path was reported to use `fb.e/f >> 5` for converting its internal positions to tile positions.

The `>>5` and `>>8` observations refer to **different structures**, not contradictory universal conversion rules. Do not consolidate them into one global coordinate formula without verifying the owning type.

## Later bot evolution — provenance, not dependencies

| Iteration | Previously documented findings |
| --- | --- |
| v5.2 (this repository) | Early BombModel capture; visible-layer canvas tracing; per-direction simulated fire; tile-based path and timing logic; anti-idle controller. |
| v5.3 | `runtime_hook_bot_v2.js` and runtime entity probes to distinguish actual bombs from visual states, including active-plane filtering. |
| v5.9 / v5.9.5 | Collision catalogue work, bomb state with owner/strength/countdown, per-direction fire predictions, and corrected 1-HP destructible brick behavior. |
| v5.10.7 | Reports of `gobGameApi()`, `gobBombs()`, `gobBombEvents()`, `gobPowerups()`, `gobMapAround(r)`, `gobSetBlastRadius(n)` and space-time A*; these features/implementations must be verified separately against this archive. |
| v5.11.x | Browser/runner integration and updated escape/powerup/brick priorities; not packaged with this v5.2 userscript. |

## Evidence sources and availability

| Historical source | What it contributed | Included? |
| --- | --- | --- |
| `Scripts-main/Работа с Канвасом/Умник` | Main bot file (renamed, extension normalized) | **Yes:** `src/intelligent-bot.user.js` |
| Canvas deconstructor and tile coordinate/change probes | Detect canvas resource names, tile placement and updates | **Yes:** `research/canvas/` |
| Canvas timer, prediction, range-view experiments | Observed bomb indicators, frame timing and map projection | **Yes:** `research/canvas/` |
| Keyboard/input bot prototypes | Early movement and automation implementations | **Yes:** `research/prototypes/` |
| Original `app.nocache.js` | Compiled client models, `XP()`, `jQ()`, bombs/collision and rendering functions | **No:** historical client analysis only |
| `data.js` / `data.json` | Asset/config mapping and tutorial/game schema investigation | **No:** not verified or included in this export |
| Uploaded `Pasted text*.txt`, packet probes and JSON model dumps | Hex payloads, live entity field observations and logs | **No:** original attachments not packaged; key reported findings summarized above |
| Later bot ZIPs and `runtime_hook_bot_v2.js` | Newer observations and design fixes beyond v5.2 | **No:** different versions, not dependencies |
| Plutonium/chest spawn analysis | Separate 0–31 coordinate/event study; not a pathfinding or explosion-model dependency | **No:** unrelated feature, deliberately excluded |

## Boundaries and verification

This is a **provenance and design reference**, not an assertion of identical behavior across client versions. Specific values like fuse duration, collision classes, coordinate shift and packet layout are backed either by comments/code in v5.2 or by historical discussions as indicated. To reproduce byte-level findings, collect the exact archived client build, its `data.js`/`data.json`, model dumps, packet logs, captured frames, and version tags; add sanitized samples under `fixtures/` and tests before changing assumptions.
