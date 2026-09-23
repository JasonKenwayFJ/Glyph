use uuid::Uuid;
use crate::network::api_client::ApiClient;
use crate::Project;

/// Забирает список проектов пользователя с сервера.
pub async fn get_projects(client: &ApiClient, user_id: &Uuid) -> Result<Vec<Project>, String> {
    client
        .get::<Vec<Project>>(format!("project/getAll/{user_id}"))
        .await
        .map_err(|error| {
            println!("Не удалось получить проекты с сервера: {error}");
            error
        })
}

/// Отправляет проект на сервер.
///
/// Тело ответа принимаем как `serde_json::Value`, а не как `()`:
/// `()` десериализуется только из литерала `null`, поэтому на `{}` или на
/// пустом теле он падал бы с ошибкой. `Value` принимает любую JSON-форму,
/// а содержимое ответа нам здесь не нужно — статус уже проверил клиент.
pub async fn create_project(client: &ApiClient, project: &Project) -> Result<(), String> {
    client
        .post::<Project, serde_json::Value>("project/create", project)
        .await
        .map_err(|error| {
            println!("Не удалось отправить проект на сервер: {error}");
            error
        })?;

    println!("Проект {} отправлен на сервер", project.id);
    Ok(())
}

/// Удаляет проект на сервере.
pub async fn delete_project(client: &ApiClient, project: &Project) -> Result<(), String> {
    client
        .delete(format!("project/{}", project.id))
        .await
        .map_err(|error| {
            println!("Не удалось удалить проект на сервере: {error}");
            error
        })?;

    println!("Проект {} удалён на сервере", project.id);
    Ok(())
}
