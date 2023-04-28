function readUserStates() {

  const config = getCodeConfig();

  let file = DriveApp.getFileById(config.json.saveFileID);

  if (file) {

    let fileBlob = file.getBlob().getDataAsString();
    let returnObj = JSON.parse(fileBlob);
    return returnObj;

  } else {

    return null
  }
}

function saveUserState(userID, userState) {

  const config = getCodeConfig();

  let userStates = readUserStates();

  for(let procedure in userState){
    for(let item of userState[procedure]){
      for(let key in item){
        if(key !== 'name' && key !== 'checked'){
          delete item[key];
        }
      }
    }
  }

  userStates[userID] = userState;

  let saveFile = DriveApp.getFileById(config.json.saveFileID);
  saveFile.setContent(JSON.stringify(userStates));

}

function resetUserStateFile(){
  let userStates = {};
  let config = getCodeConfig();
  let saveFile = DriveApp.getFileById(config.json.saveFileID);
  saveFile.setContent(JSON.stringify(userStates));
}
