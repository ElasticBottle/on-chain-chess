import { Flex } from "@chakra-ui/react";
import { Chess, type Square } from "chess.js";
import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { api } from "~/utils/api";
import { PieceColor, pollForTransactionStatus } from "~/utils/web3Api";
import { convertChessPositionToTuple } from "../../utils/chess";

type SquareMapping = Partial<
  Record<Square, { background: string; borderRadius?: string }>
>;
export const ChessBoardBlockChain = ({
  roomId,
  currentTurn,
  setCurrentTurn,
  playerColor,
  opponentColor,
  opponentMove,
}: {
  roomId: string;
  currentTurn: number;
  setCurrentTurn: React.Dispatch<React.SetStateAction<number>>;
  playerColor: number;
  opponentColor: number;
  opponentMove: { from: string; to: string } | undefined;
}) => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | undefined>(undefined);
  const [moveTo, setMoveTo] = useState<Square | undefined>(undefined);
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareMapping>(
    {}
  );
  const [optionSquares, setOptionSquares] = useState<SquareMapping>({});

  const apiContext = api.useContext();
  const { mutateAsync } = api.web3api.writeChessContract.useMutation({
    onSuccess: (txnId) => {
      pollForTransactionStatus({
        apiContext,
        txnId,
        onSuccess() {
          console.log("success");
        },
        onError(e) {
          console.log("error moving piece", e);
        },
      });
    },
  });
  const movePiece = async (from: Square, to: Square) => {
    const { x: fromX, y: fromY } = convertChessPositionToTuple(from);
    const { x: toX, y: toY } = convertChessPositionToTuple(to);

    await mutateAsync({
      function_name: "movePiece",
      args: [
        roomId,
        fromX.toString(),
        fromY.toString(),
        toX.toString(),
        toY.toString(),
      ],
    });
  };

  useEffect(() => {
    if (opponentMove?.from && opponentMove?.to) {
      try {
        game.move({
          from: opponentMove?.from,
          to: opponentMove?.to,
          promotion: "q",
        });
        setCurrentTurn(playerColor);
      } catch (e) {
        console.error(e);
      }
    }
  }, [opponentMove?.from, opponentMove?.to]);

  function getMoveOptions(square: Square) {
    if (playerColor === PieceColor.None || playerColor !== currentTurn) {
      return false;
    }

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

  async function onSquareClick(square: Square) {
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

      // is normal move
      try {
        game.move({
          from: moveFrom,
          to: square,
          promotion: "q",
        });
        setCurrentTurn(opponentColor);
        await movePiece(moveFrom, square);
      } catch (e) {
        // this will happen if we could not make the move on chain
        console.error(e);
        game.move({
          from: square ?? "",
          to: moveFrom ?? "",
          promotion: "q",
        });
        setCurrentTurn(playerColor);
        return;
      }
      setMoveFrom(undefined);
      setMoveTo(undefined);
      setOptionSquares({});
      return;
    }
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
        autoPromoteToQueen={true}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          ...optionSquares,
          ...rightClickedSquares,
        }}
        boardOrientation="black"
        boardWidth={800}
      />
    </Flex>
  );
};
