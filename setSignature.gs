/**
 * Script created by MrCaspan of caspan.com
 * 
 * Requires the use of getService.gs
 * 
 * Pre conditions to allow this script to run:
 * A new Google Cloud Project that is used only for this entire script
 *   Enable the Gmail API
 *   A service account that has a JSON key file
 *   This service account must have domain wide delegation
 *   The Client ID of the service account must be added to the Google Admin https://admin.google.com/ac/owl/domainwidedelegation
 *   Allow the scope https://www.googleapis.com/auth/gmail.settings.basic
 * 
 * Documentation:
 * Scope   - https://developers.google.com/admin-sdk/directory/v1/guides/authorizing
 * API     - https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs/get
 * payload - https://developers.google.com/gmail/api/reference/rest/v1/users.settings.sendAs#SendAs
 */
 
 
 /**
 * Sets the signature on a user
 * 
 * @param {string} email The email address of the user to template
 * @param {string} signature The template to apply to the user's Gmail signature
 */
function setSignature_(email, signature) {
 
  Logger.log(`Setting signature for ${email}...`);
 
  var service = getService_(`GoogleDrive: ${email}`, 'https://www.googleapis.com/auth/gmail.settings.basic', email);
  if (!service.hasAccess()) {
    Logger.log('There was a service error:' + service.getLastError());
    service.reset();
    fail; // There is no such thing as fail so this will hault our script
  }
 
  // Doc - 
  var url   = `https://gmail.googleapis.com/gmail/v1/users/${email}/settings/sendAs/${email}`;
 
  const payload = JSON.stringify({
    "sendAsEmail"       : email,
    "isDefault"         : true,
    "replyToAddress"    : email,
    "signature"         : signature
  })
  
  const options = {
    method              : 'PUT',
    headers             : {'Authorization': 'Bearer ' + service.getAccessToken() },
    contentType         : 'application/json',
    muteHttpExceptions  : true,
    payload             : payload
  }
 
  var response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() != 200) {Logger.log(response);fail;}
 
  // Clean up the serivce and tokens
  service.reset();

  Logger.log('Complete');
  return;
 
}