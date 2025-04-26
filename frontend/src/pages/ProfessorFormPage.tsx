import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, CircularProgress, Alert, Paper
} from '@mui/material';
import { getProfessorById, createProfessor, updateProfessor } from '../services/professorService';
import { ProfessorDTO } from '../types';

const ProfessorFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<ProfessorDTO>({
    nome: '',
    escola: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Novo Professor');

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      setPageTitle('Editar Professor');
      getProfessorById(id)
        .then(professorData => {
          setFormData({
            nome: professorData.nome,
            escola: professorData.escola,
          });
        })
        .catch(err => {
          console.error("Erro ao buscar professor para edição:", err);
          setError('Falha ao carregar dados do professor para edição.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Validação simples no frontend (pode ser melhorada com libs como Yup)
    if (!formData.nome || !formData.escola) {
        setError('Os campos Nome e Escola são obrigatórios.');
        setLoading(false);
        return;
    }

    try {
      if (isEditMode && id) {
        await updateProfessor(id, formData);
        navigate('/professores'); // Redireciona para a lista após sucesso
      } else {
        await createProfessor(formData);
        navigate('/professores'); // Redireciona para a lista após sucesso
      }
    } catch (err: any) {
      console.error("Erro ao salvar professor:", err);
      const apiError = err.response?.data?.message || err.response?.data || 'Ocorreu um erro desconhecido.';
      setError(`Falha ao salvar o professor: ${apiError}`);
      setLoading(false); // Mantém no formulário em caso de erro
    } 
  };

  // Mostra loading apenas ao buscar dados para edição
  if (loading && isEditMode) {
    return <CircularProgress />;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {pageTitle}
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome do Professor"
            name="nome"
            autoFocus
            value={formData.nome}
            onChange={handleChange}
            disabled={loading} // Desabilita enquanto carrega/submete
            error={!formData.nome && !!error} // Indica erro se campo vazio e houve tentativa de submissão
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="escola"
            label="Escola / Departamento"
            name="escola"
            value={formData.escola}
            onChange={handleChange}
            disabled={loading}
            error={!formData.escola && !!error}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="button"
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() => navigate('/professores')} // Botão Cancelar volta para a lista
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfessorFormPage; 