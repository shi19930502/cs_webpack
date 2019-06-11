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
		path:path.resolve(__dirname , '../dist'), //join,这个在开发环境好像没用
//		publicPath:process.env.NODE_ENV === 'production'
//		?'[name][chunkhash].js'
//		:'dist/'
		publicPath:'/'
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
//			{
//				test:/\.html$/,
//				use:[{
//					loader:'html-loader',
//					options:{
//						minimize: true,
//				        removeComments: false,
//				        collapseWhitespace: false
//					}
//				}]
//			},
         	{
         		test:/\.js$/,
         		exclude:/node_modules/,
         		loader:"babel-loader",
         		query:{presets:['es2015']}
         	},
         	{
		        test: /\.(htm|html)$/i,
//		        loader: 'html-withimg-loader',
		        use:[{
		        	loader: 'html-withimg-loader',
		        }]
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
//		contentBase: path.resolve(__dirname , '../view/index.html'),
		host:"10.2.15.105",
		openPage:'index.html',//打开的地址文件夹
//		port: 7777, //不加端口的时候是自动适应
	},
	plugins:[
		extractSass,
		new HtmlWebpackPlugin({
	      filename: 'index.html',
	      template: 'view/index.html',
	      inject: true,
	      hash:true,
	    }),
	]
}
