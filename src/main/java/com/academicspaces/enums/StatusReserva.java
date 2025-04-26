package com.academicspaces.enums;

public enum StatusReserva {
    SOLICITADA,
    CONFIRMADA, // Reserva aceita pelo sistema
    CANCELADA, // Cancelada pelo administrador ou professor
    FINALIZADA, // Uso confirmado pelo professor ou tempo expirado
    EM_USO // Status durante o período da reserva (opcional)
} 