import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";
import fs from "fs";

export default function (eleventyConfig) {
  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/products/*.md");
  });
  eleventyConfig.addCollection("offers", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/offers/*.md");
  });
  eleventyConfig.addCollection("reviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/reviews/*.md");
  });

  eleventyConfig.addPassthroughCopy({ "images": "images" });
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.on("eleventy.before", async () => {
    const css = fs.readFileSync("./assets/css/style.css", "utf8");
    const result = await postcss([tailwindcss]).process(css, { from: "./assets/css/style.css" });
    fs.mkdirSync("./_site/assets/css", { recursive: true });
    fs.writeFileSync("./_site/assets/css/style.css", result.css);
  });

  return {
    dir: {
      input: "content",
      output: "_site",
      includes: "../_includes",
      data: "../_data",
    }
  };
};
