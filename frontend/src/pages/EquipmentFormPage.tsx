import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  TextField, Button, Container, Typography, Box, CircularProgress, Alert 
} from '@mui/material';
import { createEquipment, getEquipmentById, updateEquipment } from '../services/equipmentService';
import { EquipmentDTO } from '../types';
import axios from 'axios';

const EquipmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<EquipmentDTO>({
    name: '',
  });
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      setIsLoadingData(true);
      getEquipmentById(id)
        .then(equipment => {
          setFormData({ name: equipment.name });
          setError(null);
        })
        .catch(err => {
          console.error("Erro ao buscar equipamento:", err);
          setError("Falha ao carregar equipamento para edição.");
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [id, isEditMode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await updateEquipment(id, formData);
      } else {
        await createEquipment(formData);
      }
      navigate('/equipments');
    } catch (err) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} equipamento:`, err);
      let errorMessage = `Falha ao ${isEditMode ? 'atualizar' : 'criar'} o equipamento.`;
      if (axios.isAxiosError(err) && err.response?.data?.message) {
          errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
          errorMessage = err.message;
      }
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Editar Equipamento' : 'Novo Equipamento'}
      </Typography>
      {error && !isSubmitting && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nome do Equipamento"
          name="name"
          autoComplete="off"
          autoFocus
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting || isLoadingData}
        />
        
        {error && isSubmitting && (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting || isLoadingData}
        >
          {isSubmitting ? <CircularProgress size={24} /> : (isEditMode ? 'Salvar Alterações' : 'Criar Equipamento')}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate('/equipments')}
          disabled={isSubmitting || isLoadingData}
        >
          Cancelar
        </Button>
      </Box>
    </Container>
  );
};

export default EquipmentFormPage; 