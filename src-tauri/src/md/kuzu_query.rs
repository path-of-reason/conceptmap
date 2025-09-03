use kuzu::{Connection, Database, SystemConfig};

#[tauri::command]
pub fn kuzu_test() -> Result<Vec<String>, String> {
    let db = Database::new("", SystemConfig::default()).map_err(|e| e.to_string())?;
    let conn = Connection::new(&db).map_err(|e| e.to_string())?;

    conn.query("CREATE NODE TABLE User(name STRING PRIMARY KEY, age INT64)")
        .map_err(|e| e.to_string())?;
    conn.query("CREATE NODE TABLE City(name STRING PRIMARY KEY, population INT64)")
        .map_err(|e| e.to_string())?;
    conn.query("CREATE REL TABLE Follows(FROM User TO User, since INT64)")
        .map_err(|e| e.to_string())?;
    conn.query("CREATE REL TABLE LivesIn(FROM User TO City)")
        .map_err(|e| e.to_string())?;

    // Load the data
    conn.query("COPY User FROM './data/user.csv'")
        .map_err(|e| e.to_string())?;
    conn.query("COPY City FROM './data/city.csv'")
        .map_err(|e| e.to_string())?;
    conn.query("COPY Follows FROM './data/follows.csv'")
        .map_err(|e| e.to_string())?;
    conn.query("COPY LivesIn FROM './data/lives-in.csv'")
        .map_err(|e| e.to_string())?;

    let query_result = conn
        .query("MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name;")
        .map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    // Collect the rows into a Vec<String>
    for row in query_result {
        results.push(format!("{}, {}, {}", row[0], row[1], row[2]));
    }
    Ok(results)
}
