/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

// --- Lire les données : Ligne du Plateau ---
function readBoardRow() {
    const gameBoard = [];

    for (let i = 0; i < 8; i++) {
        const boardRow = readline();
        const row = boardRow.split('');

        gameBoard.push(row);
    }
    
    return gameBoard;
}

//Appel des fonctions
const gameBoard = readBoardRow();

// --- Logique du jeu ---
//Déclaration Emplacement Pièces
function findPieces(gameBoard) {
    const pieces = [];
    for (let row = 0; row < gameBoard.length; row++) {
        for (let col = 0; col < gameBoard[row].length; col++) {
            const caseRow = gameBoard[row][col];

            if(caseRow !== '.') {
                const piece = {name: caseRow, row: row, col: col};
                pieces.push(piece);
            }
        }
    }

    return pieces;
}

//Inventaire et Tris des Attaques
function findCharacerAttacks(gameBoard, pieces) {
    const attackedCases = {
        'W': [],
        'B': []
    };

    for (const piece of pieces) {
        switch (piece.name) {
            case 'R': //Pièces Blanches
                attackedCases['W'].push(...attackStraightLines(gameBoard, piece));
                break;
            case 'N':
                attackedCases['W'].push(...attackKnight(gameBoard, piece));
                break;
            case 'B':
                attackedCases['W'].push(...attackDiagonals(gameBoard, piece));
                break;
            case 'Q':
                attackedCases['W'].push(...attackStraightLines(gameBoard, piece));
                attackedCases['W'].push(...attackDiagonals(gameBoard, piece));
                break;
            case 'K':
                attackedCases['W'].push(...attackKing(gameBoard, piece));
                break;
            case 'P':
                attackedCases['W'].push(...attackPawn(gameBoard, piece));
                break;

            case 'r': //Pièces Noires
                attackedCases['B'].push(...attackStraightLines(gameBoard, piece));
                break;
            case 'n':
                attackedCases['B'].push(...attackKnight(gameBoard, piece));
                break;
            case 'b':
                attackedCases['B'].push(...attackDiagonals(gameBoard, piece));
                break;
            case 'q':
                attackedCases['B'].push(...attackStraightLines(gameBoard, piece));
                attackedCases['B'].push(...attackDiagonals(gameBoard, piece));
                break;
            case 'k':
                attackedCases['B'].push(...attackKing(gameBoard, piece));
                break;
            case 'p':
                attackedCases['B'].push(...attackPawn(gameBoard, piece));
                break;
        }
    }

    return attackedCases;
}

//Style d'Attaque
//Direction Attaques
function directionsOfAttacks(gameBoard, piece, directions) {
    const attackedCases = [];

    for (const direction of directions) {
        let row = piece.row + direction.dRow;
        let col = piece.col + direction.dCol;

        while (row >= 0 && row < 8 && col >= 0 && col < 8) {
            attackedCases.push({ row: row, col: col });

            if (gameBoard[row][col] !== '.') {
                break;
            }

            row += direction.dRow;
            col += direction.dCol;
        }
    }

    return attackedCases;
}

//Move Attaques
function moveAttacks(piece, moves) {
    const attackedCases = [];

    for (const move of moves) {
        const row = piece.row + move.dRow;
        const col = piece.col + move.dCol;

        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            attackedCases.push({ row: row, col: col });
        }
    }

    return attackedCases;
}

//Lignes Droites
function attackStraightLines(gameBoard, piece) {
    const directions = [
        {dRow: -1, dCol: 0}, //En bas
        {dRow: 1, dCol: 0}, //En haut
        {dRow: 0, dCol: -1}, //A gauche
        {dRow: 0, dCol: 1} //A droite
    ];

    const attackedCases = directionsOfAttacks(gameBoard, piece, directions);
    return attackedCases;
}

//Ligne Diagonales
function attackDiagonals(gameBoard, piece) {
    const directions = [
        {dRow: -1, dCol: -1},
        {dRow: -1, dCol: 1},
        {dRow: 1, dCol: -1},
        {dRow: 1, dCol: 1}
    ];

    const attackedCases = directionsOfAttacks(gameBoard, piece, directions);
    return attackedCases;
}

