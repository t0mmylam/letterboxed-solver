import { useState, useEffect, useRef, useCallback } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type TrieNode = {
    isEndOfWord: boolean;
    children: { [key: string]: TrieNode };
};

class Trie {
    root: TrieNode;

    constructor() {
        this.root = this.createNode();
    }

    createNode(): TrieNode {
        return { isEndOfWord: false, children: {} };
    }

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

    clear(): void {
        this.root = this.createNode();
    }
}

const usesAllLetters = (
    words: string[],
    validLetters: Set<string>
): boolean => {
    const usedLetters = new Set(words.join("").split(""));
    // console.log(usedLetters);
    return [...validLetters].every((letter) => usedLetters.has(letter));
};

const findValidSolutions = (
    trie: Trie,
    letters: string[][],
    validLetters: Set<string>
): string[][] => {
    const results: string[][] = [];
    const path: string[] = [];

    const splitAfterPrefix = (word: string, prefix: string): string => {
        if (word.startsWith(prefix)) {
            return word.slice(prefix.length - 1);
        }
        return word;
    };

    const dfs = (
        node: TrieNode,
        lastSide: number,
        usedInCurrentWord: Set<string>,
        startNewWord: boolean,
        prevWords: string[] = []
    ) => {
        if (node.isEndOfWord && path.length >= 3) {
            const currentWord = path.join("");

            if (prevWords.length === 0) {
                if (usesAllLetters([currentWord], validLetters)) {
                    results.push([currentWord]);
                }

                const lastLetter = currentWord[currentWord.length - 1];
                if (trie.root.children[lastLetter]) {
                    dfs(
                        trie.root.children[lastLetter],
                        -1,
                        new Set([lastLetter]),
                        false,
                        [currentWord]
                    );
                }
            } else if (prevWords.length === 1) {
                const firstWord = prevWords[0];
                const secondWord = currentWord;
                const adjustedSecondWord = splitAfterPrefix(
                    secondWord,
                    firstWord
                );

                if (adjustedSecondWord.length >= 3) {
                    const solution = [firstWord, adjustedSecondWord];
                    if (usesAllLetters(solution, validLetters)) {
                        results.push(solution);
                    }
                }
            }
        }

        for (const [letter, nextNode] of Object.entries(node.children)) {
            if (!validLetters.has(letter)) continue;

            const currentSide = letters.findIndex((side) =>
                side.includes(letter)
            );
            if (currentSide === -1) continue;
            if (!startNewWord && currentSide === lastSide) continue;

            path.push(letter);
            usedInCurrentWord.add(letter);
            dfs(nextNode, currentSide, usedInCurrentWord, false, prevWords);
            usedInCurrentWord.delete(letter);
            path.pop();
        }
    };

    dfs(trie.root, -1, new Set(), true);

    return results.sort((a, b) => {
        const totalLengthA = a.join("").length;
        const totalLengthB = b.join("").length;
        if (totalLengthA !== totalLengthB) {
            return totalLengthA - totalLengthB;
        }
        return (
            Math.abs(a[0].length - a[1]?.length || 0) -
            Math.abs(b[0].length - b[1]?.length || 0)
        );
    });
};

export const useSolver = (
    letters: string[][]
): [string[][], (customDictionary?: string[]) => void, boolean] => {  // Added loading state to return
    const [answers, setAnswers] = useState<string[][]>([]);
    const [isDictionaryLoading, setIsDictionaryLoading] = useState(true);
    const trieRef = useRef<Trie>(new Trie());
    const defaultDictRef = useRef<string[]>([]);

    // Load default dictionary on mount
    useEffect(() => {
        const loadDictionary = async () => {
            setIsDictionaryLoading(true);
            try {
                const response = await fetch("./dictionary.txt");
                const text = await response.text();
                const words = text
                    .split(/\s+/)
                    .filter((word) => word.length >= 3)
                    .map((word) => word.toUpperCase());
                defaultDictRef.current = words;

                // Initialize trie with default dictionary
                const newTrie = new Trie();
                for (const word of words) {
                    newTrie.insert(word);
                }
                trieRef.current = newTrie;
            } catch (error) {
                console.error("Error loading dictionary:", error);
            } finally {
                setIsDictionaryLoading(false);
            }
        };

        loadDictionary();
    }, []);

    const solve = useCallback(
        async (customDictionary?: string[]) => {  // Made solve async
            if (isDictionaryLoading) {
                console.log("Dictionary still loading...");
                return;
            }

            const validLetters = new Set<string>();
            letters.forEach((group) => {
                group.forEach((letter) => {
                    if (letter) validLetters.add(letter.toUpperCase());
                });
            });

            if (validLetters.size === 0) return;

            // Reset trie and create merged dictionary
            trieRef.current.clear();

            // Add default dictionary words
            for (const word of defaultDictRef.current) {
                trieRef.current.insert(word);
            }

            // Add custom dictionary words if provided
            if (customDictionary) {
                for (const word of customDictionary) {
                    trieRef.current.insert(word.toUpperCase());
                }
            }

            const solutions = findValidSolutions(
                trieRef.current,
                letters,
                validLetters
            );
            setAnswers(solutions);
        },
        [letters, isDictionaryLoading]
    );

    return [answers, solve, isDictionaryLoading];
};