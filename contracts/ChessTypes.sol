// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ChessTypes {
    struct Room {
        address player1;
        address player2;
        mapping(uint8 => mapping(uint8 => Piece)) board;
        bool isActive;
        address winner;
    }

    enum PieceType {
        Empty,
        Pawn,
        Rook,
        Knight,
        Bishop,
        Queen,
        King
    }
    enum PieceColor {
        None,
        White,
        Black
    }

    struct Piece {
        PieceType pieceType;
        PieceColor pieceColor;
    }
}
