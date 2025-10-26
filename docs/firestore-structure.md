# Estructura de Firestore para Relius REPSE

## Colecciones y Documentos

### companies
- `{companyId}`
  - `name`: Nombre de la Empresa Cliente
  - `rfc`: RFC de la empresa
  - `paymentStatus`: "paid" | "due"

### users
- `{userId}` (UID de Firebase Auth)
  - `email`: Correo electrónico
  - `companyId`: Referencia a la empresa
  - `role`: "SuperAdmin" | "RevisorInterno" | "AdminEmpresa" | "UsuarioEmpresa"

### clients
- `{clientId}`
  - `name`: Nombre del Cliente Final
  - `companyId`: Empresa cliente a la que pertenece

### documentTemplates
- `{templateId}`
  - `name`: Nombre del Documento
  - `description`: Descripción
  - `isActive`: true | false

### documentTasks
- `{taskId}`
  - `companyId`: Empresa cliente
  - `clientId`: Cliente final
  - `templateId`: Plantilla de documento
  - `year`: Año
  - `month`: Mes
  - `status`: "pending" | "approved" | "rejected"
  - `rejectionReason`: Motivo de rechazo (opcional)
  - `fileUrl`: URL en Cloud Storage
  - `lastUpdatedBy`: UID del usuario
  - `history`: Array de cambios de estado

### auditLog
- `{logId}`
  - `userId`: UID
  - `userRole`: Rol
  - `timestamp`: Fecha/hora
  - `actionType`: Tipo de acción
  - `targetId`: ID objetivo
  - `sourceIp`: IP origen
  - `userAgent`: User Agent
  - `changes`: Detalle de cambios

---
Esta estructura está optimizada para entornos multi-tenant y escalabilidad en Firestore.