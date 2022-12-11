import * as vscode from "vscode";

export const getApiKey = ():string => {
    return vscode.workspace.getConfiguration("VSRegex").get("ApiKey") ?? "";
};

export const isKeyValid = (key: string):boolean => {
    // Syntax check
    if(key.length !== 51 || key.substring(0,3) !== 'sk-'){
        return false;
    }

    // API check
    // const requestOptions = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + String(key)
    //     }
    // };
    

    // let response = await fetch('https://api.openai.com/v1/models', requestOptions)
    // .then((response) => response.json())
    // .then((data) => {
    //     //key is valid
    //     console.log(data);
    //     return true;
    // })
    // .catch((err) => {
    //     //key is invalid
    //     console.log(err);
    //     return false;
    // });
    

    return true;
};