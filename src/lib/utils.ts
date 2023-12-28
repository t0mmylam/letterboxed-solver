import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect, useRef, useCallback } from "react";

// `cn` function that merges class names using `clsx` and `twMerge` for conditional and combined class names.
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Definition of a Trie node structure.
type TrieNode = {
    isEndOfWord: boolean;
    children: { [key: string]: TrieNode };
};

// Trie class for efficient word storage and retrieval.
class Trie {
    root: TrieNode;

    constructor() {
        this.root = this.createNode();
    }

    // Helper function to create a new Trie node.
    createNode(): TrieNode {
        return { isEndOfWord: false, children: {} };
    }

    // Inserts a word into the Trie.
    insert(word: string): void {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = this.createNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    // Searches for a word in the Trie and returns if it exists as a complete word.
    search(word: string): boolean {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord;
    }
}

// Finds all valid words that can be formed by visiting each group once.
const findOneWords = (trie: Trie, letters: string[][]): string[][] => {
    const results: string[][] = [];
    const path: string[] = [];

    // Flatten the groups of letters and map each letter to its group index.
    const flatLetters = letters.flat();
    const groups = flatLetters.map((letter) => {
        return letters.findIndex((group) => group.includes(letter));
    });

    // Depth-first search to find words using each letter once.
    const dfs = (
        node: TrieNode,
        lastGroup: number,
        used: Map<string, number>
    ) => {
        // If a complete word is formed, check if all letters are used.
        if (node.isEndOfWord) {
            let count = 0;
            for (const pair of used) {
                if (pair[1] >= 1) {
                    count += 1;
                }
            }
            // Add to results if all letters are used once.
            if (count === flatLetters.length) {
                results.push([path.join("")]);
            }
        }

        // Explore the next letters, ensuring we don't revisit the same group.
        for (let i = 0; i < flatLetters.length; i++) {
            const letter = flatLetters[i];
            const group = groups[i];

            if (node.children[letter] && lastGroup !== group) {
                // Increment usage count and continue the search.
                const currentCount = used.get(letter) || 0;
                used.set(letter, currentCount + 1);
                path.push(letter);
                dfs(node.children[letter], group, used);
                // Backtrack
                path.pop();
                used.set(letter, currentCount);
            }
        }
    };

    const used: Map<string, number> = new Map<string, number>();
    dfs(trie.root, -1, used);
    return results;
};

// Finds all pairs of valid words that cover all letters without reusing any letter.
const findTwoWords = (trie: Trie, letters: string[][]): string[][] => {
    // This function is similar to `findOneWords` but finds pairs of words
    // and thus involves two levels of DFS calls.

    const results: string[][] = [];
    const path1: string[] = [];
    let path2: string[] = [];
    const flatLetters = letters.flat();
    const groups = flatLetters.map((letter) => {
        return letters.findIndex((group) => group.includes(letter));
    });

    const dfsTwoWords = (
        node: TrieNode,
        lastGroup: number,
        used2: Map<string, number>,
        firstWord: string
    ) => {
        if (node.isEndOfWord) {
            let count = 0;
            for (const pair of used2) {
                if (pair[1] >= 1) {
                    count += 1;
                }
            }
            if (count === flatLetters.length) {
                results.push([firstWord, path2.join("")]);
            }
        }

        for (let i = 0; i < flatLetters.length; i++) {
            const letter = flatLetters[i];
            const group = groups[i];

            if (node.children[letter] && lastGroup !== group) {
                const currentCount = used2.get(letter) || 0;
                used2.set(letter, currentCount + 1);
                path2.push(letter);
                dfsTwoWords(node.children[letter], group, used2, firstWord);
                path2.pop();
                used2.set(letter, currentCount);
            }
        }
    };

    const dfsOneWord = (
        node: TrieNode,
        lastGroup: number,
        used1: Map<string, number>
    ) => {
        if (node.isEndOfWord) {
            const firstWord = path1.join("");
            const firstLetter = firstWord[firstWord.length - 1];
            if (trie.root.children[firstLetter]) {
                path2 = [firstLetter];
                const used2 = new Map<string, number>([...used1]);
                const currentCount = used2.get(firstLetter) || 0;
                used2.set(firstLetter, currentCount + 1);
                dfsTwoWords(
                    trie.root.children[firstLetter],
                    lastGroup,
                    used2,
                    firstWord
                );
            }
        }

        for (let i = 0; i < flatLetters.length; i++) {
            const letter = flatLetters[i];
            const group = groups[i];

            if (node.children[letter] && lastGroup !== group) {
                const currentCount = used1.get(letter) || 0;
                used1.set(letter, currentCount + 1);
                path1.push(letter);
                dfsOneWord(node.children[letter], group, used1);
                path1.pop();
                used1.set(letter, currentCount);
            }
        }
    };
    const used = new Map<string, number>();
    dfsOneWord(trie.root, -1, used);
    return results;
};

// Custom hook to use the solver in a React component.
export const useSolver = (letters: string[][]): [string[][], () => void] => {
    // This React hook encapsulates the logic for initializing the Trie,
    // loading the dictionary, and computing the answers.

    const [answers, setAnswers] = useState<string[][]>([]);
    const trieRef = useRef<Trie | null>(null);

    const computeAnswers = useCallback(() => {
        if (trieRef.current) {
            const newAnswers = findOneWords(trieRef.current, letters).concat(
                findTwoWords(trieRef.current, letters)
            );
            setAnswers(newAnswers);
        }
    }, [letters]);

    useEffect(() => {
        const loadDictionary = async () => {
            try {
                const response = await fetch("./dictionary.txt");
                const text = await response.text();
                const words = text.split(/\s+/);
                const newTrie = new Trie();
                for (const word of words) {
                    newTrie.insert(word);
                }
                trieRef.current = newTrie;
            } catch (error) {
                console.error("Error fetching words:", error);
            }
        };

        loadDictionary();
    }, []);

    const solve = () => {
        if (trieRef.current) {
            computeAnswers();
        }
    };

    return [answers, solve];
};
