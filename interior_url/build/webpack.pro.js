console.log(444)
var path=require('path');
var webpack=require('webpack');
const ExtractTextPluginSass = require("extract-text-webpack-plugin");
const ExtractTextPluginCss=require("extract-text-webpack-plugin");
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
//		ces:'./src/js/ces.js',
	},
	output:{
		filename:'js/[name].[chunkhash].js', //[name].[chunkhash]
		path:path.resolve(__dirname , '../static/dist/'), //出口
//		publicPath:process.env.NODE_ENV === 'production'
//		?'[name][chunkhash].js'
//		:'dist/'
		publicPath:'dist/' //自动生成html的访问路径,与出口的最后路径最好相匹配
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
				use:ExtractTextPluginCss.extract({
						fallback:"style-loader",
						use: [
							{
								loader: 'css-loader',
		                        options:{
		                        	importLoaders:1,
		                            minimize: true //css压缩
		                        }
							}, 
							//开启前缀,最好别用这个，有时候报奇葩的错误(错误原因好像是如果没有找到前缀的级不熬错)
//							'postcss-loader'
						],
//						path:path.resolve(__dirname , '../static/css'),
						publicPath:path.resolve(__dirname , 'static/css') //访问路径？这个我也忘记是什么意思了，好像可以不要
					}),
					
			},
			{
				test:/(\.scss|\.sass)$/,
//				use:[{
//						loader:'style-loader'
//					},{
//						loader:'css-loader'
//					},{
//						loader:'sass-loader',
//						options:{
//							outputStyle:'compressed'  //以style的形式输出，然后压缩
//						}
//					}
//				],
				use:ExtractTextPluginSass.extract({
						fallback:"style-loader",
						use: [
							{
								loader:'css-loader'
							},
							{
								loader:'postcss-loader',
								options: {
		              config: {
		                path: path.resolve(__dirname , 'buuild/postcss.config.js')  // 这个得在项目根目录创建此文件
		              }
		            }
							},
//							{   //先不用这个，不太会
//								loader:'postcss-loader',
//								options: {
//	                                plugins: function() {
//	                                    return [
//	                                        //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
//	                                        require('postcss-import')(),
//	                                        require("autoprefixer")({
//	                                            "browsers": ["Android >= 4.1", "iOS >= 7.0", "ie >= 8"]
//	                                        })
//	                                    ]
//	                                }
//	                            }
//							},
							{
								loader: 'sass-loader',
		                        options:{
		                        	importLoaders:1,//支持@important引入css
		                            minimize: true, //css压缩
		                            outputStyle:'compressed'
		                        }
							}, 
						],
//						path:path.resolve(__dirname , '../static/css'),
						//好像会影响下面的图片路径生成地址
//						publicPath:path.resolve(__dirname , 'static/dist/css/../') //访问路径？这个我也忘记是什么意思了，好像可以不要
						publicPath:'../'
					}),
		},
         	{
         		test:/\.js$/,
         		exclude:/node_modules/,
         		loader:"babel-loader",
         		query:{presets:['es2015']}
         	},
         	//如果用了html-loader，这个不识别<%= require('html-loader!./layout/script.html')  %>
//			{
//              test: /\.html$/i,
//              loader: 'html-loader'
//         	},
			{
		        test: /\.(htm|html)$/i,
//		        loader: 'html-withimg-loader',
		        use:[{
		        	loader: 'html-withimg-loader',
		        }]
		   	},
			{
				test:/\.(png|jpg|gif|svg|jepg)$/,
				use:[
//					{
//						loader: 'html-withimg-loader',
//					},
					{
	//					loader:'url-loader?limit=10000&name=build/[name].[ext]'
						loader:'url-loader',
						options:{
							//小于8k的图片编译为base64，大于10k的图片使用file-loader 
							limit:8192,
							prefix:"true",
	//						name:'bdImgs/[hash:5].[name].[ext]',
							name:'imgs/[name].[ext]',
//							outputPath:path.resolve(__dirname , 'static/imgs'),//图片输出路径，最好别用path,
							//这里打包的好像只有那个背景图，因为只在引进了.scss文件打包，由于图片打包出来的路径通过css文件路径，所以加一个../
//							publicPath:'../' , //这里是所有的图片访问路径，由于hmtl和sass不一样，所有要保证路径正确在sass-loader里面写public
//							publicPath:path.resolve(__dirname , 'static/css') 
							//图片压缩
//	            'image-webpack-loader'
						}
					},
					//**放的位置也很重要，这个必须放url-loader下面
					{
						loader:'image-webpack-loader' //图片压缩，不过打包慢了点
					},
				]
			}
		]
	},
	plugins:[
		new webpack.optimize.UglifyJsPlugin({
			parallel:true,
//      	compress: env.production // 只在生产环境构建时压缩
      	}),
      	new HtmlWebpackPlugin ({
      		template:'view/index.html',
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
      	//		new ExtractTextPlugin("[name].css"),
		new ExtractTextPluginSass({
			filename:(getPath)=>{
//				这里表示在static下面生成一个css的文件夹存放这些东西
				return getPath('css/[name][chunkhash].css');
//				.replace('css/js', 'css')
			}
		}),
		//不用下面的也可以，好像全部打包在一起了
//		new ExtractTextPluginCss({
//			filename:(getPath)=>{
////				这里表示在static下面生成一个css的文件夹存放这些东西
//				return getPath('css/[name][chunkhash].css');
////				.replace('css/js', 'css')
//			}
//		}),
      	new CleanWebpackPlugin(
      		//匹配删除的文件
//	    ['dist/js/*.js','dist/css/*.css','dist/build/*.png'],　
	    ['dist/*'],
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
//		    initialFile:'./static',  //需要打包的文件夹(一般为dist)
//		    endPath: './ce',  //打包到对应目录（一般为当前目录'./'）
//		    zipName: 'static.zip' //打包生成的文件名
//			}),
//		new ZipPlugin({
//		    path:'zip',
//		    filename: 'dist.zip'
//		})
	]
}
