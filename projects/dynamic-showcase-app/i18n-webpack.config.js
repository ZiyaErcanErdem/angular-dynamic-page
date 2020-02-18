const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");

module.exports = {
  plugins: [   
    new MergeJsonWebpackPlugin({
        output: {
            groupBy: [
                { 
                    pattern: "{./src/i18n/en/*.json,./../../node_modules/angular-dynamic-page/i18n/en/*.json}", 
                    fileName: "./i18n/en.json" 
                },
                { 
                    pattern: "{./src/i18n/tr/*.json,./../../node_modules/angular-dynamic-page/i18n/tr/*.json}", 
                    fileName: "./i18n/tr.json" 
                },
            ]
        }
    })    
  ]
};