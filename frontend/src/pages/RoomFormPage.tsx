import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, CircularProgress, Alert, Paper
} from '@mui/material';
import { getRoomById, createRoom, updateRoom } from '../services/roomService';
import { RoomDTO } from '../types';

const RoomFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<RoomDTO>({
    sigla: '',
    nome: '',
    descricao: '',
    capacidade: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Nova Sala');

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      setPageTitle('Editar Sala');
      getRoomById(id)
        .then(roomData => {
          setFormData({
            sigla: roomData.sigla,
            nome: roomData.nome,
            capacidade: Number(roomData.capacidade) || 0,
            descricao: roomData.descricao || '',
          });
        })
        .catch(err => {
          console.error('Erro ao buscar sala para edição:', err);
          setError('Falha ao carregar dados da sala para edição.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await updateRoom(id, formData);
        navigate('/rooms');
      } else {
        await createRoom(formData);
        navigate('/rooms');
      }
    } catch (err: any) {
      console.error('Erro ao salvar sala:', err);
      const apiError = err.response?.data?.message || err.response?.data || 'Ocorreu um erro desconhecido.';
      setError(`Falha ao salvar a sala: ${apiError}`);
    }
  };

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
            id="sigla"
            label="Sigla"
            name="sigla"
            autoFocus
            value={formData.sigla}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome da Sala / Laboratório"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            id="descricao"
            label="Descrição"
            name="descricao"
            multiline
            rows={3}
            value={formData.descricao}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="capacidade"
            label="Capacidade de Alunos"
            name="capacidade"
            type="number"
            value={formData.capacidade}
            onChange={handleChange}
            disabled={loading}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="button"
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() => navigate('/rooms')}
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

export default RoomFormPage; 