"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { v4 as uuidv4 } from "uuid";
import { format, differenceInDays, differenceInHours, addMonths, addYears } from "date-fns";
import confetti from "canvas-confetti";
import { playClickSound, playSealSound, playUnlockSound } from "@/lib/audio";
import { Lock, Unlock, Clock, AlertTriangle, Sparkles, Download, Upload, Trash2, Calendar, ShieldCheck } from "lucide-react";

type TimeCapsule = {
  id: string;
  title: string;
  message: string;
  unlockDate: string; // ISO string for robust JSON storage
  createdAt: string;
  isUnlocked: boolean;
  sealBrokenEarly?: boolean;
};

const DEFAULT_CAPSULES: TimeCapsule[] = [
  {
    id: "sample-1",
    title: "Letter to My 2027 Self",
    message: "Remember the days building late at night with Forge and the Harkco team? Keep the craft high, never compromise on tactile quality, and stay curious!",
    unlockDate: addYears(new Date(), 1).toISOString(),
    createdAt: new Date().toISOString(),
    isUnlocked: false,
  },
  {
    id: "sample-2",
    title: "Unlocked Memory: Studio Genesis",
    message: "The first day we deployed our daily micro-apps to Coolify and achieved full local sovereignty. A milestone worth cherishing forever.",
    unlockDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    createdAt: addMonths(new Date(), -6).toISOString(),
    isUnlocked: true,
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newUnlockDate, setNewUnlockDate] = useState<Date | undefined>(undefined);

  // Load capsules from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("time-capsules-v2");
      if (saved) {
        setCapsules(JSON.parse(saved));
      } else {
        setCapsules(DEFAULT_CAPSULES);
      }
    } catch (e) {
      setCapsules(DEFAULT_CAPSULES);
    }
  }, []);

  // Save capsules to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("time-capsules-v2", JSON.stringify(capsules));
    }
  }, [capsules, mounted]);

  const createCapsule = () => {
    if (!newTitle.trim() || !newMessage.trim() || !newUnlockDate) return;

    playSealSound();

    const capsule: TimeCapsule = {
      id: uuidv4(),
      title: newTitle.trim(),
      message: newMessage.trim(),
      unlockDate: newUnlockDate.toISOString(),
      createdAt: new Date().toISOString(),
      isUnlocked: false,
    };

    setCapsules([capsule, ...capsules]);
    setNewTitle("");
    setNewMessage("");
    setNewUnlockDate(undefined);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const unlockCapsule = (id: string, forceEarly: boolean = false) => {
    playUnlockSound();
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch (e) {}

    setCapsules(
      capsules.map((c) =>
        c.id === id
          ? {
              ...c,
              isUnlocked: true,
              sealBrokenEarly: forceEarly ? true : c.sealBrokenEarly,
            }
          : c
      )
    );
  };

  const deleteCapsule = (id: string) => {
    playClickSound();
    if (confirm("Permanently delete this time capsule?")) {
      setCapsules(capsules.filter((c) => c.id !== id));
    }
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const unlock = new Date(dateStr);
    unlock.setHours(0, 0, 0, 0);
    return Math.max(0, differenceInDays(unlock, today));
  };

  const isExpired = (dateStr: string) => {
    return new Date(dateStr).getTime() <= Date.now();
  };

  const exportCapsules = () => {
    playClickSound();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(capsules, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `harkco_time_capsules_${format(new Date(), "yyyy-MM-dd")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 py-8 px-4 flex flex-col justify-between">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/20">
              ⏳
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
              Time Capsule
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Harkco
            </span>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Seal your memories, dreams, and forecasts for the future. 100% private in your browser.
          </p>

          {/* Quick Toolbar */}
          <div className="flex items-center justify-center gap-3 mt-4 text-xs">
            <button
              onClick={exportCapsules}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 transition"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Backup Capsules</span>
            </button>
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-server privacy</span>
            </div>
          </div>
        </div>

        {/* Create Capsule Form */}
        <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 mb-10 shadow-2xl shadow-purple-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-xl text-purple-300">
                🔮
              </div>
              <div>
                <CardTitle className="text-purple-200 text-xl font-bold">Seal a New Capsule</CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Write to your future self and choose when the vault unlocks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-slate-200 text-xs uppercase font-semibold tracking-wider">
                Capsule Title
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. My goals for 2027, Startup reflections..."
                className="bg-slate-950/60 border-purple-500/30 text-slate-100 placeholder:text-slate-500 h-11 text-sm focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-slate-200 text-xs uppercase font-semibold tracking-wider">
                Secret Message
              </Label>
              <Textarea
                id="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your honest thoughts, hopes, questions, and reflections..."
                rows={4}
                className="bg-slate-950/60 border-purple-500/30 text-slate-100 placeholder:text-slate-500 resize-none text-sm focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-200 text-xs uppercase font-semibold tracking-wider">
                Unlock Date
              </Label>
              <DatePicker
                date={newUnlockDate}
                onChange={setNewUnlockDate}
              />
            </div>

            <Button
              onClick={createCapsule}
              disabled={!newTitle.trim() || !newMessage.trim() || !newUnlockDate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-6 text-base shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99] cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                🔒 Seal Time Capsule
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Capsule Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {capsules.map((capsule) => {
            const expired = isExpired(capsule.unlockDate);
            const daysLeft = getDaysUntil(capsule.unlockDate);

            return (
              <Card
                key={capsule.id}
                className={`transition-all duration-300 overflow-hidden ${
                  capsule.isUnlocked
                    ? "bg-slate-900/90 border-emerald-500/40 shadow-emerald-500/10"
                    : expired
                    ? "bg-slate-900/90 border-amber-500/40 shadow-amber-500/10"
                    : "bg-slate-900/80 backdrop-blur-md border-purple-500/30 shadow-purple-500/10"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold text-slate-100 truncate">
                        {capsule.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs mt-0.5">
                        {capsule.isUnlocked
                          ? `✨ Unlocked on ${format(new Date(capsule.unlockDate), "PPP")}`
                          : `📅 Unlocks: ${format(new Date(capsule.unlockDate), "PPP")}`}
                      </CardDescription>
                    </div>

                    {/* Status Badge */}
                    {capsule.isUnlocked ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 flex-shrink-0">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>OPEN</span>
                      </span>
                    ) : expired ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30 flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>READY</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/15 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30 flex-shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                        <span>SEALED</span>
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Content Area */}
                  {capsule.isUnlocked ? (
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/20 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
                      {capsule.message}
                      {capsule.sealBrokenEarly && (
                        <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-amber-400/90 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Vault seal was broken early by author</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-b from-purple-950/30 to-slate-950/80 p-5 rounded-xl border border-purple-500/20 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
                        <Lock className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-purple-300 font-mono">
                          {daysLeft} {daysLeft === 1 ? "day" : "days"}
                        </div>
                        <p className="text-xs text-slate-400">until official unsealing</p>
                      </div>

                      {expired ? (
                        <Button
                          onClick={() => unlockCapsule(capsule.id)}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20"
                        >
                          🎉 It's Time! Open Capsule
                        </Button>
                      ) : (
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to break the seal early? Time capsules are meant for the future!")) {
                              unlockCapsule(capsule.id, true);
                            }
                          }}
                          className="text-[11px] text-slate-500 hover:text-purple-400 transition underline underline-offset-2"
                        >
                          Break seal early
                        </button>
                      )}
                    </div>
                  )}

                  {/* Footer info & delete */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/60 text-xs text-slate-500">
                    <span>
                      Sealed {format(new Date(capsule.createdAt), "MMM d, yyyy")}
                    </span>
                    <button
                      onClick={() => deleteCapsule(capsule.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      title="Delete capsule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Harkco Ecosystem Footer */}
      <footer className="mt-16 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 text-slate-400">
          <a href="https://portfolio.apps.harkco.se" className="hover:text-purple-300 transition">Portfolio</a>
          <a href="https://puls.apps.harkco.se" className="hover:text-purple-300 transition">Puls</a>
          <a href="https://knippa.apps.harkco.se" className="hover:text-purple-300 transition">Knippa</a>
          <a href="https://fakt.apps.harkco.se" className="hover:text-purple-300 transition">Fakt</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Harkco. Pure craft, local privacy.</p>
      </footer>
    </main>
  );
}