// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ChessTypes.sol";

library ChessMoveValidator {
    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }

    function isValidMoveForPawn(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY,
        ChessTypes.PieceColor pieceColor,
        bool isFirstMove
    ) internal pure returns (bool) {
        int8 deltaX = int8(toX) - int8(fromX);
        int8 deltaY = int8(toY) - int8(fromY);

        if (pieceColor == ChessTypes.PieceColor.White) {
            // White pawn moves forward (y decreases) and can capture diagonally
            if (deltaY == -1 && deltaX == 0) {
                return true;
            } else if (isFirstMove && deltaY == -2 && deltaX == 0) {
                return true;
            } else if (deltaY == -1 && abs(deltaX) == 1) {
                return true;
            }
        } else if (pieceColor == ChessTypes.PieceColor.Black) {
            // Black pawn moves forward (y increases) and can capture diagonally
            if (deltaY == 1 && deltaX == 0) {
                return true;
            } else if (isFirstMove && deltaY == 2 && deltaX == 0) {
                return true;
            } else if (deltaY == 1 && abs(deltaX) == 1) {
                return true;
            }
        }

        return false;
    }

    function isValidMoveForRook(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    ) internal pure returns (bool) {
        int8 deltaX = int8(toX) - int8(fromX);
        int8 deltaY = int8(toY) - int8(fromY);

        if ((deltaX == 0 && deltaY != 0) || (deltaX != 0 && deltaY == 0)) {
            // Rook moves vertically or horizontally
            return true;
        }

        return false;
    }

    function isValidMoveForKnight(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    ) internal pure returns (bool) {
        int8 deltaX = int8(toX) - int8(fromX);
        int8 deltaY = int8(toY) - int8(fromY);

        // Knights move in an L-shape: two squares in one direction and one square in the other
        if (
            (abs(deltaX) == 1 && abs(deltaY) == 2) ||
            (abs(deltaX) == 2 && abs(deltaY) == 1)
        ) {
            return true;
        }

        return false;
    }

    function isValidMoveForBishop(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    ) internal pure returns (bool) {
        int8 deltaX = int8(toX) - int8(fromX);
        int8 deltaY = int8(toY) - int8(fromY);

        // Bishop moves diagonally
        if (abs(deltaX) == abs(deltaY)) {
            return true;
        }

        return false;
    }

    function isValidMoveForQueen(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    ) internal pure returns (bool) {
        // The Queen combines the valid moves of Rook and Bishop
        return
            isValidMoveForRook(fromX, fromY, toX, toY) ||
            isValidMoveForBishop(fromX, fromY, toX, toY);
    }

    function isValidMoveForKing(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY,
        bool isFirstMove
    ) internal pure returns (bool) {
        int8 deltaX = int8(toX) - int8(fromX);
        int8 deltaY = int8(toY) - int8(fromY);

        // King moves one square in any direction
        if (abs(deltaX) <= 1 && abs(deltaY) <= 1) {
            return true;
        }

        // Implement castling rule (optional)
        if (isFirstMove && deltaX == 2 && deltaY == 0) {
            // King-side castle (right-side castle)
            // Ensure the squares between the King and Rook are empty, not under attack, and not passing through attacked squares
            // Update the board accordingly
            // Return true if the move is valid
        } else if (isFirstMove && deltaX == -2 && deltaY == 0) {
            // Queen-side castle (left-side castle)
            // Implement similar checks as above
        }

        return false;
    }
}
