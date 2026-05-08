import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";
import fs from "fs";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy("admin");
  
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
      includes: "../../_includes", 
      data: "../../_data",
      components: "../../_components"
    }
  };
};
