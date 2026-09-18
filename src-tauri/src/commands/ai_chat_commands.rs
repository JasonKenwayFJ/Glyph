use glyph_core::entities::ai_message_entity::ChatRequest;
use glyph_core::managers::ai_chat_manager::AiChatManager;
use glyph_core::network::api_client::ApiClient;


#[tauri::command]
pub async fn _send_message(
    _api_state: tauri::State<'_, ApiClient>,
    _chat_manager: tauri::State<'_, AiChatManager>,
    _message: ChatRequest) -> Result<(), String>{
    Ok(())
}

#[tauri::command]
pub async fn _get_messages(
    _api_state: tauri::State<'_, ApiClient>,
    _chat_manager: tauri::State<'_, AiChatManager>,
    _message: ChatRequest) -> Result<(), String>{
    Ok(())
}
#[tauri::command]
pub async fn _clear_messages(
    _api_state: tauri::State<'_, ApiClient>,
    _chat_manager: tauri::State<'_, AiChatManager>,
    _message: ChatRequest) -> Result<(), String>{
    Ok(())
}
#[tauri::command]
pub async fn _send_image(
    _api_state: tauri::State<'_, ApiClient>,
    _chat_manager: tauri::State<'_, AiChatManager>,
    _message: ChatRequest) -> Result<(), String>{
Ok(())
}