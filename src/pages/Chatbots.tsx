import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Globe, Facebook, MessageCircle, Play, Edit, Trash2, Bot } from "lucide-react";

const API_URL = "http://localhost:5000/api/chatbots";
const SESSIONS_API_URL = "http://localhost:5000/api/sessions";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJUZXN0VXNlciIsImlhdCI6MTc2MDMwNTU4NiwiZXhwIjoxNzYwMzA5MTg2fQ.xBYWeHz8-q2WmNQ8lz9HEkMO1-gtu1CMAT_Qt6Dd1zo";

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
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ======================= LOAD CHATBOTS =======================
  const loadChatbots = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const data = await res.json();
      setChatbots(data.chatbots || []);
    } catch (error) {
      console.error("Erreur chargement chatbots:", error);
    }
  };

  // ======================= LOAD SESSIONS =======================
  useEffect(() => {
    fetch(`${API_URL}/sessions`, { headers: { Authorization: `Bearer ${TOKEN}` } })
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions || []);
        if (data.sessions?.length > 0) {
          setActiveSessionId(data.sessions[0].id);
        }
      })
      .catch((err) => console.error("Erreur chargement sessions:", err));

    loadChatbots();
  }, []);

  // ======================= SCENARIOS =======================
  const handleScenarioChange = (index: number, field: string, value: string) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: value };
    setScenarios(newScenarios);
  };
  const addScenario = () => setScenarios([...scenarios, { question: "", answer: "" }]);

  // ======================= CREATE OR UPDATE CHATBOT =======================
  const handleSaveChatbot = async () => {
    if (!botName.trim()) {
      alert("Veuillez saisir un nom pour le chatbot !");
      return;
    }

    const chatbotData = {
      bot_name: botName,
      welcome_message: welcomeMessage,
      scenarios,
      channels,
      is_active: isActive,
    };

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(chatbotData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(editingId ? "Chatbot mis à jour !" : "Chatbot créé !");
        loadChatbots();
        resetForm();
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      console.error("❌ Erreur création/màj chatbot:", error);
    }
  };

  // ======================= DELETE CHATBOT =======================
  const handleDeleteChatbot = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce chatbot ?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (res.ok) {
        setChatbots(chatbots.filter((b) => b.id !== id));
        alert("Chatbot supprimé !");
      } else {
        alert("Erreur suppression !");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  // ======================= EDIT CHATBOT =======================
  const handleEditChatbot = (bot: any) => {
    setBotName(bot.bot_name);
    setWelcomeMessage(bot.welcome_message);
    setScenarios(bot.scenarios || [{ question: "", answer: "" }]);
    setChannels(bot.channels || { whatsapp: false, website: false, facebook: false });
    setIsActive(bot.is_active);
    setEditingId(bot.id);
  };

  // ======================= RESET FORM =======================
  const resetForm = () => {
    setBotName("");
    setWelcomeMessage("");
    setScenarios([{ question: "", answer: "" }]);
    setChannels({ whatsapp: false, website: false, facebook: false });
    setIsActive(true);
    setEditingId(null);
  };

  // ======================= SAVE SESSION =======================
  const handleSaveSession = async () => {
    try {
      if (!activeSessionId) {
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
      console.error("❌ Erreur sauvegarde session:", error);
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

      const matchedScenario = scenarios.find((s) => s.question === testMessage);
      const simulatedResponse = matchedScenario ? matchedScenario.answer : "Réponse automatique";

      setTestResponse(simulatedResponse);
      setInteractions([
        ...interactions,
        { id: interactions.length + 1, user: "Test", message: testMessage, response: simulatedResponse },
      ]);
      setTestMessage("");
    } catch (error) {
      console.error("❌ Erreur test bot:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bot className="w-6 h-6 text-primary" /> Gestion des Chatbots
      </h1>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configurer</TabsTrigger>
          <TabsTrigger value="channels">Canaux</TabsTrigger>
          <TabsTrigger value="test">Tester</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
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

              <div className="flex items-center gap-2 mt-4">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <span className="text-sm">{isActive ? "Bot Actif" : "Bot Inactif"}</span>
              </div>

              <Button className="w-full mt-4" onClick={handleSaveChatbot}>
                {editingId ? "💾 Mettre à jour le Chatbot" : "➕ Créer le Chatbot"}
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

        {/* ===== LISTE ===== */}
        <TabsContent value="list">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              {chatbots.length === 0 ? (
                <p>Aucun chatbot trouvé.</p>
              ) : (
                chatbots.map((bot) => (
                  <div
                    key={bot.id}
                    className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <h3 className="font-semibold">{bot.bot_name}</h3>
                      <p className="text-sm text-gray-600">{bot.welcome_message}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          bot.is_active ? "bg-green-200 text-green-800" : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {bot.is_active ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditChatbot(bot)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteChatbot(bot.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Chatbots;
