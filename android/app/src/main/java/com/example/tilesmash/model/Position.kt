package com.example.tilesmash.model

data class Position(
    val row: Int,
    val col: Int
) {
    fun isAdjacentTo(other: Position): Boolean {
        val rowDiff = kotlin.math.abs(row - other.row)
        val colDiff = kotlin.math.abs(col - other.col)
        return (rowDiff == 1 && colDiff == 0) || (rowDiff == 0 && colDiff == 1)
    }
}
