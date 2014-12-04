cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.core.inappbrowser/www/InAppBrowser.js",
        "id": "org.apache.cordova.core.inappbrowser.InAppBrowser",
        "clobbers": [
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.core.inappbrowser": "0.1.0"
}
// BOTTOM OF METADATA
});