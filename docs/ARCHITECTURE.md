# Architecture overview

The bot is one self-contained Tampermonkey userscript. It installs early (`document-start`) to observe the game client before initialization, then starts its controller after the DOM is ready. Its implementation includes a BombModel prototype tap, canvas/state instrumentation, hazard predictions, movement selection, and an on-screen interface.

**Why a monolithic main file?** Early client hooks can be sensitive to evaluation order. A cosmetic module refactor without an integration test would risk breaking the bot. Consequently, the main script is retained in place and the extracted research snippets are explicitly isolated under `research/`. A safe future refactor should add recorded input fixtures and tests for grid extraction, bomb-range calculation, pathfinding, and per-frame controller decisions before splitting the main code.

**Asset usage:** The PNGs in `assets/bot/` are visual references. The primary bot does not import them.
