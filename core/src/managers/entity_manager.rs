use crate::entities::entity::{Entity, EntityType};
use std::sync::Mutex;

pub struct EntityManager {
    entities: Mutex<Vec<Entity>>
}

impl EntityManager {
    pub fn new() -> EntityManager {
        EntityManager{
            entities: Mutex::new(Vec::new())
        }
    }

    pub fn hydrate(&self, loaded_entities: Vec<Entity>) {
        let mut entities = self.entities.lock().unwrap();
        if entities.is_empty() {
            entities.extend(loaded_entities);
        }
    }
    pub fn get_entities(&self, r#type: EntityType) -> Result<Vec<Entity>, String> {
        let entities = self.entities.lock().unwrap();

        let result = entities
            .iter()
            .filter(|e| e.entity_type == r#type)
            .cloned()
            .collect();

        Ok(result)
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

