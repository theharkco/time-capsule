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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            ⏳ Time Capsule
          </h1>
          <p className="text-slate-400 mt-4 text-lg">
            Seal your thoughts for the future
          </p>
        </div>

        {/* Create Capsule Form */}
        <Card className="bg-slate-900/50 border-purple-500/20 mb-12">
          <CardHeader>
            <CardTitle className="text-purple-300">Create a Time Capsule</CardTitle>
            <CardDescription className="text-slate-400">
              Write a message to your future self and choose when to unlock it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-200">Title</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., My goals for 2027"
                className="bg-slate-800/50 border-purple-500/20 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-200">Message</Label>
              <Textarea
                id="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your thoughts, dreams, hopes..."
                rows={5}
                className="bg-slate-800/50 border-purple-500/20 text-slate-200 placeholder:text-slate-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unlockDate" className="text-slate-200">Unlock Date</Label>
              <DatePicker
                date={newUnlockDate}
                onChange={setNewUnlockDate}
              />
            </div>

            <Button
              onClick={createCapsule}
              disabled={!newTitle.trim() || !newMessage.trim() || !newUnlockDate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg"
            >
              🔮 Seal Time Capsule
            </Button>
          </CardContent>
        </Card>

        {/* Capsule Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {capsules.map((capsule) => (
            <Card
              key={capsule.id}
              className={`transition-all duration-300 ${
                capsule.isUnlocked
                  ? "bg-emerald-900/20 border-emerald-500/30"
                  : isExpired(capsule.unlockDate)
                  ? "bg-amber-900/20 border-amber-500/30"
                  : "bg-slate-900/50 border-purple-500/20"
              } ${capsule.isUnlocked ? "ring-2 ring-emerald-500/50" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-200">{capsule.title}</CardTitle>
                  {capsule.isUnlocked ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full">
                      🔓 UNLOCKED
                    </span>
                  ) : isExpired(capsule.unlockDate) ? (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-semibold rounded-full">
                      ⏰ OVERDUE
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-semibold rounded-full">
                      🔒 SEALED
                    </span>
                  )}
                </div>
                <CardDescription className="text-slate-400">
                  {capsule.isUnlocked
                    ? `Unlocked on ${format(capsule.unlockDate, "PPP")}`
                    : `Unlocks: ${format(capsule.unlockDate, "PPP")}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/10">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-4">
                    {capsule.message}
                  </p>
                </div>

                {!capsule.isUnlocked && (
                  <div className="space-y-3">
                    {isExpired(capsule.unlockDate) ? (
                      <Button
                        onClick={() => unlockCapsule(capsule.id)}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        🎉 Unlock Capsule (It's time!)
                      </Button>
                    ) : (
                      <div className="text-center text-purple-400 font-medium">
                        {getDaysUntil(capsule.unlockDate)} days to go
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-500">
                    Created {format(capsule.createdAt, "PPP p")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCapsule(capsule.id)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {capsules.length === 0 && (
            <Card className="col-span-2 bg-slate-900/30 border-purple-500/10">
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">🔮</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  No time capsules yet
                </h3>
                <p className="text-slate-500">
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