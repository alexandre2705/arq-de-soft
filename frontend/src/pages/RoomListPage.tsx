import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, CircularProgress, Alert, Button, Box, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRooms, deleteRoom } from '../services/roomService';
import { Room } from '../types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const RoomListPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Erro ao buscar salas:", err);
      setError('Falha ao carregar as salas. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await deleteRoom(id);
        setRooms(prevRooms => prevRooms.filter(room => room.id !== id));
      } catch (err) {
        console.error("Erro ao excluir sala:", err);
        setError('Falha ao excluir a sala.');
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
          Lista de Salas
        </Typography>
        <Button 
          component={RouterLink} 
          to="/rooms/new" 
          variant="contained" 
          color="primary"
        >
          Nova Sala
        </Button>
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="tabela de salas">
          <TableHead>
            <TableRow>
              <TableCell>Sigla</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Capacidade</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhuma sala encontrada.
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={room.id}>
                  <TableCell>{room.sigla}</TableCell>
                  <TableCell>{room.nome}</TableCell>
                  <TableCell>{room.capacidade}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="editar"
                      color="primary"
                      component={RouterLink}
                      to={`/rooms/${room.id}/edit`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="excluir"
                      color="error"
                      onClick={() => handleDelete(room.id)}
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

export default RoomListPage; 