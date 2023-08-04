// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155LazyMint.sol";
import "./ChessTypes.sol";
import "./ChessMoveValidator.sol";

contract Chess is ERC1155LazyMint {
    mapping(uint256 => ChessTypes.Room) public rooms;
    mapping(address => uint256) public playerToActiveRoom;
    mapping(address => uint256[]) public playerPastRooms;
    uint256 public totalRooms = 0;
    uint8 constant boardSize = 8;

    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC1155LazyMint(
            _defaultAdmin,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {}

    modifier activeRoom(uint256 roomId) {
        require(rooms[roomId].isActive, "Room is not active");
        _;
    }
    modifier onlyAllowedCaller(uint256 roomId) {
        require(
            rooms[roomId].player1 == msg.sender ||
                rooms[roomId].player2 == msg.sender ||
                owner() == msg.sender,
            "Not an operator"
        );
        _;
    }

    modifier isValidMove(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    ) {
        require(
            fromX >= 0 &&
                fromY >= 0 &&
                toX >= 0 &&
                toY >= 0 &&
                fromX < boardSize &&
                fromY < boardSize &&
                toX < boardSize &&
                toY < boardSize,
            "Invalid move: Out of bounds"
        );
        require(
            fromX != toX || fromY != toY,
            "Invalid move: Same source and destination"
        );
        require(
            rooms[totalRooms].board[fromX][fromY].pieceColor !=
                ChessTypes.PieceColor.None,
            "Invalid move: Empty source cell"
        );
        require(
            rooms[totalRooms].board[fromX][fromY].pieceColor !=
                rooms[totalRooms].board[toX][toY].pieceColor,
            "Invalid move: Can't capture own piece"
        );
        _;
    }

    function getAvailableRooms(
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory) {
        require(offset >= 0, "Invalid offset");
        require(limit > 0, "Invalid limit");

        uint256 count = 0;
        uint256[] memory availableRooms = new uint256[](limit);

        for (uint256 i = offset; i < offset + limit; ++i) {
            if (rooms[i].isActive && rooms[i].player2 == address(0)) {
                availableRooms[count] = i;
                ++count;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; ++i) {
            result[i] = availableRooms[i];
        }
        return result;
    }

    function createRoom(address player) external {
        require(playerToActiveRoom[player] == 0, "Already in a room");
        ++totalRooms;
        rooms[totalRooms].isActive = true;
        rooms[totalRooms].player1 = player;
        rooms[totalRooms].player1Color = ChessTypes.PieceColor.White;
        playerToActiveRoom[player] = totalRooms;
        initializeBoard(totalRooms);
    }

    function initializeBoard(uint256 roomId) internal {
        rooms[roomId].board[0][0] = ChessTypes.Piece(
            ChessTypes.PieceType.Rook,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[0][1] = ChessTypes.Piece(
            ChessTypes.PieceType.Knight,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[0][2] = ChessTypes.Piece(
            ChessTypes.PieceType.Bishop,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[0][3] = ChessTypes.Piece(
            ChessTypes.PieceType.Queen,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[0][4] = ChessTypes.Piece(
            ChessTypes.PieceType.King,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[0][5] = ChessTypes.Piece(
            ChessTypes.PieceType.Bishop,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[0][6] = ChessTypes.Piece(
            ChessTypes.PieceType.Knight,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[0][7] = ChessTypes.Piece(
            ChessTypes.PieceType.Rook,
            ChessTypes.PieceColor.White
        );

        rooms[roomId].board[1][0] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[1][1] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[1][2] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[1][3] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[1][4] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[1][5] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[1][6] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.White
        );
        rooms[roomId].board[1][7] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.White
        );

        rooms[roomId].board[6][0] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[6][1] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[6][2] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[6][3] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[6][4] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[6][5] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[6][6] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[6][7] = ChessTypes.Piece(
            ChessTypes.PieceType.Pawn,
            ChessTypes.PieceColor.Black
        );

        rooms[roomId].board[7][0] = ChessTypes.Piece(
            ChessTypes.PieceType.Rook,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[7][1] = ChessTypes.Piece(
            ChessTypes.PieceType.Knight,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[7][2] = ChessTypes.Piece(
            ChessTypes.PieceType.Bishop,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[7][3] = ChessTypes.Piece(
            ChessTypes.PieceType.Queen,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[7][4] = ChessTypes.Piece(
            ChessTypes.PieceType.King,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[7][5] = ChessTypes.Piece(
            ChessTypes.PieceType.Bishop,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[7][6] = ChessTypes.Piece(
            ChessTypes.PieceType.Knight,
            ChessTypes.PieceColor.Black
        );
        rooms[roomId].board[7][7] = ChessTypes.Piece(
            ChessTypes.PieceType.Rook,
            ChessTypes.PieceColor.Black
        );
    }

    function joinRoom(
        uint256 roomId,
        address player
    ) external activeRoom(roomId) {
        require(roomId > 0 && roomId <= totalRooms, "Invalid room ID");
        require(rooms[roomId].player2 == address(0), "Room is already full");
        require(player != rooms[roomId].player1, "Player already in room");
        playerToActiveRoom[player] = roomId;
        rooms[roomId].player2 = player;
        rooms[roomId].player2Color = ChessTypes.PieceColor.Black;
    }

    function closeRoom(
        uint256 roomId
    ) external activeRoom(roomId) onlyAllowedCaller(roomId) {
        rooms[roomId].isActive = false;
        address player1 = rooms[roomId].player1;
        address player2 = rooms[roomId].player2;
        playerToActiveRoom[player1] = 0;
        playerToActiveRoom[player2] = 0;
        playerPastRooms[player1].push(roomId);
        playerPastRooms[player2].push(roomId);
    }

    function isValidPieceMove(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY,
        ChessTypes.PieceType pieceType,
        ChessTypes.PieceColor pieceColor
    ) internal pure returns (bool) {
        if (pieceType == ChessTypes.PieceType.Pawn) {
            bool isFirstMove = false;
            if (pieceColor == ChessTypes.PieceColor.White) {
                isFirstMove = fromY == 1;
            } else if (pieceColor == ChessTypes.PieceColor.Black) {
                isFirstMove = fromY == 6;
            }
            // To consider capturing diagonally, en passant, and pawn promotion
            ChessMoveValidator.isValidMoveForPawn(
                fromX,
                fromY,
                toX,
                toY,
                pieceColor,
                isFirstMove
            );
        } else if (pieceType == ChessTypes.PieceType.Rook) {
            ChessMoveValidator.isValidMoveForRook(fromX, fromY, toX, toY);
        } else if (pieceType == ChessTypes.PieceType.Knight) {
            ChessMoveValidator.isValidMoveForKnight(fromX, fromY, toX, toY);
        } else if (pieceType == ChessTypes.PieceType.Bishop) {
            ChessMoveValidator.isValidMoveForBishop(fromX, fromY, toX, toY);
        } else if (pieceType == ChessTypes.PieceType.Queen) {
            ChessMoveValidator.isValidMoveForQueen(fromX, fromY, toX, toY);
        } else if (pieceType == ChessTypes.PieceType.King) {
            bool isFirstMove = false;
            if (pieceColor == ChessTypes.PieceColor.White) {
                isFirstMove = fromY == 0 && fromX == 4;
            } else if (pieceColor == ChessTypes.PieceColor.Black) {
                isFirstMove = fromY == 7 && fromX == 4;
            }
            ChessMoveValidator.isValidMoveForKing(
                fromX,
                fromY,
                toX,
                toY,
                isFirstMove
            );
        }

        // If none of the valid moves match, it's an invalid move
        return false;
    }

    function makeMove(
        uint256 roomId,
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    )
        external
        activeRoom(roomId)
        onlyAllowedCaller(roomId)
        isValidMove(fromX, fromY, toX, toY)
    {
        // TODO: fix player1 can move player2 pieces

        ChessTypes.Piece storage sourcePiece = rooms[roomId].board[fromX][
            fromY
        ];
        ChessTypes.Piece storage targetPiece = rooms[roomId].board[toX][toY];

        // Check for valid piece movement (you need to implement this according to chess rules)
        require(
            isValidPieceMove(
                fromX,
                fromY,
                toX,
                toY,
                sourcePiece.pieceType,
                sourcePiece.pieceColor
            ),
            "Invalid move: Invalid piece movement"
        );

        // Perform the move
        rooms[roomId].board[toX][toY] = sourcePiece;
        rooms[roomId].board[fromX][fromY] = ChessTypes.Piece(
            ChessTypes.PieceType.Empty,
            ChessTypes.PieceColor.None
        );

        if (targetPiece.pieceType == ChessTypes.PieceType.King) {
            // Game over, update the winner
            rooms[roomId].isActive = false;
            rooms[roomId].winner = msg.sender;
        }
    }

    function gradeBoard(uint256 roomId) external activeRoom(roomId) {
        require(rooms[roomId].isActive, "Room is not active");

        if (rooms[roomId].winner != address(0)) {
            claim(rooms[roomId].winner, 0, 1);
        }
    }
}
