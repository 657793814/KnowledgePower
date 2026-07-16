use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::Manager;

struct BackendProcess(Mutex<Option<Child>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .setup(|app| {
            app.handle().plugin(
                tauri_plugin_log::Builder::default()
                    .level(log::LevelFilter::Info)
                    .build(),
            )?;

            // 读取环境变量决定后端类型: "node" 或 "java"（默认 node）
            let backend = std::env::var("BACKEND").unwrap_or_else(|_| "node".to_string());
            log::info!("后端引擎: {}", backend);

            let child = match backend.as_str() {
                "java" => {
                    // 原 Java JAR 后端
                    let jar_path = app
                        .path()
                        .resource_dir()
                        .map(|p| p.join("binaries").join("knowledgepower-backend.jar"))
                        .unwrap_or_default();

                    if jar_path.exists() {
                        log::info!("启动 Java 后端: {:?}", jar_path);
                        match Command::new("java").arg("-jar").arg(&jar_path).spawn() {
                            Ok(child) => {
                                log::info!("Java 后端已启动, PID: {}", child.id());
                                Some(child)
                            }
                            Err(e) => {
                                log::warn!("启动 Java 后端失败: {}", e);
                                None
                            }
                        }
                    } else {
                        log::warn!("未找到 JAR: {:?}，请确保 http://localhost:8080 已运行", jar_path);
                        None
                    }
                }
                _ => {
                    // 默认 Node.js 后端
                    let backend_dir = app
                        .path()
                        .resource_dir()
                        .map(|p| p.join("backend"))
                        .unwrap_or_default();

                    let server_js = backend_dir.join("server.js");
                    let db_path = backend_dir.join("knowledgepower.db");

                    if server_js.exists() {
                        log::info!("启动 Node.js 后端: {:?}", server_js);
                        log::info!("数据库路径: {:?}", db_path);
                        let db_url = format!("file:{}", db_path.display());
                        // Finder 启动时 PATH 极简，显式设置确保找到 node
                        let node_path = std::env::var("PATH").unwrap_or_else(|_| String::new());
                        let extended_path = format!("/usr/local/bin:{}:{}/.nvm/versions/node/v20.19.4/bin", node_path, std::env::var("HOME").unwrap_or_default());
                        match Command::new("/usr/local/bin/node")
                            .arg(&server_js)
                            .current_dir(&backend_dir)
                            .env("DATABASE_URL", &db_url)
                            .env("PATH", &extended_path)
                            .spawn()
                        {
                            Ok(child) => {
                                log::info!("Node 后端已启动, PID: {}", child.id());
                                Some(child)
                            }
                            Err(e) => {
                                log::warn!("启动 Node 后端失败: {}", e);
                                None
                            }
                        }
                    } else {
                        log::warn!("未找到 server.js: {:?}，请确保 http://localhost:3001 已运行", server_js);
                        None
                    }
                }
            };

            app.manage(BackendProcess(Mutex::new(child)));
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    // 退出时关闭后端
    app.run(|app_handle, event| {
        if let tauri::RunEvent::ExitRequested { .. } = event {
            if let Some(state) = app_handle.try_state::<BackendProcess>() {
                if let Ok(mut guard) = state.0.lock() {
                    if let Some(ref mut child) = *guard {
                        log::info!("关闭后端服务...");
                        let _ = child.kill();
                        let _ = child.wait();
                        log::info!("后端服务已关闭");
                    }
                }
            }
        }
    });
}
