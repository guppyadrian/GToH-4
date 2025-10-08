## 0.5.0 October 8, 2025
- Added
    - Lobby level
    - First 6 levels
    - Win & portal blocks
- Changed 
    - lvl format uses JSON5 to make it more readable
    - Input it reset after changing levels (fix parity with original GToH)


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