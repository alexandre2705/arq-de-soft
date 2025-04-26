import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, CircularProgress, Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Importar o hook useAuth
import { loginUser } from '../services/authService'; // Importar serviço de autenticação

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Obter a função login do contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Usar o authService e o contexto de autenticação
      await login({ email, password });
      navigate('/'); // Redirecionar para a página inicial
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      
      // Verificar se é um erro do Axios com status HTTP
      if (err.response) {
        if (err.response.status === 401) {
          setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        } else if (err.response.status === 400) {
          setError('Erro de validação. Verifique os campos.');
        } else {
          setError(`Falha ao tentar fazer login (Status: ${err.response.status}). Tente novamente mais tarde.`);
        }
      } else {
        setError('Ocorreu um erro de rede ou servidor. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage; 