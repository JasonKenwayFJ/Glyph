use std::sync::Mutex;
use crate::entities::entity::{Entity, EntityType};
use crate::managers::file_manager::load_entities;


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
        let mut entities = self.entities.lock().unwrap();

        if entities.is_empty() {
            let local_entities =
                load_entities().expect("Failed getting local entities");

            entities.extend(local_entities);
        }

        entities
            .iter()
            .filter(|e| e.entity_type == r#type)
            .cloned()
            .collect()
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

