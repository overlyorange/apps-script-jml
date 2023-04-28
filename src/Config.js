function getProcedureConfig(userID) {
   return {
      /***********************
       *      JOINERS       *
       **********************/

      joinersList: [
         {
            name: 'Create their file and folder',
            action: {
               text: 'Create folder & add to sheet',
               callback: 'createUserFolderAddToSheet', //See ButtonAction
            },
         },
         {
            name: 'Add relevant details to their entry on the TEAM tab of this sheet',
            description:
               'You can add roles and agreement types under CATEGORIES.',
         },
         {
            name: 'Set up legal agreement',
            action: {
               text: 'Create document',
               callback: 'initiateLegalDocument', //See ButtonAction
            },
         },
         { name: `Save legal agreement as PDF` },
         {
            name: `Send an email asking them to`,
            list: [
               'sign the PDF',
               'send it back to us',
               'share some form of ID',
               'share their home address',
               'share an emergency contact',
            ],
         },
         { name: `Save the signed document in their folder` },
         {
            name: `Share an updated organogram with the insurance and inform them of the`,
            list: [
               'new team member',
               'their type of agreement/contract',
               'their name',
               'their role',
            ],
            links: [
               { text: 'Organogram', url: '{{URL}}' },
               { text: 'Email', url: '{{MAILTO URL' },
            ],
         },
         {
            name: 'Start a training and induction plan in consideration of their role profile',
         },
         {
            name: 'Send the new team member a welcome email',
            description:
               "This email contains various instructions and files they should have a look at. You'll be in CC.",
            action: {
               text: 'Send Welcome Email',
               callback: 'sendWelcomeEmail', //See ButtonAction
            },
         },
      ],

      /***********************
       *       MOVERS        *
       **********************/

      moversList: [],

      /***********************
       *      LEAVERS        *
       **********************/

      leaversList: [],
   };
}

/**
 * Constants used throughout the codebase
 */

function getCodeConfig() {
   return {
      json: {
         saveFolderID: '{{FOLDER ID}}',
         saveFileName: 'userState.json',
         saveFileID: '{{FILE ID}}',
      },
      directory: {
         saveFolderID: '{{FOLDER ID}}',
         folderLinkColumnIndex: 2,
         nameColumnIndex: 3,
      },

      //The three types are hard coded on the widget
      legalDocs: {
         employment: {
            templateID: '{{FILE ID}}',
            newFileName: 'Employment Contract',
         },
         consultancy: {
            templateID: '{{FILE ID}}',
            newFileName: 'Consultancy Agreement',
         },
         volunteering: {
            templateID: '{{FILE ID}}',
            newFileName: 'Volunteering Agreement',
         },
      },
   };
}
