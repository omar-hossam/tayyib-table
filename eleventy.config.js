export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy("admin");

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
