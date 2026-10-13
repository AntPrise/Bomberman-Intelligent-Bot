# Security and responsible use

- **HTTPS only:** the primary userscript is limited to `https://gameofbombs.com/*`; the insecure HTTP match was removed.
- **No secrets:** do not commit access tokens, account passwords, or session cookies. A static scan is included for the main script, but that is not a full security audit.
- **Page instrumentation:** the main script instruments rendering and in-memory game-client behavior. Some hooks affect shared browser objects during startup and can conflict with extensions or game updates. Enable it only on a trusted host.
- **No remote dependencies:** the primary userscript has no `@require` directive or bundled third-party packages.
- **Scope:** archived prototypes and research files are for inspection, not production deployment. They have not undergone individual security review.
- **Account safety:** only run in an environment where you have authorization to test or automate gameplay.
- **Reporting:** remove secrets from logs when reporting issues.

Static checks do not replace a runtime security review or a live test.
