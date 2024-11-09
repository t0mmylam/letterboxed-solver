import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect, useRef, useCallback } from "react";

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

    // Add method to clear and rebuild the trie
    rebuild(words: string[]): void {
        this.root = this.createNode();
        for (const word of words) {
            this.insert(word);
        }
    }
}

const usesAllLetters = (words: string[], validLetters: Set<string>): boolean => {
    const usedLetters = new Set(words.join('').split(''));
    return [...validLetters].every(letter => usedLetters.has(letter));
};

const findValidSolutions = (trie: Trie, letters: string[][], validLetters: Set<string>): string[][] => {
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
            const currentWord = path.join('');
            
            if (prevWords.length === 0) {
                if (usesAllLetters([currentWord], validLetters)) {
                    results.push([currentWord]);
                }
                
                const lastLetter = currentWord[currentWord.length - 1];
                if (trie.root.children[lastLetter]) {
                    dfs(trie.root.children[lastLetter], -1, new Set([lastLetter]), false, [currentWord]);
                }
            } else if (prevWords.length === 1) {
                const firstWord = prevWords[0];
                const secondWord = currentWord;
                const adjustedSecondWord = splitAfterPrefix(secondWord, firstWord);
                
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

            const currentSide = letters.findIndex(side => side.includes(letter));
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
        const totalLengthA = a.join('').length;
        const totalLengthB = b.join('').length;
        if (totalLengthA !== totalLengthB) {
            return totalLengthA - totalLengthB;
        }
        return Math.abs(a[0].length - a[1]?.length || 0) - 
               Math.abs(b[0].length - b[1]?.length || 0);
    });
};

export const useSolver = (letters: string[][]): [string[][], (customDictionary?: string[]) => void] => {
    const [answers, setAnswers] = useState<string[][]>([]);
    const trieRef = useRef<Trie>(new Trie());

    const solve = useCallback((customDictionary?: string[]) => {
        const validLetters = new Set<string>();
        letters.forEach(group => {
            group.forEach(letter => {
                if (letter) validLetters.add(letter);
            });
        });

        if (validLetters.size === 0) return;

        // If a custom dictionary is provided, rebuild the trie with it
        if (customDictionary) {
            const words = customDictionary.filter(word => word.length >= 3);
            trieRef.current.rebuild(words);
        } else if (!trieRef.current.root.children['A']) {
            // If no custom dictionary and trie is empty, load default dictionary
            fetch("./dictionary.txt")
                .then(response => response.text())
                .then(text => {
                    const words = text.split(/\s+/)
                        .filter(word => word.length >= 3)
                        .map(word => word.toUpperCase());
                    trieRef.current.rebuild(words);
                    const solutions = findValidSolutions(trieRef.current, letters, validLetters);
                    setAnswers(solutions);
                })
                .catch(error => console.error("Error fetching words:", error));
            return;
        }

        const solutions = findValidSolutions(trieRef.current, letters, validLetters);
        setAnswers(solutions);
    }, [letters]);

    useEffect(() => {
        // Initial load of default dictionary
        fetch("./dictionary.txt")
            .then(response => response.text())
            .then(text => {
                const words = text.split(/\s+/)
                    .filter(word => word.length >= 3)
                    .map(word => word.toUpperCase());
                trieRef.current.rebuild(words);
            })
            .catch(error => console.error("Error fetching words:", error));
    }, []);

    return [answers, solve];
};