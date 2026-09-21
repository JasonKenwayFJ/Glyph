use crate::enums::entity::Entity;
use std::sync::Mutex;

pub struct TrashManager {
    entities: Mutex<Vec<Entity>>
}

impl TrashManager{
    pub fn new() -> TrashManager {
        TrashManager{
            entities: Mutex::new(Vec::new()),
        }
    }

    pub fn add_entity(&self, entity: Entity) {
        self.entities.lock().unwrap().push(entity);
    }
    pub fn remove_entity(&self, entity: &Entity) {
        let mut entities = self.entities.lock().unwrap();
        entities.retain(|e| e.id != entity.id);
    }
}
