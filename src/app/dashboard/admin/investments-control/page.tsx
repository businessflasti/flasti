"use client";

import { useState } from "react";

export default function InvestmentsControlPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [isLocked, setIsLocked] = useState(false);

    // Estados para configuración general
    const [minInvestment, setMinInvestment] = useState(5);
    const [maxInvestment, setMaxInvestment] = useState(10000);
    const [currentValue, setCurrentValue] = useState(132.25);
    const [dailyChange, setDailyChange] = useState(2.5);

    // Estados para períodos
    const [periods, setPeriods] = useState([
        { days: 30, rate: 5.0, enabled: true },
        { days: 45, rate: 7.5, enabled: true },
        { days: 90, rate: 12.0, enabled: true }
    ]);

    // Estados para gráfico
    const [chartData, setChartData] = useState([
        { month: "Ene", value: 120 },
        { month: "Feb", value: 125 },
        { month: "Mar", value: 122 },
        { month: "Abr", value: 128 },
        { month: "May", value: 130 },
        { month: "Jun", value: 132.25 }
    ]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Panel de Control - Inversiones</h1>
                            <p className="text-gray-600 mt-1">Administra todos los aspectos del sistema de inversiones</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Sistema:</span>
                                <button
                                    onClick={() => setIsLocked(!isLocked)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        isLocked ? "bg-red-600" : "bg-green-600"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            isLocked ? "translate-x-1" : "translate-x-6"
                                        }`}
                                    />
                                </button>
                                <span className={`text-sm font-semibold ${isLocked ? "text-red-600" : "text-green-600"}`}>
                                    {isLocked ? "BLOQUEADO" : "ACTIVO"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-8 px-6">
                            {[
                                { id: "general", label: "Configuración General" },
                                { id: "periods", label: "Períodos de Inversión" },
                                { id: "chart", label: "Control de Gráfico" },
                                { id: "faqs", label: "FAQs" },
                                { id: "users", label: "Inversores" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Contenido según tab activo */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* TAB: Configuración General */}
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Configuración General del Activo</h2>
                            
                            <div className="grid grid-cols-2 gap-6">
                                {/* Valor Actual del Activo */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor Actual del Activo (USD)
                                    </label>
                                    <input
                                        type="number"
                                        value={currentValue}
                                        onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        step="0.01"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Este es el precio por token que verán los usuarios</p>
                                </div>

                                {/* Cambio Diario */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cambio Diario (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={dailyChange}
                                        onChange={(e) => setDailyChange(parseFloat(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        step="0.1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Porcentaje de cambio respecto al día anterior</p>
                                </div>

                                {/* Inversión Mínima */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Inversión Mínima (USD)
                                    </label>
                                    <input
                                        type="number"
                                        value={minInvestment}
                                        onChange={(e) => setMinInvestment(parseFloat(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Inversión Máxima */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Inversión Máxima (USD)
                                    </label>
                                    <input
                                        type="number"
                                        value={maxInvestment}
                                        onChange={(e) => setMaxInvestment(parseFloat(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Vista Previa */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">Vista Previa</h3>
                                <div className="grid grid-cols-4 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-blue-700">Valor Actual</p>
                                        <p className="text-2xl font-bold text-blue-900">${currentValue}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700">Cambio 24h</p>
                                        <p className={`text-2xl font-bold ${dailyChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {dailyChange >= 0 ? "+" : ""}{dailyChange}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700">Mínimo</p>
                                        <p className="text-2xl font-bold text-blue-900">${minInvestment}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700">Máximo</p>
                                        <p className="text-2xl font-bold text-blue-900">${maxInvestment}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                Guardar Cambios
                            </button>
                        </div>
                    )}

                    {/* TAB: Períodos de Inversión */}
                    {activeTab === "periods" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Períodos de Inversión</h2>
                            
                            {periods.map((period, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Período de {period.days} días</h3>
                                        <button
                                            onClick={() => {
                                                const newPeriods = [...periods];
                                                newPeriods[index].enabled = !newPeriods[index].enabled;
                                                setPeriods(newPeriods);
                                            }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                period.enabled ? "bg-green-600" : "bg-gray-300"
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    period.enabled ? "translate-x-6" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Días de Bloqueo
                                            </label>
                                            <input
                                                type="number"
                                                value={period.days}
                                                onChange={(e) => {
                                                    const newPeriods = [...periods];
                                                    newPeriods[index].days = parseInt(e.target.value);
                                                    setPeriods(newPeriods);
                                                }}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                disabled={!period.enabled}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tasa de Interés Anual (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={period.rate}
                                                onChange={(e) => {
                                                    const newPeriods = [...periods];
                                                    newPeriods[index].rate = parseFloat(e.target.value);
                                                    setPeriods(newPeriods);
                                                }}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                step="0.1"
                                                disabled={!period.enabled}
                                            />
                                        </div>
                                    </div>

                                    {period.enabled && (
                                        <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
                                            <p className="text-sm text-green-800">
                                                <strong>Ejemplo:</strong> Una inversión de $1,000 por {period.days} días generará ${(1000 * period.rate / 100 * period.days / 365).toFixed(2)} en intereses
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                Guardar Períodos
                            </button>
                        </div>
                    )}

                    {/* TAB: Control de Gráfico */}
                    {activeTab === "chart" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Control del Gráfico de Valor</h2>
                            
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Datos Históricos</h3>
                                
                                <div className="space-y-3 mb-4">
                                    {chartData.map((data, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                value={data.month}
                                                onChange={(e) => {
                                                    const newData = [...chartData];
                                                    newData[index].month = e.target.value;
                                                    setChartData(newData);
                                                }}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Mes"
                                            />
                                            <input
                                                type="number"
                                                value={data.value}
                                                onChange={(e) => {
                                                    const newData = [...chartData];
                                                    newData[index].value = parseFloat(e.target.value);
                                                    setChartData(newData);
                                                }}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Valor"
                                                step="0.01"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newData = chartData.filter((_, i) => i !== index);
                                                    setChartData(newData);
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        setChartData([...chartData, { month: "Nuevo", value: currentValue }]);
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    + Agregar Punto
                                </button>
                            </div>

                            {/* Vista Previa del Gráfico */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Vista Previa</h3>
                                <div className="h-64 bg-gray-50 rounded flex items-end justify-around p-4">
                                    {chartData.map((data, index) => (
                                        <div key={index} className="flex flex-col items-center gap-2">
                                            <div
                                                className="w-12 bg-blue-600 rounded-t"
                                                style={{ height: `${(data.value / Math.max(...chartData.map(d => d.value))) * 200}px` }}
                                            />
                                            <span className="text-xs text-gray-600">{data.month}</span>
                                            <span className="text-xs font-semibold text-gray-900">${data.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                Actualizar Gráfico
                            </button>
                        </div>
                    )}

                    {/* TAB: FAQs */}
                    {activeTab === "faqs" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
                            
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">¿A dónde van mis fondos?</h3>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        defaultValue="Tus fondos se destinan al crecimiento y operación de la plataforma Flasti: 40% en infraestructura y hosting, 30% en marketing y adquisición de usuarios, 20% en desarrollo tecnológico, y 10% en reservas de liquidez."
                                    />
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">¿Cómo se calculan los intereses?</h3>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        defaultValue="Los intereses se calculan de forma proporcional según el período elegido. Se acreditan automáticamente al finalizar el período de bloqueo."
                                    />
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">¿Puedo retirar antes del período?</h3>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        defaultValue="No, los fondos quedan bloqueados durante el período seleccionado. Esto garantiza la estabilidad del sistema y los rendimientos prometidos."
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                Guardar FAQs
                            </button>
                        </div>
                    )}

                    {/* TAB: Inversores */}
                    {activeTab === "users" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Inversores Activos</h2>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Inicio</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Fin</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">usuario@example.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$500</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30 días</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01/01/2025</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">31/01/2025</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Activo
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
