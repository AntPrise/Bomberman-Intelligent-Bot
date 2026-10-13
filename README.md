# Intelligent Bomberman Bot

A standalone repository for the **Game of Bombs Intelligent Tile Bot v5.2.0** (14,798 lines in the original script). The primary deliverable is a Tampermonkey userscript. It analyzes the rendered world and attempts hazard-aware movement and bomb planning.

> Independent community tooling. Not affiliated with the game publisher. Verify that automation is permitted on the server where you use it.

## Get started

1. Install a userscript manager such as Tampermonkey.
2. Open `src/intelligent-bot.user.js` and install it in your manager.
3. Disable older Game of Bombs bot userscripts to avoid overlapping input handlers.
4. Open `https://gameofbombs.com/`, refresh the page, and observe the console for initialization diagnostics.
5. Use the script's built-in controls and console diagnostics for testing.

The bot currently runs in the browser, not Node.js. The included `package.json` is only for development checks.

## Project layout

```text
src/                  Main userscript (the only installation entry point)
research/canvas/      Earlier grid, tile, timer, and explosion-analysis experiments
research/prototypes/  Earlier input and bot implementations, not automatically loaded
assets/bot/           Bot visual assets, provided as optional references
docs/                 Architecture, security notes and source inventory
tests/                Static validation checks
```

## Development

Requires Node.js 18 or newer for checks (not required for installing the bot).

```bash
npm test
```

The research folder is **not a dependency** of the main bot. Do not install its archived userscripts together with the main bot unless debugging a specific behavior: their hooks can conflict. The bot-themed PNG files are optional art references and are not loaded by the bot.

## Status and limitations

- The main script is preserved as an integrated legacy implementation rather than being split into modules that could break early page hooks.
- Static syntax validation is included. Live gameplay, movement, server compatibility and resource behavior have **not** been verified.
- The bot relies on implementation details of the game client. Updates to that client can break tracking or planning.
- The original file includes experimental prototype instrumentation. See `SECURITY.md` before running it.

## Origins

The main file was extracted from `Scripts-main/Работа с Канвасом/Умник` (through the reorganized BombKit archive). Companion tools were selected from the same repository. See `docs/SOURCES.md` for the file inventory and **`docs/REVERSE_ENGINEERING.md` for the full historical evidence map** (client analysis, bomb strengths, collision, canvas, coordinates, packets, and later bot research).

## Licensing

No new license is asserted for the legacy scripts or art. Confirm ownership and licensing before publishing or redistributing.
