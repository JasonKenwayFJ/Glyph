import {createProjectService} from "../localClient.ts";
import {createProject, updateProject, deleteProject} from "../entityControllers/projectController.ts";
import {db} from "../GlyphDB.ts";

export const projectService = createProjectService(db.projects, {
    createProject: createProject,
    updateProject: updateProject,
    removeProject: deleteProject,
});