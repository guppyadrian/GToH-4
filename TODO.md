## NEW
- When pressing R to reset a level, the input gets reset along with pressing r.
    This is a problem because the R key check is only done every tick, so it would delete any inputs pressed in that buffer time
    The fix is to have a listener for R so it knows the exact time it was pressed.
- Fix drawing to be pixel perfect
- Add metal colored blocks???
- Grass block
- do water...

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