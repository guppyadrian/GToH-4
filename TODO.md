## LIBRARY
- [ ] ? Make master have a canvas class instead of just storing as a var
- [x] Add a loader scene for loading in assets
- [ ] Add a justPressed method to keyboard
- [ ] Camera should have an array for tranformations. So multiple transformations could be applied at once!
- [x] Zoom needs to scale images~!
- [ ] mouse input? for gui
- [ ] progress for loading would be nice...
- [x] Make everything use guppy-lib module!
- [x] Sprite extends Rect/Area for collisions + LEFT + TOP + RIGHT + BOTTOM
- [ ] skip drawing stuff offscreen (if it's even faster idk?)

## GAME
- [ ] win somehow needs to access game scene, or a static game class.
- [x] Lets make player physics
- [x] Make world <-- this is next please
- [x] Do some collision stuff, I bet some of it should be part of the library
- [x] make the loadLevel.js load json files from a folder.
- [x] unplement autozoom
- [ ] add methods to levels.ts (maybe turn it into a static class)
- [ ] compare frame draw time to old GToH versions (GToH OG, Ancient, Expanded, Remastered)
- [ ] try embedding images and using an import meta blob?

hey complicated water shaders please
also webgl please, fallback to canvas then?

how will collision work? need some way to get all statuses i think that is how original worked.
efficient collision method where if colliding, move until no longer colliding with that SPECIFIC block.
- [x] sprite.from is redundsnt right? the image argument should just br a string instead for faster.
- [x] also make a canvas class. it should have some createpattern method and store it in a map.
also Assets needs to store audio also. change get to getImage and load to loadImage. add audio methods
- [x] canvas class has a full draw method, including rotstions/scaling
also camera values should be get set, for camera transforms like shake. alsso camera should eotate that would be cool
draw method also for gui. Gui should have origin for scsling.
if an element is at the bottom put origin at bottom so it scales up.
- [x] look into build macros. when builds it packs all levels into an array. a file should be automated to import all json when builds