import { useEffect } from "react";
import { useApiMonitor } from "./hooks/useApiMonitor";
import SearchPanel from "./components/SearchPanel";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DonutChart from "./components/DonutChart";
import ScatterPlot from "./components/ScatterPlot";
import StatsCard from "./components/StatsCard";

function App() {
  const {
    metrics,
    categoryData,
    scatterData,
    loading,
    totalSearches,
    performSearch,
    clearMetrics,
    loadHistory,
  } = useApiMonitor();

  // Charger l'historique au démarrage
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const avgResponseTime =
    metrics.length > 0
      ? (
          metrics.reduce((sum, m) => sum + (m?.responseTime || 0), 0) /
          metrics.length
        ).toFixed(2)
      : 0;

  const totalRequests = metrics.length;
  const totalCategories = categoryData.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="#ffffff"
                >
                  <path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight">
                  Explorateur de Performance API
                </h1>
                <p className="text-xs md:text-sm text-gray-600">
                  Analyse de Performance Wikipedia en Temps Réel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#d7492a"
                >
                  <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium">
                    Source
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Wikipedia API
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* SIDEBAR */}
        <div className="w-full lg:w-72 bg-gray-50 shadow-sm p-3 flex flex-col gap-3 lg:border-r border-gray-200 overflow-y-auto max-h-[500px] lg:max-h-none">
          <SearchPanel onSearch={performSearch} loading={loading} />

          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm flex-1 flex flex-col min-h-0">
            <h3 className="font-semibold text-sm text-gray-800 mb-2.5 flex items-center gap-2 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="#d7492a"
              >
                <path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
              </svg>
              Historique des recherches
            </h3>
            {totalRequests === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 text-xs italic text-center">
                  Aucune recherche effectuée
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {metrics
                  .slice()
                  .reverse()
                  .slice(0, 12)
                  .map((metric, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200 shadow-sm hover:shadow-md transition-all hover:border-orange-300"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900 truncate">
                            {metric.query}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="12px"
                              viewBox="0 -960 960 960"
                              width="12px"
                              fill="currentColor"
                            >
                              <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
                            </svg>
                            {new Date(metric.time).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div
                            className={`px-2 py-1 rounded-md text-xs font-bold ${
                              metric.responseTime < 150
                                ? "bg-green-100 text-green-700"
                                : metric.responseTime < 300
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {metric.responseTime.toFixed(0)}ms
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {totalRequests > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <h3 className="font-semibold text-sm text-gray-800 mb-2.5 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="#d7492a"
                >
                  <path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z" />
                </svg>
                Résumé des performances
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Rapide (&lt;500ms)
                  </span>
                  <span className="text-xs font-bold text-green-700">
                    {metrics.filter((m) => m.responseTime < 500).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Moyen (500-1000ms)
                  </span>
                  <span className="text-xs font-bold text-orange-700">
                    {
                      metrics.filter(
                        (m) => m.responseTime >= 500 && m.responseTime < 1000
                      ).length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Lent (&gt;1000ms)
                  </span>
                  <span className="text-xs font-bold text-red-700">
                    {metrics.filter((m) => m.responseTime >= 1000).length}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      Meilleur temps
                    </span>
                    <span className="text-xs font-bold text-green-600">
                      {Math.min(...metrics.map((m) => m.responseTime)).toFixed(
                        0
                      )}
                      ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold text-gray-700">
                      Pire temps
                    </span>
                    <span className="text-xs font-bold text-red-600">
                      {Math.max(...metrics.map((m) => m.responseTime)).toFixed(
                        0
                      )}
                      ms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={clearMetrics}
            disabled={metrics.length === 0}
            className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-semibold shadow-md flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="currentColor"
            >
              <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
            </svg>
            Réinitialiser
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-x-hidden">
          {/* GRAPH HEADER */}
          <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  Monitoring API Éducative
                </h2>
                <p className="text-gray-600 mt-1.5 text-sm">
                  Visualisation des performances en temps réel
                </p>
                <p className="text-xs text-gray-500">
                  Toutes les données en millisecondes (ms)
                </p>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="p-3 md:p-5 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <StatsCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32px"
                    viewBox="0 -960 960 960"
                    width="32px"
                    fill="currentColor"
                  >
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                  </svg>
                }
                label="Requêtes totales"
                value={totalRequests}
                color="blue"
              />
              <StatsCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32px"
                    viewBox="0 -960 960 960"
                    width="32px"
                    fill="currentColor"
                  >
                    <path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z" />
                  </svg>
                }
                label="Temps moyen (ms)"
                value={avgResponseTime}
                color="green"
              />
              <StatsCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32px"
                    viewBox="0 -960 960 960"
                    width="32px"
                    fill="currentColor"
                  >
                    <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                  </svg>
                }
                label="Catégories"
                value={totalCategories}
                color="purple"
              />
              <StatsCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32px"
                    viewBox="0 -960 960 960"
                    width="32px"
                    fill="currentColor"
                  >
                    <path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z" />
                  </svg>
                }
                label="Points de données"
                value={scatterData.length}
                color="orange"
              />
            </div>

            {/* CHARTS */}
            <div className="space-y-5">
              <LineChart data={metrics} />
              <DonutChart data={metrics} />
              <BarChart data={categoryData} />
              <ScatterPlot data={scatterData} />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="text-center text-sm text-gray-600">
            <p>
              <span className="font-semibold">React</span> •{" "}
              <span className="font-semibold">D3.js</span> •{" "}
              <span className="font-semibold">Tailwind CSS</span> •{" "}
              <span className="font-semibold">Firebase</span> •{" "}
              <span className="font-semibold">Cloud Functions</span> •{" "}
              <span className="font-semibold">Firestore</span> •{" "}
              <span className="font-semibold">Vite</span> •{" "}
              <span className="font-semibold">Axios</span> •{" "}
              <span className="font-semibold">Wikipedia API</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Créé pour Capgemini Morocco
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
