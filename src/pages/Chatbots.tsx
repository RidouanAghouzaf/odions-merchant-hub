import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Globe, Facebook, MessageCircle, Play } from "lucide-react";

const Chatbots: React.FC = () => {
  // ✅ States
  const [botName, setBotName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [scenarios, setScenarios] = useState([{ question: "", answer: "" }]);
  const [channels, setChannels] = useState({
    whatsapp: false,
    website: false,
    facebook: false,
  });
  const [isActive, setIsActive] = useState(true);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [interactions, setInteractions] = useState<
    { id: number; user: string; message: string; response: string }[]
  >([
    { id: 1, user: "Client 1", message: "Bonjour", response: "Salut 👋 ! Comment puis-je aider ?" },
    { id: 2, user: "Client 2", message: "Où est ma commande ?", response: "Votre commande est en cours de livraison 🚚" },
  ]);

  // ✅ Handlers
  const handleScenarioChange = (index: number, field: string, value: string) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: value };
    setScenarios(newScenarios);
  };

  const addScenario = () => setScenarios([...scenarios, { question: "", answer: "" }]);

  const handleTestBot = () => {
    const simulatedResponse =
      scenarios.length > 0
        ? scenarios[0].answer || "Réponse automatique"
        : "Aucun scénario défini";
    setTestResponse(simulatedResponse);

    // Ajoute dans l’historique
    setInteractions([
      ...interactions,
      { id: interactions.length + 1, user: "Test", message: testMessage, response: simulatedResponse },
    ]);
  };

  const handleSave = () => {
    const payload = {
      botName,
      welcomeMessage,
      scenarios,
      channels,
      isActive,
    };
    console.log("📡 Chatbot sauvegardé :", payload);
    alert("Chatbot sauvegardé avec succès !");
    // 🔗 À remplacer par un POST vers ton backend Spring Boot
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🤖 Gestion des Chatbots</h1>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configurer</TabsTrigger>
          <TabsTrigger value="channels">Canaux</TabsTrigger>
          <TabsTrigger value="test">Tester</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* ✅ Configuration */}
        <TabsContent value="config">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold">Créer / Configurer un Chatbot</h2>

              <Input
                placeholder="Nom du chatbot"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
              />

              <Textarea
                placeholder="Message de bienvenue"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
              />

              {/* ✅ Scénarios */}
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

              {/* ✅ Statut Actif/Inactif */}
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

        {/* ✅ Connexion aux Canaux */}
        <TabsContent value="channels">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold">Connexion aux Canaux</h2>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2">
                  <Switch
                    checked={channels.whatsapp}
                    onCheckedChange={(v) => setChannels({ ...channels, whatsapp: v })}
                  />
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </label>

                <label className="flex items-center gap-2">
                  <Switch
                    checked={channels.website}
                    onCheckedChange={(v) => setChannels({ ...channels, website: v })}
                  />
                  <Globe className="h-4 w-4" /> Site Web
                </label>

                <label className="flex items-center gap-2">
                  <Switch
                    checked={channels.facebook}
                    onCheckedChange={(v) => setChannels({ ...channels, facebook: v })}
                  />
                  <Facebook className="h-4 w-4" /> Facebook Messenger
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ✅ Tester le Bot */}
        <TabsContent value="test">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold">Tester le Chatbot</h2>

              <div className="flex gap-2">
                <Input
                  placeholder="Tapez un message..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                />
                <Button variant="outline" onClick={handleTestBot}>
                  <Play className="h-4 w-4" /> Tester
                </Button>
              </div>

              {testResponse && (
                <p className="text-sm text-muted-foreground mt-2">
                  🤖 {testResponse}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ✅ Historique des Interactions */}
        <TabsContent value="history">
          <Card className="p-4 shadow-md">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold">Historique des Interactions</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {interactions.map((i) => (
                  <div
                    key={i.id}
                    className="p-3 rounded-lg border bg-muted text-sm flex flex-col"
                  >
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
