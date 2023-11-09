from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

def write_unique_words_to_file(game_words, file_name):
    try:
        # Read existing words from the file if it exists
        existing_words = set()
        try:
            with open(file_name, 'r') as file:
                existing_words = set(word.strip() for word in file.readlines())
        except FileNotFoundError:
            print(f"{file_name} not found. A new file will be created.")
        except Exception as e:
            print(f"An error occurred while reading {file_name}: {e}")
            return

        # Combine existing words with new words from game_data
        new_words = set(game_words)
        combined_words = existing_words.union(new_words)

        # Write the combined words back to the file
        with open(file_name, 'w') as file:
            for word in sorted(combined_words):
                file.write(f"{word}\n")

        print(f"Words were successfully written to {file_name}")

    except Exception as e:
        print(f"An error occurred while writing to {file_name}: {e}")

# Set up Chrome options
chrome_options = Options()
chrome_options.add_experimental_option("detach", True)

# Initialize the WebDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# Navigate to the webpage
driver.get("https://www.nytimes.com/puzzles/letter-boxed")

# Give the page time to load and execute initial JavaScript
driver.implicitly_wait(10)

# Fetch the gameData from the console
game_data = driver.execute_script("return gameData;")

# Extract words from gameData and write to file
if "dictionary" in game_data:
    write_unique_words_to_file(game_data["dictionary"], "dictionary.txt")
else:
    print("The 'dictionary' key was not found in the game data.")

# Don't forget to quit the driver session
driver.quit()