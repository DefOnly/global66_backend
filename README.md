# Backend - Global66 API

API REST desarrollada con Express para obtener tasas de cambio y gestionar suscripciones.

## Requisitos Previos

- Node.js >= 14.x
- npm >= 6.x

## Instalación

```bash
# Instalar dependencias
npm install
```

## Configuración

```bash
# Copiar archivo de variables de entorno
cp .env.example .env
```

### Variables de Entorno (.env)

```env
PORT=3001
NODE_ENV=development

# Google Sheets (Opcional - para suscripciones)
GOOGLE_SPREADSHEET_ID=tu_spreadsheet_id
GOOGLE_CREDENTIALS_PATH=./credentials/service-account.json
```

## Ejecución

### Modo Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### Modo Producción

```bash
npm start
```

## Endpoints Disponibles

### Health Check
```bash
GET /api/health
```
Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-02-26T10:30:00.000Z"
}
```

### Obtener Tasas de Cambio
```bash
GET /api/rates
GET /api/rates?base=USD&target=CLP
```

**Parámetros de Query (opcionales):**
- `base` - Moneda base (default: USD)
- `target` - Moneda objetivo (CLP, PEN, USD)

**Respuesta:**
```json
{
  "base": "USD",
  "rates": {
    "CLP": 987.62,
    "PEN": 3.81,
    "USD": 1.00
  },
  "asOf": "2025-02-26T10:30:00.000Z"
}
```

### Suscribirse
```bash
POST /api/subscribe
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Suscripción registrada exitosamente"
}
```

## Configuración de Google Sheets (Opcional)

Para habilitar la integración real con Google Sheets:

### 1. Crear Service Account

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear nuevo proyecto o seleccionar uno existente
3. Ir a "APIs & Services" > "Credentials"
4. Crear credenciales > Service Account
5. Descargar el archivo JSON de credenciales

### 2. Configurar Google Spreadsheet

1. Crear un nuevo Google Spreadsheet
2. Crear una hoja llamada **"Subscribers"**
3. Agregar encabezados en la primera fila:
   - Columna A: `Name`
   - Columna B: `Email`
   - Columna C: `Timestamp`
4. Compartir el Spreadsheet con el email del Service Account (permisos de editor)

### 3. Configurar Variables de Entorno

1. Crear carpeta `credentials/` en la raíz del backend
2. Guardar el archivo JSON como `service-account.json`
3. Copiar el ID del Spreadsheet (de la URL)
4. Actualizar `.env`:

```env
GOOGLE_SPREADSHEET_ID=1A2B3C4D5E6F7G8H9I0J
GOOGLE_CREDENTIALS_PATH=./credentials/service-account.json
```

## Estructura del Proyecto

```
back/
├── src/
│   ├── index.js                  # Punto de entrada
│   ├── app.js                    # Configuración de Express
│   ├── routes/
│   │   ├── rates.js              # Endpoint de tasas
│   │   └── subscribe.js          # Endpoint de suscripción
│   ├── services/
│   │   ├── ratesService.js       # Lógica de tasas
│   │   └── googleSheetsService.js# Integración Google Sheets
│   └── middleware/
│       ├── errorHandler.js       # Manejo de errores
│       └── requestLogger.js      # Logging de requests
├── credentials/                  # Credenciales de Google (no en git)
├── .env                          # Variables de entorno (no en git)
├── .env.example                  # Ejemplo de variables
└── package.json
```

## Tecnologías

- **Express 4** - Framework web
- **Helmet** - Seguridad HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger
- **express-validator** - Validación de requests
- **googleapis** - Integración con Google Sheets
- **dotenv** - Variables de entorno

## Manejo de Errores

El API devuelve respuestas consistentes para errores:

### 400 - Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

### 404 - Not Found
```json
{
  "error": "Endpoint not found"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Descripción del error"
}
```

## Testing

### Probar Endpoints con cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Obtener tasas
curl http://localhost:3001/api/rates
curl "http://localhost:3001/api/rates?base=USD&target=CLP"

# Suscribirse
curl -X POST http://localhost:3001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

## Notas de Desarrollo

- Las tasas de cambio están mockeadas por defecto
- Para producción, conectar con un proveedor real de tasas (ej: exchangerate-api.com)
- La integración de Google Sheets es opcional
- Los logs se muestran en consola (Morgan en modo 'dev')
