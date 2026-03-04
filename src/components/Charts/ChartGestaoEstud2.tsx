import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const uData = [20, 21, 30, 46, 18, 23, 34, 34, 29, 37, 43, 50];
const pData = [25, 12, 60, 39, 5, 38, 43, 23, 54, 32, 13, 44];
const xLabels = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export default function ChartGestaoEstud2() {
  return (
    <Box sx={{ width: '100%', height: 300, transition: 'all 50s ease-in-out' }}>
      <LineChart
      
        series={[
          { data: pData, label: 'Ativo', color: '#268cff' },
          { data: uData, label: 'Inativo', color: '#c76d50' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels, height: 28 }]}
        yAxis={[{ width: 50 }]}
        margin={margin}
      />
    </Box>
  );
}
