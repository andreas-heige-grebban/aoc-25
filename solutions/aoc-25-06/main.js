"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const parseProblems = (input) => {
    var _a, _b;
    const lines = input.split('\n').filter(line => line.length > 0);
    const operatorLine = lines[lines.length - 1];
    const numberLines = lines.slice(0, -1);
    // Find column boundaries by identifying groups separated by all-space columns
    const width = Math.max(...lines.map(l => l.length));
    const paddedLines = lines.map(l => l.padEnd(width));
    // Find columns that are spaces in ALL rows (including operator row)
    const separatorCols = [];
    for (let col = 0; col < width; col++) {
        const isAllSpace = paddedLines.every(line => line[col] === ' ');
        if (isAllSpace) {
            separatorCols.push(col);
        }
    }
    // Group consecutive separator columns and find problem boundaries
    const problemRanges = [];
    for (let i = 0; i <= separatorCols.length; i++) {
        const col = (_a = separatorCols[i]) !== null && _a !== void 0 ? _a : width;
        const prevCol = (_b = separatorCols[i - 1]) !== null && _b !== void 0 ? _b : -1;
        // If there's a gap (non-separator columns), we have a problem
        if (col > prevCol + 1 || i === separatorCols.length) {
            const problemStart = prevCol + 1;
            const problemEnd = col;
            if (problemEnd > problemStart) {
                problemRanges.push([problemStart, problemEnd]);
            }
        }
    }
    // Extract problems from each range
    const problems = problemRanges.map(([colStart, colEnd]) => {
        const numbers = [];
        for (const line of numberLines) {
            const segment = line.slice(colStart, colEnd).trim();
            if (segment.length > 0) {
                const num = parseInt(segment, 10);
                if (!isNaN(num)) {
                    numbers.push(num);
                }
            }
        }
        const opSegment = operatorLine.slice(colStart, colEnd).trim();
        const operator = opSegment.includes('*') ? '*' : '+';
        return { numbers, operator };
    });
    return problems;
};
const solveProblem = (problem) => {
    const { numbers, operator } = problem;
    if (operator === '+') {
        return numbers.reduce((sum, n) => sum + n, 0);
    }
    else {
        return numbers.reduce((prod, n) => prod * n, 1);
    }
};
const solveWorksheet = (problems) => problems.reduce((total, problem) => total + solveProblem(problem), 0);
const main = () => {
    const totalStart = performance.now();
    const readStart = performance.now();
    const input = fs.readFileSync('input.txt', 'utf-8');
    const readTime = performance.now() - readStart;
    const executeStart = performance.now();
    const problems = parseProblems(input);
    const result = solveWorksheet(problems);
    const executeTime = performance.now() - executeStart;
    console.log('Part 1:', result);
    console.log(`\nFile Read: ${(readTime / 1000).toFixed(6)}s`);
    console.log(`Execution: ${(executeTime / 1000).toFixed(6)}s`);
    console.log(`Total: ${((performance.now() - totalStart) / 1000).toFixed(6)}s`);
};
main();
