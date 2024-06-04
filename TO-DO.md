✅🟦🟥
- Fix player jitter/ find better movement 
- 🟦get collisions with world working
	- 🟥 they aren't correct via tilled and still ne world boundary 
- ✅scale sprites down to make world bigger
- get camera and player to stop at world border
- ✅Figure out what the pink is around player sprite
	- this a debug tool `this.sprite.body.debugShow = false`

---

### Player
- ✅set attack animation
	- ✅ have to figure out facing as well
- ✅set hit registration on attack
- give player HP
- health bar
- take damage animation

### Enemy
- 🟦 make an base Enemy class to extend with different types
- ✅ random movement
- ✅agro on player when in a range 
- ✅give HP
- Give it attacks
	- HIT REG
- Health bar || Number popup 
- take damage animation
- death animation
- Spawn more enemies randomly.  

### Collision
- ✅set world bounds so player and NPC can't walk off the map 
- ✅and set so camera can't go past the bounds

### LOOT
- Shrooms
	- drops from enemies
	- random chests on map


### Escape menu
- show shrooms
- leave game
- log-out
- delete account