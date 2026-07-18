use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    Manager,
};

struct BackendProcess(Mutex<Option<Child>>);

// ==================== Health Check Commands (via curl) ====================

fn http_get_ok(url: &str) -> bool {
    Command::new("curl")
        .args(["-sf", "-m", "3", url])
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

/// 检查后端 API 是否健康
#[tauri::command]
fn check_backend_health() -> Result<String, String> {
    if http_get_ok("http://localhost:3001/health") {
        Ok("🟢 后端正常运行".to_string())
    } else {
        Ok("🔴 后端不可用".to_string())
    }
}

/// 检查 Milvus 是否健康
#[tauri::command]
fn check_milvus_health() -> Result<String, String> {
    if http_get_ok("http://localhost:9091/healthz") {
        Ok("🟢 Milvus 运行中".to_string())
    } else {
        Ok("🔴 Milvus 不可用".to_string())
    }
}

/// 检查 Ollama 是否健康
#[tauri::command]
fn check_ollama_health() -> Result<String, String> {
    if http_get_ok("http://localhost:11434/api/tags") {
        Ok("🟢 Ollama 运行中".to_string())
    } else {
        Ok("🔴 Ollama 不可用".to_string())
    }
}

/// 健康总览
#[tauri::command]
fn health_check_all() -> Result<serde_json::Value, String> {
    let backend = http_get_ok("http://localhost:3001/health");
    let milvus = http_get_ok("http://localhost:9091/healthz");
    let ollama = http_get_ok("http://localhost:11434/api/tags");
    Ok(serde_json::json!({
        "backend": backend,
        "milvus": milvus,
        "ollama": ollama,
        "all": backend && milvus && ollama,
    }))
}

/// 查找可用的 node 二进制路径（优先 nvm 管理的高版本）
fn find_node() -> String {
    // 优先查 nvm 管理的 node（用户可能通过 nvm 安装了高版本）
    if let Ok(home) = std::env::var("HOME") {
        let nvm_node = format!("{}/.nvm/versions/node/v25.9.0/bin/node", home);
        if std::path::Path::new(&nvm_node).exists() {
            return nvm_node;
        }
    }

    let candidates = [
        "/opt/homebrew/bin/node",
        "/usr/local/bin/node",
        "/usr/bin/node",
    ];

    // 先查 PATH 中的 node
    if let Ok(output) = Command::new("which").arg("node").output() {
        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() {
                return path;
            }
        }
    }

    // 查候选路径
    for p in &candidates {
        if std::path::Path::new(p).exists() {
            return p.to_string();
        }
    }

    // 兜底
    "/usr/local/bin/node".to_string()
}

// ==================== App Entry ====================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // 读取环境变量决定后端类型: "node" 或 "java"（默认 node）
            let backend = std::env::var("BACKEND").unwrap_or_else(|_| "node".to_string());
            log::info!("后端引擎: {}", backend);

            let child = match backend.as_str() {
                "java" => {
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
                        log::warn!(
                            "未找到 JAR: {:?}，请确保 http://localhost:8080 已运行",
                            jar_path
                        );
                        None
                    }
                }
                _ => {
                    let backend_dir = app
                        .path()
                        .resource_dir()
                        .map(|p| p.join("backend"))
                        .unwrap_or_default();

                    let server_js = backend_dir.join("server.js");

                    // 数据库放在用户数据目录（可读写），不是 Resources（只读）
                    let data_dir = app.path().app_data_dir().unwrap_or_else(|_| backend_dir.clone());
                    let _ = std::fs::create_dir_all(&data_dir);
                    let db_path = data_dir.join("knowledgepower.db");

                    // 首次启动时，从打包资源复制预置数据库到用户数据目录
                    if !db_path.exists() {
                        let bundled_db = backend_dir.join("prisma").join("knowledgepower.db");
                        if bundled_db.exists() {
                            match std::fs::copy(&bundled_db, &db_path) {
                                Ok(_) => log::info!("已从打包资源复制预置数据库到用户数据目录"),
                                Err(e) => log::warn!("复制预置数据库失败: {}，将创建空数据库", e),
                            }
                        } else {
                            log::info!("打包资源中无预置数据库，Prisma 首次启动时会创建空数据库");
                        }
                    } else {
                        log::info!("数据库文件已存在: {:?}", db_path);
                    }

                    if server_js.exists() {
                        log::info!("启动 Node.js 后端: {:?}", server_js);
                        log::info!("数据库路径: {:?}", db_path);

                        let db_url = format!("file:{}", db_path.display());
                        let node_binary = find_node();
                        let node_path = std::env::var("PATH").unwrap_or_else(|_| String::new());

                        // 配置文件也放到用户数据目录（可读写）
                        let config_dir = data_dir.join("config");
                        let _ = std::fs::create_dir_all(&config_dir);
                        let config_path = config_dir.join("ai-config.json");

                        match Command::new(&node_binary)
                            .arg(&server_js)
                            .current_dir(&backend_dir)
                            .env("DATABASE_URL", &db_url)
                            .env("ZD_CONFIG_PATH", config_path.to_str().unwrap_or_default())
                            .env("PATH", &node_path)
                            .spawn()
                        {
                            Ok(child) => {
                                log::info!("Node 后端已启动, PID: {} (node: {})", child.id(), node_binary);
                                Some(child)
                            }
                            Err(e) => {
                                log::warn!("启动 Node 后端失败: {} (node: {})", e, node_binary);
                                None
                            }
                        }
                    } else {
                        log::warn!(
                            "未找到 server.js: {:?}，打包时需先执行 scripts/build-node.sh",
                            server_js
                        );
                        None
                    }
                }
            };

            app.manage(BackendProcess(Mutex::new(child)));

            // 系统托盘
            let open_i = MenuItemBuilder::with_id("open", "打开主窗口").build(app)?;
            let health_i = MenuItemBuilder::with_id("health", "🔄 检查服务状态").build(app)?;
            let quit_i = MenuItemBuilder::with_id("quit", "退出").build(app)?;
            let tray_menu = MenuBuilder::new(app)
                .item(&open_i)
                .item(&health_i)
                .separator()
                .item(&quit_i)
                .build()?;

            let _tray = TrayIconBuilder::new()
                .tooltip("知识动力")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .on_menu_event(move |app_handle, event| {
                    match event.id.as_ref() {
                        "open" => {
                            if let Some(window) = app_handle.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "health" => {
                            // 发送系统通知
                            let _ = app_handle.try_state::<BackendProcess>();
                        }
                        "quit" => {
                            if let Some(state) = app_handle.try_state::<BackendProcess>() {
                                if let Ok(mut guard) = state.0.lock() {
                                    if let Some(ref mut child) = *guard {
                                        let _ = child.kill();
                                        let _ = child.wait();
                                    }
                                }
                            }
                            app_handle.exit(0);
                        }
                        _ => {}
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            check_backend_health,
            check_milvus_health,
            check_ollama_health,
            health_check_all,
        ])
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
