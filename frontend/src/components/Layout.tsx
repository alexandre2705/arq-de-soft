import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Controle de Espaços Acadêmicos
            </RouterLink>
          </Typography>
          {/* Links de Navegação */}
          <Button color="inherit" component={RouterLink} to="/rooms">
            Salas
          </Button>
          <Button color="inherit" component={RouterLink} to="/professores">
            Professores
          </Button>
          <Button color="inherit" component={RouterLink} to="/equipments">
            Equipamentos
          </Button>
          <Button color="inherit" component={RouterLink} to="/reservations">
            Reservas
          </Button>
          {/* Adicionar links para Reservas, etc. aqui */}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          marginTop: '64px', // Altura padrão da AppBar
        }}
      >
        <Container maxWidth="lg">
          {/* O conteúdo da rota atual será renderizado aqui */}
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 