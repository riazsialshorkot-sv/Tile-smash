package com.example.tilesmash.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.tilesmash.model.DifficultyMode
import com.example.tilesmash.ui.theme.*

@Composable
fun StartScreen(
    highScore: Int,
    unlockedLevel: Int,
    soundEnabled: Boolean,
    onToggleSound: () -> Unit,
    onStartGame: (DifficultyMode) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedDifficulty by remember { mutableStateOf(DifficultyMode.NORMAL) }
    var showHowToPlay by remember { mutableStateOf(false) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color(0xFF020617),
                        Color(0xFF0F172A),
                        Color(0xFF020617)
                    )
                )
            )
            .statusBarsPadding()
            .navigationBarsPadding(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp, vertical = 12.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar with Sound Toggle and High Score
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Sound Toggle Button
                IconButton(
                    onClick = onToggleSound,
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(Slate900)
                        .border(1.dp, Slate800, CircleShape)
                ) {
                    Icon(
                        imageVector = if (soundEnabled) Icons.Default.VolumeUp else Icons.Default.VolumeOff,
                        contentDescription = "Toggle Sound",
                        tint = if (soundEnabled) EmeraldGreen else RubyRed,
                        modifier = Modifier.size(20.dp)
                    )
                }

                // High Score Pill
                Row(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(Slate900)
                        .border(1.dp, Slate800, CircleShape)
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.EmojiEvents,
                        contentDescription = null,
                        tint = GoldAccent,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = "Best: %,d".format(highScore),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = GoldAccent
                    )
                }

                // How to play button
                IconButton(
                    onClick = { showHowToPlay = true },
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(Slate900)
                        .border(1.dp, Slate800, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.HelpOutline,
                        contentDescription = "How to Play",
                        tint = SapphireBlue,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Center Hero Emblem & Title
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(
                                    Color(0xFFF59E0B),
                                    Color(0xFFE11D48),
                                    Color(0xFF0284C7)
                                )
                            )
                        )
                        .border(2.dp, GoldAccent, RoundedCornerShape(24.dp))
                        .shadow(16.dp, RoundedCornerShape(24.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(44.dp)
                    )
                }

                Text(
                    text = "TILE SMASH",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.5.sp,
                    color = GoldAccent
                )

                Text(
                    text = "Crystalline Match-3 Puzzle Game",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Slate400
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Difficulty Mode Selector Section
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "SELECT DIFFICULTY",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = Slate400,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(start = 4.dp)
                )

                // 1. Easy Mode Card
                DifficultyCard(
                    title = "Easy Mode",
                    subtitle = "Relaxed & Casual • 34 Moves",
                    isSelected = selectedDifficulty == DifficultyMode.EASY,
                    accentColor = EmeraldGreen,
                    icon = Icons.Default.Shield,
                    onClick = { selectedDifficulty = DifficultyMode.EASY }
                )

                // 2. Normal Mode Card
                DifficultyCard(
                    title = "Normal Mode",
                    subtitle = "Classic Balance • 26 Moves",
                    isSelected = selectedDifficulty == DifficultyMode.NORMAL,
                    accentColor = AmberOrange,
                    icon = Icons.Default.Star,
                    onClick = { selectedDifficulty = DifficultyMode.NORMAL }
                )

                // 3. Hard Mode Card
                DifficultyCard(
                    title = "Hard Mode",
                    subtitle = "Master Challenge • 18 Moves • 1.5x Score",
                    isSelected = selectedDifficulty == DifficultyMode.HARD,
                    accentColor = RubyRed,
                    icon = Icons.Default.Whatshot,
                    onClick = { selectedDifficulty = DifficultyMode.HARD }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Play Launch Button
            Button(
                onClick = { onStartGame(selectedDifficulty) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .shadow(12.dp, RoundedCornerShape(16.dp)),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = when (selectedDifficulty) {
                        DifficultyMode.EASY -> EmeraldGreen
                        DifficultyMode.NORMAL -> AmberOrange
                        DifficultyMode.HARD -> RubyRed
                    }
                )
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = null,
                        modifier = Modifier.size(24.dp)
                    )
                    Text(
                        text = "PLAY ${selectedDifficulty.label.uppercase()} MODE",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.5.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
        }

        // How to Play Modal Dialog
        if (showHowToPlay) {
            HowToPlayDialog(onDismiss = { showHowToPlay = false })
        }
    }
}

@Composable
fun DifficultyCard(
    title: String,
    subtitle: String,
    isSelected: Boolean,
    accentColor: Color,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = if (isSelected) Slate900 else Slate950,
        border = BorderStroke(
            if (isSelected) 2.dp else 1.dp,
            if (isSelected) accentColor else Slate800
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(14.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(accentColor.copy(alpha = 0.15f))
                        .border(1.dp, accentColor.copy(alpha = 0.4f), RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = accentColor,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Column {
                    Text(
                        text = title,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = subtitle,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = Slate400
                    )
                }
            }

            RadioButton(
                selected = isSelected,
                onClick = onClick,
                colors = RadioButtonDefaults.colors(
                    selectedColor = accentColor,
                    unselectedColor = Slate700
                )
            )
        }
    }
}

@Composable
fun HowToPlayDialog(onDismiss: () -> Unit) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = Slate900,
            border = BorderStroke(1.dp, Slate700),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "HOW TO PLAY",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = GoldAccent
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                    }
                }

                RuleItem(
                    title = "Match 3 Gems",
                    desc = "Swap adjacent tiles to line up 3 of the same gem color to smash them and score points."
                )

                RuleItem(
                    title = "Match 4 for Line Blast",
                    desc = "Matching 4 gems creates a Line Blast tile that obliterates an entire row or column."
                )

                RuleItem(
                    title = "Match 5 for Color Bomb",
                    desc = "Matching 5 gems creates a powerful Color Bomb that destroys all tiles of whatever gem color you swap it with!"
                )

                RuleItem(
                    title = "Cascading Combos",
                    desc = "Chain reactions increase your combo multiplier for massive score boosts."
                )

                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen)
                ) {
                    Text("Got It!", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun RuleItem(title: String, desc: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Slate950)
            .border(1.dp, Slate800, RoundedCornerShape(12.dp))
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(text = title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = EmeraldGreen)
        Text(text = desc, fontSize = 11.sp, color = Slate400, lineHeight = 16.sp)
    }
}
