import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Container, Typography, Box, CircularProgress, Alert,
  Select, MenuItem, InputLabel, FormControl, Grid, Paper
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { createReservation } from '../services/reservationService';
import { getRooms } from '../services/roomService';
import { getProfessors } from '../services/professorService';
import { ReservationDTO, Room, Professor } from '../types';
import { SelectChangeEvent } from '@mui/material/Select';

const ReservationFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFormData = async () => {
      setFormLoading(true);
      setError(null);
      try {
        const [roomsData, professorsData] = await Promise.all([
          getRooms(),
          getProfessors()
        ]);
        setRooms(roomsData);
        setProfessors(professorsData);
      } catch (err) {
        console.error("Erro ao carregar dados do formulário de reserva:", err);
        setError('Falha ao carregar salas ou professores. Tente novamente.');
      }
      setFormLoading(false);
    };
    loadFormData();
  }, []);

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoomId(event.target.value as string);
  };

  const handleProfessorChange = (event: SelectChangeEvent<string>) => {
    setSelectedProfessorId(event.target.value as string);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedRoomId || !selectedProfessorId || !selectedDate || !startTime || !endTime) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }

    if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
        setError('A hora final deve ser posterior à hora inicial.');
        setLoading(false);
        return;
    }

    const reservationData: ReservationDTO = {
      espacoId: selectedRoomId,
      professorId: selectedProfessorId,
      dataReserva: selectedDate.format('YYYY-MM-DD'),
      horaInicio: startTime.format('HH:mm:ss'),
      horaFim: endTime.format('HH:mm:ss')
    };

    try {
      await createReservation(reservationData);
      navigate('/reservations');
    } catch (err: any) {
      console.error("Erro ao criar reserva:", err);
      const apiError = err.response?.data?.message || err.response?.data || 'Ocorreu um erro desconhecido ao tentar criar a reserva.';
      setError(`Falha ao criar reserva: ${apiError}`);
      setLoading(false);
    }
  };

  if (formLoading) {
    return <CircularProgress />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Solicitar Reserva de Espaço
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            
            <FormControl fullWidth margin="normal" required disabled={loading}>
              <InputLabel id="room-select-label">Espaço (Sala/Laboratório)</InputLabel>
              <Select
                labelId="room-select-label"
                id="room-select"
                value={selectedRoomId}
                label="Espaço (Sala/Laboratório)"
                onChange={handleRoomChange}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id.toString()}> 
                    {room.sigla} - {room.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required disabled={loading}>
              <InputLabel id="professor-select-label">Professor Solicitante</InputLabel>
              <Select
                labelId="professor-select-label"
                id="professor-select"
                value={selectedProfessorId}
                label="Professor Solicitante"
                onChange={handleProfessorChange}
              >
                {professors.map((professor) => (
                  <MenuItem key={professor.id} value={professor.id}> 
                    {professor.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePicker
              label="Data da Reserva"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              disablePast
              sx={{ mt: 2, mb: 1, width: '100%' }} 
              disabled={loading}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 1 }}>
              <TimePicker
                label="Hora Início"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                sx={{ flexGrow: 1 }}
                disabled={loading}
              />
              <TimePicker
                label="Hora Fim"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                sx={{ flexGrow: 1 }}
                disabled={loading}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                type="button"
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => navigate('/reservations')} 
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || formLoading}
              >
                {loading ? <CircularProgress size={24} /> : 'Solicitar Reserva'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default ReservationFormPage; 