//Move Cavalier
function attackKnight(piece) {
    const moves = [
        { dRow: -2, dCol: -1 },
        { dRow: -2, dCol: 1 },
        { dRow: -1, dCol: -2 },
        { dRow: -1, dCol: -2 },
        { dRow: 1, dCol: -2 },
        { dRow: 1, dCol: 2 },
        { dRow: 2, dCol: -1 },
        { dRow: 2, dCol: 1 }
    ];

    const attackedCases = moveAttacks(piece, moves);
    return attackedCases;
}


//Move Pion
function attackPawn(piece) {
    let moves = [];

    if(piece.name === 'P') {
        moves = [
            { dRow: -1, dCol: -1 },
            { dRow: -1, dCol: 1 }
        ];
    } else if (piece.name === 'p') {
        moves = [
            { dRow: 1, dCol: -1 },
            { dRow: 1, dCol: 1 }
        ]
    }

    const attackedCases = moveAttacks(piece, moves);
    return attackedCases;
}

//Move Roi
function attackKing(piece) {
    const moves = [
        { dRow: -1, dCol: -1 },
        { dRow: -1, dCol: 0 },
        { dRow: -1, dCol: 1 },
        { dRow: 0, dCol: -1 },
        { dRow: 0, dCol: 1 },
        { dRow: 1, dCol: -1 },
        { dRow: 1, dCol: 0 },
        { dRow: 1, dCol: 1}
    ];
    
    const attackedCases = moveAttacks(piece, moves);
    return attackedCases;
}

//Final
//Roi en échec
function kingIsAttacked(king, attackedCases) {
    return attackedCases.some(caseBoard => caseBoard.row === king.row && caseBoard.col === king.col);
}

//Possibilité du Roi : attaquer ou fuir
//CODE NON-FONCTIONNEL
// function kingMoveSafety(king, attackedCases, enemyPieces, alliesPieces) {
//     const moves = attackKing(king);

//     for (const move of moves) {
//         const row = move.row;
//         const col = move.col;

//         const isAlliesPieces = alliesPieces.some(piece => piece.row === row && piece.col === col);
//         const isAttacked = attackedCases.some(attacked => attacked.row === row && attacked.col === col);
//         const isEnemyPieces = enemyPieces.some(piece => piece.row === row && piece.col === col);

//         if (isAlliesPieces || isAttacked) {
//             continue;
//         }

//         if (isEnemyPieces && !isAttacked) {
//             return true; //Attaque
//         }

//         if (!isEnemyPieces) {
//             return true; //Fuite
//         }
//     }
//     return false; //Checkmate
// }

//Check du Échec et Mat
function checkmate(king, attackedCases, enemyPieces, alliesPieces) {
    const isAttacked = kingIsAttacked(king, attackedCases);
    // const noSafeMove = !kingMoveSafety(king, attackedCases, enemyPieces, alliesPieces);

    // return isAttacked && noSafeMove;
    return isAttacked;
}

//Déterminer le Vainqueur
function findWinner(gameBoard) {
    const pieces = findPieces(gameBoard);
    const attackedCases = findCharacerAttacks(gameBoard, pieces);

    const whitePieces = pieces.filter(piece => piece.name === piece.name.toUpperCase());
    const blackPieces = pieces.filter(piece => piece.name === piece.name.toLowerCase());

    const whiteKing = pieces.find(piece => piece.name === 'K');
    const blackKing = pieces.find(piece => piece.name === 'k');

    if (checkmate(whiteKing, attackedCases['B'], blackPieces, whitePieces)) {
        return 'B';
    } else if (checkmate(blackKing, attackedCases['W'], whitePieces, blackPieces)) {
        return 'W';
    }

    return 'N';
}


// --- Simulation du jeu ---
function playGame(gameBoard) {
    const winner = findWinner(gameBoard);
    console.log(winner);
}

playGame(gameBoard);

// Write an answer using console.log()
// To debug: console.error('Debug messages...');

