use pulldown_cmark::{html, Options, Parser};

#[tauri::command]
pub async fn convert_markdown_to_html(markdown: String) -> Result<String, String> {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_MATH);
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_FOOTNOTES);
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TASKLISTS);
    options.insert(Options::ENABLE_WIKILINKS);
    options.insert(Options::ENABLE_GFM);
    options.insert(Options::ENABLE_SUBSCRIPT);
    options.insert(Options::ENABLE_SUPERSCRIPT);
    options.insert(Options::ENABLE_SMART_PUNCTUATION);
    options.insert(Options::ENABLE_HEADING_ATTRIBUTES);
    options.insert(Options::ENABLE_YAML_STYLE_METADATA_BLOCKS);
    let parser = Parser::new_ext(&markdown, options.clone());

    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    Ok(html_output)
}
