// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Mutex;
use tauri::webview::PageLoadEvent;
use tauri::{Manager, State};
use url::Url;

#[derive(Default)]
struct JagexLogin {
    state: Option<String>,
    code: Option<String>,
}

#[derive(Default)]
struct ExecutablePaths {
    simba1400: PathBuf,
    simba2000: PathBuf,
    legacy: PathBuf,
    runelite: PathBuf,
    osclient: PathBuf,
}

#[tauri::command]
async fn jagex_login(
    app: tauri::AppHandle,
    jlogin: State<'_, Mutex<JagexLogin>>,
    url: String,
) -> Result<(), ()> {
    let mut jagex_login = jlogin.lock().unwrap();
    jagex_login.state = None;
    jagex_login.code = None;

    let webview = tauri::WebviewWindowBuilder::new(
        &app,
        "jagexaccount",
        tauri::WebviewUrl::External(url.parse().unwrap()),
    );

    webview
        .title("Jagex Account Login")
        .on_page_load(|webview, payload| {
            match payload.event() {
                PageLoadEvent::Started => {
                    let url_str = payload.url().as_str();
                    let parsed_url = Url::parse(url_str).unwrap();

                    if parsed_url.path() != "/m=weblogin/launcher-redirect" {
                        return;
                    }

                    // Get the query parameters
                    let query_pairs = parsed_url.query_pairs();
                    let mut code = String::new();
                    let mut state = String::new();

                    for (key, value) in query_pairs {
                        if key == "code" {
                            code = value.to_string();
                        } else if key == "state" {
                            state = value.to_string();
                        }
                    }

                    let app = webview.app_handle();
                    let jagex_login = app.state::<Mutex<JagexLogin>>();
                    let mut jagex_login = jagex_login.lock().unwrap();

                    jagex_login.state = Some(state.clone());
                    jagex_login.code = Some(code.clone());

                    println!("CODE: {}", code);
                    println!("STATE: {}", state);
                    webview.close().unwrap();
                    return;
                }
                PageLoadEvent::Finished => {}
            }
        })
        .build()
        .unwrap();
    Ok(())
}

#[tauri::command]
fn get_code(jlogin: State<'_, Mutex<JagexLogin>>) -> Option<String> {
    let jagex_login = jlogin.lock().unwrap();
    jagex_login.code.clone()
}

#[tauri::command]
fn get_state(jlogin: State<'_, Mutex<JagexLogin>>) -> Option<String> {
    let jagex_login = jlogin.lock().unwrap();
    jagex_login.state.clone()
}

#[tauri::command]
fn set_executable_path(paths: State<'_, Mutex<ExecutablePaths>>, exe: String, path: String) {
    let mut paths = paths.lock().unwrap();
    match exe.as_str() {
        "simba1400" => paths.simba1400 = PathBuf::from(path),
        "simba2000" => paths.simba2000 = PathBuf::from(path),
        "legacy"    => paths.legacy = PathBuf::from(path),
        "runelite"  => paths.runelite = PathBuf::from(path),
        "osclient"  => paths.osclient = PathBuf::from(path),
        _ => {},
    }
}

#[tauri::command]
fn get_executable_path(paths: State<'_, Mutex<ExecutablePaths>>, exe: String) -> String {
    let paths = paths.lock().unwrap();
    match exe.as_str() {
      "simba1400" => paths.simba1400.to_str().unwrap().to_string(),
      "simba2000" => paths.simba2000.to_str().unwrap().to_string(),
      "legacy"    => paths.legacy.to_str().unwrap().to_string(),
      "runelite"  => paths.runelite.to_str().unwrap().to_string(),
      "osclient"  => paths.osclient.to_str().unwrap().to_string(),
      _ => paths.simba1400.to_str().unwrap().to_string(),
  }
}

#[tauri::command]
async fn run_executable(paths: State<'_, Mutex<ExecutablePaths>>, exe: String, args: Vec<String>) -> Result<String, String> {
  let paths = paths.lock().unwrap();
  let path: PathBuf = match exe.as_str() {
      "simba1400" => paths.simba1400.clone(),
      "simba2000" => paths.simba2000.clone(),
      "legacy"    => paths.legacy.clone(),
      "runelite"  => paths.runelite.clone(),
      "osclient"  => paths.osclient.clone(),
      _ => paths.simba1400.clone(),
  };

  let output = Command::new(path).args(args).output().map_err(|err| err.to_string())?; // Convert errors to string if it fails

  //Check if the program executed successfully
  if output.status.success() {
      let stdout = String::from_utf8_lossy(&output.stdout).to_string();
      Ok(stdout)
  } else {
      let stderr = String::from_utf8_lossy(&output.stderr).to_string();
      Err(stderr)
  }
}

fn main() {
  tauri::Builder::default()
      .plugin(tauri_plugin_dialog::init())
      .setup(|app| {

       let program_files_str = env::var("PROGRAMFILES(X86)").unwrap_or_else(|_| {
            app.path().app_local_data_dir().expect("Local Data Dir doesn't exist on this system").to_string_lossy().into_owned()
        });

        let program_files: PathBuf = PathBuf::from(program_files_str);

        app.manage(Mutex::new(JagexLogin::default()));
        app.manage(Mutex::new(ExecutablePaths {
            simba1400: app.path().app_local_data_dir()?.join(PathBuf::from("Simba/1400/Simba64.exe")),
            simba2000: app.path().app_local_data_dir()?.join(PathBuf::from("Simba/2000/Simba64.exe")),
            legacy: app.path().home_dir()?.join(PathBuf::from("jagexcache/jagexlauncher/bin/jagexappletviewer.jar")),
            runelite: app.path().local_data_dir()?.join(PathBuf::from("RuneLite/RuneLite.exe")),
            osclient: program_files.join(PathBuf::from("Jagex Launcher/Games/Old School RuneScape/Client/osclient.exe"))
          }));
          Ok(())
      })
      .invoke_handler(tauri::generate_handler![
          jagex_login,
          get_code,
          get_state,
          set_executable_path,
          get_executable_path,
          run_executable
      ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
