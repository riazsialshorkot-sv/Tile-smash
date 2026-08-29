package com.example.tilesmash.game

import com.example.tilesmash.model.Match
import com.example.tilesmash.model.MatchDirection
import com.example.tilesmash.model.Position
import com.example.tilesmash.model.SpecialTile
import com.example.tilesmash.model.Tile

object MatchDetector {
    const val BOARD_SIZE = 8

    /**
     * Detects all horizontal & vertical matches, including intersections (T/L/Cross)
     */
    fun findMatches(board: List<List<Tile?>>): List<Match> {
        val matches = mutableListOf<Match>()

        // 1. Horizontal matches
        for (r in 0 until BOARD_SIZE) {
            var matchLength = 1
            for (c in 0 until BOARD_SIZE) {
                val current = board[r][c]
                val next = if (c + 1 < BOARD_SIZE) board[r][c + 1] else null

                if (current != null && next != null && current.type == next.type) {
                    matchLength++
                } else {
                    if (matchLength >= 3 && current != null) {
                        val matchedTiles = mutableListOf<Tile>()
                        for (i in 0 until matchLength) {
                            board[r][c - i]?.let { matchedTiles.add(it) }
                        }
                        val specialCreation = when {
                            matchLength == 4 -> SpecialTile.LINE_BLAST_HORIZONTAL
                            matchLength >= 5 -> SpecialTile.COLOR_BOMB
                            else -> SpecialTile.NONE
                        }
                        matches.add(
                            Match(
                                tiles = matchedTiles,
                                type = current.type,
                                direction = MatchDirection.HORIZONTAL,
                                specialCreation = specialCreation
                            )
                        )
                    }
                    matchLength = 1
                }
            }
        }

        // 2. Vertical matches
        for (c in 0 until BOARD_SIZE) {
            var matchLength = 1
            for (r in 0 until BOARD_SIZE) {
                val current = board[r][c]
                val next = if (r + 1 < BOARD_SIZE) board[r + 1][c] else null

                if (current != null && next != null && current.type == next.type) {
                    matchLength++
                } else {
                    if (matchLength >= 3 && current != null) {
                        val matchedTiles = mutableListOf<Tile>()
                        for (i in 0 until matchLength) {
                            board[r - i][c]?.let { matchedTiles.add(it) }
                        }
                        val specialCreation = when {
                            matchLength == 4 -> SpecialTile.LINE_BLAST_VERTICAL
                            matchLength >= 5 -> SpecialTile.COLOR_BOMB
                            else -> SpecialTile.NONE
                        }
                        matches.add(
                            Match(
                                tiles = matchedTiles,
                                type = current.type,
                                direction = MatchDirection.VERTICAL,
                                specialCreation = specialCreation
                            )
                        )
                    }
                    matchLength = 1
                }
            }
        }

        return matches
    }

    /**
     * Finds all possible moves on the board
     */
    fun findPossibleMoves(board: List<List<Tile?>>): List<Pair<Position, Position>> {
        val possibleMoves = mutableListOf<Pair<Position, Position>>()

        for (r in 0 until BOARD_SIZE) {
            for (c in 0 until BOARD_SIZE) {
                val current = board[r][c] ?: continue

                // Check right swap
                if (c + 1 < BOARD_SIZE) {
                    val right = board[r][c + 1]
                    if (right != null) {
                        if (current.special == SpecialTile.COLOR_BOMB || right.special == SpecialTile.COLOR_BOMB) {
                            possibleMoves.add(Position(r, c) to Position(r, c + 1))
                        } else {
                            val swappedBoard = swapTilesInCopy(board, Position(r, c), Position(r, c + 1))
                            if (findMatches(swappedBoard).isNotEmpty()) {
                                possibleMoves.add(Position(r, c) to Position(r, c + 1))
                            }
                        }
                    }
                }

                // Check down swap
                if (r + 1 < BOARD_SIZE) {
                    val down = board[r + 1][c]
                    if (down != null) {
                        if (current.special == SpecialTile.COLOR_BOMB || down.special == SpecialTile.COLOR_BOMB) {
                            possibleMoves.add(Position(r, c) to Position(r + 1, c))
                        } else {
                            val swappedBoard = swapTilesInCopy(board, Position(r, c), Position(r + 1, c))
                            if (findMatches(swappedBoard).isNotEmpty()) {
                                possibleMoves.add(Position(r, c) to Position(r + 1, c))
                            }
                        }
                    }
                }
            }
        }

        return possibleMoves
    }

    private fun swapTilesInCopy(
        board: List<List<Tile?>>,
        pos1: Position,
        pos2: Position
    ): List<List<Tile?>> {
        val copy = board.map { it.toMutableList() }.toMutableList()
        val temp = copy[pos1.row][pos1.col]
        copy[pos1.row][pos1.col] = copy[pos2.row][pos2.col]?.copy(row = pos1.row, col = pos1.col)
        copy[pos2.row][pos2.col] = temp?.copy(row = pos2.row, col = pos2.col)
        return copy
    }
}
