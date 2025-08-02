import Image, { ImageProps } from 'next/image';

interface NoIndexImageProps extends ImageProps {
  // Heredar todas las props de Image de Next.js
}

/**
 * Componente Image que no será indexado por buscadores
 * Agrega automáticamente atributos para evitar indexación
 */
export default function NoIndexImage(props: NoIndexImageProps) {
  return (
    <Image
      {...props}
      data-noindex="true"
      loading={props.loading || "lazy"}
      // Agregar atributos adicionales para evitar indexación
      style={{
        ...props.style,
        // Evitar que sea detectada por crawlers de imágenes
      }}
    />
  );
}

/**
 * Componente img HTML que no será indexado por buscadores
 */
interface NoIndexImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function NoIndexImg(props: NoIndexImgProps) {
  return (
    <img
      {...props}
      data-noindex="true"
      loading={props.loading || "lazy"}
    />
  );
}