import { Flex } from "@chakra-ui/react";
import { Chess, type Square } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { type PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

type SquareMapping = Partial<
  Record<Square, { background: string; borderRadius?: string }>
>;
export const ChessBoardBlockChain = () => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | undefined>(undefined);
  const [moveTo, setMoveTo] = useState<Square | undefined>(undefined);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareMapping>(
    {}
  );
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState<SquareMapping>({});

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    console.log("moves", moves);
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: SquareMapping = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex] ?? "");
    setGame(new Chess(game.fen()));
  }

  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        square: moveFrom,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : undefined);
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "1") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "8")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      try {
        game.move({
          from: moveFrom,
          to: square,
          promotion: "q",
        });
      } catch (e) {
        // this should not happen since we validate the move earlier
        console.error(e);
        return;
      }

      setTimeout(makeRandomMove, 300);
      setMoveFrom(undefined);
      setMoveTo(undefined);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece?: PromotionPieceOption) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (!moveFrom || !moveTo || !piece) {
      console.warn("No piece selected for promotion");
      return false;
    }
    if (piece) {
      game.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });
      setTimeout(makeRandomMove, 300);
    }

    setMoveFrom(undefined);
    setMoveTo(undefined);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function onSquareRightClick(square: Square) {
    const color = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square]?.background === color
          ? undefined
          : { backgroundColor: color },
    });
  }

  return (
    <Flex grow={1} alignItems={"center"} justifyContent={"center"}>
      <Chessboard
        animationDuration={200}
        arePiecesDraggable={false}
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
        boardOrientation="black"
        boardWidth={800}
      />
    </Flex>
  );
};
