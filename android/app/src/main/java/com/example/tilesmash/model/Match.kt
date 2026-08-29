package com.example.tilesmash.model

enum class MatchDirection {
    HORIZONTAL,
    VERTICAL,
    CROSS
}

data class Match(
    val tiles: List<Tile>,
    val type: TileType,
    val direction: MatchDirection = MatchDirection.HORIZONTAL,
    val specialCreation: SpecialTile = SpecialTile.NONE
)
