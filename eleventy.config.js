import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";
import fs from "fs";
// for image uploads
import Image from "@11ty/eleventy-img";
import path from "path";
import { glob } from "glob";

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
  
  eleventyConfig.addPassthroughCopy("assets/theme.js");
  eleventyConfig.addPassthroughCopy({ "images": "images" });
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.on("eleventy.before", async () => {
    const css = fs.readFileSync("./assets/css/style.css", "utf8");
    const result = await postcss([tailwindcss]).process(css, { from: "./assets/css/style.css" });
    fs.mkdirSync("./_site/assets/css", { recursive: true });
    fs.writeFileSync("./_site/assets/css/style.css", result.css);
  });
  
  eleventyConfig.on("eleventy.after", async () => {
    const images = await glob("images/gallery/**/*.{jpg,jpeg,png,webp}");
    
    await Promise.all(images.map(async (imgPath) => {
      await Image(imgPath, {
        formats: ["webp"],
        widths: [1200],
        outputDir: `_site/${path.dirname(imgPath)}/`,
        filenameFormat: (id, src, width, format) => {
          const name = path.basename(src, path.extname(src));
          return `${name}.${format}`; // keeps same filename, just changes extension
        }
      });
      
      const siteOriginal = `_site/${imgPath}`;
      if (fs.existsSync(siteOriginal)) {
        fs.unlinkSync(siteOriginal);
      }
    }));
  });
    
  eleventyConfig.addFilter("webp", (url) => {
    return url.replace(/\.(jpg|jpeg|png)$/i, ".webp");
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
