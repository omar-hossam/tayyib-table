import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const config = {
  entryPoints: ['src/js/main.js'],
  bundle: true,
  minify: !isWatch,
  sourcemap: isWatch,
  outfile: '_site/js/main.js',
};

if (isWatch) {
  let ctx = await esbuild.context(config);
  await ctx.watch();
  console.log('⚡ esbuild is watching for changes...');
} else {
  await esbuild.build(config);
  console.log('✅ esbuild build complete');
}
