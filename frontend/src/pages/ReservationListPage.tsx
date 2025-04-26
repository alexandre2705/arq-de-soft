import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, CircularProgress, Alert, Button, Box, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Cancel';
import { getReservations, deleteReservation } from '../services/reservationService';
import { Reservation } from '../types';
import { Link as RouterLink } from 'react-router-dom';

const ReservationListPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReservations(); 
      setReservations(data);
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      setError('Falha ao carregar as reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await deleteReservation(id);
        setReservations(prev => prev.filter(res => res.id !== id));
      } catch (err) {
        console.error("Erro ao cancelar reserva:", err);
        setError('Falha ao cancelar a reserva.');
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h4" component="h1">
          Lista de Reservas
        </Typography>
        <Button 
          component={RouterLink} 
          to="/reservations/new"
          variant="contained" 
          color="primary"
        >
          Nova Reserva
        </Button>
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="tabela de reservas">
          <TableHead>
            <TableRow>
              <TableCell>Espaço (Sala)</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Início</TableCell>
              <TableCell>Fim</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>...</TableCell></TableRow>
            ) : error ? (
              <TableRow><TableCell colSpan={6}><Alert severity="error">{error}</Alert></TableCell></TableRow>
            ) : reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma reserva encontrada.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((reservation) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={reservation.id}>
                  <TableCell>{reservation.espaco?.nome || 'N/A'}</TableCell>
                  <TableCell>{reservation.professor?.nome || 'N/A'}</TableCell>
                  <TableCell>{reservation.dataReserva}</TableCell>
                  <TableCell>{reservation.horaInicio}</TableCell>
                  <TableCell>{reservation.horaFim}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="cancelar"
                      color="error"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReservationListPage; 