"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Solution = {
    id: number;
    word1: string;
    word2: string;
    length: number;
};

export const columns: ColumnDef<Solution>[] = [
    { accessorKey: "word1", header: "Word One" },
    { accessorKey: "word2", header: "Word Two" },
    { accessorKey: "length", header: "Characters" },
];
