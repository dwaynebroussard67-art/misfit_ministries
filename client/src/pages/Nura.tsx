import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSiteCopy } from "@/lib/useSiteCopy";
import { trpc } from "@/lib/trpc";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { Send, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isCrisis?: boolean;
}

export default function Nura() {
  const copy = useSiteCopy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [hasCrisis, setHasCrisis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.nura.chat.useMutation();

  useEffect(() => {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(id);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        message: userMessage,
        sessionId,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.message,
          isCrisis: response.isCrisis,
        },
      ]);

      if (response.isCrisis) {
        setHasCrisis(true);
        toast.error("Crisis detected. Please call 988 immediately.");
      }
    } catch (error) {
      toast.error("Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">
              {copy("nura.headline")}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {copy("nura.body")}
            </p>
            <p className="text-sm text-muted-foreground italic">
              Grounded in Ethiopian Orthodox theology. Centered on Jesus Christ.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="flex flex-col h-[600px] md:h-[700px] bg-card border-border">
              {hasCrisis && (
                <div className="bg-destructive/20 border-b border-destructive/50 p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">Crisis Detected</p>
                    <p className="text-sm text-destructive/80">
                      If you are in immediate danger, please call 988 or go to your nearest emergency room.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <p className="text-lg font-semibold text-foreground mb-2">
                        Welcome. Jesus sees you.
                      </p>
                      <p className="text-muted-foreground">
                        What's on your heart?
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <Streamdown>{msg.content}</Streamdown>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border p-4">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    placeholder={copy("nura.placeholder")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Nura is a spiritual companion, not a replacement for professional mental health care.
              </p>
              <p className="mt-2">
                In crisis? Call <span className="font-semibold text-foreground">988</span> immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
