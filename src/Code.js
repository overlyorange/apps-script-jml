function onOpen() {
   SpreadsheetApp.getUi()
      .createMenu('💻')
      .addItem('🚀 Launch Sidebar', 'showSidebar')
      .addToUi();

   //You could call showSidebar directly but it would then only work for users who have previously authorized this script while appearing non-functional for others.
}

/**
 * Prepare Sidebar
 */
function showSidebar() {
   let html = HtmlService.createTemplateFromFile('Sidebar')
      .evaluate()
      .setTitle('HR App');
   SpreadsheetApp.getUi().showSidebar(html);
}

//This is to be able to split up Modal.html into various files
function include(filename) {
   return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Read in Data
 */
function listAllUsers() {
   let pageToken;
   let page;
   let users;

   //Get Users
   do {
      page = AdminDirectory.Users.list({
         domain: 'indigovolunteers.org',
         orderBy: 'givenName',
         maxResults: 100,
         pageToken: pageToken,
      });
      users = page.users;
      if (!users) {
         console.log('No users found.');
         return;
      }
      pageToken = page.nextPageToken;
   } while (pageToken);

   //Sort by fullName
   users.sort((a, b) => {
      const fullNameA = a.name.fullName.toUpperCase();
      const fullNameB = b.name.fullName.toUpperCase();
      if (fullNameA < fullNameB) {
         return -1;
      }
      if (fullNameA > fullNameB) {
         return 1;
      }
      return 0;
   });

   return users;
}

function getUserState(userID) {
   let savedUserStates = readUserStates();
   let savedUserState;
   if (savedUserStates.hasOwnProperty(userID)) {
      savedUserState = savedUserStates[userID];
   }

   let procedureConfig = getProcedureConfig(userID);
   let renderedUserState = {};

   //Cycle through procedureConfig and match it with saved data
   for (let procedure in procedureConfig) {
      renderedUserState[procedure] = []; //buffer

      for (let i = 0; i < procedureConfig[procedure].length; i++) {
         let item = procedureConfig[procedure][i];

         //Check if item has been saved
         if (savedUserState) {
            let itemMatched = false;

            for (let savedItem of savedUserState[procedure]) {
               if (item.name == savedItem.name) {
                  item.checked = savedItem.checked;
                  renderedUserState[procedure].push(item);
                  itemMatched = true;
               }
            }

            if (!itemMatched) {
               item.checked = false;
               renderedUserState[procedure].push(item);
            }
         } else {
            item.checked = false;
            renderedUserState[procedure].push(item);
         }
      }
   }
   return renderedUserState;
}
