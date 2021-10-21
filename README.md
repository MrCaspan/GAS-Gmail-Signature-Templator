# GAS-Gmail-Signature-Templator
This script will allow you to use a Google Cloud Project service account to set a default signature on all selected users using a Google App Script

Please note this script is not just a drop in place, set a couple of variables to start using it. The script requires that custom attributes (https://support.google.com/a/answer/6208725?hl=en) get created for your Google Workspace enviroment so that you can specify your setting on each user insted of creating a Google Sheet to manage all your users and settings.

Please see my blog at https://caspan.com/2021/10/google-app-script-set-gmail-signature-template-on-org-users/ for details on setting up the Google Active Script Project & Google Cloud Project and any other prerequisites.

# Addon libraries
This script require the use of the OoAuth2 library by Google. Make sure you add this library to you Google App Script library

oAuth2 Library ID - Librar1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF - Version 41

If there is a newer verison available you are welcome to use it but I have only tested with verison 41 of the Library

Here is the documentation on it the library:
https://github.com/googleworkspace/apps-script-oauth2
