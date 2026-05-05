import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";
import fs from "fs";

export default function (eleventyConfig) {
  // 1. Passthrough: Move icons and admin to build
  // eleventyConfig.addPassthroughCopy({ "src/icons": "icons" });
  // eleventyConfig.addPassthroughCopy("admin");

  // 2. Tailwind Processing
  eleventyConfig.on("eleventy.before", async () => {
    const css = fs.readFileSync("./src/css/style.css", "utf8");
    const result = await postcss([tailwindcss]).process(css, { from: "./src/css/style.css" });
    fs.mkdirSync("./_site/css", { recursive: true });
    fs.writeFileSync("./_site/css/style.css", result.css);
  });

  return {
    dir: {
      input: "src/content",  // Your source files live here
      output: "_site",
      // These are relative to the 'input' directory (src/content)
      includes: "../../_includes", 
      data: "../../_data"
    }
  };
};
