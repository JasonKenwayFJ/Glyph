use glyph_core::{UserManager, User, ApiClient};
use glyph_core::network::authorization_service;
use tauri::Emitter;

#[tauri::command]
pub async fn register(
    api_state: tauri::State<'_, ApiClient>,
    username: String,
    email: String,
    password: String,
    image_path: String,
) -> Result<String, String> {
    let token_response = authorization_service::registration(
        api_state.inner(),
        &username,
        &email,
        &password,
        &image_path,
    ).await?;

    UserManager.
    Ok(token_response.token)
}

#[tauri::command]
pub async fn login(
    api_state: tauri::State<'_, ApiClient>,
    email: String,
    password: String,
) -> Result<String, String> {
    let token_response = authorization_service::authorization(
        api_state.inner(),
        &email,
        &password,
    ).await?;

    Ok(token_response.token)
}