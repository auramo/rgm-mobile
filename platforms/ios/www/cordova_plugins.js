cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.core.inappbrowser/www/InAppBrowser.js",
        "id": "org.apache.cordova.core.inappbrowser.InAppBrowser",
        "pluginId": "org.apache.cordova.core.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/com.verso.cordova.clipboard/www/clipboard.js",
        "id": "com.verso.cordova.clipboard.Clipboard",
        "pluginId": "com.verso.cordova.clipboard",
        "clobbers": [
            "cordova.plugins.clipboard"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.core.inappbrowser": "0.1.0",
    "com.verso.cordova.clipboard": "0.1.0"
}
// BOTTOM OF METADATA
});