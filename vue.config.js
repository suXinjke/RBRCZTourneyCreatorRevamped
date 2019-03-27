module.exports = {
    filenameHashing: true,
    publicPath: '/rbrcz_prototype',
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': 'http://rbr.onlineracing.cz'
        }

    },

    chainWebpack: config => {
        config.optimization.delete('splitChunks')
    },

    css: {
        extract: false
    }
}