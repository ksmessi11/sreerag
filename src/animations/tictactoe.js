import gsap from 'gsap';

export class TicTacToe {
    constructor(boardSelector, statusSelector, resetBtnSelector) {
        this.boardEl = document.querySelector(boardSelector);
        this.statusEl = document.querySelector(statusSelector);
        this.resetBtn = document.querySelector(resetBtnSelector);
        this.cells = Array.from(this.boardEl.querySelectorAll('.cell'));

        this.board = Array(9).fill(null);
        this.playerSymbol = 'X';
        this.aiSymbol = 'O';
        this.isPlayerTurn = true;
        this.gameActive = true;

        // Win combinations
        this.winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        // Reference to the 3D scene (will be injected)
        this.scene3D = null;

        this.init();
    }

    setScene3D(scene) {
        this.scene3D = scene;
    }

    init() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            // Hook up magnetic cursor to empty cells
            cell.setAttribute('data-magnetic', '');
        });

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetGame());
        }

        this.updateStatus("PLAYER (X) TURN");
    }

    handleCellClick(e) {
        if (!this.isPlayerTurn || !this.gameActive) return;

        const cell = e.target;
        const index = parseInt(cell.dataset.index);

        if (this.board[index] !== null) return;

        this.makeMove(index, this.playerSymbol);

        if (this.checkWin(this.playerSymbol)) {
            this.endGame('PLAYER');
        } else if (this.checkDraw()) {
            this.endGame('DRAW');
        } else {
            this.isPlayerTurn = false;
            this.updateStatus("AI THINKING...", "var(--accent-purple)");
            setTimeout(() => this.aiMove(), 600 + Math.random() * 500);
        }
    }

    makeMove(index, symbol) {
        this.board[index] = symbol;
        const cell = this.cells[index];
        cell.textContent = symbol;
        cell.classList.add(symbol.toLowerCase());

        // Pop animation
        gsap.fromTo(cell,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
    }

    aiMove() {
        if (!this.gameActive) return;

        // BALANCED AI: 70% chance to make the best Minimax move, 30% chance to make a random valid move padding
        const isOptimal = Math.random() > 0.3;
        let moveIndex;

        if (isOptimal) {
            moveIndex = this.getBestMove();
        } else {
            const available = this.getAvailableMoves();
            moveIndex = available[Math.floor(Math.random() * available.length)];
        }

        this.makeMove(moveIndex, this.aiSymbol);

        if (this.checkWin(this.aiSymbol)) {
            this.endGame('AI');
        } else if (this.checkDraw()) {
            this.endGame('DRAW');
        } else {
            this.isPlayerTurn = true;
            this.updateStatus("PLAYER (X) TURN", "var(--accent-cyan)");
        }
    }

    getAvailableMoves() {
        return this.board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    }

    getBestMove() {
        let bestScore = -Infinity;
        let move = null;
        let available = this.getAvailableMoves();

        // Minor optimization: early game random center/corner
        if (available.length === 9) return 4;
        if (available.length === 8 && available.includes(4)) return 4;

        for (let i = 0; i < available.length; i++) {
            let index = available[i];
            this.board[index] = this.aiSymbol;
            let score = this.minimax(this.board, 0, false);
            this.board[index] = null;
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
        return move;
    }

    minimax(board, depth, isMaximizing) {
        if (this.checkWinState(board, this.aiSymbol)) return 10 - depth;
        if (this.checkWinState(board, this.playerSymbol)) return depth - 10;
        if (this.getAvailableMovesState(board).length === 0) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            let available = this.getAvailableMovesState(board);
            for (let i = 0; i < available.length; i++) {
                let index = available[i];
                board[index] = this.aiSymbol;
                let score = this.minimax(board, depth + 1, false);
                board[index] = null;
                bestScore = Math.max(score, bestScore);
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            let available = this.getAvailableMovesState(board);
            for (let i = 0; i < available.length; i++) {
                let index = available[i];
                board[index] = this.playerSymbol;
                let score = this.minimax(board, depth + 1, true);
                board[index] = null;
                bestScore = Math.min(score, bestScore);
            }
            return bestScore;
        }
    }

    // Helper methods for minimax state checking
    getAvailableMovesState(board) {
        return board.map((c, i) => c === null ? i : null).filter(v => v !== null);
    }

    checkWinState(board, symbol) {
        return this.winCombos.some(combo => {
            return combo.every(index => board[index] === symbol);
        });
    }

    checkWin(symbol) {
        const winningCombo = this.winCombos.find(combo => {
            return combo.every(index => this.board[index] === symbol);
        });

        if (winningCombo) {
            this.drawWinLine(winningCombo);
            return true;
        }
        return false;
    }

    checkDraw() {
        return this.board.every(cell => cell !== null);
    }

    endGame(result) {
        this.gameActive = false;
        let message = "";
        let color = "";

        if (result === 'PLAYER') {
            message = "🎉 PLAYER WINS! 🎉";
            color = "var(--accent-cyan)";
            this.trigger3DEffect('victory');
        } else if (result === 'AI') {
            message = "💀 AI WINS! 💀";
            color = "var(--accent-pink)";
            this.trigger3DEffect('defeat');
        } else {
            message = "🤝 DRAW! 🤝";
            color = "var(--text-primary)";
            this.trigger3DEffect('draw');
        }

        this.updateStatus(message, color);

        // Status animation
        gsap.fromTo(this.statusEl,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out" }
        );
    }

    updateStatus(text, color = "var(--accent-cyan)") {
        if (!this.statusEl) return;
        this.statusEl.textContent = text;
        this.statusEl.style.color = color;
    }

    drawWinLine(combo) {
        // Determine line type based on combo
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.classList.add('win-line-container');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';

        const line = document.createElementNS(svgNS, "line");
        line.classList.add('win-line');

        // Calculate coordinates based on cell positions
        const getCellCenter = (index) => {
            const cell = this.cells[index];
            const rect = cell.getBoundingClientRect();
            const boardRect = this.boardEl.getBoundingClientRect();
            return {
                x: rect.left - boardRect.left + rect.width / 2,
                y: rect.top - boardRect.top + rect.height / 2
            };
        };

        const start = getCellCenter(combo[0]);
        const end = getCellCenter(combo[2]);

        // Extend line slightly
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        const extension = 20;

        line.setAttribute('x1', start.x - Math.cos(angle) * extension);
        line.setAttribute('y1', start.y - Math.sin(angle) * extension);
        line.setAttribute('x2', end.x + Math.cos(angle) * extension);
        line.setAttribute('y2', end.y + Math.sin(angle) * extension);

        svg.appendChild(line);
        this.boardEl.appendChild(svg);

        // Animate line drawing
        const length = Math.sqrt(dx * dx + dy * dy) + extension * 2;
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;

        gsap.to(line, {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    }

    trigger3DEffect(type) {
        if (this.scene3D && typeof this.scene3D.playEffect === 'function') {
            this.scene3D.playEffect(type);
        }
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.isPlayerTurn = true;
        this.gameActive = true;

        // Remove win line if exists
        const winLineSvg = this.boardEl.querySelector('svg.win-line-container');
        if (winLineSvg) {
            gsap.to(winLineSvg, { opacity: 0, duration: 0.3, onComplete: () => winLineSvg.remove() });
        }

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
            gsap.set(cell, { scale: 1, opacity: 1 });
        });

        this.updateStatus("PLAYER (X) TURN", "var(--accent-cyan)");

        // Reset 3D scene if applicable
        if (this.scene3D && typeof this.scene3D.resetEffect === 'function') {
            this.scene3D.resetEffect();
        }
    }
}
