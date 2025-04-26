import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, CircularProgress, Alert, Button, Box, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProfessors, deleteProfessor } from '../services/professorService';
import { Professor } from '../types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const ProfessorListPage: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProfessores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfessors();
      setProfessores(data);
    } catch (err) {
      console.error("Erro ao buscar professores:", err);
      setError('Falha ao carregar os professores. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        await deleteProfessor(id);
        // Atualiza a lista removendo o professor excluído
        setProfessores(prevProfessores => prevProfessores.filter(prof => prof.id !== id));
        // Adicionar feedback de sucesso (Snackbar)
      } catch (err: any) {
        console.error("Erro ao excluir professor:", err);
        const apiError = err.response?.data?.message || 'Falha ao excluir o professor.';
        setError(apiError);
        // Manter o erro visível por um tempo ou usar Snackbar
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  // Mostrar erro de forma mais proeminente
  if (error && !loading) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h4" component="h1">
          Lista de Professores
        </Typography>
        <Button 
          component={RouterLink} 
          to="/professores/new" // Rota para o formulário de novo professor
          variant="contained" 
          color="primary"
        >
          Novo Professor
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>} {/* Mostrar erro mesmo com a tabela */} 
      <TableContainer>
        <Table stickyHeader aria-label="tabela de professores">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Escola</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professores.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhum professor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              professores.map((professor) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={professor.id}>
                  <TableCell>{professor.nome}</TableCell>
                  <TableCell>{professor.escola}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="editar" 
                      color="primary"
                      component={RouterLink}
                      to={`/professores/${professor.id}/edit`} // Rota para editar professor
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="excluir" 
                      color="error"
                      onClick={() => handleDelete(professor.id)}
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

export default ProfessorListPage; 