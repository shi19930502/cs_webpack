var path=require('path');
var webpack=require('webpack')
module.exports={
	devtool:'eval-source-map',
	entry:{
		index_data:'../src/js/data.js',
		index:'../src/js/index.js',
	},
	output:{
		filename:'[name].js',
		path:__dirname, '../dist',
		publicPath:process.env.NODE_ENV === 'production'
		?'[name][chunkhash].js'
		:'dist/'
	},
	module:{
		loaders:[
			{
				test:/\.css$/,
				use
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
							outputStyle:'compressed'
						}
					}
				]
			}
		]
	}
}
