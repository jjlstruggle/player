#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_store;
use tauri_plugin_upload;
use tauri_plugin_wallpaper::Wallpaper;
use window_shadows::set_shadow;

#[tauri::command]
fn detach(app: tauri::AppHandle) {
    let wallpaper = app.get_window("wallpaper").unwrap();
    Wallpaper::detach(&wallpaper);
}
#[tauri::command]
fn attach(app: tauri::AppHandle) {
    let wallpaper = app.get_window("wallpaper").unwrap();
    Wallpaper::attach(&wallpaper);
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_upload::init())
        .plugin(Wallpaper::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let wallpaper = app.get_window("wallpaper").unwrap();
            Wallpaper::attach(&wallpaper);
            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![detach, attach])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
