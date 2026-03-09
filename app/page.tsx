"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { v4 as uuidv4 } from "uuid";
import { format, differenceInDays } from "date-fns";

type TimeCapsule = {
  id: string;
  title: string;
  message: string;
  unlockDate: Date;
  createdAt: Date;
  isUnlocked: boolean;
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newUnlockDate, setNewUnlockDate] = useState<Date | undefined>(undefined);

  // Load capsules from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("time-capsules");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        setCapsules(parsed.map((c: TimeCapsule) => ({
          ...c,
          unlockDate: new Date(c.unlockDate),
          createdAt: new Date(c.createdAt),
        })));
      } catch (e) {
        console.error("Failed to parse saved capsules");
      }
    }
  }, []);

  // Save capsules to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("time-capsules", JSON.stringify(capsules));
    }
  }, [capsules, mounted]);

  const createCapsule = () => {
    if (!newTitle.trim() || !newMessage.trim() || !newUnlockDate) return;

    const capsule: TimeCapsule = {
      id: uuidv4(),
      title: newTitle,
      message: newMessage,
      unlockDate: newUnlockDate,
      createdAt: new Date(),
      isUnlocked: false,
    };

    setCapsules([...capsules, capsule]);
    setNewTitle("");
    setNewMessage("");
    setNewUnlockDate(undefined);
  };

  const unlockCapsule = (id: string) => {
    setCapsules(capsules.map(c => 
      c.id === id ? { ...c, isUnlocked: true } : c
    ));
  };

  const deleteCapsule = (id: string) => {
    setCapsules(capsules.filter(c => c.id !== id));
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const unlockDate = new Date(date);
    unlockDate.setHours(0, 0, 0, 0);
    return differenceInDays(unlockDate, today);
  };

  const isExpired = (date: Date) => {
    return differenceInDays(date, new Date()) < 0;
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 py-8 px-4">
      {/* Floating background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/25">
              ⏳
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Time Capsule
          </h1>
          <p className="text-slate-400 mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Seal your thoughts, dreams, and messages for the future
          </p>
        </div>

        {/* Create Capsule Form */}
        <Card className="bg-slate-900/80 backdrop-blur-sm border-purple-500/30 mb-10 shadow-2xl shadow-purple-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                🔮
              </div>
              <div>
                <CardTitle className="text-purple-300 text-2xl">Create a Time Capsule</CardTitle>
                <CardDescription className="text-slate-400 text-base">
                  Write a message to your future self and choose when to unlock it
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-200 text-base font-medium">Title</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., My goals for 2027"
                className="bg-slate-800/50 border-purple-500/30 text-slate-200 placeholder:text-slate-500 h-12 text-base focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-200 text-base font-medium">Message</Label>
              <Textarea
                id="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your thoughts, dreams, hopes..."
                rows={5}
                className="bg-slate-800/50 border-purple-500/30 text-slate-200 placeholder:text-slate-500 resize-none h-auto text-base focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unlockDate" className="text-slate-200 text-base font-medium">Unlock Date</Label>
              <DatePicker
                date={newUnlockDate}
                onChange={setNewUnlockDate}
              />
            </div>

            <Button
              onClick={createCapsule}
              disabled={!newTitle.trim() || !newMessage.trim() || !newUnlockDate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                🔮 Seal Time Capsule
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Capsule Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {capsules.map((capsule, index) => (
            <Card
              key={capsule.id}
              className={`transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                capsule.isUnlocked
                  ? "bg-emerald-900/20 border-emerald-500/40 shadow-emerald-500/10"
                  : isExpired(capsule.unlockDate)
                  ? "bg-amber-900/20 border-amber-500/40 shadow-amber-500/10"
                  : "bg-slate-900/80 backdrop-blur-sm border-purple-500/30 shadow-purple-500/10"
              } ${capsule.isUnlocked ? "ring-2 ring-emerald-500/30" : "hover:ring-2 hover:ring-purple-500/30"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-slate-200 mb-2">{capsule.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {capsule.isUnlocked
                        ? `✨ Unlocked on ${format(capsule.unlockDate, "PPP")}`
                        : `📅 Unlocks: ${format(capsule.unlockDate, "PPP")}`}
                    </CardDescription>
                  </div>
                  {capsule.isUnlocked ? (
                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-full border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                      🔓 UNLOCKED
                    </span>
                  ) : isExpired(capsule.unlockDate) ? (
                    <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm font-bold rounded-full border border-amber-500/30 shadow-lg shadow-amber-500/10">
                      ⏰ OVERDUE
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-full border border-purple-500/30 shadow-lg shadow-purple-500/10">
                      🔒 SEALED
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 p-4 rounded-xl border border-purple-500/10">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-4">
                    {capsule.message}
                  </p>
                </div>

                {!capsule.isUnlocked && (
                  <div className="space-y-3">
                    {isExpired(capsule.unlockDate) ? (
                      <Button
                        onClick={() => unlockCapsule(capsule.id)}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                      >
                        <span className="flex items-center justify-center gap-2">
                          🎉 Unlock Capsule (It's time!)
                        </span>
                      </Button>
                    ) : (
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                          {getDaysUntil(capsule.unlockDate)}
                        </div>
                        <div className="text-purple-400/80 text-sm font-medium">days to go</div>
                        {/* Progress bar */}
                        <div className="mt-3 h-2 bg-purple-500/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.max(5, 100 - (getDaysUntil(capsule.unlockDate) / 365 * 100))}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                  <span className="text-xs text-slate-500">
                    📝 Created {format(capsule.createdAt, "PPP p")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCapsule(capsule.id)}
                    className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {capsules.length === 0 && (
            <Card className="col-span-2 bg-slate-900/80 backdrop-blur-sm border-purple-500/20">
              <CardContent className="py-16 text-center">
                <div className="text-7xl mb-6 animate-bounce">🔮</div>
                <h3 className="text-2xl font-bold text-slate-300 mb-3">
                  No time capsules yet
                </h3>
                <p className="text-slate-500 max-w-md mx-auto text-base">
                  Create your first time capsule to start sealing thoughts for the future
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}