package com.example.tilesmash.game

import com.example.tilesmash.model.FloatingScore
import com.example.tilesmash.model.Match
import com.example.tilesmash.model.MatchDirection
import com.example.tilesmash.model.Position
import com.example.tilesmash.model.SpecialTile
import com.example.tilesmash.model.Tile
import com.example.tilesmash.model.TileType
import java.util.UUID

object Match3Engine {
    const val BOARD_SIZE = 8

    data class CascadeResult(
        val finalBoard: List<List<Tile?>>,
        val scoreEarned: Int,
        val floatingScores: List<FloatingScore>,
        val triggeredSpecial: Pair<String, Int>?
    )

    /**
     * Swaps two tiles in a board representation
     */
    fun swapTiles(
        board: List<List<Tile?>>,
        pos1: Position,
        pos2: Position
    ): List<List<Tile?>> {
        val copy = board.map { it.toMutableList() }.toMutableList()
        val tile1 = copy[pos1.row][pos1.col]
        val tile2 = copy[pos2.row][pos2.col]

        copy[pos1.row][pos1.col] = tile2?.copy(row = pos1.row, col = pos1.col)
        copy[pos2.row][pos2.col] = tile1?.copy(row = pos2.row, col = pos2.col)
        return copy
    }

    /**
     * Activates a Color Bomb on the chosen tile type
     */
    fun activateColorBomb(
        board: List<List<Tile?>>,
        bombPos: Position,
        targetType: TileType
    ): Pair<List<List<Tile?>>, Int> {
        val copy = board.map { it.toMutableList() }.toMutableList()
        var count = 0

        for (r in 0 until BOARD_SIZE) {
            for (c in 0 until BOARD_SIZE) {
                if (copy[r][c]?.type == targetType || (r == bombPos.row && c == bombPos.col)) {
                    copy[r][c] = null
                    count++
                }
            }
        }

        val collapsed = collapseAndSpawn(copy)
        val score = count * 40
        return collapsed to score
    }

    /**
     * Collapses columns and fills top with new tiles
     */
    fun collapseAndSpawn(board: List<MutableList<Tile?>>): List<List<Tile?>> {
        for (c in 0 until BOARD_SIZE) {
            var emptyRow = BOARD_SIZE - 1
            for (r in BOARD_SIZE - 1 downTo 0) {
                if (board[r][c] != null) {
                    if (r != emptyRow) {
                        board[emptyRow][c] = board[r][c]?.copy(row = emptyRow, col = c)
                        board[r][c] = null
                    }
                    emptyRow--
                }
            }

            for (r in emptyRow downTo 0) {
                board[r][c] = BoardGenerator.createTile(r, c)
            }
        }
        return board
    }

    /**
     * Processes single cascade step
     */
    fun processCascadeStep(
        board: List<List<Tile?>>,
        combo: Int
    ): CascadeResult? {
        val matches = MatchDetector.findMatches(board)
        if (matches.isEmpty()) return null

        val mutableBoard = board.map { it.toMutableList() }.toMutableList()
        val tilesToRemove = mutableSetOf<Pair<Int, Int>>()
        val specialToCreate = mutableListOf<Tile>()
        val floatingScores = mutableListOf<FloatingScore>()
        var scoreEarned = 0
        var lineBlastTrigger: Pair<String, Int>? = null

        matches.forEach { match ->
            val matchScore = ScoreCalculator.calculateScore(match.tiles.size, combo)
            scoreEarned += matchScore

            val centerTile = match.tiles[match.tiles.size / 2]
            floatingScores.add(
                FloatingScore(
                    id = UUID.randomUUID().toString(),
                    text = "+$matchScore",
                    row = centerTile.row,
                    col = centerTile.col
                )
            )

            match.tiles.forEach { t ->
                tilesToRemove.add(t.row to t.col)

                if (t.special == SpecialTile.LINE_BLAST_HORIZONTAL) {
                    lineBlastTrigger = "HORIZONTAL" to t.row
                    for (c in 0 until BOARD_SIZE) {
                        tilesToRemove.add(t.row to c)
                    }
                } else if (t.special == SpecialTile.LINE_BLAST_VERTICAL) {
                    lineBlastTrigger = "VERTICAL" to t.col
                    for (r in 0 until BOARD_SIZE) {
                        tilesToRemove.add(r to t.col)
                    }
                }
            }

            if (match.specialCreation != SpecialTile.NONE) {
                specialToCreate.add(
                    BoardGenerator.createTile(
                        row = centerTile.row,
                        col = centerTile.col,
                        type = match.type,
                        special = match.specialCreation
                    )
                )
            }
        }

        // Remove matched tiles
        for (r in 0 until BOARD_SIZE) {
            for (c in 0 until BOARD_SIZE) {
                if (tilesToRemove.contains(r to c)) {
                    mutableBoard[r][c] = null
                }
            }
        }

        // Insert new special tiles
        specialToCreate.forEach { specialTile ->
            mutableBoard[specialTile.row][specialTile.col] = specialTile
        }

        val finalBoard = collapseAndSpawn(mutableBoard)
        return CascadeResult(
            finalBoard = finalBoard,
            scoreEarned = scoreEarned,
            floatingScores = floatingScores,
            triggeredSpecial = lineBlastTrigger
        )
    }
}
