import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';

// Gradient ProgressBar styling
const GradientProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  background: 'linear-gradient(to right, #f44336, #ff9800, #ffeb3b, #8bc34a, #4caf50)', // Gradient
  '& .MuiLinearProgress-bar': {
    borderRadius: 10,
    backgroundColor: 'transparent', // Hide default color
  },
}));

// Arrow indicator styling
const IndicatorWrapper = styled(Box)(({ value }) => ({
  position: 'relative',
  height: '30px',
  marginTop: '-25px', // Adjust arrow placement above the bar
  left: `${value - 25}%`, // Position based on value
}));

// CognitiveWorkloadBar component for each data point
export const CognitiveWorkloadBar = ({ label, value }) => {
  // Normalize the value to a percentage
  const normalizedValue = (value / 20) * 100; // Assuming 7 is the max score

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', mb: 4 }}>
      <Typography variant="subtitle1" align="left" gutterBottom>
        {label}
      </Typography>

      {/* Gradient ProgressBar */}
      <GradientProgress variant="determinate" value={normalizedValue} />

      {/* Arrow indicator */}
      <IndicatorWrapper value={normalizedValue}>
          <Tooltip title={`${Math.floor(value) }`} placement="right-start">
            <ArrowDropUpIcon
              sx={{ fontSize: 30, color: '#8bc34a', marginTop: '18px' }} // Customize arrow color
            />
          </Tooltip>
      </IndicatorWrapper>
    </Box>
  );
};

// Main component rendering all workload bars
const CognitiveWorkloadChart = (props) => {

  const {data} = props

  const cognitiveWorkload  = data;

  return (
    <Box sx={{ p: 4 }}>
      {/* Render bars for each workload factor */}
      <CognitiveWorkloadBar label="Mental Demand" value={cognitiveWorkload.average_mental_demand} />
      <CognitiveWorkloadBar label="Physical Demand" value={cognitiveWorkload.average_physical_demand} />
      <CognitiveWorkloadBar label="Temporal Demand" value={cognitiveWorkload.average_temporal_demand} />
      <CognitiveWorkloadBar label="Performance" value={cognitiveWorkload.average_performance} />
      <CognitiveWorkloadBar label="Effort" value={cognitiveWorkload.average_effort} />
      <CognitiveWorkloadBar label="Frustration" value={cognitiveWorkload.average_frustration} />
    </Box>
  );
};

export default CognitiveWorkloadChart;
