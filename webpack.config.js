const path=require('path');
const ExtractTextPlugin=require("extract-text-webpack-plugin");
const webpack=require('webpack');
const UglifyJSPlugin=require('uglifyjs-webpack-plugin');//minify the output,只解析文件中用到的部分

const extractLess=new ExtractTextPlugin({
	filename:"../style/[name].css",//文件默认是在script文件夹下
	disable:process.env.NODE_ENV==="development"
});

module.exports={
	entry:{
		index:'./src/script/index.js',
		vendor:['react','react-dom']
	},
	output:{
		path:path.resolve(__dirname,'build/script'),
		filename:'[name].js'
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				include:[
					path.resolve(__dirname,'src/script')
				],
				loader:'babel-loader'
			},
			{
				test:/\.less$/,
				use:extractLess.extract({
					use:[{
						loader:"css-loader"  //css转换成JS
					},{
						loader:"less-loader"   //css转换成commonJS(可以使用import)
					}],
					//use style-loader in development
					fallback:"style-loader"
				})

			}
		]
	},
	plugins:[
		extractLess,
		new webpack.optimize.CommonsChunkPlugin({
			names:["vendor","runtime"]
		}),//与externals功能相同,只是把不需要的文件单独打包成一个vendor.js文件
		new UglifyJSPlugin()
	],
	//提供暴露出来的全局变量，打包时去除掉一些文件(不是自己写的文件)，较小内存
	// externals:{
	// 	'react':'React',
	// 	'react-dom':'ReactDOM'
	// }
};