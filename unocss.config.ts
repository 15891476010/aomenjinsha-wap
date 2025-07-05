import presetWeapp from "unocss-preset-weapp";

export default {
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(),
  ],
  shortcuts: [
    {
      "flex-center": "flex justify-center items-center flex-wrap",
      "flex-start": "flex justify-start items-center",
      "flex-end": "flex justify-end items-center",
      "flex-between": "flex justify-between items-center",
    },
  ],
};
