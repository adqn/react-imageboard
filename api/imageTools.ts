/* eslint-disable @typescript-eslint/no-var-requires */
const gm = require("gm").subClass({ imageMagick: true });

type ImageDimensions = {
  height: number,
  width: number,
}

export const saveThumbnail = (fileName: string | any) => {
  function callback(size: ImageDimensions) {
    const ratio = size.width > size.height ? 250 / size.width : 250 / size.height;
    const thumb_w = size.width * ratio;
    const thumb_h = size.height * ratio;

    const name = fileName.match(/\d+/)![0];
    const ext = fileName.match(/\..+/)![0];

    image
      .resize(thumb_w, thumb_h)
      .noProfile()
      .autoOrient()
      .write(__dirname + "/img/" + name + "s" + ext, (err: string) => {
        if (err) console.log(err)
      });
  }

  const size: ImageDimensions = {
    height: 0,
    width: 0,
  };
  const image = gm(__dirname + "/img/" + fileName);

  image.size((err: string, value: ImageDimensions) => {
    size.width = value.width;
    size.height = value.height;
    callback(size);
  });
};
