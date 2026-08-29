package com.example.tilesmash.game

import com.example.tilesmash.model.Position
import com.example.tilesmash.model.SpecialTile
import com.example.tilesmash.model.Tile
import com.example.tilesmash.model.TileType
import kotlin.random.Random

object BoardGenerator {
    const val BOARD_SIZE = 8
    val ALL_TYPES = TileType.values().toList()

    fun createTile(row: Int, col: Int, type: TileType? = null, special: SpecialTile = SpecialTile.NONE): Tile {
        val selectedType = type ?: ALL_TYPES[Random.nextInt(ALL_TYPES.size)]
        return Tile(
            type = selectedType,
            special = special,
            row = row,
            col = col
        )
    }

    /**
     * Generates an initial board with NO immediate matches and AT LEAST one valid move.
     */
    fun generatePlayableBoard(): List<List<Tile?>> {
        var attempts = 0
        while (attempts < 100) {
            attempts++
            val board = mutableListOf<MutableList<Tile?>>()

            for (r in 0 until BOARD_SIZE) {
                val row = mutableListOf<Tile?>()
                for (c in 0 until BOARD_SIZE) {
                    val invalidTypes = mutableSetOf<TileType>()

                    // Check horizontal match-3 prevention
                    if (c >= 2 && row[c - 1]?.type != null && row[c - 1]?.type == row[c - 2]?.type) {
                        invalidTypes.add(row[c - 1]!!.type)
                    }

                    // Check vertical match-3 prevention
                    if (r >= 2 && board[r - 1][c]?.type != null && board[r - 1][c]?.type == board[r - 2][c]?.type) {
                        invalidTypes.add(board[r - 1][c]!!.type)
                    }

                    val validTypes = ALL_TYPES.filter { it !in invalidTypes }
                    val tileType = if (validTypes.isNotEmpty()) {
                        validTypes[Random.nextInt(validTypes.size)]
                    } else {
                        ALL_TYPES[Random.nextInt(ALL_TYPES.size)]
                    }

                    row.add(createTile(r, c, tileType))
                }
                board.add(row)
            }

            // Verify matches == 0 and possible moves > 0
            if (MatchDetector.findMatches(board).isEmpty() && MatchDetector.findPossibleMoves(board).isNotEmpty()) {
                return board
            }
        }

        // Fallback
        return List(BOARD_SIZE) { r ->
            List(BOARD_SIZE) { c ->
                createTile(r, c)
            }
        }
    }

    /**
     * Shuffles an existing board ensuring no immediate matches and at least one move
     */
    fun shuffleBoard(currentBoard: List<List<Tile?>>): List<List<Tile?>> {
        val flatTiles = currentBoard.flatten().filterNotNull().map { it.type }.toMutableList()

        var attempts = 0
        while (attempts < 100) {
            attempts++
            flatTiles.shuffle()

            var index = 0
            val newBoard = List(BOARD_SIZE) { r ->
                List(BOARD_SIZE) { c ->
                    createTile(r, c, flatTiles[index++])
                }
            }

            if (MatchDetector.findMatches(newBoard).isEmpty() && MatchDetector.findPossibleMoves(newBoard).isNotEmpty()) {
                return newBoard
            }
        }

        return generatePlayableBoard()
    }
}
