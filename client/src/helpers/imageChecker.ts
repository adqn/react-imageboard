import * as nsfwjs from "nsfwjs";

export const checkImage = async (img: any) => {
  const model = await nsfwjs.load();
  return await model.classify(img);
};
