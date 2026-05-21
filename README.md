# 🐾 PetFeeder Pro — Guía de Instalación y Ejecución

Plataforma IoT para controlar un dispensador remoto de comida para mascotas basado en ESP32.

---

## Requisitos Previos

| Software | Versión mínima | Verificar con |
|----------|---------------|---------------|
| **Node.js** | v18.18 o superior | `node -v` |
| **npm** | v9 o superior | `npm -v` |
| **Git** | Cualquiera | `git --version` |

> Si no tienes Node.js, descárgalo de [https://nodejs.org](https://nodejs.org) (versión LTS recomendada).

---

## Instalación paso a paso

### 1. Clonar o copiar el proyecto

```bash
# Si tienes el repositorio en Git:
git clone <URL_DEL_REPOSITORIO>
cd dispensador_mascotas

# Si recibes la carpeta directamente, navega a ella:
cd ruta/a/dispensador_mascotas
```

### 2. Instalar dependencias

```bash
npm install
```

> Esto instalará todas las dependencias definidas en `package.json` (~440 paquetes). Puede tomar 1-2 minutos.

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

Verás algo como:

```
▲ Next.js 16.2.6 (Turbopack)
- Local:    http://localhost:3000
- Network:  http://192.168.x.x:3000
✓ Ready in ~500ms
```

### 4. Abrir en el navegador

Abre **http://localhost:3000** en tu navegador.

---

## Flujo de uso

1. **Landing** (`/`) → Clic en **"Comenzar Ahora"**
2. **Auth** (`/auth`) → Llena los campos:
   - Correo: `cualquier@correo.com`
   - Contraseña: `cualquiervalor`
   - ID del Dispositivo: `AA:BB:CC:DD:EE:FF` (formato MAC obligatorio)
3. **Dashboard** (`/dashboard`) → Panel IoT con:
   - Nivel de comida (gauge semicircular)
   - Botón "Servir Ración Ahora"
   - Programación de horarios
   - Analítica predictiva
4. **Settings** (`/settings`) → Configurar Telegram y buzzer

---

## Conexión MQTT (IoT)

La app se conecta automáticamente al broker público **HiveMQ** vía WebSocket:

| Parámetro | Valor |
|-----------|-------|
| Broker | `ws://broker.hivemq.com:8000/mqtt` |
| Tópico de estado (subscribe) | `utp/petfeeder/estado` |
| Tópico de comandos (publish) | `utp/petfeeder/comando` |

### Probar sin hardware

Puedes simular el ESP32 publicando manualmente con cualquier cliente MQTT (ej. [MQTTX](https://mqttx.app/)):

**Simular estado del dispositivo** → publicar en `utp/petfeeder/estado`:
```json
{
  "nivel_comida": 65,
  "ultimo_dispensado": "2026-05-19T18:00:00",
  "estado": "online",
  "atasco": false,
  "buzzer_activo": true,
  "hora_interna": "17:15"
}
```

**Simular confirmación de ración** → publicar en `utp/petfeeder/estado`:
```json
{
  "mensaje": "Ración servida exitosamente",
  "nivel_comida": 60
}
```

---

## Estructura del proyecto

```
dispensador_mascotas/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Layout raíz (fuente Inter, Toaster, SEO)
│   │   ├── page.tsx              # Landing Page
│   │   ├── globals.css           # Diseño: glassmorphism, animaciones
│   │   ├── auth/page.tsx         # Login/Registro + MAC del ESP32
│   │   ├── dashboard/page.tsx    # Dashboard IoT principal
│   │   ├── settings/page.tsx     # Configuración Telegram + Buzzer
│   │   └── api/telegram/route.ts # API Route para alertas Telegram
│   ├── components/
│   │   ├── ui/                   # Componentes Shadcn (auto-generados)
│   │   ├── dashboard/            # Tarjetas del dashboard
│   │   └── layout/Navbar.tsx     # Barra de navegación
│   ├── hooks/useMQTT.ts          # Hook MQTT con time offset
│   ├── lib/
│   │   ├── utils.ts              # Utilidad cn() de Shadcn
│   │   └── mqtt-config.ts        # Configuración del broker
│   └── types/index.ts            # Tipos TypeScript compartidos
├── package.json
├── tsconfig.json
├── next.config.ts
└── components.json               # Configuración de Shadcn UI
```

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 16.2.6 | Framework (App Router) |
| React | 19 | UI |
| TypeScript | 5 | Tipado |
| Tailwind CSS | v4 | Estilos |
| Shadcn UI | Latest (base-ui) | Componentes |
| Lucide React | Latest | Iconos |
| Recharts | Latest | Gráficos |
| mqtt.js | Latest | Protocolo MQTT/WebSocket |

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (hot reload) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción (requiere build previo) |
| `npm run lint` | Ejecutar ESLint |

---

## Solución de problemas

### "Error: Cannot find module..."
→ Ejecuta `npm install` para instalar dependencias faltantes.

### "Port 3000 is already in use"
→ Cierra la otra app que usa ese puerto, o usa `npm run dev -- -p 3001` para otro puerto.

### El botón "Servir Ración" queda en loading infinito
→ Es el comportamiento esperado sin hardware. El botón se libera **solo** cuando el ESP32 responde con un payload que contenga `"mensaje"`. Usa un cliente MQTT para simular la respuesta (ver sección anterior).

### Error de hidratación (Hydration mismatch)
→ Es un warning menor de SSR por timestamps. No afecta la funcionalidad.

---

## Notas importantes

- **Autenticación**: Es simulada (localStorage). No hay backend real de auth.
- **MQTT Broker**: Es público (HiveMQ). Los tópicos son accesibles por cualquiera. No usar para datos sensibles en producción.
- **Datos**: Los horarios, configuración y perfil se guardan en `localStorage` del navegador.
