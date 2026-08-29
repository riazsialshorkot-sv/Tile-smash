package com.example.tilesmash.model

import java.util.UUID

data class Tile(
    val id: String = UUID.randomUUID().toString(),
    val type: TileType,
    val special: SpecialTile = SpecialTile.NONE,
    val row: Int,
    val col: Int,
    val isMatched: Boolean = false,
    val isHinted: Boolean = false
)
