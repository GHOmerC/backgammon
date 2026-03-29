# Backgammon Changelog

## v4.4-MP
**Rewrite matchmaking — split watch/poll, no complex listener logic**
- Each player watches only their OWN queue entry for a roomCode (join as Black path)
- Separate `setInterval` polls the full queue every 2s (become White path)
- Smaller Firebase key wins the tie-break — exactly one player becomes White
- `_matchPollInterval` tracked globally so Cancel cleans it up properly

## v4.3-MP
**Rewrite matchmaking — deterministic key-comparison, no transactions**
- Removed transaction and interval polling entirely
- Both players write to queue then watch the entire `/matchQueue/` with `on('value')` (real-time)
- Race condition eliminated by rule: player with the **smaller Firebase push key** always becomes White
- The larger-key player simply waits; the smaller-key player writes the roomCode into the other's entry
- No polling delay — match fires the moment the second player appears in the queue

## v4.2-MP
**Fix transaction cache miss + checkbox alignment**
- Matchmaking still failed because Firebase transactions receive `null` on first call for uncached nodes, causing an immediate abort. Fix: warm the local cache with `once('value')` before running the transaction.
- Checkbox label now top-aligns with `margin-top:2px` on the checkbox so it doesn't float to the top when the label text wraps to two lines.

## v4.1-MP
**Fix matchmaking — atomic claim via Firebase transaction**
- Root cause of v4.0 failure: both players rescanned at the same time, both found each other, both tried to become White simultaneously → deadlock
- Fix: use a Firebase transaction to atomically mark a queue entry as claimed; only one player wins the transaction, the other gets `null` and backs off
- Both players now add themselves to the queue immediately on click, then scan every 3s
- Black side ignores `roomCode = 'PENDING'` and waits for the real room code

## v4.0-MP
**Fix matchmaking race condition**
- Both players clicking "Find a Match" at the same time would both see an empty queue, both add themselves, and neither would ever find the other
- Fix: after adding yourself to the queue, re-scan every 4 seconds for newly arrived players
- First to find a match in the rescan becomes White and claims the other player

## v3.9-MP
**Find a Match — ELO-based auto matchmaking**
- New "FIND A MATCH" button in lobby (blue, above Create/Join)
- Scans `/matchQueue/` for waiting players; picks closest rating match (ties: oldest first)
- Stale entries (>30s) are skipped; race conditions handled
- Claimant becomes White and creates the room; waiter becomes Black
- "Searching..." screen with Cancel button while in queue
- Both players' rating and level are exchanged automatically on match

## v3.8-MP
**ELO rating update at game end**
- `_updateElo(winnerColor, pts)` calculates rating change for both players after every game
- Called on normal win (1/2/3 pts), clock forfeit (2 pts), and remote gameover
- Formula: `delta = pts − Expected`; winner gains `K × delta`; loser loses `K × delta`
- K = 4 (first 10 games), 3 (up to 30 games), 2 (experienced)
- Rating floored at 100; written back to Firebase `/players/{key}`

## v3.7-MP
**Player registration, IP capture, level labels**
- On Create or Join, public IP fetched via ipify; player record created/updated in Firebase `/players/`
- Returning players recognized by name + IP — rating persists across sessions
- `_levelLabel()` maps rating to: Beginner · Casual · Club Player · Advanced · Expert · Master · World-class
- Level + rating shown in lobby below country selector (e.g. "Club Player · 1542")
- Level + rating shown on board left border below version number (multiplayer only)
- Players exchange rating and level when joining a room

## v3.6-MP
**Miscellaneous fixes (internal)**
- Bug fix: Create/Join broken when Firebase `/players/` rules not yet set — wrapped in try/catch so game always starts

## v3.5-MP
**Left-base layout fixes**
- Fixed dice disappearing in left-base mode
- Fixed green felt covering wrong area in left-base mode
- Fixed clock, banner, and medallion off-center in left-base mode

## v3.4-MP
**"Home board on left side" option**
- Checkbox in lobby: mirrors the board so home board (points 1–6) appears on the left of the bar
- Local preference only — opponent sees their own normal layout
- `barX()` / `bearX()` helpers replace hardcoded constants throughout all drawing functions

## v3.3-MP
**Double-move bug fix + opening die jump fix**
- Fixed: every remote move was executing twice (`visualOnly` flag added to remote checker animation)
- Fixed: first opening die jumping to center on remote board (`dicePositions` now sent for `opening_b` phase)
- Fixed: safe close sound (`Safe closed.m4a` — capital S, case-sensitive on GitHub Pages/Linux)

## v3.2-MP
**Backgammon 3-point win detection**
- Detects backgammon (opponent has checker on bar or in winner's home board) → 3 points
- Gammon (opponent has no checkers borne off) → 2 points
- Normal win → 1 point

## v3.0-MP
**Synced dice rolling animation and sounds**
- Dice positions mirrored — both players see dice in the same board location
- Rolling animation synced — remote player sees the same dice physics
- Sounds play on both sides (roll, checker, blot, bear-off)
- `diceInitState` and `dicePositions` added to `pushState()`

## v2.9-MP
**Remote 4-dice fix + USA pinned**
- Fixed: remote player seeing wrong dice count on doubles
- USA pinned at top of country dropdown with separator

## v2.8-MP
**UX improvements**
- Country dropdown: first-letter keyboard navigation; name before emoji
- Enter key creates a game from name/country fields
- Doubles show golden glow on dice
- Added `Safe closed.m4a` sound

## v2.7-MP
**Board flip for Black**
- Black sees home board (points 19–24) at bottom-right, matching White's experience
- `vp(n) = 25 − n` system flips visual point mapping for Black

## v2.6-MP
- Enter key in join field triggers Join
- First die flicker fix
- Safe-door closing sound added

## v2.5-MP
- "Press R" blinks on title screen
- Click anywhere to roll
- Chess clock shown only to active player; clock synced between clients
- Tick sound in last 20 seconds

## v2.4-MP
- Version label position on board border
- Opening roll player name hidden from non-rolling player
