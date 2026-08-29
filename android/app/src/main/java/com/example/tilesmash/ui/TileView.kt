package com.example.tilesmash.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.tilesmash.model.SpecialTile
import com.example.tilesmash.model.Tile
import com.example.tilesmash.model.TileType
import com.example.tilesmash.ui.theme.*
import kotlin.math.abs

@Composable
fun TileView(
    tile: Tile?,
    isSelected: Boolean,
    isHinted: Boolean,
    onClick: () -> Unit,
    onSwipe: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    if (tile == null) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0x220F172A))
        )
        return
    }

    // Selection scale animation
    val scale by animateFloatAsState(
        targetValue = if (isSelected) 1.15f else 1.0f,
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "tile_scale"
    )

    // Hint pulse
    val infiniteTransition = rememberInfiniteTransition(label = "hint_transition")
    val hintAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "hint_alpha"
    )

    val (brush, borderColor) = when (tile.type) {
        TileType.RUBY -> Brush.verticalGradient(listOf(RubyRed, RubyDark)) to RubyRed
        TileType.AMBER -> Brush.verticalGradient(listOf(AmberOrange, AmberDark)) to AmberOrange
        TileType.TOPAZ -> Brush.verticalGradient(listOf(TopazYellow, TopazDark)) to TopazYellow
        TileType.EMERALD -> Brush.verticalGradient(listOf(EmeraldGreen, EmeraldDark)) to EmeraldGreen
        TileType.SAPPHIRE -> Brush.verticalGradient(listOf(SapphireBlue, SapphireDark)) to SapphireBlue
        TileType.AMETHYST -> Brush.verticalGradient(listOf(AmethystPurple, AmethystDark)) to AmethystPurple
    }

    var totalDragX by remember { mutableFloatStateOf(0f) }
    var totalDragY by remember { mutableFloatStateOf(0f) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .scale(scale)
            .pointerInput(tile.id) {
                detectDragGestures(
                    onDragStart = {
                        totalDragX = 0f
                        totalDragY = 0f
                    },
                    onDrag = { change, dragAmount ->
                        change.consume()
                        totalDragX += dragAmount.x
                        totalDragY += dragAmount.y
                    },
                    onDragEnd = {
                        val absX = abs(totalDragX)
                        val absY = abs(totalDragY)
                        if (absX > 30f || absY > 30f) {
                            if (absX > absY) {
                                if (totalDragX > 0) onSwipe("RIGHT") else onSwipe("LEFT")
                            } else {
                                if (totalDragY > 0) onSwipe("DOWN") else onSwipe("UP")
                            }
                        } else {
                            onClick()
                        }
                    }
                )
            }
            .clickable { onClick() }
            .then(
                if (isSelected) {
                    Modifier.border(3.dp, Color.White, RoundedCornerShape(12.dp))
                } else if (isHinted) {
                    Modifier.border(
                        2.dp,
                        GoldAccent.copy(alpha = hintAlpha),
                        RoundedCornerShape(12.dp)
                    )
                } else {
                    Modifier
                }
            )
            .shadow(4.dp, RoundedCornerShape(12.dp))
            .clip(RoundedCornerShape(12.dp))
            .background(
                if (tile.special == SpecialTile.COLOR_BOMB) {
                    Brush.radialGradient(listOf(GoldAccent, RubyRed, SapphireBlue))
                } else {
                    brush
                }
            ),
        contentAlignment = Alignment.Center
    ) {
        // Glossy Highlight reflection
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .fillMaxWidth(0.85f)
                .fillMaxHeight(0.35f)
                .padding(top = 2.dp)
                .clip(RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp))
                .background(
                    Brush.verticalGradient(
                        listOf(Color.White.copy(alpha = 0.55f), Color.Transparent)
                    )
                )
        )

        // Glyph Icon depending on type and special
        when (tile.special) {
            SpecialTile.COLOR_BOMB -> {
                Icon(
                    imageVector = Icons.Default.BrightnessAuto,
                    contentDescription = "Color Bomb",
                    tint = Color.White,
                    modifier = Modifier.size(24.dp)
                )
            }
            SpecialTile.LINE_BLAST_HORIZONTAL -> {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.ArrowBack, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                    Box(modifier = Modifier.height(2.dp).weight(1f).background(Color.White))
                    Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                }
            }
            SpecialTile.LINE_BLAST_VERTICAL -> {
                Column(
                    modifier = Modifier.fillMaxHeight().padding(vertical = 2.dp),
                    verticalArrangement = Arrangement.SpaceBetween,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(Icons.Default.ArrowUpward, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                    Box(modifier = Modifier.width(2.dp).weight(1f).background(Color.White))
                    Icon(Icons.Default.ArrowDownward, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                }
            }
            SpecialTile.NONE -> {
                val iconVector = when (tile.type) {
                    TileType.RUBY -> Icons.Default.Favorite
                    TileType.AMBER -> Icons.Default.Star
                    TileType.TOPAZ -> Icons.Default.Diamond
                    TileType.EMERALD -> Icons.Default.Shield
                    TileType.SAPPHIRE -> Icons.Default.WaterDrop
                    TileType.AMETHYST -> Icons.Default.Hexagon
                }
                Icon(
                    imageVector = iconVector,
                    contentDescription = tile.type.name,
                    tint = Color.White.copy(alpha = 0.9f),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
