function createUserFolderAddToSheet(uuid) {
   const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
   const activeSheet = SpreadsheetApp.getActiveSheet();

   const user = getContactFromID(uuid);
   const config = getCodeConfig();

   let userDirectory = DriveApp.getFolderById(config.directory.saveFolderID);
   let userFolder = userDirectory.createFolder(user.name.fullName);
   let userFolderURL = userFolder.getUrl();

   activeSpreadsheet.toast(`Creating file for ${user.name.fullName}`, 'Setup');

   let folderHyperlink = SpreadsheetApp.newRichTextValue()
      .setText('📁')
      .setLinkUrl(userFolderURL)
      .build();

   let userRowIndex = activeSheet.getLastRow() + 1;

   activeSheet
      .getRange(userRowIndex, config.directory.folderLinkColumnIndex)
      .setRichTextValue(folderHyperlink);
   activeSheet
      .getRange(userRowIndex, config.directory.nameColumnIndex)
      .setValue(user.name.fullName);

   activeSpreadsheet.toast(`All done`, 'Setup');
}

function initiateLegalDocument(uuid) {
   showWidget('Select Document', { type: 'legalDocumentation', uuid: uuid });
}

function createLegalDocument(uuid, type) {
   const config = getCodeConfig();

   let userFolder = getFolderFromID(uuid);
   let templateFile = DriveApp.getFileById(config.legalDocs[type].templateID);

   let newFileName = `${config.legalDocs[type].newFileName} - ${user.name.fullName} (unsigned)`;
   let newFile = templateFile.makeCopy(newFileName, userFolder);

   showWidget("Here's your new file", {
      type: 'displayURL',
      href: newFile.getUrl(),
      text: newFileName,
   });
}

/**
 * AUXILLIARY
 */

function showWidget(title, payload) {
   let html = HtmlService.createTemplateFromFile('Widget');
   html.payload = JSON.stringify(payload);

   let rendered = html
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setHeight(300)
      .setWidth(450);

   SpreadsheetApp.getUi().showModalDialog(rendered, title);
}

function showAnchor(name, url) {
   var html =
      '<html><body><a href="' +
      url +
      '" target="blank" onclick="google.script.host.close()">' +
      name +
      '</a></body></html>';
   var ui = HtmlService.createHtmlOutput(html);
   SpreadsheetApp.getUi().showModelessDialog(ui, 'demo');
}

function getContactFromID(uuid) {
   let users = listAllUsers();
   let contact = {};
   for (let user of users) {
      if (user.id == uuid) {
         console.log(user);
         for (let email of user.emails) {
            if (email.hasOwnProperty('primary') && email.primary == true) {
               console.log(email);
               contact.email = email.address;
            }
         }
         contact.name = user.name;
      }
   }
   return contact;
}

function getFolderFromID(uuid) {
   const config = getCodeConfig();
   const user = getContactFromID(uuid);

   let userDirectory = DriveApp.getFolderById(config.directory.saveFolderID);

   let userFolder;
   let userFolderIterator = userDirectory.getFoldersByName(user.name.fullName);

   while (userFolderIterator.hasNext()) {
      userFolder = userFolderIterator.next();
   }

   return userFolder;
}
