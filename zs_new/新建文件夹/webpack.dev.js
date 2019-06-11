var path=require('path');
var webpack=require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});
console.log('dev')
module.exports={
	devtool:'eval-source-map',
	entry:{
		index_data:'./src/js/data.js',
		index:'./src/js/index.js',
	},
	output:{
		filename:'[name].[chunkhash].js',
		path:path.join(__dirname + './dist'),
//		publicPath:process.env.NODE_ENV === 'production'
//		?'[name][chunkhash].js'
//		:'dist/'
	},
	module:{
		loaders:[
			{
				test:/\.css$/,
				loader:"style-loader!css-loader"
			},
			{
				test:/(\.scss|\.sass)$/,
				use:[{
						loader:'style-loader'
					},{
						loader:'css-loader'
					},{
						loader:'sass-loader',
						options:{
							outputStyle:'compressed'  //以style的形式输出，然后压缩
						}
					}
				]
			},
			{
				test:/\.(png|jpg|gif|svg|jepg)$/,
				use:[{
					loader:'url-loader?limit=10000&name=build/[name].[ext]'
				}]
			}
		]
	},
	plugins:[
		extractSass
	]
}
