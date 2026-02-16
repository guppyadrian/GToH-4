## NEW
- When pressing R to reset a level, the input gets reset along with pressing r.
    This is a problem because the R key check is only done every tick, so it would delete any inputs pressed in that buffer time
    The fix is to have a listener for R so it knows the exact time it was pressed.
- Fix drawing to be pixel perfect
- Add metal colored blocks???
- Grass block
- do water...
- Add a menu for logging in
- Show player names
- Add best times
- Add world records

## Multiplayer
- multiplayer.ts should just be for handling connections?
- It needs a way to add/remove event listeners
- In the gamescene listen for other playersd
- Some static class for storing players... So I guess it should be in the multiplayer class?


## LIBRARY
- [ ] Camera should have an array for tranformations. So multiple transformations could be applied at once!
- [ ] mouse input? for gui
- [ ] progress for loading would be nice...

## GAME
- [ ] add methods to levels.ts (maybe turn it into a static class)
- [ ] compare frame draw time to old GToH versions (GToH OG, Ancient, Expanded, Remastered)
- [ ] when colliding, player only needs to check collision with that one block. Honestly, could just teleport to the edge of the block!
- Note with above ^ wouldn't that mess with some stuff technically? other blocked touched while moving over

## ARCHITECTURE
1. Client connects socket.io
2. Client sends version #
3. Server either closes connection or acknowledges
4. Client sends ready signal
5. Server syncs players and level times

## Redesign
Maybe multiplayer should be separated from the rest of the game and just watches.
It calls functions in the game to create and modify entities

### Rework guppy-lib
What do I want exposed with guppy-lib?
especially with an ECS how is drawing best done?
- I want a scene object. data should transfer between scenes

### Entity component system
Should swap to entity component system? or at least use components for blocks
Entity store exists