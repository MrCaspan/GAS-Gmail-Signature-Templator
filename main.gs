/**
 * Script created by MrCaspan of caspan.com
 * 
 * Explanation of Script:
 * https://caspan.com/2021/10/google-app-script-set-gmail-signature-template-on-org-users/
 * 
 * This script will get all signature users for the domain and apply a default signature to their default Gmail address
 * 
 * Pre conditions to allow this script to run:
 * Custom attributes created on domain users - https://admin.google.com/ac/customschema
 *   Category - Gmail Signature
 *     New Attribute - Enforce Default Signature  {Yes/No} - Include this user in any signature runs
 *     New Attribute - Exclude Mobile             {Yes/No} - Lets us exclude a users mobile number form their signature
 *     New Attribute - Custom Template            {Text}   - This value is a Google Drive File ID to a custom HTML Template to use
 *     New Attribute - Certifications             {Text}   - If the user has any kind of certifications
 * 
 * Please follow any documentation on any of the add on scripts
 */
 
const searchDomain = '{domain}'; // The domain to look up users from
const adminEmail   = '{super admin email}'; // the Admin SDK API requires that you impersonate an super admin account
const configFileID = '{Config File ID}';  // This file holds the configuration for the default template

/**
 * This function is the primary function
 */
function start() {
  
  // Load the config
  const CONFIG = loadConfig_();
  
  // Get users for the signature run
  const users = getUsers_(searchDomain, adminEmail);

  // Load the default signature template
  const defaultTemplate = loadTemplate_(CONFIG.emailTemplateID);
 
  // For each one of the users
  for (const email in users) {
    
    // Create a user object
    const user = users[email];

    Logger.log(`Starting to template ${email}`);
 
    // Does the user have a Custom Template ID set
    if (user.CustomTemplateID) {
 
      // Replace the template with the custom one
      var template = loadTemplate_(user.CustomTemplateID);
      Logger.log(`${user} has cutom signature template`);
 
    } else {

      // Use the default template
      var template = defaultTemplate;

    }

    Logger.log(`Values are: ${JSON.stringify(user)}`);
 
    // Take the users template values and replace then in the users template
    template = doTemplating_(user, template);
 
    // Set the users signature
    setSignature_(user['{EmailAddress}'], template);
 
  }
 
  Logger.log('Script is done!');
 
}