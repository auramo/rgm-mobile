RGM Mobile
==========

To test this you'll have to edit your own Dropbox API key and secret into RgmLoginDetailRepository.prototype.getStoredLoginDetails (credentials.js). After that you'll be able to test the app in the browser via index.html. You'l need a web browser in between because of Dropbox authentication. I use Python's built in server for that:

    cd www
    python -m SimpleHTTPServer 5000

Then I point the browser to http://localhost:5000/index.html

To run it on android you'll have to install cordova, android SDK, set the ANDROID_HOME env variable to point to your sdk and then run:

    cordova run android

while your phone is plugged in via USB and debug mode is enabled.
