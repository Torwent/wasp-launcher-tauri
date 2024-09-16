#[tauri::command]
fn execute_program(program: String, args: Vec<String>) -> Result<String, String> {
  let output = Command::new(program)
      .args(args)
      .output()
      .map_err(|err| err.to_string())?;  // Convert errors to string if it fails

  // Check if the program executed successfully
  if output.status.success() {
      let stdout = String::from_utf8_lossy(&output.stdout).to_string();
      Ok(stdout)
  } else {
      let stderr = String::from_utf8_lossy(&output.stderr).to_string();
      Err(stderr)
  }
}