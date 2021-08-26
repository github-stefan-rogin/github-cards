import { readFile } from 'fs/promises'; 
import { Octokit } from "@octokit/core";

const cards = JSON.parse(await readFile('./cards.json'));
const user = JSON.parse(await readFile('./user.json'));
const octokit = new Octokit({
    auth: user.apitoken,
});
const gitOptions = {
    mediaType: {
        previews: [
            'inertia'
        ]
    },
};

// create project
async function createProject(name) {
    return (await octokit.request("POST /user/projects", { ...gitOptions, name }))?.data?.id;
}

async function getProjectId(projectName, username) {
    const response = await octokit.request("GET /users/{username}/projects", { ...gitOptions, username });
    return response.data.find(p => p.name === projectName)?.id;
}

async function createColumn(name, project_id) {
    return (await octokit.request("POST /projects/{project_id}/columns", {...gitOptions, name, project_id}))?.data?.id;
}

async function getColumns(project_id) {
    return (await octokit.request("GET /projects/{project_id}/columns", {...gitOptions, project_id}))?.data;
}

const projectId = await getProjectId(cards.project.name, user.username) ?? await createProject(cards.project.name);
const projectColumns = await getColumns(projectId);
for (let col of cards.columns) {
    let projectColumn = projectColumns?.find(c => c.name === col.name);
    let colId = projectColumn?.id ?? await createColumn(col.name, projectId);
    colId && projectColumn[id] = colId;
}
console.log(projectId);