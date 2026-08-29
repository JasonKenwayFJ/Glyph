use std::sync::Mutex;
use crate::entities::user_entity::User;

pub struct UserManager {
    user: Mutex<Option<User>>
}

impl UserManager {
    pub fn new() -> UserManager {
        UserManager {
            user: Mutex::new(None)
        }
    }

    pub fn get_user(&self) -> Option<User> {
        self.user.lock().unwrap().clone()
    }
    pub fn set_user(&self, user: User) {
        self.user.lock().unwrap().replace(user);
    }
    pub fn quit(&self) {
        let mut user = self.user.lock().unwrap();
        *user = None;
    }
}

#[cfg(test)]
mod tests{
    use uuid::Uuid;
    use crate::entities::entity::{Entity, EntityType};
    use crate::managers::entity_manager::EntityManager;


    #[test]
    fn new_manager_has_no_entities(){
        let manager = EntityManager::new();
        assert_eq!(manager.get_entities(EntityType::Card).unwrap().len(), 0)
    }
    #[test]
    fn add_entity_locally_stores_it() {
        let manager = EntityManager::new();
        let entity = Entity::new(
            Uuid::new_v4(), "Test", "desc", "", "",
            EntityType::Card, vec![], vec![], vec![]
        );

        manager.add_entity_locally(&entity);

        let result = manager.get_entities(EntityType::Card).unwrap();
        assert_eq!(result.len(), 1);
        assert_eq!(result[0].id, entity.id);
    }
    #[test]
    fn delete_entity_removes_it() {
        let manager = EntityManager::new();
        let entity = Entity::new(
            Uuid::new_v4(), "Test", "desc", "", "",
            EntityType::Card, vec![], vec![], vec![]
        );

        manager.add_entity_locally(&entity);
        manager.delete_entity_locally(&entity);

        assert_eq!(manager.get_entities(EntityType::Card).unwrap().len(), 0);
    }
}