import Phaser from "phaser"


export class HealthBar {
  constructor(scene, x, y, width, height) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.maxHealth = 100;
      this.currentHealth = 100;

      this.graphics = this.scene.add.graphics();
      this.graphics.setScrollFactor(1); // Ensure the health bar is fixed to the camera      this.draw();
  }

  decrease(amount) {
      this.currentHealth -= amount;
      if (this.currentHealth < 0) {
          this.currentHealth = 0;
      }
      this.draw();
  }

  increase(amount) {
      this.currentHealth += amount;
      if (this.currentHealth > this.maxHealth) {
          this.currentHealth = this.maxHealth;
      }
      this.draw();
  }

  draw() {
      this.graphics.clear();
      // Draw the background bar
      this.graphics.fillStyle(0x000000, 1);
      this.graphics.fillRect(this.x, this.y, this.width, this.height);

      // Draw the health bar
      this.graphics.fillStyle(0xff0000, 1);
      const healthWidth = (this.currentHealth / this.maxHealth) * this.width;
      this.graphics.fillRect(this.x, this.y, healthWidth, this.height);
  }
}