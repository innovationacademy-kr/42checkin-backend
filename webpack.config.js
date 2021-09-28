const path = require('path');
const webpack = require('webpack');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const dotenv = require('dotenv');
const { NODE_ENV } = process.env;
console.log({ NODE_ENV});

const config = {
	production: {
		env: './.env.production' ,
		output_path: 'dist'
	},
	test: {
		env: './.env.test',
		output_path: 'test_dist'
	},
	alpha: {
		env: './.env.alpha',
		output_path: 'alpha_dist'
	},
	developlemt: {
		env: './.env.development',
		output_path: ''
	}
}

dotenv.config({
	path: config[NODE_ENV].env
});

const output_path = config[NODE_ENV].output_path;
console.log(process.env.DATABASE_USERNAME);
module.exports = {
	entry: './src/server.ts',
	target: 'node',
	externals: [nodeExternals()],
	optimization: {
		minimize: false,
	},
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, output_path)
	},
	devtool: 'source-map',
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			"@entities": path.resolve(__dirname, "./src/entities/"),
			"@repository": path.resolve(__dirname, "./src/repository/"),
			"@service": path.resolve(__dirname, "./src/service/"),
			"@controllers": path.resolve(__dirname, "./src/controllers/"),
			"@config": path.resolve(__dirname, "./src/config/"),
			"@strategy": path.resolve(__dirname, "./src/strategy/"),
			"@dto": path.resolve(__dirname, "./src/dto/"),
			"@routes": path.resolve(__dirname, "./src/routes/"),
			"@modules": path.resolve(__dirname, "./src/modules/"),
		},
		plugins: [
			new TsconfigPathsPlugin(),
		]
	},
	module: {
		rules: [
			// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
			{ test: /\.tsx?$/, loader: 'ts-loader' }
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.PORT': JSON.stringify(process.env.PORT),
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'process.env.DATABASE_HOST': JSON.stringify(process.env.DATABASE_HOST),
			'process.env.DATABASE_PORT': JSON.stringify(process.env.DATABASE_PORT),
			'process.env.DATABASE_USERNAME': JSON.stringify(process.env.DATABASE_USERNAME),
			'process.env.DATABASE_PASSWORD': JSON.stringify(process.env.DATABASE_PASSWORD),
			'process.env.DATABASE_NAME': JSON.stringify(process.env.DATABASE_NAME),
			'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
			'process.env.CLIENT_SECRET': JSON.stringify(process.env.CLIENT_SECRET),
			'process.env.CLIENT_CALLBACK': JSON.stringify(process.env.CLIENT_CALLBACK),
			'process.env.JWT_SECRET': JSON.stringify(process.env.JWT_SECRET),
			'process.env.LOG_DEBUG': JSON.stringify(process.env.LOG_DEBUG),
			'process.env.DISCORD_GAEPO_ID': JSON.stringify(process.env.DISCORD_GAEPO_ID),
			'process.env.DISCORD_GAEPO_PW': JSON.stringify(process.env.DISCORD_GAEPO_PW),
			'process.env.DISCORD_SEOCHO_ID': JSON.stringify(process.env.DISCORD_SEOCHO_ID),
			'process.env.DISCORD_SEOCHO_PW': JSON.stringify(process.env.DISCORD_SEOCHO_PW),
			'process.env.MAIL': JSON.stringify(process.env.MAIL),
			'process.env.URL_CLIENT': JSON.stringify(process.env.URL_CLIENT),
			'process.env.URL_CLIENT_OLD': JSON.stringify(process.env.URL_CLIENT_OLD),
			'process.env.URL_ROOTHOST': JSON.stringify(process.env.URL_ROOTHOST),
			'process.env.URL_ADMIN': JSON.stringify(process.env.URL_ADMIN),
			'process.env.COOKIE_AUTH': JSON.stringify(process.env.COOKIE_AUTH),
			'process.env.SLACK_WH_MONITOR': JSON.stringify(process.env.SLACK_WH_MONITOR),
			'process.env.FT_GUEST_IP': JSON.stringify(process.env.FT_GUEST_IP),
			'process.env.DEVELOPER01_IP': JSON.stringify(process.env.DEVELOPER01_IP),
			'process.env.DEVELOPER02_IP': JSON.stringify(process.env.DEVELOPER02_IP),
		}),
	]
};
