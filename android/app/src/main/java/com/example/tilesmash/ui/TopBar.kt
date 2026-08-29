package com.example.tilesmash.ui

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.tilesmash.model.DifficultyMode
import com.example.tilesmash.ui.theme.*

@Composable
fun TopBar(
    level: Int,
    score: Int,
    targetScore: Int,
    movesRemaining: Int,
    highScore: Int,
    difficulty: DifficultyMode = DifficultyMode.NORMAL,
    onHome: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val progress = (score.toFloat() / targetScore.coerceAtLeast(1).toFloat()).coerceIn(0f, 1f)
    val animatedProgress by animateFloatAsState(targetValue = progress, label = "progress")
    val isLowMoves = movesRemaining <= 5

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        // Title & High Score Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (onHome != null) {
                    IconButton(
                        onClick = onHome,
                        modifier = Modifier
                            .size(34.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Slate900)
                            .border(1.dp, Slate800, RoundedCornerShape(10.dp))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Main Menu",
                            tint = SapphireBlue,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Brush.linearGradient(listOf(AmberOrange, RubyRed))),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }

                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = "TILE SMASH",
                            fontWeight = FontWeight.Black,
                            fontSize = 16.sp,
                            color = GoldAccent
                        )
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(
                                    when (difficulty) {
                                        DifficultyMode.EASY -> EmeraldGreen.copy(alpha = 0.2f)
                                        DifficultyMode.NORMAL -> AmberOrange.copy(alpha = 0.2f)
                                        DifficultyMode.HARD -> RubyRed.copy(alpha = 0.2f)
                                    }
                                )
                                .border(
                                    1.dp,
                                    when (difficulty) {
                                        DifficultyMode.EASY -> EmeraldGreen
                                        DifficultyMode.NORMAL -> AmberOrange
                                        DifficultyMode.HARD -> RubyRed
                                    },
                                    RoundedCornerShape(4.dp)
                                )
                                .padding(horizontal = 4.dp, vertical = 1.dp)
                        ) {
                            Text(
                                text = difficulty.label,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = when (difficulty) {
                                    DifficultyMode.EASY -> EmeraldGreen
                                    DifficultyMode.NORMAL -> AmberOrange
                                    DifficultyMode.HARD -> RubyRed
                                }
                            )
                        }
                    }
                    Text(
                        text = "LEVEL $level",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate400
                    )
                }
            }

            // High Score Pill
            Row(
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Slate900)
                    .border(1.dp, Slate800, CircleShape)
                    .padding(horizontal = 10.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.EmojiEvents,
                    contentDescription = null,
                    tint = AmberOrange,
                    modifier = Modifier.size(14.dp)
                )
                Text(
                    text = "Best: %,d".format(highScore),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = GoldAccent
                )
            }
        }

        // Stats Cards: Score | Moves | Target
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Score Card
            Surface(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                color = Slate900,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
            ) {
                Column(
                    modifier = Modifier.padding(vertical = 6.dp, horizontal = 6.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("SCORE", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                    Text(
                        text = "%,d".format(score),
                        fontSize = 15.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = AmberOrange
                    )
                }
            }

            // Moves Card
            Surface(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                color = if (isLowMoves) Color(0xFF450A0A) else Slate900,
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (isLowMoves) RubyRed else Slate800
                )
            ) {
                Column(
                    modifier = Modifier.padding(vertical = 6.dp, horizontal = 6.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("MOVES", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                    Text(
                        text = "$movesRemaining",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = if (isLowMoves) RubyRed else SapphireBlue
                    )
                }
            }

            // Target Card
            Surface(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                color = Slate900,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
            ) {
                Column(
                    modifier = Modifier.padding(vertical = 6.dp, horizontal = 6.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Flag,
                            contentDescription = null,
                            tint = EmeraldGreen,
                            modifier = Modifier.size(10.dp)
                        )
                        Text("TARGET", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                    }
                    Text(
                        text = "%,d".format(targetScore),
                        fontSize = 15.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = EmeraldGreen
                    )
                }
            }
        }

        // Progress Bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(14.dp)
                .clip(CircleShape)
                .background(Slate900)
                .border(1.dp, Slate800, CircleShape),
            contentAlignment = Alignment.CenterStart
        ) {
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(animatedProgress)
                    .clip(CircleShape)
                    .background(
                        Brush.horizontalGradient(
                            listOf(EmeraldGreen, GoldAccent)
                        )
                    )
            )
            Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                Text(
                    text = "${(animatedProgress * 100).toInt()}% Complete",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
    }
}
