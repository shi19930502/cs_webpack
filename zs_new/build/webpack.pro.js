console.log(444)
var path=require('path');
var webpack=require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');  		
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin')
const WebpackZipPlugin =require('webpack-zip-plugin')
//var index_css= new ExtractTextPlugin('[name].css')
//console.log(index_css.extract)
//const extractSass = new ExtractTextPlugin({
//  filename: "[name].[contenthash].css",
//  disable: process.env.NODE_ENV === "development"
//});
module.exports={
	entry:{
		index:'./src/js/index.js',
	},
	output:{
		filename:'[name].[chunkhash].js', //[name].[chunkhash]
		path:path.resolve(__dirname , '../static/dist'), //join
//		publicPath:process.env.NODE_ENV === 'production'
//		?'[name][chunkhash].js'
//		:'dist/'
		publicPath:'dist/'
	},
	module:{
		loaders:[
			{
				test:/\.css$/, 
				//不用ExtractTextPlugin的压缩
//				loader:"style-loader!css-loader",
//				options:{
//		            minimize: true //css压缩
//		        }
				use:ExtractTextPlugin.extract({
						fallback:"style-loader",
						use: [
							{
								loader: 'css-loader',
		                        options:{
		                        	importLoaders:1,
		                            minimize: true //css压缩
		                        }
							},
							//开启前缀
							'postcss-loader'
						],
//						path:path.resolve(__dirname , '../static/css'),
						publicPath:path.resolve(__dirname , '../static/css')
					}),
					
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
	plugins:[
//		new ExtractTextPlugin("[name].css"),
		new ExtractTextPlugin({
			filename:(getPath)=>{
				return getPath('../css/[name][chunkhash].css');
//				.replace('css/js', 'css')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			parallel:true,
//      	compress: env.production // 只在生产环境构建时压缩
      	}),
      	new HtmlWebpackPlugin ({
      		template:'indexPro.html',
      		filename:'../index.html',
//    		title:'测试，也可以通过JS生成',//好像是没有在html中写的时候才生效
//    		favicon: 'path/to/yourfile.ico'
			hash:true,
//			chunks: ['index','index2'] //这个在多个入口的时候表示引用需要的js
      		minify:{
      			removeScriptTypeAttributes:true,
      			removeStyleLinkTypeAttributes:true,//只删除script和link标签的type属性
      			removeComments:true,
      			processConditionalComments:true,//缩小器处理注释的内容，
      			minifyJS:true,
      			removeAttributesQuotes:true,
//    			removeEmptyElements:true,//这个不能要，不然占位的空标签会被删除
      		},
      		inject: true,
      	}),
      	new CleanWebpackPlugin(
      		//匹配删除的文件
	    ['dist/*.js','css/*.css'],　 
	    {
	        root: path.resolve(__dirname , '../static/'),  //根目录  
	        verbose:  true,  //开启在控制台输出信息
	        dry: false,    //启用删除文件
	    }),
	    new CopyWebpackPlugin(
	    	[{
	    		from:path.resolve(__dirname , '../lib/'),
	    		to:path.resolve(__dirname , '../static/lib'),
	    	}]
	    ),
//	    new WebpackZipPlugin({
//		    initialFile: path.resolve(__dirname , '../dist'),  //需要打包的文件夹(一般为dist)
//		    endPath: path.resolve(__dirname , '../zip'),  //打包到对应目录（一般为当前目录'./'）
//		    zipName: 'static.zip' //打包生成的文件名
//		}),
//		new ZipPlugin({
//		    path:'path.resolve(__dirname , '../static')',
//		    filename: 'dist.zip'
//		})
	]
}
