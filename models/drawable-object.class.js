class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;


    loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

    draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

    loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      img.style = 'transform: scaleX(-1)';
      this.imageCache[path] = img;
    });
  }


}
