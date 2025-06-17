# Chapter 5: Code Organization and External Integration

This chapter explores how to structure your Jac programs across multiple files and modules, and how to interact with external systems through file operations. You'll learn to build well-organized, maintainable codebases that can read configuration files, process data, and integrate with external systems.

## Module System and Imports

Jac provides a powerful module system that allows you to organize your code across multiple files and create reusable components.

### Basic Import Statements

**Code Example**
!!! example "Import Examples"
    === "Jac"
        <div class="code-block">
        ```jac
        --8<-- "jac/examples/reference/import_include_statements.jac"
        ```
        </div>
    === "Python"
        ```python
        --8<-- "jac/examples/reference/import_include_statements.py"
        ```

**Description**

--8<-- "jac/examples/reference/import_include_statements.md"

### Implementation Files and Separation

Jac supports implementation separation through `.impl.jac` files, allowing you to separate interface definitions from their implementations.

**Code Example**
!!! example "Implementation Separation"
    === "Jac"
        <div class="code-block">
        ```jac
        --8<-- "jac/examples/reference/implementations.jac"
        ```
        </div>
    === "Python"
        ```python
        --8<-- "jac/examples/reference/implementations.py"
        ```


**Description**

--8<-- "jac/examples/reference/implementations.md"

### Multi-Module Calculator Example

Let's build a practical example that demonstrates module organization:

**Code Example**
!!! example "Multi-Module Calculator"
    === "calculator/math_ops.jac"
        <div class="code-block">
        ```jac
        # Basic mathematical operations module
        can add(a: float, b: float) -> float {
            return a + b;
        }

        can subtract(a: float, b: float) -> float {
            return a - b;
        }

        can multiply(a: float, b: float) -> float {
            return a * b;
        }

        can divide(a: float, b: float) -> float {
            if b == 0 {
                raise ValueError("Division by zero");
            }
            return a / b;
        }
        ```
        </div>

    === "calculator/advanced_ops.jac"
        <div class="code-block">
        ```jac
        # Advanced mathematical operations
        import:py math;

        can power(base: float, exponent: float) -> float {
            return math.pow(base, exponent);
        }

        can square_root(n: float) -> float {
            if n < 0 {
                raise ValueError("Cannot calculate square root of negative number");
            }
            return math.sqrt(n);
        }

        can factorial(n: int) -> int {
            if n < 0 {
                raise ValueError("Factorial not defined for negative numbers");
            }
            if n <= 1 {
                return 1;
            }
            return n * factorial(n - 1);
        }
        ```
        </div>

    === "calculator/main.jac"
        <div class="code-block">

        ```jac
        # Main calculator application
        include:jac calculator.math_ops;
        include:jac calculator.advanced_ops;

        can run_calculator() {
            print("=== Multi-Module Calculator ===");

            # Basic operations
            result1 = add(10, 5);
            print(f"10 + 5 = {result1}");

            result2 = multiply(4, 3);
            print(f"4 * 3 = {result2}");

            # Advanced operations
            result3 = power(2, 8);
            print(f"2^8 = {result3}");

            result4 = square_root(16);
            print(f"√16 = {result4}");

            result5 = factorial(5);
            print(f"5! = {result5}");
        }

        with entry {
            run_calculator();
        }
        ```
        </div>

## File Operations and External Systems

Working with external files is essential for reading configuration, processing data, and integrating with other systems.

### File I/O Operations

**Code Example**
!!! example "File Operations"
    === "Jac"
        <div class="code-block">
        ```jac
        import:py os;
        import:py json;

        # Reading text files
        can read_text_file(filepath: str) -> str {
            try {
                with open(filepath, 'r') as file {
                    return file.read();
                }
            } except FileNotFoundError {
                print(f"File {filepath} not found");
                return "";
            }
        }

        # Writing text files
        can write_text_file(filepath: str, content: str) -> bool {
            try {
                with open(filepath, 'w') as file {
                    file.write(content);
                return True;
            } except Exception as e {
                print(f"Error writing file: {e}");
                return False;
            }
        }

        # Reading JSON files
        can read_json_file(filepath: str) -> dict {
            try {
                with open(filepath, 'r') as file {
                    return json.load(file);
            } except FileNotFoundError {
                print(f"JSON file {filepath} not found");
                return {};
            } except json.JSONDecodeError {
                print(f"Invalid JSON in file {filepath}");
                return {};
            }
        }

        # Writing JSON files
        can write_json_file(filepath: str, data: dict) -> bool {
            try {
                with open(filepath, 'w') as file {
                    json.dump(data, file, indent=2);
                return True;
            } except Exception as e {
                print(f"Error writing JSON file: {e}");
                return False;
            }
        }
        ```
        </div>

### Configuration File Reader Example

