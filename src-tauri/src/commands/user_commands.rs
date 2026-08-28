use glyph_core::managers::user_manager::UserManager;
use glyph_core::network::api_client::{ApiClient, ApiResponse};
use glyph_core::network::authorization_service;



#[tauri::command]
pub fn get_user(
    manager: tauri::State<'_, UserManager>
) -> String {
    manager.get_user().unwrap()
}
#[tauri::command]
pub async fn register(
    api_state: tauri::State<'_, ApiClient>,
    manager: tauri::State<'_, UserManager>,
    username: String,
    email: String,
    password: String,
    image_path: String,
) -> Result<String, String> {
    let response = authorization_service::registration(
        api_state.inner(),
        &username,
        &email,
        &password,
        &image_path,
    )
    .await?;
    let token = response.data.ok_or_else(|| "Couldnt registrate")?.to_string();
    manager.set_user(&token);
    Ok(token)
}

#[tauri::command]
pub async fn login(
    api_state: tauri::State<'_, ApiClient>,
    email: String,
    password: String,
) -> Result<ApiResponse<String>, String> {
    let token_response =
        authorization_service::authorization(api_state.inner(), &email, &password).await?;

    Ok(token_response)
}
