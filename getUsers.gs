/**
 * Script created by MrCaspan of caspan.com
 *  
 * Requires the use of getService.gs
 * 
 * Pre conditions to allow this script to run:
 * A new Google Cloud Project that is used only for this entire script
 * Enable the Google Admin SDK API
 * A service account that has a JSON key file
 *  This service account must have domain wide delegation
 *  The Client ID of the service account must be added to the Google Admin https://admin.google.com/ac/owl/domainwidedelegation
 *  You will then need to allow the scope https://www.googleapis.com/auth/admin.directory.user.readonly
 *
 * Documentation
 * Scope - https://developers.google.com/admin-sdk/directory/v1/guides/authorizing
 * API   - https://developers.google.com/admin-sdk/directory/reference/rest/v1/users/list
 * Prams - https://developers.google.com/admin-sdk/directory/v1/guides/search-users#examples 
 *
 * @param {string} domain, The domain to get the user from
 * @param {string} impersonateAccount, account to impersonate
 * 
 * @return {object}, an object of domains users that require signature templating
 */
function getUsers_(domain, impersonateAccount) {
  
  var users = {};

  Logger.log(`Getting users for the domain ${domain}...`);
 
  const service = getService_('AdminSKD-Directory', 'https://www.googleapis.com/auth/admin.directory.user.readonly', impersonateAccount);
  if (!service.hasAccess()) {Logger.log('There was a service error:' + service.getLastError());return;fail;}
 
  var url = 'https://admin.googleapis.com/admin/directory/v1/users' +
            '?domain=' + domain + // Set this to the domain to get users
            '&maxResults=500' +   // This is the Max number of results to return
            '&projection=full' +  // Include all fields associated with this user.
            '&query=Gmail_Signature%2EEnforce_Default_Signature%3Dtrue';  // Make to URL Encode your query
 
  const options = {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + service.getAccessToken() },
    contentType: 'application/json',
    muteHttpExceptions: true
  };
 
  var response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() != 200) {
    Logger.log(response);
    service.reset();
    fail; // There is no such thing as fail so this will hault our script
    }
 
  // Turn the response into an object
  var response = JSON.parse(response);
  
  // Make an object that has propteries that are the users email address
  // and the value be the users data to make it easier to access
  for (const user of response.users) {

    // Start building an user object    
    users[user.primaryEmail] = new buildUser_(user);

  }

  Logger.log('Complete');

  // Clean up the serivce  
  service.reset();

  // Return the users
  return users;

}
