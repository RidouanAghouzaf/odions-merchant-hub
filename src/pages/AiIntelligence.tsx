import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, Brain, Smile, DollarSign, AlertCircle, Gift } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_URL = "http://127.0.0.1:8000"; // FastAPI backend
const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#f87171"];

export default function AiIntelligence() {
  const [activeTab, setActiveTab] = useState("segmentation");
  const [loading, setLoading] = useState(false);

  const [segmentationData, setSegmentationData] = useState<any>(null);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [sentimentTrend, setSentimentTrend] = useState<any>([]);
  const [clvData, setClvData] = useState<any>(null);
  const [churnData, setChurnData] = useState<any>(null);
  const [recommendationData, setRecommendationData] = useState<any>(null);

  // ----------------- Regenerate CSV Data -----------------
  const regenerateData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/regenerate-data`, { method: "POST" });
      const data = await res.json();

      // Refresh all tabs
      await fetchSegmentation();
      await fetchPrediction();
      await fetchSentiment();
      await fetchCLV();
      await fetchChurn();
      await fetchRecommendations();

      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la régénération des données");
    }
    setLoading(false);
  };

  // ----------------- Fetch Functions -----------------
  const fetchSegmentation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/segmentation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: 1, n_clusters: 3 }),
      });
      const data = await res.json();
      setSegmentationData(data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la segmentation");
    }
    setLoading(false);
  };

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/prediction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: 1 }),
      });
      const data = await res.json();
      setPredictionData(data.predictions);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la prédiction");
    }
    setLoading(false);
  };

  const fetchSentiment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: 1 }),
      });
      const data = await res.json();
      setSentimentData(data.sentiments);

      const trendMap: any = {};
      data.sentiments.forEach((s: any) => {
        const date = new Date().toISOString().split("T")[0];
        if (!trendMap[date]) trendMap[date] = { date, positive: 0, negative: 0 };
        trendMap[date].positive += s.score.pos;
        trendMap[date].negative += s.score.neg;
      });
      setSentimentTrend(Object.values(trendMap));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'analyse des sentiments");
    }
    setLoading(false);
  };

  const fetchCLV = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/clv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: 1 }),
      });
      const data = await res.json();
      setClvData(data.clv);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du calcul du CLV");
    }
    setLoading(false);
  };

  const fetchChurn = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/churn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: 1 }),
      });
      const data = await res.json();
      setChurnData(data.risks);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'analyse du churn");
    }
    setLoading(false);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: 1 }),
      });
      const data = await res.json();
      setRecommendationData(data.recommendations);
    } catch (err) {
      console.error(err);
      alert("Erreur lors des recommandations");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold">Gestion de l’Intelligence Artificielle</h1>
        </div>
        <Button
          className="transition-all duration-200 hover:scale-105 hover:bg-blue-600"
          onClick={regenerateData}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Regénérer les Données"}
        </Button>
      </div>

      <p className="text-gray-600 max-w-full md:max-w-3xl">
        Cette section exploite l’IA pour aider les e-commerçants à mieux comprendre leurs clients : segmentation, prédiction, sentiment, CLV, churn et recommandations produits.
      </p>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full overflow-x-auto">
          <TabsTrigger value="segmentation" className="transition-all hover:scale-105">Segmentation</TabsTrigger>
          <TabsTrigger value="prediction" className="transition-all hover:scale-105">Prédiction</TabsTrigger>
          <TabsTrigger value="sentiment" className="transition-all hover:scale-105">Sentiment</TabsTrigger>
          <TabsTrigger value="clv" className="transition-all hover:scale-105">CLV</TabsTrigger>
          <TabsTrigger value="churn" className="transition-all hover:scale-105">Churn</TabsTrigger>
          <TabsTrigger value="recommendations" className="transition-all hover:scale-105">Recommandations</TabsTrigger>
        </TabsList>

        {/* ==================== SEGMENTATION ==================== */}
        <TabsContent value="segmentation">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-blue-500" />
                <h2 className="text-xl font-semibold">Segmentation Avancée des Clients</h2>
              </div>
              <p className="text-gray-600 text-sm">Cette analyse divise les clients en groupes selon leurs comportements d’achat, fréquence, et valeur.</p>
              <Button onClick={fetchSegmentation} disabled={loading}>
                {loading ? "Analyse en cours..." : "Lancer la Segmentation"}
              </Button>

              {segmentationData && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50 shadow">
                      <h4 className="text-blue-700 font-semibold">Total Segments</h4>
                      <p className="text-2xl font-bold text-blue-600">{Object.keys(segmentationData.segments).length}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-green-100 to-green-50 shadow">
                      <h4 className="text-green-700 font-semibold">Clients Analysés</h4>
                      <p className="text-2xl font-bold text-green-600">{Object.values(segmentationData.segments).flat().length}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-50 shadow">
                      <h4 className="text-yellow-700 font-semibold">Insights Générés</h4>
                      <p className="text-2xl font-bold text-yellow-600">{segmentationData.insights?.length || 0}</p>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-700 mb-3">Répartition des Clients par Segment</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={Object.entries(segmentationData.segments).map(([segment, clients]) => ({ name: segment, value: clients.length }))}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={100}
                          label
                        >
                          {Object.entries(segmentationData.segments).map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bar Chart */}
                  <div className="mt-10">
                    <h3 className="font-semibold text-gray-700 mb-3">Valeur Moyenne par Segment (DH)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={Object.entries(segmentationData.segments).map(([segment, clients]) => ({
                          segment,
                          avg_spent: clients.reduce((sum: number, c: any) => sum + (c.spent || 0), 0) / clients.length,
                        }))}
                      >
                        <XAxis dataKey="segment" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avg_spent" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Insights */}
                  {segmentationData.insights && (
                    <div className="mt-10 space-y-6">
                      <h3 className="text-lg font-semibold text-gray-700">🧠 Insights et Actions Recommandées</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {segmentationData.insights.map((insight: any, idx: number) => (
                          <div key={idx} className="border rounded-2xl p-5 bg-white shadow hover:shadow-lg transition">
                            <h4 className="font-semibold text-blue-600 mb-2">{insight.cluster}</h4>
                            <p className="text-sm text-gray-700">{insight.description}</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600 mt-3 space-y-1">
                              {insight.actions.map((action: string, i: number) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== PREDICTION ==================== */}
        <TabsContent value="prediction">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="text-purple-500" />
                <h2 className="text-xl font-semibold">Prédiction du Comportement d’Achat</h2>
              </div>
              <Button onClick={fetchPrediction} disabled={loading}>
                {loading ? "Chargement..." : "Lancer la Prédiction"}
              </Button>

              {predictionData && predictionData.length > 0 && (
                <>
                  {(() => {
                    const avgPurchase =
                      predictionData.reduce((sum: number, p: any) => sum + p.predicted_next_purchase, 0) / predictionData.length;
                    return (
                      <>
                        <div className="mt-6">
                          <h3 className="text-gray-700 font-semibold mb-2">Montant Prévisionnel par Client</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={predictionData}>
                              <XAxis dataKey="client_id" />
                              <YAxis />
                              <Tooltip formatter={(value: any) => `${value} DH`} />
                              <Bar dataKey="predicted_next_purchase" fill="#a78bfa" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="mt-6">
                          <h3 className="text-gray-700 font-semibold mb-2">Top 5 Clients à Cibler</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {predictionData
                              .sort((a: any, b: any) => b.predicted_next_purchase - a.predicted_next_purchase)
                              .slice(0, 5)
                              .map((p: any) => (
                                <li key={p.client_id}>
                                  Client #{p.client_id} – Prévision : {p.predicted_next_purchase} DH
                                </li>
                              ))}
                          </ul>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                          <table className="w-full border-collapse border">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="p-2 border">Client</th>
                                <th className="p-2 border">Montant Prochain Achat</th>
                                <th className="p-2 border">Comparé à la Moyenne</th>
                              </tr>
                            </thead>
                            <tbody>
                              {predictionData.map((p: any) => (
                                <tr key={p.client_id} className={p.predicted_next_purchase >= avgPurchase ? "bg-green-50" : "bg-red-50"}>
                                  <td className="border p-2">{p.client_id}</td>
                                  <td className="border p-2">{p.predicted_next_purchase} DH</td>
                                  <td className="border p-2">{p.predicted_next_purchase >= avgPurchase ? "Au-dessus de la moyenne" : "En dessous de la moyenne"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== SENTIMENT ==================== */}
        <TabsContent value="sentiment">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Smile className="text-green-500" />
                <h2 className="text-xl font-semibold">Analyse de Sentiments</h2>
              </div>
              <Button onClick={fetchSentiment} disabled={loading}>
                {loading ? "Chargement..." : "Analyser les Messages"}
              </Button>

              {sentimentData && sentimentData.map((s: any, i: number) => (
                <div key={i} className="p-3 border rounded-lg my-2 bg-gray-50">
                  <p>{s.text}</p>
                  <p className="text-sm">Pos: {s.score.pos}, Neu: {s.score.neu}, Neg: {s.score.neg}</p>
                </div>
              ))}

              {sentimentTrend.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sentimentTrend}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="positive" fill="#4ade80" />
                    <Bar dataKey="negative" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== CLV ==================== */}
        <TabsContent value="clv">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="text-yellow-500" />
                <h2 className="text-xl font-semibold">Customer Lifetime Value</h2>
              </div>
              <Button onClick={fetchCLV} disabled={loading}>
                {loading ? "Chargement..." : "Calculer CLV"}
              </Button>
              {clvData && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clvData}>
                    <XAxis dataKey="client_id" />
                    <YAxis />
                    <Tooltip formatter={(val: any) => `${val} DH`} />
                    <Bar dataKey="clv" fill="#fbbf24" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== CHURN ==================== */}
        <TabsContent value="churn">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500" />
                <h2 className="text-xl font-semibold">Analyse du Churn</h2>
              </div>
              <Button onClick={fetchChurn} disabled={loading}>
                {loading ? "Chargement..." : "Analyser le Churn"}
              </Button>
              {churnData && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={churnData}>
                    <XAxis dataKey="client_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="risk_score" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== RECOMMENDATIONS ==================== */}
        <TabsContent value="recommendations">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2">
                <Gift className="text-pink-500" />
                <h2 className="text-xl font-semibold">Recommandations Produits</h2>
              </div>
              <Button onClick={fetchRecommendations} disabled={loading}>
                {loading ? "Chargement..." : "Générer Recommandations"}
              </Button>
              {recommendationData && recommendationData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {recommendationData.map((rec: any, idx: number) => (
                    <div key={idx} className="border p-4 rounded-xl shadow hover:shadow-lg transition bg-white">
                      <h4 className="font-semibold">{rec.product_name}</h4>
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
