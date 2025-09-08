## LIBRARY
- [ ] ? Make master have a canvas class instead of just storing as a var
- [x] Add a loader scene for loading in assets
- [ ] Add a justPressed method to keyboard
- [ ] Camera should have an array for tranformations. So multiple transformations could be applied at once!
- [ ] Zoom needs to scale images~!
- [ ] mouse input? for gui
- [ ] progress for loading would be nice...
- [x] Make everything use guppy-lib module!
- [x] Sprite extends Rect/Area for collisions + LEFT + TOP + RIGHT + BOTTOM

## GAME
- [ ] win somehow needs to access game scene, or a static game class.
- [ ] Lets make player physics
- [ ] Make world <-- this is next please
- [ ] Do some collision stuff, I bet some of it should be part of the library
- [ ] make the loadLevel.js load json files from a folder.
- [ ] unplement autozoom

how will collision work? need some way to get all statuses i think that is how original worked.
efficient collision method where if colliding, move until no longer colliding with that SPECIFIC block.
sprite.from is redundsnt right? the image argument should just br a string instead for faster.
also make a canvas class. it should have some createpattern method and store it in a map.
also Assets needs to store audio also. change get to getImage and load to loadImage. add audio methods
canvas class has a full draw method, including rotstions/scaling
also camera values should be get set, for camera transforms like shake. alsso camera should eotate that would be cool
draw method also for gui. Gui should have origin for scsling.
if an element is at the bottom put origin at bottom so it scales up.
look into build macros. when builds it packs all levels into an array. a file should be automated to import all json when builds