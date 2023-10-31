def merge_text_files(file1, file2, output_file):
    try:
        with open(file1, 'r') as f:
            words1 = set(f.read().split())
    except FileNotFoundError:
        print(f"{file1} not found.")
        return
    except Exception as e:
        print(f"An error occurred while reading {file1}: {e}")
        return

    try:
        with open(file2, 'r') as f:
            words2 = set(f.read().split())
    except FileNotFoundError:
        print(f"{file2} not found.")
        return
    except Exception as e:
        print(f"An error occurred while reading {file2}: {e}")
        return

    merged_words = words1.union(words2)

    try:
        with open(output_file, 'w') as f:
            for word in sorted(merged_words):
                f.write(f"{word}\n")
    except Exception as e:
        print(f"An error occurred while writing to {output_file}: {e}")
        return

    print("Files were successfully merged and written to", output_file)

merge_text_files("dictionary.txt", "test.txt", "words.txt")