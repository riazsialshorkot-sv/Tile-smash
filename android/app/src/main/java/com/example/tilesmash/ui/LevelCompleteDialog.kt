package com.example.tilesmash.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.tilesmash.ui.theme.*

@Composable
fun LevelCompleteDialog(
    isOpen: Boolean,
    level: Int,
    score: Int,
    movesBonus: Int,
    totalScore: Int,
    onNextLevel: () -> Unit,
    onReplay: () -> Unit,
    onHome: (() -> Unit)? = null
) {
    if (!isOpen) return

    Dialog(onDismissRequest = {}) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = Slate900,
            border = androidx.compose.foundation.BorderStroke(2.dp, GoldAccent),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Celebration Stars
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Star, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(28.dp))
                    Icon(Icons.Default.Star, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(40.dp))
                    Icon(Icons.Default.Star, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(28.dp))
                }

                Text(
                    text = "LEVEL COMPLETE!",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = GoldAccent
                )

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Slate950,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Level Score:", color = Slate400)
                            Text("%,d".format(score), fontWeight = FontWeight.Bold, color = Color.White)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Moves Bonus:", color = Slate400)
                            Text("+%,d".format(movesBonus), fontWeight = FontWeight.Bold, color = EmeraldGreen)
                        }
                        Divider(color = Slate800, modifier = Modifier.padding(vertical = 4.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Total Score:", fontWeight = FontWeight.Bold, color = GoldAccent)
                            Text("%,d".format(totalScore), fontWeight = FontWeight.Black, fontSize = 18.sp, color = GoldAccent)
                        }
                    }
                }

                Button(
                    onClick = onNextLevel,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen)
                ) {
                    Text("Next Level", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(Modifier.width(8.dp))
                    Icon(Icons.Default.ArrowForward, contentDescription = null)
                }

                Button(
                    onClick = onReplay,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate800)
                ) {
                    Text("Replay Level", color = Slate400, fontWeight = FontWeight.Bold)
                }

                if (onHome != null) {
                    Button(
                        onClick = onHome,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Slate900)
                    ) {
                        Icon(Icons.Default.Home, contentDescription = null, tint = SapphireBlue)
                        Spacer(Modifier.width(8.dp))
                        Text("Main Menu", color = Slate300, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
