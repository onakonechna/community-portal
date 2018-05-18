// Updates project information from project repo.

var projectApiUrl =
"http://localhost:8080/rest/default/mkeze/v1/main:project";

function updateProjects(projects) {
log.debug("Updating Projects");

// Is there a better way to get data from the db?
projects = timerUtil.restGet(projectApiUrl);
for (var project in projects) {
updateProjectData(project);
}
}

function updateProjectData(project) {
var restGetRequest = makeRepoGetRequest(project);
if (!restGetRequest) {
return;
}   
var repoData = timerUtil.restGet(restGetRequest);
if (repoData["message"] == "Not Found") {
log.fine
return;
}
putUpdate(project, repoData);
}

function makeRepoGetRequest(project) {
var git_link = project["github"];
if (!git_link) {
return false;
}
var words = git_link.split('/');
if (words.length < 2) {
return false;
}
// last two words are assumed to be owner and name of repo.
var owner = words[words.length - 2];
var name = words[words.length - 1];
var request = "https://api.github.com/repos/" +
owner + "/" + name + " [get]";
return request;
}

/**
* Creates put request to add data to project
*/
function putUpdate(project, repoData) {
var checkSum = project["@metadata"]["checksum"];
var projectId = project["ident"];
var nIssues = repoData["open_issues"];
    
var update = {
"ident": projectId,
"open_issues": nIssues,
"@metadata": {
"checksum": checkSum
}
}
    
timerUtil.restPut(projectApiUrl + "/" + projectId, null, null, update);
}

updateProjects();