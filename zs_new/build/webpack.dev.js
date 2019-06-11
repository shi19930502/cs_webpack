console.log(444)
var path=require('path');
var webpack=require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});
const HtmlWebpackPlugin = require('html-webpack-plugin');  		

module.exports={
	devtool:'eval-source-map',
	entry:{
		index:'./src/js/index.js',
//		index_data:'./src/js/dataArr.js',
	},
	output:{
		filename:'[name].js', //[name].[chunkhash]
		path:path.resolve(__dirname , '../dist'), //join
//		publicPath:process.env.NODE_ENV === 'production'
//		?'[name][chunkhash].js'
//		:'dist/'
		publicPath:'dist/'
	},
	module:{
		loaders:[
			{
				test:/\.css$/,
				loader:"style-loader!css-loader",
//				options:{
//					minimize:true,
//				}
			},
         	{
         		test:/\.js$/,
         		exclude:/node_modules/,
         		loader:"babel-loader",
         		query:{presets:['es2015']}
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
	devServer:{
		open:true,
		noInfo:true,
		historyApiFallback:true,
//		host:"10.2.15.105",
	},
	plugins:[
		extractSass,
//		new HtmlWebpackPlugin({
//	      filename: 'index_dev.html',
//	      template: 'index.html',
//	      inject: true
//	    }),
	]
}
