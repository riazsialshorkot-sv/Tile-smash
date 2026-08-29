package com.example.tilesmash.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.VolumeOff
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.tilesmash.ui.theme.*

@Composable
fun GameControls(
    onRestart: () -> Unit,
    onHint: () -> Unit,
    onToggleSound: () -> Unit,
    onPause: () -> Unit,
    soundEnabled: Boolean,
    isProcessing: Boolean,
    isHintActive: Boolean,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        ControlButton(
            icon = Icons.Default.Refresh,
            label = "Restart",
            iconTint = AmberOrange,
            onClick = onRestart,
            enabled = !isProcessing,
            modifier = Modifier.weight(1f)
        )

        ControlButton(
            icon = Icons.Default.Lightbulb,
            label = "Hint",
            iconTint = TopazYellow,
            onClick = onHint,
            enabled = !isProcessing,
            isActive = isHintActive,
            modifier = Modifier.weight(1f)
        )

        ControlButton(
            icon = if (soundEnabled) Icons.Default.VolumeUp else Icons.Default.VolumeOff,
            label = if (soundEnabled) "Sound" else "Muted",
            iconTint = if (soundEnabled) EmeraldGreen else RubyRed,
            onClick = onToggleSound,
            modifier = Modifier.weight(1f)
        )

        ControlButton(
            icon = Icons.Default.Pause,
            label = "Pause",
            iconTint = SapphireBlue,
            onClick = onPause,
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
private fun ControlButton(
    icon: ImageVector,
    label: String,
    iconTint: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    isActive: Boolean = false
) {
    Surface(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .clickable(enabled = enabled, onClick = onClick),
        shape = RoundedCornerShape(14.dp),
        color = if (isActive) AmberOrange.copy(alpha = 0.2f) else Slate900,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isActive) GoldAccent else Slate800
        )
    ) {
        Column(
            modifier = Modifier.padding(vertical = 8.dp, horizontal = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (enabled) iconTint else Slate400,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = label,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = if (enabled) Color.White else Slate400
            )
        }
    }
}