**Code Example**
!!! example "Configuration Management System"
    === "config/config_reader.jac"
        <div class="code-block">
        ```jac
        # Configuration file reader module
        import:py json;
        import:py os;

        obj ConfigManager {
            has config_data: dict = {};
            has config_file: str;

            can init(config_file: str) {
                self.config_file = config_file;
                self.load_config();
            }

            can load_config() {
                if os.path.exists(self.config_file) {
                    try {
                        with open(self.config_file, 'r') as file {
                            self.config_data = json.load(file);
                        print(f"Configuration loaded from {self.config_file}");
                    } except json.JSONDecodeError {
                        print(f"Error: Invalid JSON in {self.config_file}");
                        self.config_data = {};
                    } except Exception as e {
                        print(f"Error loading config: {e}");
                        self.config_data = {};
                } else {
                    print(f"Config file {self.config_file} not found, using defaults");
                    self.create_default_config();
                }
            }

            can create_default_config() {
                self.config_data = {
                    "database": {
                        "host": "localhost",
                        "port": 5432,
                        "name": "myapp"
                    },
                    "logging": {
                        "level": "INFO",
                        "file": "app.log"
                    },
                    "features": {
                        "debug_mode": False,
                        "cache_enabled": True
                    }
                };
                self.save_config();
            }

            can save_config() {
                try {
                    with open(self.config_file, 'w') as file {
                        json.dump(self.config_data, file, indent=2);
                    print(f"Configuration saved to {self.config_file}");
                } except Exception as e {
                    print(f"Error saving config: {e}");
                }
            }

            can get_value(key_path: str, default_value: any = None) -> any {
                keys = key_path.split('.');
                current = self.config_data;

                for key in keys {
                    if isinstance(current, dict) and key in current {
                        current = current[key];
                    } else {
                        return default_value;
                    }
                }
                return current;
            }

            can set_value(key_path: str, value: any) {
                keys = key_path.split('.');
                current = self.config_data;

                for key in keys[:-1] {
                    if key not in current {
                        current[key] = {};
                    }
                    current = current[key];
                }

                current[keys[-1]] = value;
                self.save_config();
            }

            can get_database_config() -> dict {
                return self.get_value("database", {});
            }

            can get_logging_config() -> dict {
                return self.get_value("logging", {});
            }

            can is_debug_enabled() -> bool {
                return self.get_value("features.debug_mode", False);
            }
        }
        ```
        </div>

    === "config/app.jac"
        <div class="code-block">
        ```jac
        # Main application using configuration
        include:jac config.config_reader;
        import:py logging;

        obj Application {
            has config_manager: ConfigManager;
            has logger: any;

            can init(config_file: str = "app_config.json") {
                self.config_manager = ConfigManager(config_file);
                self.setup_logging();
            }

            can setup_logging() {
                log_config = self.config_manager.get_logging_config();
                log_level = log_config.get("level", "INFO");
                log_file = log_config.get("file", "app.log");

                logging.basicConfig(
                    level=getattr(logging, log_level),
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler(log_file),
                        logging.StreamHandler()
                    ]
                );
                self.logger = logging.getLogger(__name__);
                self.logger.info("Application logging configured");
            }

            can start() {
                self.logger.info("Starting application...");

                # Get database configuration
                db_config = self.config_manager.get_database_config();
                self.logger.info(f"Database: {db_config.get('host')}:{db_config.get('port')}");

                # Check debug mode
                if self.config_manager.is_debug_enabled() {
                    self.logger.debug("Debug mode is enabled");
                    self.run_debug_mode();
                } else {
                    self.run_normal_mode();
                }

            can run_debug_mode() {
                self.logger.debug("Running in debug mode");
                # Debug-specific functionality
                print("=== DEBUG MODE ===");
                print(f"Full config: {self.config_manager.config_data}");
            }

            can run_normal_mode() {
                self.logger.info("Running in normal mode");
                # Normal application functionality
                print("Application running normally");
            }

            can update_config(key: str, value: any) {
                self.config_manager.set_value(key, value);
                self.logger.info(f"Configuration updated: {key} = {value}");
            }
        }

        with entry {
            app = Application();
            app.start();

            # Example of runtime configuration update
            app.update_config("features.debug_mode", True);
            app.start();  # Restart with new config
        }
        ```
        </div>

### Shared Utilities Library Example

