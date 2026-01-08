## 0.7.1 January 8, 2026
- Fixed levels in world 3 not having a format, which stopped the level from being loaded
    - Tower of Ratio
    - Tower of Jobe
    - Prison Escape Tower
    - Tower of Good Timing

## 0.7.0 January 7, 2026
- Added
    - World 3
    - Key and Door blocks
    - Ice blocks
- Parity fixes with original GToH
    - purple now starts out active instead of orange
    - actually fixed blue not starting out active instead of red
- Changed
    - Temporarily disabled main menu

## 0.6.0 October 9, 2025
- Added
    - Main lobby
    - World 2
- Fixed
    - Portals with no destination now display an error name instead of crashing

## 0.5.0 October 8, 2025
- Added
    - Lobby level
    - All world 1 levels
    - Win & portal blocks
    - basic settings scene
    - Smooth camera option
    - High fps option
- Changed 
    - lvl format uses JSON5 to make it more readable
- Parity fixes with original GToH
    - Input is reset after changing levels
    - Blue starts active instead of red
    - Start level with -3 y velocity


## 0.4.1 October 4, 2025
- Make canvas rendering like 10x faster
- Added metal block
- Added status block
- Changed how assets are preloaded
- Added bounce block
- Added force block
- Performance improvements

## 0.4.0 October 3, 2025
- Added interpolation
- Changed canvas rendering slightly to hopefully avoid weird visuals
- Added swap and timed blocks
- changed game zoom to 2x for now. Will hopefully make a real fix

## 0.3.0 September 10, 2025
- Changed canvas to be its own class.
    - Some stuff might still need to be migrated
- Game is now in fullscreen
- Partially implemented repeating textures.

## 0.2.1 September 9, 2025
- Added
    - level.ts to store a map of all levels in levels/ folder
        - Each level must have an unique ID now!

## 0.2.0 September 7, 2025
- Added
    - Area class
    - collision
    - World & level loading
    - createBlock()
    - Camera easing
- Changed
    - lib is now its own package
    - resolution is not 720x480
    - Uses typescript
    - Able to jump as level starts

## 0.1.1 September 6, 2025
- Added
    - More documentation
- Changed
    - sprite has a center property now to get it's center
    - Camera follows player
- Fixed
    - Camera zoom being set to 0


## 0.1.0 September 6, 2025
- Added
    - Library
        - assets.js
        - input.js
        - keyboard.js
        - master.js
        - scene.js
        - sprite.js
        - vector2.js
        - camera.js
    - Game
        - gameScene.js
        - player.js