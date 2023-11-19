import * as PIXI from './pixi.mjs';

const height = Math.floor(window.innerHeight / 32) * 32;
const width = Math.floor(window.innerWidth / 32) * 32;

let app = new PIXI.Application({ height, width });
document.body.appendChild(app.view);

// Create the sprite and add it to the stage
for (let i = 0; i < 100000; ++i) {
  let sprite = PIXI.Sprite.from('./4d5bbuxo.bmp');
  sprite.y = Math.floor((Math.floor((i * 32) / width) * 32) % height);
  sprite.x = Math.floor((i * 32) % width);
  app.stage.addChild(sprite);
}
