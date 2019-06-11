console.log(333333321)

var path=require('path');
var webpack=require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
console.log(CopyWebpackPlugin)
module.exports={
	plugins:[
		new CopyWebpackPlugin(
	    	[
	    		{
	    			from:path.resolve(__dirname , '../src/assets'),
	    			to:path.resolve(__dirname , '../a'),
	    			force:true,
	    		},
	    	]
	    ),
	]
}