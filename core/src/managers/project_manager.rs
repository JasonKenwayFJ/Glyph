use std::sync::Mutex;
use uuid::Uuid;
use crate::entities::project_entity::Project;
use crate::enums::entity_type::EntityType;
use crate::traits::entity::EntityLike;

pub struct ProjectManager {
    current_project: Mutex<Option<Project>>,
    projects: Mutex<Vec<Project>>,
    entities: Mutex<Vec<Box<dyn EntityLike>>>,
}

impl ProjectManager {
    pub fn new() -> ProjectManager {
        ProjectManager {
            current_project: Mutex::new(None),
            projects: Mutex::new(Vec::new()),
            entities: Mutex::new(Vec::new()),
        }
    }

    pub fn get_entities(&self, entity_type: EntityType) -> Vec<Box<dyn EntityLike>> {
        self.entities
            .lock()
            .unwrap()
            .iter()
            .filter(|e| e.entity_type() == entity_type)
            .cloned()
            .collect()
    }

    pub fn add_entity(&self, entity: impl EntityLike + 'static) {
        self.entities
            .lock()
            .unwrap()
            .push(Box::new(entity));
    }



    pub fn update_entity(&self, entity: Box<dyn EntityLike>) -> Result<(), String> {
        let mut entities = self.entities.lock().unwrap();

        match entities.iter_mut().find(|e| e.id() == entity.id()) {
            Some(existing) => {
                *existing = entity;
                Ok(())
            }
            None => Err(format!("Entity with id {} not found", entity.id())),
        }
    }
    pub fn remove_entity(&self, entity_id: Uuid) {
        self.entities
            .lock()
            .unwrap()
            .retain(|e| e.id() != entity_id);
    }

    pub fn get_project(&self) -> Option<Project> {
        self.current_project.lock().unwrap().clone()
    }

    pub fn get_projects(&self) -> Vec<Project> {
        self.projects.lock().unwrap().clone()
    }

    pub fn get_project_id(&self, id: Uuid) -> Option<Project> {
        self.projects
            .lock()
            .unwrap()
            .iter()
            .find(|project| project.id == id)
            .cloned()
    }

    pub fn add_project(&self, project: Project) -> Result<(), String> {
        self.projects.lock().unwrap().push(project);
        Ok(())
    }
    pub fn update_project(&self, project: Project) -> Result<(), String> {
        let mut projects = self.projects.lock().unwrap();

        match projects.iter_mut().find(|p| p.id == project.id) {
            Some(existing) => {
                *existing = project;
                Ok(())
            }
            None => Err(format!("Project with id {} not found", project.id)),
        }
    }
    pub fn set_projects(&self, projects: Vec<Project>) {
        *self.projects.lock().unwrap() = projects;
    }

    pub fn set_current_project(&self, project: Project) {
        self.current_project.lock().unwrap().replace(project);
    }

    pub fn close_project(&self) {
        *self.current_project.lock().unwrap() = None;
    }
}