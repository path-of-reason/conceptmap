use std::fs;
use std::path::Path;

// 프론트엔드로 보낼 디렉토리 항목의 구조체 정의
#[derive(serde::Serialize, Debug)] // Added Debug
pub struct DirEntry {
    pub name: String,
    pub is_dir: bool,
    pub path: String,                    // 전체 경로
    pub children: Option<Vec<DirEntry>>, // Added for recursion
}

#[tauri::command]
pub fn read_dir_recursive(path_str: String) -> Result<Vec<DirEntry>, String> {
    let path = Path::new(&path_str);
    if !path.exists() {
        return Err(format!("Path not found: {}", path.display()));
    }
    if !path.is_dir() {
        return Err(format!("Path is not a directory: {}", path.display()));
    }

    let mut entries_vec = Vec::new();

    for entry_result in fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry_result.map_err(|e| e.to_string())?;
        let file_path = entry.path();
        // Use file_name() and convert OsStr to String, providing a default if conversion fails
        let file_name = file_path
            .file_name()
            .unwrap_or_default() // Get OsStr, or default if None (e.g. for "." or "..")
            .to_string_lossy() // Convert OsStr to Cow<str>, replacing invalid UTF-8 sequences
            .into_owned(); // Convert Cow<str> to String

        let entry_path_str = file_path.to_string_lossy().into_owned();
        let is_dir = file_path.is_dir();

        let children = if is_dir {
            // Recursive call
            // Clone entry_path_str for recursive call if it's still needed by current scope,
            // otherwise, it can be moved. Here, cloning is safer.
            Some(read_dir_recursive(entry_path_str.clone())?)
        } else {
            None
        };

        entries_vec.push(DirEntry {
            name: file_name,
            is_dir,
            path: entry_path_str,
            children,
        });
    }

    // Sort entries: directories first, then by name (case-insensitive)
    entries_vec.sort_by(|a, b| {
        if a.is_dir && !b.is_dir {
            std::cmp::Ordering::Less
        } else if !a.is_dir && b.is_dir {
            std::cmp::Ordering::Greater
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });

    Ok(entries_vec)
}

// 디렉토리 내용을 읽고 구조화된 목록을 반환하는 Command (Original non-recursive version)
#[derive(serde::Serialize)]
pub struct OldDirEntry {
    pub name: String,
    pub is_dir: bool,
    pub path: String,
}

#[tauri::command]
pub fn read_directory(path: &str) -> Result<Vec<OldDirEntry>, String> {
    let path_obj = Path::new(path); // Renamed to avoid conflict with path variable in outer scope if this was nested

    if !path_obj.exists() {
        return Err(format!("Directory not found: {}", path_obj.display()));
    }
    if !path_obj.is_dir() {
        return Err(format!("Path is not a directory: {}", path_obj.display()));
    }

    fs::read_dir(path_obj)
        .map_err(|e| e.to_string())
        .map(|entries| {
            let mut collected_entries: Vec<OldDirEntry> =
                entries // Ensure type annotation
                    .filter_map(|entry_result| {
                        let entry = match entry_result {
                            Ok(entry) => entry,
                            Err(e) => {
                                eprintln!("Error reading directory entry: {}", e);
                                return None;
                            }
                        };

                        let file_name = match entry.file_name().into_string() {
                            Ok(name) => name,
                            Err(_) => {
                                eprintln!("Invalid file name for entry in {}", path_obj.display());
                                return None;
                            }
                        };

                        let path_buf = entry.path();
                        let path_string = match path_buf.to_str() {
                            Some(s) => s.to_string(),
                            None => {
                                eprintln!(
                                    "Invalid path string for entry in {}",
                                    path_obj.display()
                                );
                                return None;
                            }
                        };

                        let is_dir = match entry.file_type() {
                            Ok(file_type) => file_type.is_dir(),
                            Err(e) => {
                                eprintln!("Error getting file type for {}: {}", path_string, e);
                                return None;
                            }
                        };

                        Some(OldDirEntry {
                            // Use renamed struct
                            name: file_name,
                            is_dir,
                            path: path_string,
                        })
                    })
                    .collect();

            collected_entries.sort_by(|a, b| {
                // Corrected sorting logic
                if a.is_dir && !b.is_dir {
                    std::cmp::Ordering::Less
                } else if !a.is_dir && b.is_dir {
                    std::cmp::Ordering::Greater
                } else {
                    a.name.to_lowercase().cmp(&b.name.to_lowercase())
                }
            });
            collected_entries
        })
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 파일 내용을 읽는 Command
#[tauri::command]
pub fn read_file(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

// 파일에 내용을 쓰는 Command
#[tauri::command]
pub fn write_file(path: &str, contents: &str) -> Result<(), String> {
    fs::write(path, contents).map_err(|e| e.to_string())
}
