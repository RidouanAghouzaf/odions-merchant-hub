import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Globe, Facebook, MessageCircle, Play } from "lucide-react";

const API_URL = "http://localhost:5000/api/chatbots"; // Backend Express
const TOKEN = " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJUZXN0VXNlciIsImlhdCI6MTc1OTUyNzIzMCwiZXhwIjoxNzU5NTMwODMwfQ.dBLSH83k8MZJaIr8WsaaFuNwF59T6KGoSlIUVEL2BIg";

const Chatbots: React.FC = () => {
  // ======================= STATES =======================
  const [botName, setBotName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [scenarios, setScenarios] = useState([{ question: "", answer: "" }]);
  const [channels, setChannels] = useState({ whatsapp: false, website: false, facebook: false });
  const [isActive, setIsActive] = useState(true);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [interactions, setInteractions] = useState<
    { id: number; user: string; message: string; response: string }[]
  >([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  // ======================= LOAD SESSIONS =======================
  useEffect(() => {
    fetch(`${API_URL}/sessions`, { headers: { Authorization: `Bearer ${TOKEN}` } })
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions || []);
        if (data.sessions?.length > 0) {
          setActiveSessionId(data.sessions[0].id); // Définit la première session active par défaut
        }
      })
      .catch((err) => console.error("Erreur chargement sessions:", err));
  }, []);

  // ======================= SCENARIOS =======================
  const handleScenarioChange = (index: number, field: string, value: string) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: value };
    setScenarios(newScenarios);
  };
  const addScenario = () => setScenarios([...scenarios, { question: "", answer: "" }]);

  // ======================= SAVE CHATBOT =======================
  const handleSave = async () => {
    try {
      if (!activeSessionId) {
        // Création d'une nouvelle session
        const res = await fetch(`${API_URL}/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setSessions([data.session, ...sessions]);
        setActiveSessionId(data.session.id);
        alert("Chatbot sauvegardé et session créée !");
      } else {
        alert("Chatbot déjà sauvegardé dans la session active !");
      }
    } catch (error) {
      console.error("❌ Erreur sauvegarde:", error);
      alert("Erreur lors de la sauvegarde du chatbot !");
    }
  };

  // ======================= TEST BOT =======================
  const handleTestBot = async () => {
    if (!activeSessionId) {
      alert("Aucune session active !");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/sessions/${activeSessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({ message: testMessage, role: "user" }),
      });
      const data = await res.json();
      console.log("💬 Message envoyé:", data);

      // Réponse simulée avec scénario
      const matchedScenario = scenarios.find((s) => s.question === testMessage);
      const simulatedResponse = matchedScenario ? matchedScenario.answer : "Réponse automatique";

      setTestResponse(simulatedResponse);
      setInteractions([
        ...interactions,
        { id: interactions.length + 1, user: "Test", message: testMessage, response: simulatedResponse },
      ]);
      setTestMessage(""); // vide l'input
    } catch (error) {
      console.error("❌ Erreur test bot:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🤖 Gestion des Chatbots</h1>

      {/* ======================= TABS ======================= */}
      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configurer</TabsTrigger>
          <TabsTrigger value="channels">Canaux</TabsTrigger>
          <TabsTrigger value="test">Tester</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* ===== CONFIGURATION ===== */}
        <TabsContent value="config">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              <Input placeholder="Nom du chatbot" value={botName} onChange={(e) => setBotName(e.target.value)} />
              <Textarea
                placeholder="Message de bienvenue"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
              />

              {/* Scénarios */}
              <div className="space-y-3">
                <h3 className="font-medium">Scénarios de conversation</h3>
                {scenarios.map((s, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="Question"
                      value={s.question}
                      onChange={(e) => handleScenarioChange(idx, "question", e.target.value)}
                    />
                    <Input
                      placeholder="Réponse"
                      value={s.answer}
                      onChange={(e) => handleScenarioChange(idx, "answer", e.target.value)}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={addScenario}>
                  ➕ Ajouter un scénario
                </Button>
              </div>

              {/* Actif/Inactif */}
              <div className="flex items-center gap-2 mt-4">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <span className="text-sm">{isActive ? "Bot Actif" : "Bot Inactif"}</span>
              </div>

              <Button className="w-full mt-4" onClick={handleSave}>
                💾 Sauvegarder le Chatbot
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== CANAUX ===== */}
        <TabsContent value="channels">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2">
                <Switch checked={channels.whatsapp} onCheckedChange={(v) => setChannels({ ...channels, whatsapp: v })} />
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={channels.website} onCheckedChange={(v) => setChannels({ ...channels, website: v })} />
                <Globe className="h-4 w-4" /> Site Web
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={channels.facebook} onCheckedChange={(v) => setChannels({ ...channels, facebook: v })} />
                <Facebook className="h-4 w-4" /> Facebook Messenger
              </label>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TEST ===== */}
        <TabsContent value="test">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Tapez un message..." value={testMessage} onChange={(e) => setTestMessage(e.target.value)} />
                <Button variant="outline" onClick={handleTestBot}>
                  <Play className="h-4 w-4" /> Tester
                </Button>
              </div>
              {testResponse && <p className="text-sm text-muted-foreground mt-2">🤖 {testResponse}</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== HISTORIQUE ===== */}
        <TabsContent value="history">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {interactions.map((i) => (
                  <div key={i.id} className="p-3 rounded-lg border bg-muted text-sm flex flex-col">
                    <span className="font-bold">{i.user}</span>
                    <span className="text-gray-700">💬 {i.message}</span>
                    <span className="text-green-700">🤖 {i.response}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Chatbots;
