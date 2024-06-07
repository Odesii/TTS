✅🟦🟥
-✅ Fix player jitter/ find better movement 
- ✅get collisions with world working
	- ✅ they aren't correct via tilled and still ne world boundary 
- ✅scale sprites down to make world bigger
- ✅get camera and player to stop at world border
- 
---



### Player
- ✅set attack animation
	- ✅ have to figure out facing as well
- ✅set hit registration on attack
- ✅give player HP
- ✅health bar
  - STYLE it
- ✅ take damage animation
- projectiles
- ✅give player death state
- adjust attack
  - get it to use shroom style of distance detection to help make it more consistent

### Enemy
- 🟦 make an base Enemy class to extend with different types
- ✅ random movement
- ✅agro on player when in a range 
- ✅give HP
- ✅Give it attacks
	- ✅HIT REG
- Number popup 
- ✅take damage animation
	- ✅set it for direction and add knock back.
- ✅death animation
- ✅Spawn more enemies randomly. 
	- ✅fix world collisions *still spawn in walls but move out*
	- ✅if % under spawn amount destroy .isDead and spawn new

### Collision
- ✅set world bounds so player and NPC can't walk off the map 
- ✅and set so camera can't go past the bounds

### LOOT
- !CHests !work!!!! !need to edit tile sheet for anims
- adjust range on pick up
- make it only interactive once 
- Shrooms
	- drops from enemies
	- ✅random chests on map
		- ✅random shroom value
		- display above player head "5x'Shr0om Icon'"

### Escape menu
- take you to /profile
  - add play button tp profile 
  - should have shop redirect
  - log out
-  show amount of shrooms
- ✅ leave game
- ✅ log-out
- ✅ delete account

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

## SOCKET IO
- get players on same screen 




kill feed on pvp