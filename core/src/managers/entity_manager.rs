use std::sync::Mutex;
use crate::entities::entity::{Entity, EntityType};



pub struct EntityManager {
    entities: Mutex<Vec<Entity>>
}

impl EntityManager {
    pub fn new() -> EntityManager {
        EntityManager{
            entities: Mutex::new(Vec::new())
        }
    }

    pub fn get_entities(&self, r#type: EntityType) -> Vec<Entity> {
        let entities = self.entities
            .lock().unwrap();
        entities.iter().filter(|e| e.entity_type == r#type).cloned().collect()
    }
    pub fn add_entity_locally(&self, entity: &Entity){
        let mut entities = self.entities.lock().unwrap();
        entities.push(entity.clone());
    }

    pub fn update_entity_locally(&self, entity: &Entity) {
        let mut entities = self.entities.lock().unwrap();
        if let Some(index) = entities.iter().position(|x| x.id == entity.id){
            entities[index] = entity.clone();
        }
    }
    pub fn delete_entity_locally(&self, entity: &Entity){
        let mut entities = self.entities.lock().unwrap();
        entities.retain(|e| e.id != entity.id);
    }


}

