/* eslint-disable @typescript-eslint/no-var-requires */
const gm = require('gm').subClass({ imageMagick: true })

const resize = imageName => {
  function callback(size) {
    let thumb_w;
    let thumb_h;

    let ratio = (size.width > size.height ? 250 / size.width : 250 / size.height)

    thumb_w = size.width * ratio;
    thumb_h = size.height * ratio;

    let name = imageName.match(/\d+/)[0]
    let ext = imageName.match(/\..+/)[0]

    image
      .resize(thumb_w, thumb_h)
      .noProfile()
      .autoOrient()
      .write(__dirname + '/img/' + name + 's' + ext, (err) => err ? console.log(err) : null)
  }

  let size = {};
  image = gm(__dirname + '/img/' + imageName);

  image.size((err, value) => {
    size.width = value.width;
    size.height = value.height;
    callback(size)
  });
}

exports.resize = resize;