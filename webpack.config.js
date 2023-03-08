const FileManagerPlugin = require('filemanager-webpack-plugin'); // 压缩文件夹
const manifestInfo = require('./src/manifest.json');
const dateNow = new Date().toLocaleString().replace(/[\/|\s\:]/g,'_').split('_').map(function(v){if(v.length<2){return '0'+v}else{return v}});dateNow.splice(3,0,'_');dateNow.splice(6,1);
module.exports = {
  entry: './src/manifest.json',
  output: {
    filename: './index.js',
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onEnd: {
          archive: [
            { 
              source: './src', 
              destination: `./dist/crx_${manifestInfo.version}_${dateNow.join('')}.zip`,
              options:{
                globOptions:{
                  ignore: ['index.js']
                }
              }
            }
          ],
          delete: ['./dist/index.js'],
        }
      }
    })
  ]
}