/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	// Turbopack configuration for GLSL shader files
	turbopack: {
		rules: {
			"*.glsl": {
				loaders: ["raw-loader"],
				as: "*.js",
			},
			"*.vs": {
				loaders: ["raw-loader"],
				as: "*.js",
			},
			"*.fs": {
				loaders: ["raw-loader"],
				as: "*.js",
			},
			"*.vert": {
				loaders: ["raw-loader"],
				as: "*.js",
			},
			"*.frag": {
				loaders: ["raw-loader"],
				as: "*.js",
			},
		},
	},

	// Keep webpack config for backward compatibility (when using --webpack flag)
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.module.rules.push({
			test: /\.(glsl|vs|fs|vert|frag)$/,
			exclude: /node_modules/,
			use: ["raw-loader"],
		});

		return config;
	},
};

module.exports = nextConfig;
