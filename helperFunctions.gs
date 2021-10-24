/**
 * This function will take the values and the passed template
 * replace vales and templating tags 
 * 
 * @param   {object}  values    An object of key/value pairs to be replaced
 * @param   {string}  template  The template that holds the HTML
 * 
 * @return  {string}            Returns the passed template with tags replaced
 */
function doTemplating_(values, template){
 
  Logger.log(`Applying these values to template tags...`);
 
  const regex1 = new RegExp('<rt>(.*?)<\/rt>');
  const regex2 = new RegExp('{(.*?)}');
 
  // For each one of the values
  for (const propterty in values) {
 
    // if there is any value then replace its tag
    if (values[propterty]) {
      var searchRegExp  = new RegExp(`${propterty}`, 'g');
      template = template.replace(searchRegExp, values[propterty]);
    }
 
  }
 
  // While there are still <rt></rt> tags in the template
  while (regex1.exec(template)) {
 
    // If there is a {tag} inbetween the <rt></rt> elements
    if (regex2.exec(regex1.exec(template))) {
 
      // Replace the <rt>(.*)</rt> with nothing
      template = template.replace(regex1, '');
     
    // there was not a {tag} found
    } else {
 
      // Replace the <rt> </rt> with the non <rt> match version
      template = template.replace(regex1.exec(regex1.exec(template))[0], regex1.exec(regex1.exec(template))[1]);
 
    }
 
  }
 
  Logger.log(`Complete`);
  return template;
  
}



/**
 * Will take a Admin SDK Directory API user schema
 * and build a user object with expected property values
 * 
 * @param   {object}  phoneSchema   An object of phone numbers form the ADMIN SKD Directory API
 */
function createPhoneObj_(phoneSchema) {

    // Loop around phone schema to get phone values
    for (const propterty in phoneSchema) {

      var proptery = phoneSchema[propterty].type;
      var value = phoneSchema[propterty].value;

      // If the type is custom 
      if (proptery == 'custom'){
        
        // Use the customType Value instead
        proptery = phoneSchema[propterty].customType;

      }

      // Add the number to the phone object
      this[proptery] = value;

    }

}
  
/**
 * This function will load the email template file as specified by the config file
 * 
 * @param   {string}  fileID  The Google Drive ID of the file to open
 * @return  {string}          The contents of the FileID passed
 */
function loadTemplate_(fileID) {
  
  let file;

  try {

    file = DriveApp.getFileById(fileID);

  }catch(e){

    Logger.log('The file ID is not a valid file or you dont have permissions to it' + e);
    fail;  // There is no such thing as fail so this will hault our script

  }

  return file.getBlob().getDataAsString();
  
}
  
/**
 * This function will load the config file and convert it to an object
 * 
 * return   {object}    This object will hold the data from the config file
 */

function loadConfig_() {
    
  let file;

  try {

    file = DriveApp.getFileById(configFileID);

  }catch(e){

    Logger.log('The file ID is not a valid file or you dont have permissions to it' + e);fail;

  }    

  return JSON.parse(file.getBlob().getDataAsString());

}
  
/**
 * This function will take a Admin SDK Directory API user schema
 * and get our required values from it
 * 
 * @param {object} schema This object will hold the schema data for the user
 */
function buildUser_(schema) {

  // Take the phone schema and build an object
  const phones = new createPhoneObj_(schema.phones);

  this['{FirstName}']      = schema.name?.givenName; 
  this['{LastName}']       = schema.name?.familyName;
  this['{JobTitle}']       = schema.organizations?.[0]?.title;
  this['{EmailAddress}']   = schema.primaryEmail;
  this['{WorkNumber}']     = 'work'   in phones ? phones['work']    : '';
  this['{MobileNumber}']   = 'mobile' in phones ? phones['mobile']  : '';
  this['{Certs}']          = schema.customSchemas.Gmail_Signature?.Certifications;
  this['CustomTemplateID'] = schema.customSchemas.Gmail_Signature?.Custom_Template_ID;

  // if the schema value exists
  if (schema.customSchemas.Gmail_Signature?.Exclude_Mobile) {

    // Set their mobile number to blank 
    this['{MobileNumber}'] = null;

  }

}
