import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, CircularProgress, Alert, Button, Box, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getEquipments, deleteEquipment } from '../services/equipmentService';
import { Equipment } from '../types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const EquipmentListPage: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEquipments(); 
      setEquipments(data);
    } catch (err) {
      console.error("Erro ao buscar equipamentos:", err);
      setError('Falha ao carregar os equipamentos. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
      try {
        await deleteEquipment(id);
        setEquipments(prev => prev.filter(eq => eq.id !== id));
      } catch (err) {
        console.error("Erro ao excluir equipamento:", err);
        setError('Falha ao excluir o equipamento.');
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
          Lista de Equipamentos
        </Typography>
        <Button 
          component={RouterLink} 
          to="/equipments/new" 
          variant="contained" 
          color="primary"
        >
          Novo Equipamento
        </Button>
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="tabela de equipamentos">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={2}>...</TableCell></TableRow>
            ) : error ? (
              <TableRow><TableCell colSpan={2}>...</TableCell></TableRow>
            ) : equipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center"> 
                  Nenhum equipamento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              equipments.map((equipment) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={equipment.id}>
                  <TableCell>{equipment.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="editar"
                      color="primary"
                      component={RouterLink}
                      to={`/equipments/${equipment.id}/edit`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="excluir"
                      color="error"
                      onClick={() => handleDelete(equipment.id)}
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

export default EquipmentListPage; 