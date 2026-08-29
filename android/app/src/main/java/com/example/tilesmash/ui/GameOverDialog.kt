package com.example.tilesmash.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.tilesmash.ui.theme.*

@Composable
fun GameOverDialog(
    isOpen: Boolean,
    finalScore: Int,
    level: Int,
    targetScore: Int,
    highScore: Int,
    onTryAgain: () -> Unit,
    onRestartFromLevel1: () -> Unit,
    onHome: (() -> Unit)? = null
) {
    if (!isOpen) return

    Dialog(onDismissRequest = {}) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = Slate900,
            border = androidx.compose.foundation.BorderStroke(2.dp, RubyRed),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    text = "GAME OVER",
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Black,
                    color = RubyRed
                )
                Text(
                    text = "Out of moves on Level $level",
                    fontSize = 12.sp,
                    color = Slate400
                )

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Slate950,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Final Score:", color = Slate400)
                            Text("%,d".format(finalScore), fontWeight = FontWeight.Bold, color = AmberOrange)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Target Score:", color = Slate400)
                            Text("%,d".format(targetScore), fontWeight = FontWeight.Bold, color = EmeraldGreen)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Best Record:", color = Slate400)
                            Text("%,d".format(highScore), fontWeight = FontWeight.Bold, color = GoldAccent)
                        }
                    }
                }

                Button(
                    onClick = onTryAgain,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = RubyRed)
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Try Again", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }

                if (onHome != null) {
                    Button(
                        onClick = onHome,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Slate800)
                    ) {
                        Icon(Icons.Default.Home, contentDescription = null, tint = SapphireBlue)
                        Spacer(Modifier.width(8.dp))
                        Text("Main Menu & Difficulty", color = SapphireBlue, fontWeight = FontWeight.Bold)
                    }
                }

                Button(
                    onClick = onRestartFromLevel1,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900)
                ) {
                    Text("Restart Level 1", color = Slate400, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
