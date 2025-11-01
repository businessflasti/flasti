#!/usr/bin/env python3
"""
Script para actualizar automáticamente los precios de Hotmart
Ejecutar 2 veces al día con cron o Task Scheduler
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
import json

# Configuración
SUPABASE_URL = "https://ewfvfvkhqftbvldvjnrk.supabase.co"
SUPABASE_SERVICE_KEY = "TU_SERVICE_ROLE_KEY_AQUI"
HOTMART_OFFER_URL = "https://pay.hotmart.com/5h87lps7"

# Países a actualizar
COUNTRIES = [
    {"code": "AR", "name": "Argentina"},
    {"code": "CO", "name": "Colombia"},
    {"code": "PE", "name": "Perú"},
    {"code": "MX", "name": "México"},
    {"code": "PA", "name": "Panamá"},
    {"code": "GT", "name": "Guatemala"},
    {"code": "DO", "name": "República Dominicana"},
    {"code": "PY", "name": "Paraguay"},
    {"code": "ES", "name": "España"},
    {"code": "CR", "name": "Costa Rica"},
    {"code": "CL", "name": "Chile"},
    {"code": "UY", "name": "Uruguay"},
    {"code": "BO", "name": "Bolivia"},
    {"code": "HN", "name": "Honduras"},
]

def extract_price_from_hotmart(country_code):
    """
    Extrae el precio de Hotmart para un país específico
    """
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Sin interfaz gráfica
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(options=options)
    
    try:
        # Abrir Hotmart
        driver.get(HOTMART_OFFER_URL)
        
        # Esperar a que cargue el formulario
        wait = WebDriverWait(driver, 10)
        
        # Aquí debes inspeccionar el HTML de Hotmart para encontrar:
        # 1. El selector del país
        # 2. El selector del precio
        
        # Ejemplo (ajustar según el HTML real):
        # country_selector = wait.until(EC.presence_of_element_located((By.ID, "country")))
        # country_selector.send_keys(country_code)
        
        # price_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "price")))
        # price_text = price_element.text
        
        # Extraer solo números
        # price = float(price_text.replace(',', '.').replace(' ', ''))
        
        # Por ahora, retornar None (debes completar la lógica)
        print(f"⚠️  Debes inspeccionar el HTML de Hotmart para {country_code}")
        return None
        
    except Exception as e:
        print(f"❌ Error extrayendo precio para {country_code}: {e}")
        return None
    finally:
        driver.quit()

def update_price_in_supabase(country_code, price):
    """
    Actualiza el precio en Supabase
    """
    url = f"{SUPABASE_URL}/rest/v1/country_prices"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    data = {"price": price}
    params = {"country_code": f"eq.{country_code}"}
    
    response = requests.patch(url, headers=headers, params=params, json=data)
    
    if response.status_code in [200, 204]:
        print(f"✅ {country_code}: ${price} actualizado")
        return True
    else:
        print(f"❌ Error actualizando {country_code}: {response.text}")
        return False

def main():
    """
    Función principal
    """
    print("🚀 Iniciando actualización de precios de Hotmart...")
    print(f"⏰ Hora: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    updated = 0
    failed = 0
    
    for country in COUNTRIES:
        code = country["code"]
        name = country["name"]
        
        print(f"\n🔄 Procesando {name} ({code})...")
        
        # Extraer precio de Hotmart
        price = extract_price_from_hotmart(code)
        
        if price is not None:
            # Actualizar en Supabase
            if update_price_in_supabase(code, price):
                updated += 1
            else:
                failed += 1
        else:
            failed += 1
        
        # Esperar un poco entre requests
        time.sleep(2)
    
    print("\n" + "=" * 50)
    print(f"✅ Actualizados: {updated}")
    print(f"❌ Fallidos: {failed}")
    print(f"📊 Total: {len(COUNTRIES)}")
    print("=" * 50)

if __name__ == "__main__":
    main()
