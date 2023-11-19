import * as PIXI from './pixi.mjs';

let app = new PIXI.Application({ width: 896, height: 896 });
document.body.appendChild(app.view);

// Create the sprite and add it to the stage
for (let i = 0; i < 100000; ++i) {
  let sprite = PIXI.Sprite.from('./4d5bbuxo.bmp');
  sprite.x = Math.floor((i * 32) % 896);
  sprite.y = Math.floor((i * 32) / 896) * 32;
  app.stage.addChild(sprite);
}
