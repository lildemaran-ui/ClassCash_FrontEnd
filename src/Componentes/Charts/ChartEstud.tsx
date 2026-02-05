import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const data = [
  { value: 5, label: 'Cartão Escolar', color: '#268cff' },
  { value: 10, label: 'Uniformes', color: '#393b3b' },
  { value: 15, label: 'Propinas', color: '#72a7ff'},

];

const size = {
  width: 200,
  height: 200,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 16,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function ChartEstud() {
   return (
    <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
      <PieCenterLabel >Serviços solicitados</PieCenterLabel>
    </PieChart>
  );
}