use std::sync::Mutex;
use std::collections::HashMap;
use uuid::Uuid;
use crate::entities::project_entity::Project;

pub struct ProjectManager {
    project: Mutex<Option<Project>>
}

impl ProjectManager {
    pub fn new() -> ProjectManager {
        ProjectManager {
            project: Mutex::new(None)
        }
    }

    pub fn get_project(&self) -> Option<Project> {
        self.project.lock().unwrap().clone()
    }

    pub fn get_project_id(&self) -> Option<Uuid> {
        self.project.lock().unwrap().as_ref().map(|p| p.id)
    }
    pub fn set_project(&self, project: Project) {
        self.project.lock().unwrap().replace(project);
    }

    pub fn close_project(&self) {
        let mut project = self.project.lock().unwrap();
        *project = None;
    }
}