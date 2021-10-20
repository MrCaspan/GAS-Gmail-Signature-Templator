/**
 * Script created by MrCaspan of caspan.com
 * 
 * This script will take a service account JSON key file 
 * It will authenticate to Google as an impersonated or non impersonated user
 * It will create a service object that holds the bearer token needed to access APIs
 * This script requires the OAuth2 Libraries, https://github.com/googleworkspace/apps-script-oauth2
 * Add this library 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF to your script
 * 
 */

// Load the service account KEY file as an object
const serviceAccount = JSON.parse(HtmlService.createHtmlOutputFromFile("serviceAccount.json").getContent()); // Parse the JSON file to an object

/**
 * Will return a service object with a bearer token 
 *
 * @param {string} name A unique discriptor for this token, If credentials have to change use a differnet name
 * @param {string} scopes A list of Google Scopes (space seperated)
 * @param {string} userToImpersonate If you want to impersonate a user like in the case of an API like the Admin SDK {optional}
 * 
 * @return {object} A service object with the bearer token
 */
const getService_ = (name, scopes, userToImpersonate) => {

  if (userToImpersonate) {

    return OAuth2.createService(name)
      .setSubject(userToImpersonate)
      .setTokenUrl(serviceAccount.token_uri)
      .setPrivateKey(serviceAccount.private_key)
      .setIssuer(serviceAccount.client_email)
      .setPropertyStore(PropertiesService.getScriptProperties())
      .setScope(scopes)
      .setLock(LockService.getScriptLock())
      .setCache(CacheService.getScriptCache())
      .setParam('access_type', 'offline')
      .setExpirationMinutes(10);

  } else {

    return OAuth2.createService(name)
      .setTokenUrl(serviceAccount.token_uri)
      .setPrivateKey(serviceAccount.private_key)
      .setClientId(serviceAccount.client_email)
      .setPropertyStore(PropertiesService.getScriptProperties())
      .setScope(scopes)
      .setLock(LockService.getScriptLock())
      .setCache(CacheService.getScriptCache())
      .setParam('access_type', 'offline')
      .setExpirationMinutes(2);

  }

}