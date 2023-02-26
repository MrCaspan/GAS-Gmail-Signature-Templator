/**
 *  This function will get the profile picture of a user using the People API
 * 
 *  * Pre conditions to allow this script to run:
 *  A new Google Cloud Project that is used only for this entire script
 *  Enable the Google Admin SDK API & People API
 *  A service account that has a JSON key file
 *  This service account must have domain wide delegation
 *  The Client ID of the service account must be added to the Google Admin https://admin.google.com/ac/owl/domainwidedelegation
 *  You will then need to allow the scope https://www.googleapis.com/auth/userinfo.profile
 *
 * Documentation
 * Scope - https://developers.google.com/people/api/rest/v1/people/get#authorization-scopes
 * API   - https://developers.google.com/people/api/rest/v1/people/get
 * Params - https://developers.google.com/people/api/rest/v1/people/get#query-parameters
 * Response Object - https://developers.google.com/people/api/rest/v1/people#photo
 *
 * @param {string} id, the id of the user
 *
 * @return {object}, the users photo objects
 */
function getProfilePicture_(id, impersonateAccount) {

  const service = getService_('People', 'https://www.googleapis.com/auth/userinfo.profile', impersonateAccount);

  if (!service.hasAccess()) {
    Logger.log('There was a service error:' + service.getLastError());
    service.reset();
    fail; // There is no such thing as fail so this will hault our script
  }
  const url = 'https://people.googleapis.com/v1/people/' + id +'?personFields=photos'

  const options = {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + service.getAccessToken() },
    contentType: 'application/json',
    muteHttpExceptions: true
  };
 
  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() != 200) {
    Logger.log(response);
    fail; // There is no such thing as fail so this will hault our script
  }
  const responseObj = JSON.parse(response);
  // Turn the response into an object

  // Return the photos object
  return responseObj.photos ? responseObj.photos : null
}