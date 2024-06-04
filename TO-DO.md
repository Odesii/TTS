✅🟦🟥
- Fix player jitter/ find better movement 
- 🟦get collisions with world working
	- 🟥 they aren't correct via tilled and still ne world boundary 
- ✅scale sprites down to make world bigger
- get camera and player to stop at world border
- ✅Figure out what the pink is around player sprite
	- this a debug tool `this.sprite.body.debugShow = false``

---



### Player
- ✅set attack animation
	- ✅ have to figure out facing as well
- ✅set hit registration on attack
- ✅give player HP
- ✅health bar
- take damage animation
- projectiles

### Enemy
- 🟦 make an base Enemy class to extend with different types
- ✅ random movement
- ✅agro on player when in a range 
- ✅give HP
- Give it attacks
	- HIT REG
- Number popup 
- ✅take damage animation
	- 🟦set it for direction and add knock back.
- ✅death animation
- ✅Spawn more enemies randomly. 
	- respawn and fix world collisions

### Collision
- ✅set world bounds so player and NPC can't walk off the map 
- ✅and set so camera can't go past the bounds

### LOOT
- Shrooms
	- drops from enemies
	- random chests on map
		- random shroom value
		- display above player head "5x'Shr0om Icon'"

### Escape menu
- show amount of shrooms
- leave game
- log-out
- delete account

### Inventory
- potions for temp buffs
- MAYBE temp weapons

### MAP
- fix border 
	- add water and bridges
- if player crosses bridge they 'extract'

### EXTRACT
- menu to spend currency 
	- potions || other items
- maybe change Class





kill feed on pvp