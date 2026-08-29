package com.example.tilesmash.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.VolumeOff
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.tilesmash.ui.theme.*

@Composable
fun PauseDialog(
    isOpen: Boolean,
    soundEnabled: Boolean,
    onResume: () -> Unit,
    onRestart: () -> Unit,
    onHome: (() -> Unit)? = null,
    onToggleSound: () -> Unit
) {
    if (!isOpen) return

    Dialog(onDismissRequest = onResume) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = Slate900,
            border = androidx.compose.foundation.BorderStroke(1.dp, Slate700),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    text = "GAME PAUSED",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )

                Button(
                    onClick = onResume,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen)
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Resume Game", fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = onRestart,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate800)
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null, tint = AmberOrange)
                    Spacer(Modifier.width(8.dp))
                    Text("Restart Level", fontWeight = FontWeight.Bold)
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
                        Text("Main Menu & Difficulty", fontWeight = FontWeight.Bold, color = SapphireBlue)
                    }
                }

                Button(
                    onClick = onToggleSound,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate800)
                ) {
                    Icon(
                        imageVector = if (soundEnabled) Icons.Default.VolumeUp else Icons.Default.VolumeOff,
                        contentDescription = null,
                        tint = if (soundEnabled) EmeraldGreen else RubyRed
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(
                        text = if (soundEnabled) "Sound: ON" else "Sound: MUTED",
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
