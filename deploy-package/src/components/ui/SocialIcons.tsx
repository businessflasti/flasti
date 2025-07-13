import React from "react";
import Image from "next/image";

const socialLinks = [
	{
		name: "Instagram",
		href: "https://www.instagram.com/flasti_inc",
		icon: "/redes/instagram.svg",
		alt: "Instagram",
		size: 24,
	},
	{
		name: "Facebook",
		href: "https://www.facebook.com/flasti.inc",
		icon: "/redes/facebook.svg",
		alt: "Facebook",
		size: 24,
	},
	{
		name: "Threads",
		href: "https://www.threads.com/@flasti_inc",
		icon: "/redes/threads.svg",
		alt: "Threads",
		size: 24, // Unificar tamaño con los demás
	},
];

// Tamaño igual al alto del botón Feedback (py-2 = 0.5rem arriba y abajo, font y icono ~20px)
const ICON_SIZE = 32;

const SocialIcons: React.FC<{ className?: string }> = ({ className = "" }) => (
	<div
		className={`flex items-center gap-3 ${className}`}
		style={{ height: 32 }}
	>
		{socialLinks.map((social) => (
			<a
				key={social.name}
				href={social.href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={social.name}
				className="transition-all duration-200 flex items-center justify-center rounded-full group"
				style={{
					width: social.size,
					height: social.size,
					borderRadius: 9999,
					background: "transparent",
				}}
			>
				<Image
					src={social.icon}
					alt={social.alt}
					width={social.size}
					height={social.size}
					className="transition-all duration-200 group-hover:brightness-75 group-hover:grayscale"
					style={{ display: "block" }}
				/>
			</a>
		))}
	</div>
);

export default SocialIcons;
