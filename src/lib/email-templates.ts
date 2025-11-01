interface WelcomeEmailData {
  fullName: string;
  email: string;
  transactionId?: string;
  amount?: string;
}

export function getWelcomeEmailTemplate(data: WelcomeEmailData): string {
  const { fullName } = data;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Flasti</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #151515 0%, #1a1a1a 50%, #0f0f0f 100%);
            margin: 0;
            padding: 0;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            min-height: 100vh;
        }

        .email-wrapper {
            width: 100%;
            padding: 40px 20px;
        }

        .email-container {
            max-width: 680px;
            margin: 0 auto;
            background: linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
        }

        .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            padding: 48px 48px 40px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%);
        }

        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
        }

        .logo-image {
            width: 64px;
            height: 64px;
            margin-right: 20px;
            border-radius: 20px;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.2);
            object-fit: contain;
            object-position: center;
            background-color: rgba(255, 255, 255, 0.05);
            padding: 16px;
            display: block;
        }



        .main-content {
            padding: 48px;
            margin: 4px;
            border-radius: 22px;
            background: linear-gradient(180deg, #151515 0%, #1a1a1a 100%);
        }

        .greeting {
            font-size: 36px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 20px;
            line-height: 1.1;
            letter-spacing: -0.5px;
            text-align: left;
        }

        .congratulations {
            font-size: 26px;
            font-weight: 500;
            color: #ffffff;
            margin-bottom: 24px;
            line-height: 1.2;
            letter-spacing: -0.3px;
            text-align: left;
        }

        .main-message {
            font-size: 18px;
            line-height: 1.4;
            color: #ffffff;
            margin-bottom: 32px;
            font-weight: 400;
            padding: 24px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border-radius: 16px;
            border-left: 4px solid #667eea;
            border: 1px solid rgba(255, 255, 255, 0.1);
            letter-spacing: 0.2px;
            text-align: left;
        }



        .welcome-banner {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
            border-radius: 24px;
            padding: 48px;
            margin: 48px 0;
            text-align: left;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
        }

        .welcome-banner::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="0,0 100,0 80,100 0,80" fill="rgba(255,255,255,0.1)"/></svg>');
        }

        .welcome-banner-content {
            position: relative;
            z-index: 2;
        }

        .welcome-banner-title {
            font-size: 32px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 20px;
            line-height: 1.1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            letter-spacing: -0.5px;
            text-align: left;
        }

        .welcome-banner-text {
            font-size: 18px;
            line-height: 1.4;
            color: #ffffff;
            margin-bottom: 32px;
            font-weight: 400;
            letter-spacing: 0.2px;
            text-align: left;
        }

        .cta-button-container {
            text-align: left;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 18px 32px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: 0.5px;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.3);
            text-transform: uppercase;
            white-space: nowrap;
            text-align: center;
            max-width: 280px;
            width: auto;
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .next-steps {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border-radius: 24px;
            padding: 48px;
            margin: 48px 0;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .next-steps::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="0" y="0" width="50" height="50" fill="rgba(102,126,234,0.1)"/><rect x="50" y="50" width="50" height="50" fill="rgba(236,72,153,0.1)"/></svg>');
        }

        .next-steps-content {
            position: relative;
            z-index: 2;
        }

        .next-steps-title {
            font-size: 28px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 32px;
            letter-spacing: -0.5px;
            text-align: left;
        }

        .step-content {
            margin-bottom: 32px;
            padding: 32px;
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            border-radius: 20px;
            border-left: 6px solid #ec4899;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .step-content::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%);
            border-radius: 50%;
            transform: translate(30px, -30px);
        }

        .step-title {
            font-size: 22px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 16px;
            position: relative;
            z-index: 2;
            letter-spacing: -0.3px;
            text-align: left;
        }

        .step-description {
            font-size: 16px;
            line-height: 1.4;
            color: #ffffff;
            position: relative;
            z-index: 2;
            font-weight: 400;
            letter-spacing: 0.2px;
            text-align: left;
        }

        .support-section {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
            border-radius: 24px;
            padding: 48px;
            margin: 48px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
        }

        .support-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="20" fill="rgba(255,255,255,0.05)"/><circle cx="75" cy="75" r="15" fill="rgba(255,255,255,0.05)"/><circle cx="75" cy="25" r="10" fill="rgba(255,255,255,0.05)"/></svg>');
        }

        .support-content {
            position: relative;
            z-index: 2;
        }

        .support-title {
            font-size: 28px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 20px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            letter-spacing: -0.5px;
            text-align: left;
        }

        .support-subtitle {
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
            margin-bottom: 24px;
            letter-spacing: -0.3px;
            text-align: left;
        }

        .support-text {
            font-size: 16px;
            line-height: 1.4;
            color: #ffffff;
            font-weight: 400;
            letter-spacing: 0.2px;
            text-align: left;
        }

        .footer {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            padding: 48px;
            text-align: center;
        }

        .contact-info {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin: 32px 0;
        }

        .contact-item {
            color: #ffffff;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 16px;
            background: linear-gradient(135deg, #667eea 0%, #ec4899 100%);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .contact-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .copyright {
            color: #ffffff;
            font-size: 12px;
            margin-top: 32px;
            line-height: 1.6;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-weight: 400;
            letter-spacing: 0.3px;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
            .email-wrapper {
                padding: 20px 10px;
            }

            .header, .main-content, .footer {
                padding: 32px 24px;
            }

            .greeting {
                font-size: 28px;
            }

            .congratulations {
                font-size: 20px;
            }



            .logo-image {
                width: 48px;
                height: 48px;
                margin-right: 16px;
                padding: 12px;
            }

            .contact-info {
                flex-direction: column;
                gap: 12px;
            }

            .welcome-banner, .next-steps, .support-section {
                padding: 32px 24px;
            }

            .cta-button-container {
                text-align: center;
            }

            .cta-button {
                padding: 16px 24px;
                font-size: 14px;
                max-width: 240px;
                margin: 0 auto;
                display: block;
            }

            .welcome-banner-title {
                font-size: 24px;
            }

            .next-steps-title, .support-title {
                font-size: 20px;
                color: #ffffff;
            }

            .step-content {
                padding: 24px 16px;
                margin: 0 -8px 32px -8px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="header">
                <div class="logo-container">
                    <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://flasti.com'}/images/principal/Isotipo.png" alt="Flasti Logo" class="logo-image" />
                </div>
            </div>

            <div class="main-content">
                <div class="greeting">Hola ${fullName},</div>

                <div class="congratulations">¡Felicitaciones! Tu acceso a Flasti ha sido exitoso, y estamos muy emocionados de que formes parte de nuestra comunidad.</div>

                <div class="main-message">
                    Estás a punto de comenzar un viaje increíble, donde aprenderás como aprovechar todo el poder de internet para generar ingresos y llevar tu vida al siguiente nivel.
                </div>



                <div class="welcome-banner">
                    <div class="welcome-banner-content">
                        <div class="welcome-banner-title">¡Tu futuro comienza ahora!</div>
                        <div class="welcome-banner-text">
                            Para que disfrutes de todo lo que hemos preparado para ti, simplemente regístrate e inicia sesión pinchando en el botón de aquí abajo.
                        </div>
                        <div class="cta-button-container">
                            <a href="https://flasti.com/register" class="cta-button">
                                REGISTRARME AHORA
                            </a>
                        </div>
                    </div>
                </div>

                <div class="next-steps">
                    <div class="next-steps-content">
                        <div class="next-steps-title">¿Y ahora qué sigue?</div>

                        <div class="step-content">
                            <div class="step-title">Ingresa a tu panel personal</div>
                            <div class="step-description">
                                Con tu acceso completo, podrás disfrutar de una plataforma diseñada para que aprendas a generar ingresos de forma fácil y segura. Comienza a explorar todas las oportunidades que Flasti tiene para ofrecerte.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="support-section">
                    <div class="support-content">
                        <div class="support-title">Soporte 24/7</div>
                        <div class="support-subtitle">Tu éxito es nuestra misión:<br>¡Aquí estamos para apoyarte!</div>
                        <div class="support-text">
                            Recuerda que en Flasti, estamos aquí para apoyarte en cada paso de este emocionante proceso. Si en algún momento tienes alguna duda o necesitas ayuda, nuestro equipo de soporte está disponible para ayudarte.
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p class="copyright">
                    © 2025 Flasti. Todos los derechos reservados.<br>
                    <small>Este email fue enviado porque completaste exitosamente tu acceso a Flasti.</small>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}
