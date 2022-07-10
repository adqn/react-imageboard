import * as nsfwjs from "nsfwjs";

export const checkImage = async (img: any) => {
  const model = await nsfwjs.load();
  const prediction = await model.classify(img);
  console.log(prediction);
};
