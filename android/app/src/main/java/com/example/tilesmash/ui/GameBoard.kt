package com.example.tilesmash.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.tilesmash.model.FloatingScore
import com.example.tilesmash.model.Position
import com.example.tilesmash.model.Tile
import com.example.tilesmash.ui.theme.GoldAccent
import com.example.tilesmash.ui.theme.RubyRed
import com.example.tilesmash.ui.theme.Slate800
import com.example.tilesmash.ui.theme.Slate900

@Composable
fun GameBoard(
    board: List<List<Tile?>>,
    selectedTile: Position?,
    hintTiles: List<Position>?,
    floatingScores: List<FloatingScore>,
    comboBanner: String?,
    activeLineBlast: Pair<String, Int>?,
    onTileClick: (Position) -> Unit,
    onTileSwipe: (Position, String) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .padding(12.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(Slate900)
            .border(2.dp, Slate800, RoundedCornerShape(24.dp))
            .padding(8.dp),
        contentAlignment = Alignment.Center
    ) {
        // 8x8 Grid
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            for (r in 0 until 8) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    for (c in 0 until 8) {
                        val tile = board.getOrNull(r)?.getOrNull(c)
                        val isSelected = selectedTile?.row == r && selectedTile?.col == c
                        val isHinted = hintTiles?.any { it.row == r && it.col == c } == true

                        TileView(
                            tile = tile,
                            isSelected = isSelected,
                            isHinted = isHinted,
                            onClick = { onTileClick(Position(r, c)) },
                            onSwipe = { direction -> onTileSwipe(Position(r, c), direction) },
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight()
                        )
                    }
                }
            }
        }

        // Line Blast Laser Beam Overlay
        activeLineBlast?.let { (type, index) ->
            if (type == "HORIZONTAL") {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .offset(y = ((index - 3.5f) * 44).dp)
                        .background(
                            Brush.horizontalGradient(
                                listOf(Color.Transparent, Color.White, Color.Transparent)
                            )
                        )
                )
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxHeight()
                        .width(8.dp)
                        .offset(x = ((index - 3.5f) * 44).dp)
                        .background(
                            Brush.verticalGradient(
                                listOf(Color.Transparent, Color.White, Color.Transparent)
                            )
                        )
                )
            }
        }

        // Combo Banner Overlay
        AnimatedVisibility(
            visible = comboBanner != null,
            enter = fadeIn(tween(150)),
            exit = fadeOut(tween(200))
        ) {
            comboBanner?.let { banner ->
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(
                            Brush.horizontalGradient(
                                listOf(GoldAccent, RubyRed)
                            )
                        )
                        .padding(horizontal = 20.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = banner,
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }
    }
}
