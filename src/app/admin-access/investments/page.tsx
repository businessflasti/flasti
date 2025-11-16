"use client";

import { useState, useEffect } from "react";

interface InvestmentPeriod {
  id: string;
  days: number;
  annual_rate: number;
  is_active: boolean;
  is_recommended: boolean;
  display_order: number;
  label: string;
  description: string;
}

interface FundAllocation {
  id: string;
  name: string;
  description: string;
  percentage: number;
  icon_type: string;
  color_from: string;
  color_to: string;
  display_order: number;
  is_active: boolean;
}

interface ChartDataPoint {
  id: string;
  month: string;
  value: number;
  order: number;
  period: string;
  date: string;
  is_active: boolean;
}

interface InvestmentMetric {
  id: string;
  metric_key: string;
  label: string;
  value: string;
  display_order: number;
  is_active: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  enabled: boolean;
}

interface InvestmentConfig {
  id: string;
  min_investment: number;
  max_investment: number;
  active_users_count: string;
  total_capital_invested: string;
  launch_date: string;
  rating: number;
  token_name: string;
  token_description: string;
  hero_title: string;
  hero_subtitle: string;
  token_current_value: number;
  token_daily_change: number;
  token_daily_change_percentage: number;
}

export default function InvestmentsControlPage() {
  const [activeTab, setActiveTab] = useState("config");
  const [periods, setPeriods] = useState<InvestmentPeriod[]>([]);
  const [fundAllocations, setFundAllocations] = useState<FundAllocation[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [metrics, setMetrics] = useState<InvestmentMetric[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [config, setConfig] = useState<InvestmentConfig | null>(null);
  const [chartPeriod, setChartPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [configRes, periodsRes, fundsRes, chartRes, metricsRes, faqsRes] = await Promise.all([
        fetch("/api/investments/admin/config"),
        fetch("/api/investments/admin/periods"),
        fetch("/api/investments/admin/funds"),
        fetch("/api/investments/admin/chart"),
        fetch("/api/investments/admin/metrics"),
        fetch("/api/investments/admin/faqs"),
      ]);

      if (configRes.ok) setConfig(await configRes.json());
      if (periodsRes.ok) setPeriods(await periodsRes.json());
      if (fundsRes.ok) setFundAllocations(await fundsRes.json());
      if (chartRes.ok) setChartData(await chartRes.json());
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (faqsRes.ok) setFaqs(await faqsRes.json());
    } catch (error) {
      console.error("Error loading data:", error);
      showMessage("❌ Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/investments/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      
      const data = await res.json();
      console.log("Response:", data);
      
      if (res.ok) {
        showMessage("✅ Configuración guardada");
      } else {
        const errorMsg = data.error || "Error desconocido";
        const details = data.details ? ` - ${data.details}` : "";
        showMessage(`❌ ${errorMsg}${details}`, "error");
        console.error("Error details:", data);
      }
    } catch (error: any) {
      showMessage(`❌ Error: ${error.message}`, "error");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const savePeriods = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/investments/admin/periods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periods }),
      });
      if (res.ok) showMessage("✅ Períodos guardados");
      else showMessage("❌ Error al guardar", "error");
    } catch (error) {
      showMessage("❌ Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveFunds = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/investments/admin/funds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funds: fundAllocations }),
      });
      if (res.ok) showMessage("✅ Destino de fondos guardado");
      else showMessage("❌ Error al guardar", "error");
    } catch (error) {
      showMessage("❌ Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveChart = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/investments/admin/chart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartData }),
      });
      if (res.ok) showMessage("✅ Datos del gráfico guardados");
      else showMessage("❌ Error al guardar", "error");
    } catch (error) {
      showMessage("❌ Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveMetrics = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/investments/admin/metrics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics }),
      });
      if (res.ok) showMessage("✅ Métricas guardadas");
      else showMessage("❌ Error al guardar", "error");
    } catch (error) {
      showMessage("❌ Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveFaqs = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/investments/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqs }),
      });
      if (res.ok) showMessage("✅ FAQs guardadas");
      else showMessage("❌ Error al guardar", "error");
    } catch (error) {
      showMessage("❌ Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  const filteredChartData = chartData.filter(d => d.period === chartPeriod);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Control - Inversiones</h1>
              <p className="text-sm text-gray-600">Control total del dashboard de inversiones</p>
            </div>
            {message && (
              <div className={`px-4 py-2 rounded-lg ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: "config", label: "Configuración General", icon: "⚙️" },
              { id: "token", label: "Valor del Token", icon: "💰" },
              { id: "periods", label: "Períodos", icon: "📅" },
              { id: "metrics", label: "Métricas", icon: "📊" },
              { id: "chart", label: "Gráfico", icon: "📈" },
              { id: "funds", label: "Destino Fondos", icon: "💼" },
              { id: "faqs", label: "FAQs", icon: "❓" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Configuración General */}
        {activeTab === "config" && config && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configuración General del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Token</label>
                <input
                  type="text"
                  value={config.token_name}
                  onChange={(e) => setConfig({ ...config, token_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción del Token</label>
                <input
                  type="text"
                  value={config.token_description}
                  onChange={(e) => setConfig({ ...config, token_description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inversión Mínima (USD)</label>
                <input
                  type="number"
                  value={config.min_investment}
                  onChange={(e) => setConfig({ ...config, min_investment: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inversión Máxima (USD)</label>
                <input
                  type="number"
                  value={config.max_investment}
                  onChange={(e) => setConfig({ ...config, max_investment: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Usuarios Activos (texto)</label>
                <input
                  type="text"
                  value={config.active_users_count}
                  onChange={(e) => setConfig({ ...config, active_users_count: e.target.value })}
                  placeholder="+100K"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capital Total (texto)</label>
                <input
                  type="text"
                  value={config.total_capital_invested}
                  onChange={(e) => setConfig({ ...config, total_capital_invested: e.target.value })}
                  placeholder="$2.5M+"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Lanzamiento</label>
                <input
                  type="date"
                  value={config.launch_date}
                  onChange={(e) => setConfig({ ...config, launch_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={config.rating}
                  onChange={(e) => setConfig({ ...config, rating: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título Hero</label>
                <input
                  type="text"
                  value={config.hero_title}
                  onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtítulo Hero</label>
                <textarea
                  value={config.hero_subtitle}
                  onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <button
              onClick={saveConfig}
              disabled={saving}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "💾 Guardar Configuración"}
            </button>
          </div>
        )}

        {/* Valor del Token */}
        {activeTab === "token" && config && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">💰 Control del Valor del Token</h2>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl mb-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-2">Valor Actual del Token</p>
                <p className="text-5xl font-bold text-gray-900">${config.token_current_value.toFixed(2)}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className={`text-lg font-semibold ${config.token_daily_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {config.token_daily_change >= 0 ? '↑' : '↓'} ${Math.abs(config.token_daily_change).toFixed(2)}
                  </span>
                  <span className={`text-sm ${config.token_daily_change_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({config.token_daily_change_percentage >= 0 ? '+' : ''}{config.token_daily_change_percentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Valor Actual (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.token_current_value}
                  onChange={(e) => setConfig({ ...config, token_current_value: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Este valor se muestra en el dashboard</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cambio Diario (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.token_daily_change}
                  onChange={(e) => setConfig({ ...config, token_daily_change: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Puede ser positivo o negativo</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cambio Diario (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.token_daily_change_percentage}
                  onChange={(e) => setConfig({ ...config, token_daily_change_percentage: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Porcentaje de cambio</p>
              </div>
            </div>
            <button
              onClick={saveConfig}
              disabled={saving}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "💾 Guardar Valor del Token"}
            </button>
          </div>
        )}

        {/* Períodos de Inversión */}
        {activeTab === "periods" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📅 Períodos de Inversión</h2>
            <div className="space-y-4">
              {periods.map((period, index) => (
                <div key={period.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">Período {period.days} días</h3>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={period.is_active}
                          onChange={(e) => {
                            const newPeriods = [...periods];
                            newPeriods[index].is_active = e.target.checked;
                            setPeriods(newPeriods);
                          }}
                          className="rounded"
                        />
                        Activo
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={period.is_recommended}
                          onChange={(e) => {
                            const newPeriods = [...periods];
                            newPeriods[index].is_recommended = e.target.checked;
                            setPeriods(newPeriods);
                          }}
                          className="rounded"
                        />
                        ⭐ Recomendado
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Días</label>
                      <input
                        type="number"
                        value={period.days}
                        onChange={(e) => {
                          const newPeriods = [...periods];
                          newPeriods[index].days = parseInt(e.target.value);
                          setPeriods(newPeriods);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tasa Anual (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={period.annual_rate}
                        onChange={(e) => {
                          const newPeriods = [...periods];
                          newPeriods[index].annual_rate = parseFloat(e.target.value);
                          setPeriods(newPeriods);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                      <input
                        type="text"
                        value={period.label}
                        onChange={(e) => {
                          const newPeriods = [...periods];
                          newPeriods[index].label = e.target.value;
                          setPeriods(newPeriods);
                        }}
                        placeholder="Corto plazo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                      <input
                        type="number"
                        value={period.display_order}
                        onChange={(e) => {
                          const newPeriods = [...periods];
                          newPeriods[index].display_order = parseInt(e.target.value);
                          setPeriods(newPeriods);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={period.description}
                      onChange={(e) => {
                        const newPeriods = [...periods];
                        newPeriods[index].description = e.target.value;
                        setPeriods(newPeriods);
                      }}
                      placeholder="Ideal para comenzar"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={savePeriods}
              disabled={saving}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "💾 Guardar Períodos"}
            </button>
          </div>
        )}

        {/* Métricas (4 tarjetas superiores) */}
        {activeTab === "metrics" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Métricas del Dashboard</h2>
            <p className="text-sm text-gray-600 mb-6">Estas son las 4 tarjetas que se muestran en la parte superior del dashboard</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Métrica {index + 1}</span>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={metric.is_active}
                        onChange={(e) => {
                          const newMetrics = [...metrics];
                          newMetrics[index].is_active = e.target.checked;
                          setMetrics(newMetrics);
                        }}
                        className="rounded"
                      />
                      Activa
                    </label>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Etiqueta</label>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => {
                          const newMetrics = [...metrics];
                          newMetrics[index].label = e.target.value;
                          setMetrics(newMetrics);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Valor</label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const newMetrics = [...metrics];
                          newMetrics[index].value = e.target.value;
                          setMetrics(newMetrics);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Orden</label>
                      <input
                        type="number"
                        value={metric.display_order}
                        onChange={(e) => {
                          const newMetrics = [...metrics];
                          newMetrics[index].display_order = parseInt(e.target.value);
                          setMetrics(newMetrics);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={saveMetrics}
              disabled={saving}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "💾 Guardar Métricas"}
            </button>
          </div>
        )}

        {/* Gráfico */}
        {activeTab === "chart" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Control del Gráfico de Valor</h2>
            
            {/* Selector de Período */}
            <div className="flex gap-2 mb-6">
              {["daily", "weekly", "monthly", "yearly"].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    chartPeriod === period
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {period === "daily" && "📅 Diario"}
                  {period === "weekly" && "📊 Semanal"}
                  {period === "monthly" && "📆 Mensual"}
                  {period === "yearly" && "🗓️ Anual"}
                </button>
              ))}
            </div>

            {/* Vista Previa del Gráfico */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Vista Previa</h3>
              <div className="h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 400 150">
                  <defs>
                    <linearGradient id="previewGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {filteredChartData.length > 0 && (
                    <>
                      <path
                        d={`M ${filteredChartData.map((d, i) => 
                          `${(i / (filteredChartData.length - 1)) * 400} ${150 - (d.value / Math.max(...filteredChartData.map(p => p.value)) * 120)}`
                        ).join(" L ")}`}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                      />
                      <path
                        d={`M ${filteredChartData.map((d, i) => 
                          `${(i / (filteredChartData.length - 1)) * 400} ${150 - (d.value / Math.max(...filteredChartData.map(p => p.value)) * 120)}`
                        ).join(" L ")} L 400 150 L 0 150 Z`}
                        fill="url(#previewGradient)"
                      />
                    </>
                  )}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 px-4">
                  {filteredChartData.map((d) => (
                    <span key={d.id}>{d.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor de Puntos */}
            <div className="space-y-3">
              {filteredChartData.map((point, index) => (
                <div key={point.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-all">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
                    {point.order}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Etiqueta</label>
                      <input
                        type="text"
                        value={point.month}
                        onChange={(e) => {
                          const newData = [...chartData];
                          const idx = newData.findIndex(d => d.id === point.id);
                          newData[idx].month = e.target.value;
                          setChartData(newData);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Valor (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={point.value}
                        onChange={(e) => {
                          const newData = [...chartData];
                          const idx = newData.findIndex(d => d.id === point.id);
                          newData[idx].value = parseFloat(e.target.value);
                          setChartData(newData);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Orden</label>
                      <input
                        type="number"
                        value={point.order}
                        onChange={(e) => {
                          const newData = [...chartData];
                          const idx = newData.findIndex(d => d.id === point.id);
                          newData[idx].order = parseInt(e.target.value);
                          setChartData(newData);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={point.is_active}
                      onChange={(e) => {
                        const newData = [...chartData];
                        const idx = newData.findIndex(d => d.id === point.id);
                        newData[idx].is_active = e.target.checked;
                        setChartData(newData);
                      }}
                      className="rounded"
                    />
                    Activo
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={saveChart}
              disabled={saving}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "💾 Guardar Datos del Gráfico"}
            </button>
          </div>
        )}

        {/* Destino de Fondos */}
        {activeTab === "funds" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">💼 Destino de Fondos</h2>
            <p className="text-sm text-gray-600 mb-6">Configura a dónde van los fondos de inversión (debe sumar 100%)</p>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-blue-900">
                Total: {fundAllocations.reduce((sum, f) => sum + f.percentage, 0)}%
                {fundAllocations.reduce((sum, f) => sum + f.percentage, 0) !== 100 && (
                  <span className="ml-2 text-red-600">⚠️ Debe sumar 100%</span>
                )}
              </p>
            </div>
            <div className="space-y-4">
              {fundAllocations.map((fund, index) => (
                <div key={fund.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">{fund.name}</span>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={fund.is_active}
                        onChange={(e) => {
                          const newFunds = [...fundAllocations];
                          newFunds[index].is_active = e.target.checked;
                          setFundAllocations(newFunds);
                        }}
                        className="rounded"
                      />
                      Activo
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={fund.name}
                        onChange={(e) => {
                          const newFunds = [...fundAllocations];
                          newFunds[index].name = e.target.value;
                          setFundAllocations(newFunds);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                      <input
                        type="text"
                        value={fund.description}
                        onChange={(e) => {
                          const newFunds = [...fundAllocations];
                          newFunds[index].description = e.target.value;
                          setFundAllocations(newFunds);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Porcentaje (%)</label>
                      <input
                        type="number"
                        value={fund.percentage}
                        onChange={(e) => {
                          const newFunds = [...fundAllocations];
                          newFunds[index].percentage = parseInt(e.target.value);
                          setFundAllocations(newFunds);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Orden</label>
                      <input
                        type="number"
                        value={fund.display_order}
                        onChange={(e) => {
                          const newFunds = [...fundAllocations];
                          newFunds[index].display_order = parseInt(e.target.value);
                          setFundAllocations(newFunds);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={saveFunds}
              disabled={saving || fundAllocations.reduce((sum, f) => sum + f.percentage, 0) !== 100}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "💾 Guardar Destino de Fondos"}
            </button>
          </div>
        )}

        {/* FAQs */}
        {activeTab === "faqs" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">❓ Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">FAQ {index + 1}</span>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={faq.enabled}
                        onChange={(e) => {
                          const newFaqs = [...faqs];
                          newFaqs[index].enabled = e.target.checked;
                          setFaqs(newFaqs);
                        }}
                        className="rounded"
                      />
                      Activa
                    </label>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Pregunta</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaqs = [...faqs];
                          newFaqs[index].question = e.target.value;
                          setFaqs(newFaqs);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Respuesta</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaqs = [...faqs];
                          newFaqs[index].answer = e.target.value;
                          setFaqs(newFaqs);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Orden</label>
                      <input
                        type="number"
                        value={faq.order}
                        onChange={(e) => {
                          const newFaqs = [...faqs];
                          newFaqs[index].order = parseInt(e.target.value);
                          setFaqs(newFaqs);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={saveFaqs}
              disabled={saving}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "💾 Guardar FAQs"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
