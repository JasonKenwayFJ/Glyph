use std::sync::Mutex;
use uuid::Uuid;
use crate::entities::project_entity::Project;

pub struct ProjectManager {
    current_project: Mutex<Option<Project>>,
    projects: Mutex<Option<Vec<Project>>>
}

impl ProjectManager {
    pub fn new() -> ProjectManager {
        ProjectManager {
            current_project: Mutex::new(None),
            projects: Mutex::new(None)
        }
    }

    pub fn get_project(&self) -> Option<Project> {
        self.current_project.lock().unwrap().clone()
    }
    pub fn get_projects(&self) -> Option<Vec<Project>> {
        self.projects.lock().unwrap().clone()
    }
    pub fn get_project_id(&self, id: Uuid) -> Option<Project> {
        self.projects
            .lock()
            .unwrap()
            .as_ref()?
            .iter()
            .find(|project| project.id == id)
            .cloned()
    }
    pub fn set_projects(&self, projects: Vec<Project>) {
        self.projects.lock().unwrap().replace(projects);
    }
    pub fn set_current_project(&self, project: Project){
        self.current_project.lock().unwrap().replace(project);
    }

    pub fn close_project(&self) {
        let mut project = self.current_project.lock().unwrap();
        *project = None;
    }
}