use std::sync::Mutex;
use uuid::Uuid;
use crate::entities::project_entity::Project;
use crate::enums::entity_type::EntityType;
use crate::traits::entity_like::EntityLike;

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

    // FIXME: первым делом нужно проверить метод Add
    // Issue: #1
    pub fn add_entity(&self, entity: impl EntityLike + 'static) {
        self.entities
            .lock()
            .unwrap()
            .push(Box::new(entity));
    }

    pub fn add_boxed_entity(&self, entity: Box<dyn EntityLike>) {
        self.entities.lock().unwrap().push(entity);
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
    pub fn set_entities(&self, entities: Vec<Box<dyn EntityLike>>) {
        *self.entities.lock().unwrap() = entities;
    }
    pub fn set_current_project(&self, project: Project) {
        self.current_project.lock().unwrap().replace(project);
    }
    pub fn delete_project(&self, project_id: Uuid) {
        self.projects
            .lock()
            .unwrap()
            .retain(|project| project.id != project_id);
    }
    pub fn close_project(&self) {
        *self.current_project.lock().unwrap() = None;
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    use crate::entities::card_entity::Card;
    use crate::entities::document_entity::Characteristic;
    use crate::enums::source::Source;
    use std::path::PathBuf;

    fn make_project(title: &str) -> Project {
        Project::new(Uuid::new_v4(), title, "описание", None, false)
    }

    fn make_card(project_id: Uuid, title: &str) -> Card {
        Card::new(
            project_id,
            Uuid::new_v4(),
            title,
            "краткое описание",
            "содержание",
            Some(Source::File(PathBuf::from("thumb.png"))), // было без Some(...)
            None,
            EntityType::Card,
            vec![],
            vec![],
            vec![]
        )
    }

    // --- Projects ---

    #[test]
    fn new_manager_has_no_projects_and_no_current_project() {
        let manager = ProjectManager::new();

        assert!(manager.get_projects().is_empty());
        assert!(manager.get_project().is_none());
    }

    #[test]
    fn add_project_then_get_projects_returns_it() {
        let manager = ProjectManager::new();
        let project = make_project("Тестовый проект");
        let project_id = project.id;

        manager.add_project(project).unwrap();

        let projects = manager.get_projects();
        assert_eq!(projects.len(), 1);
        assert_eq!(projects[0].id, project_id);
    }

    #[test]
    fn get_project_id_finds_correct_project_among_several() {
        let manager = ProjectManager::new();
        let first = make_project("Первый");
        let second = make_project("Второй");
        let second_id = second.id;

        manager.add_project(first).unwrap();
        manager.add_project(second).unwrap();

        let found = manager.get_project_id(second_id);
        assert!(found.is_some());
        assert_eq!(found.unwrap().title, "Второй");
    }

    #[test]
    fn get_project_id_returns_none_for_unknown_id() {
        let manager = ProjectManager::new();
        manager.add_project(make_project("Проект")).unwrap();

        assert!(manager.get_project_id(Uuid::new_v4()).is_none());
    }

    #[test]
    fn update_project_replaces_matching_project_by_id() {
        let manager = ProjectManager::new();
        let mut project = make_project("Старое название");
        let project_id = project.id;
        manager.add_project(project.clone()).unwrap();

        project.title = "Новое название".to_string();
        manager.update_project(project).unwrap();

        let updated = manager.get_project_id(project_id).unwrap();
        assert_eq!(updated.title, "Новое название");
        assert_eq!(manager.get_projects().len(), 1); // не задвоилось
    }

    #[test]
    fn update_project_errors_when_id_not_found() {
        let manager = ProjectManager::new();
        let unknown_project = make_project("Призрак");

        let result = manager.update_project(unknown_project);
        assert!(result.is_err());
    }

    #[test]
    fn set_projects_replaces_entire_list() {
        let manager = ProjectManager::new();
        manager.add_project(make_project("Будет стёрт")).unwrap();

        let new_projects = vec![make_project("А"), make_project("Б")];
        manager.set_projects(new_projects);

        assert_eq!(manager.get_projects().len(), 2);
    }

    #[test]
    fn current_project_lifecycle() {
        let manager = ProjectManager::new();
        let project = make_project("Активный");

        manager.set_current_project(project.clone());
        assert_eq!(manager.get_project().unwrap().id, project.id);

        manager.close_project();
        assert!(manager.get_project().is_none());
    }

    // --- Entities ---

    #[test]
    fn add_entity_then_get_entities_filters_by_type() {
        let manager = ProjectManager::new();
        let project_id = Uuid::new_v4();

        manager.add_entity(make_card(project_id, "Карта 1"));
        manager.add_entity(make_card(project_id, "Карта 2"));

        let cards = manager.get_entities(EntityType::Card);
        assert_eq!(cards.len(), 2);
    }

    #[test]
    fn get_entities_returns_empty_for_type_with_no_matches() {
        let manager = ProjectManager::new();
        manager.add_entity(make_card(Uuid::new_v4(), "Карта"));

        let documents = manager.get_entities(EntityType::Document);
        assert!(documents.is_empty());
    }

    #[test]
    fn remove_entity_deletes_by_id() {
        let manager = ProjectManager::new();
        let card = make_card(Uuid::new_v4(), "Удали меня");
        let card_id = card.id;
        manager.add_entity(card);

        manager.remove_entity(card_id);

        assert!(manager.get_entities(EntityType::Card).is_empty());
    }

    #[test]
    fn update_entity_replaces_matching_entity() {
        let manager = ProjectManager::new();
        let project_id = Uuid::new_v4();
        let original = make_card(project_id, "До");
        let entity_id = original.id;
        manager.add_entity(original);

        let mut updated_card = make_card(project_id, "После");
        updated_card.id = entity_id; // тот же id, иначе update_entity его не найдёт
        manager.update_entity(Box::new(updated_card)).unwrap();

        let cards = manager.get_entities(EntityType::Card);
        assert_eq!(cards.len(), 1);
        assert_eq!(cards[0].file_name(), "После");
    }

    #[test]
    fn update_entity_errors_when_id_not_found() {
        let manager = ProjectManager::new();
        let stray_card = make_card(Uuid::new_v4(), "Чужой");

        let result = manager.update_entity(Box::new(stray_card));
        assert!(result.is_err());
    }

    #[test]
    fn set_entities_replaces_whole_list() {
        let manager = ProjectManager::new();
        manager.add_entity(make_card(Uuid::new_v4(), "Будет стёрта"));

        let fresh: Vec<Box<dyn EntityLike>> = vec![
            Box::new(make_card(Uuid::new_v4(), "Новая 1")),
            Box::new(make_card(Uuid::new_v4(), "Новая 2")),
        ];
        manager.set_entities(fresh);

        assert_eq!(manager.get_entities(EntityType::Card).len(), 2);
    }
}