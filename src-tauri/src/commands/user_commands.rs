use tauri::{Emitter, Manager};
use crate::glyph_fs::paths::directory_for_type;
use glyph_core::dto_entities::user_dto::UserDto;
use glyph_core::enums::entity_type::EntityType;
use glyph_core::entities::helpers::data_object::DataObject;
use glyph_core::entities::user_entity::User;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::network::api_client::ApiClient;
use glyph_core::ProjectManager;
use glyph_core::network::authorization_service;
#[tauri::command]
pub async fn registration(
    app: tauri::AppHandle,
    user_state: tauri::State<'_, UserManager>,
    api_client: tauri::State<'_, ApiClient>,
    request: UserDto,
) -> Result<(), String>{
    let token =
        authorization_service::registration(api_client.inner(),&request).await
            .map_err(|error| {
            eprintln!("Ошибка регистрации на сервере: {error}");
            error
        })?;

    let mut user = request.get_entity();
    user.token = Some(token);
    user_state.set_user(user.clone());

    app.emit("OnUserAuthorized", "".to_string()).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn authorization(
    app: tauri::AppHandle,
    user_state: tauri::State<'_, UserManager>,
    api_client: tauri::State<'_, ApiClient>,
    data: UserDto,
) -> Result<(), String>{

    let response =
        authorization_service::authorization(api_client.inner(),&data.email, &data.password).await?;

    user_state.set_user(response.clone());
    app.emit("OnUserAuthorized", "".to_string()).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn verify_user(
    api_client: tauri::State<'_, ApiClient>,
    user_state: tauri::State<'_, UserManager>,
) -> Result<bool, String>
{
    let token = user_state.get_token().ok_or("Token not found").map_err(|error| {
        eprintln!("Ошибка получения токена: {error}");
        error
    })?;


    authorization_service::verify_user(api_client.inner(),token).await
}
#[tauri::command]
pub async fn delete_account(
    app: tauri::AppHandle,
    user_state: tauri::State<'_, UserManager>,
    project_state: tauri::State<'_, ProjectManager>,
    api_client: tauri::State<'_, ApiClient>,
    data: User,
) -> Result<(), String> {
    authorization_service::delete_account(api_client.inner(), &data).await?;
    let app_data_dir = app
        .path()
        .document_dir()
        .map_err(|e| format!("Не удалось получить каталог документов: {e}"))?
        .join("Glyph");

    let users_dir = directory_for_type(&app_data_dir, EntityType::User).await?;
    if tokio::fs::try_exists(&users_dir)
        .await
        .map_err(|e| e.to_string())?
    {
        tokio::fs::remove_dir_all(&users_dir)
            .await
            .map_err(|e| format!("Не удалось удалить данные пользователя: {e}"))?;
    }

    user_state.quit();
    project_state.set_projects(Vec::new());
    project_state.close_project();

    app.emit("OnUserDeleted", data.id)
        .map_err(|e| e.to_string())
}