const sass = require('sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const fs = require('fs');

const themes = ['compact', 'classic', 'bubble'];

themes.forEach((theme) => {
	const result = sass.renderSync({ file: `./src/themes/${theme}.scss` });
	const css = result.css;

	postcss([autoprefixer])
		.process(css)
		.then((result) => {
			result.warnings().forEach((warn) => {
				console.warn(warn.toString());
			});
			fs.writeFileSync(`./dist/theme.${theme}.css`, result.css);
		});

	fs.copyFileSync(`./src/themes/${theme}.scss`, `./dist/theme.${theme}.scss`);
});