**Code Example**
!!! example "Shared Utilities Library"
    === "utils/file_utils.jac"
        <div class="code-block">
        ```jac
        # File utility functions
        import:py os;
        import:py shutil;
        from datetime import datetime;

        can ensure_directory(directory_path: str) -> bool {
            """Ensure a directory exists, create if it doesn't."""
            try {
                os.makedirs(directory_path, exist_ok=True);
                return True;
            } except Exception as e {
                print(f"Error creating directory {directory_path}: {e}");
                return False;
            }
        }

        can copy_file(source: str, destination: str) -> bool {
            """Copy a file from source to destination."""
            try {
                ensure_directory(os.path.dirname(destination));
                shutil.copy2(source, destination);
                return True;
            } except Exception as e {
                print(f"Error copying file: {e}");
                return False;
            }
        }

        can get_file_info(filepath: str) -> dict {
            """Get detailed information about a file."""
            try {
                stat = os.stat(filepath);
                return {
                    "size": stat.st_size,
                    "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    "exists": True
                };
            } except FileNotFoundError {
                return {"exists": False};
            } except Exception as e {
                return {"exists": False, "error": str(e)};
            }
        }

        can list_files(directory: str, extension: str = None) -> list {
            """List files in a directory, optionally filtered by extension."""
            try {
                files = [];
                for item in os.listdir(directory) {
                    if os.path.isfile(os.path.join(directory, item)) {
                        if extension is None or item.endswith(extension) {
                            files.append(item);
                        }
                    }
                }
                return files;
            } except Exception as e {
                print(f"Error listing files: {e}");
                return [];
            }
        }
        ```
        </div>

    === "utils/data_utils.jac"
        <div class="code-block">
        ```jac
        # Data processing utilities
        import:py json;
        import:py csv;

        can process_csv_file(filepath: str) -> list {
            """Process a CSV file and return data as list of dictionaries."""
            try {
                data = [];
                with open(filepath, 'r', newline='') as csvfile {
                    reader = csv.DictReader(csvfile);
                    for row in reader {
                        data.append(dict(row));
                    }
                }
                return data;
            } except Exception as e {
                print(f"Error processing CSV file: {e}");
                return [];
            }
        }

        can write_csv_file(filepath: str, data: list, fieldnames: list) -> bool {
            """Write data to a CSV file."""
            try {
                with open(filepath, 'w', newline='') as csvfile {
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames);
                    writer.writeheader();
                    writer.writerows(data);
                }
                return True;
            } except Exception as e {
                print(f"Error writing CSV file: {e}");
                return False;
            }
        }

        can merge_data_files(file_paths: list) -> dict {
            """Merge multiple JSON data files into one dataset."""
            merged_data = {};

            for file_path in file_paths {
                try {
                    with open(file_path, 'r') as file {
                        data = json.load(file);
                        merged_data.update(data);
                    }
                } except Exception as e {
                    print(f"Error reading {file_path}: {e}");
                }
            }

            return merged_data;
        }
        ```
        </div>

    === "example_usage.jac"
        <div class="code-block">
        ```jac
        # Example usage of shared utilities
        include:jac utils.file_utils;
        include:jac utils.data_utils;

        with entry {
            # File operations example
            print("=== File Operations ===");

            # Create a test directory
            test_dir = "test_data";
            if ensure_directory(test_dir) {
                print(f"Directory {test_dir} created successfully");
            }

            # Create sample data file
            sample_data = {
                "users": [
                    {"id": 1, "name": "Alice", "email": "alice@example.com"},
                    {"id": 2, "name": "Bob", "email": "bob@example.com"}
                ]
            };

            data_file = f"{test_dir}/users.json";
            with open(data_file, 'w') as file {
                import:py json;
                json.dump(sample_data, file, indent=2);
            }

            # Get file information
            file_info = get_file_info(data_file);
            print(f"File info: {file_info}");

            # List files in directory
            files = list_files(test_dir, ".json");
            print(f"JSON files in {test_dir}: {files}");

            # Data processing example
            print("\n=== Data Processing ===");

            # Create sample CSV data
            csv_data = [
                {"name": "Alice", "age": "25", "city": "New York"},
                {"name": "Bob", "age": "30", "city": "San Francisco"},
                {"name": "Charlie", "age": "35", "city": "Chicago"}
            ];

            csv_file = f"{test_dir}/people.csv";
            if write_csv_file(csv_file, csv_data, ["name", "age", "city"]) {
                print(f"CSV file {csv_file} created successfully");

                # Read it back
                read_data = process_csv_file(csv_file);
                print(f"Read CSV data: {read_data}");
            }
        }
        ```
        </div>

## Best Practices

### Module Organization
- Group related functionality into logical modules
- Use descriptive module and file names
- Separate interface definitions from implementations when appropriate
- Keep modules focused on a single responsibility

### File Operations
- Always use proper error handling for file operations
- Use context managers (`with` statements) for file handling
- Validate file paths and handle missing files gracefully
- Consider file permissions and access rights

### Configuration Management
- Use structured configuration files (JSON, YAML)
- Provide sensible defaults
- Validate configuration values
- Support environment-specific configurations

This chapter has shown you how to build well-organized Jac applications that can scale across multiple modules and integrate with external systems through file operations. These patterns form the foundation for building robust, maintainable applications.
