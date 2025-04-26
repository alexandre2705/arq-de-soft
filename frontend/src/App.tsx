import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Typography } from '@mui/material';
import RoomListPage from './pages/RoomListPage';
import RoomFormPage from './pages/RoomFormPage';
import EquipmentListPage from './pages/EquipmentListPage';
import EquipmentFormPage from './pages/EquipmentFormPage';
import ReservationListPage from './pages/ReservationListPage';
import ReservationFormPage from './pages/ReservationFormPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfessorListPage from './pages/ProfessorListPage';
import ProfessorFormPage from './pages/ProfessorFormPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas fora do Layout principal (ex: Login) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas que usam o Layout principal */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            {/* Rota Index (Página Inicial) */}
            <Route index element={<HomePage />} />

            {/* Rotas de Salas */}
            <Route path="rooms" element={<RoomListPage />} />
            <Route path="rooms/new" element={<RoomFormPage />} />
            <Route path="rooms/:id/edit" element={<RoomFormPage />} />

            {/* Rotas de Professores */}
            <Route path="professores" element={<ProfessorListPage />} />
            <Route path="professores/new" element={<ProfessorFormPage />} />
            <Route path="professores/:id/edit" element={<ProfessorFormPage />} />

            {/* Rota para listar Equipamentos */}
            <Route path="equipments" element={<EquipmentListPage />} />
            <Route path="equipments/new" element={<EquipmentFormPage />} />
            <Route path="equipments/:id/edit" element={<EquipmentFormPage />} />

            {/* Rota para listar Reservas */}
            <Route path="reservations" element={<ReservationListPage />} />
            <Route path="reservations/new" element={<ReservationFormPage />} />

            {/* Outras rotas dentro do layout podem ser adicionadas aqui */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

// Componente simples para a página inicial
const HomePage = () => {
  return (
    <Typography variant="h4" component="h1" gutterBottom>
      Bem-vindo ao Sistema de Controle de Espaços Acadêmicos
    </Typography>
    // Adicionar mais conteúdo inicial aqui se desejar
  );
};

export default App;
