import sharp from "sharp";
sharp("test.jpg")
  .extract({ left: 100, top: 100, width: 500, height: 500 })
  .toFile("sharp.jpg");
