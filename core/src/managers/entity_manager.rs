use std::sync::Mutex;
use uuid::Uuid;
use crate::entities::entity::Entity;
use crate::entities::project_entity::Project;

pub struct EntityManager {
    entities: Mutex<Option<Entity>>   
}

impl EntityManager {
    pub fn new() -> EntityManager {
        EntityManager{
            entities: Mutex::new(None)
        }
    }
    pub async fn load_entities(&self) -> Option<Entity> {
        
    }
    pub fn get_entities(&self) -> Option<Entity> {
        self.entities.lock().unwrap().clone()
    }
    
}

