import * as nsfwjs from "nsfwjs";

export const predictImage = async (img: any) => {
  const model = await nsfwjs.load();
  return await model.classify(img);
};
