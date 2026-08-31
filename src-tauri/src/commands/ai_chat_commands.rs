use glyph_core::entities::ai_message_entity::ChatRequest;
use glyph_core::managers::ai_chat_manager::AiChatManager;
use glyph_core::network::api_client::ApiClient;

#[tauri::command]
pub async fn send_message(
    api_state: tauri::State<'_, ApiClient>,
    chat_manager: tauri::State<'_, AiChatManager>,
    message: ChatRequest) -> Result<(), String>{
    Ok(())
}
#[tauri::command]
pub async fn get_messages(
    api_state: tauri::State<'_, ApiClient>,
    chat_manager: tauri::State<'_, AiChatManager>,
    message: ChatRequest) -> Result<(), String>{
    Ok(())
}
#[tauri::command]
pub async fn clear_messages(
    api_state: tauri::State<'_, ApiClient>,
    chat_manager: tauri::State<'_, AiChatManager>,
    message: ChatRequest) -> Result<(), String>{
    Ok(())
}
#[tauri::command]
pub async fn send_image(
    api_state: tauri::State<'_, ApiClient>,
    chat_manager: tauri::State<'_, AiChatManager>,
    message: ChatRequest) -> Result<(), String>{
Ok(())
}