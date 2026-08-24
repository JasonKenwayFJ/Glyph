use glyph_core::network::api_client::{ApiClient, ApiResponse};
use glyph_core::network::authorization_service;


#[tauri::command]
pub async fn register(
    api_state: tauri::State<'_, ApiClient>,
    username: String,
    email: String,
    password: String,
    image_path: String,
) -> Result<ApiResponse<String>, String> {
    let token_response = authorization_service::registration(
        api_state.inner(),
        &username,
        &email,
        &password,
        &image_path,
    ).await?;
    Ok(token_response)
}

#[tauri::command]
pub async fn login(
    api_state: tauri::State<'_, ApiClient>,
    email: String,
    password: String,
) -> Result<ApiResponse<String>, String> {
    let token_response = authorization_service::authorization(
        api_state.inner(),
        &email,
        &password,
    ).await?;

    Ok(token_response)
}