# Flasti Platform

Plataforma de afiliados con generador de contenido IA y herramientas para maximizar ganancias.

## Características

- Dashboard interactivo con estadísticas en tiempo real
- Generador de contenido con IA usando OpenRouter
- Sistema de afiliados con seguimiento de comisiones
- Múltiples aplicaciones promocionables
- Interfaz moderna y responsive

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Configuración de OpenRouter para el Generador de Contenido

El generador de contenido utiliza [OpenRouter](https://openrouter.ai/) para acceder a modelos de IA gratuitos. Para configurarlo:

1. Regístrate en [OpenRouter](https://openrouter.ai/)
2. Crea una clave API en [https://openrouter.ai/keys](https://openrouter.ai/keys)
3. Copia el archivo `.env.local.example` a `.env.local`
4. Agrega tu clave API en el archivo `.env.local`

```bash
NEXT_PUBLIC_OPENROUTER_API_KEY=tu_clave_api_aqui
```

## Modelos de IA Utilizados

El generador de contenido utiliza modelos gratuitos disponibles en OpenRouter:

- Microsoft Phi-3 Mini (predeterminado)
- Meta Llama 3 8B
- Mistral 7B
- OpenChat 7B
- Google Gemma 7B

Puedes modificar el modelo predeterminado en `src/lib/openrouter-service.ts`.

## Learn More

Para más información sobre las tecnologías utilizadas:

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
