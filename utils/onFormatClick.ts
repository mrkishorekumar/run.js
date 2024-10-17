import prettier from "prettier";
import babel from "prettier/plugins/babel";
import esTree from "prettier/plugins/estree";

export const onFormatClick = async (javascriptCode: string) => {
  try {
    const formatted = await prettier.format(javascriptCode, {
      parser: "babel",
      plugins: [babel, esTree],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });
    return formatted.replace(/\n$/, "");
  } catch {
    return javascriptCode;
  }
};
