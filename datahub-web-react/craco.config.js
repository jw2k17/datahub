const CracoLessPlugin = require('craco-less');
const CracoAntDesignPlugin = require('craco-antd');

const themeConfig = require('./src/theme.config.json');

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: themeConfig.antdStylingOverrides,
            },
        },
    ],
    babel: {
        loaderOptions: {
            babelrc: true,
        },
    },
};
