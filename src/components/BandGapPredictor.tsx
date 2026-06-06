"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertCircle, History, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { toast } from "sonner";

import { PredictionResultCard } from "@/components/PredictionResultCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getPredictionHistory } from "@/services/history/historyService";
import { predictBandGap } from "@/services/prediction/predictionService";
import type { HistoryItem } from "@/types/prediction";

const EXAMPLES = [
  {
    name: "TlBr₃",
    text: "TlBrâ‚ƒ is Magnesium structured and crystallizes in the orthorhombic Pnma space group. The structure is zero-dimensional and consists of four TlBrâ‚ƒ clusters. TlÂ³âº is bonded in a trigonal planar geometry to three BrÂ¹â» atoms. All Tlâ€“Br bond lengths are 2.54 Ã…. There are two inequivalent BrÂ¹â» sites. In the first BrÂ¹â» site, BrÂ¹â» is bonded in a single-bond geometry to one TlÂ³âº atom. In the second BrÂ¹â» site, BrÂ¹â» is bonded in a single-bond geometry to one TlÂ³âº atom.",
  },
  {
    name: "Nd₂Co₁₉Si₃",
    text: "Ndâ‚‚Coâ‚â‚‰Siâ‚ƒ crystallizes in the monoclinic C2/m space group. Nd is bonded in a 18-coordinate geometry to nineteen Co atoms. There are a spread of Ndâ€“Co bond distances ranging from 3.04â€“3.35 Ã…. There are six inequivalent Co sites. In the first Co site, Co is bonded in a 14-coordinate geometry to two equivalent Nd, nine Co, and three Si atoms. There are a spread of Coâ€“Co bond distances ranging from 2.53â€“2.64 Ã…. All Coâ€“Si bond lengths are 2.56 Ã…. In the second Co site, Co is bonded to two equivalent Nd, eight Co, and two Si atoms to form distorted CoNdâ‚‚Coâ‚ˆSiâ‚‚ cuboctahedra that share corners with eighteen CoNdâ‚‚Coâ‚ˆSiâ‚‚ cuboctahedra, edges with four CoNdâ‚‚Coâ‚‰Si cuboctahedra, and faces with twelve CoNdâ‚‚Coâ‚ˆSiâ‚‚ cuboctahedra. There are a spread of Coâ€“Co bond distances ranging from 2.40â€“2.62 Ã…. There is one shorter (2.35 Ã…) and one longer (2.38 Ã…) Coâ€“Si bond length. In the third Co site, Co is bonded to two equivalent Nd, nine Co, and one Si atom to form a mixture of distorted corner, edge, and face-sharing CoNdâ‚‚Coâ‚‰Si cuboctahedra. There are a spread of Coâ€“Co bond distances ranging from 2.39â€“2.61 Ã…. The Coâ€“Si bond length is 2.35 Ã…. In the fourth Co site, Co is bonded to two equivalent Nd, nine Co, and one Si atom to form a mixture of distorted corner, edge, and face-sharing CoNdâ‚‚Coâ‚‰Si cuboctahedra. There are a spread of Coâ€“Co bond distances ranging from 2.36â€“2.49 Ã…. The Coâ€“Si bond length is 2.36 Ã…. In the fifth Co site, Co is bonded in a 12-coordinate geometry to two equivalent Nd, eight Co, and two Si atoms. The Coâ€“Co bond length is 2.57 Ã…. There is one shorter (2.34 Ã…) and one longer (2.38 Ã…) Coâ€“Si bond length. In the sixth Co site, Co is bonded to two equivalent Nd and ten Co atoms to form distorted CoNdâ‚‚Coâ‚â‚€ cuboctahedra that share corners with sixteen CoNdâ‚‚Coâ‚ˆSiâ‚‚ cuboctahedra, edges with four equivalent CoNdâ‚‚Coâ‚‰Si cuboctahedra, and faces with twelve CoNdâ‚‚Coâ‚ˆSiâ‚‚ cuboctahedra. There are two inequivalent Si sites. In the first Si site, Si is bonded in a 10-coordinate geometry to ten Co atoms. In the second Si site, Si is bonded in a 10-coordinate geometry to ten Co atoms.",
  },
  {
    name: "Li₄CO₄",
    text: "Liâ‚„COâ‚„ is Matlockite-like structured and crystallizes in the monoclinic Cm space group. There are three inequivalent LiÂ¹âº sites. In the first LiÂ¹âº site, LiÂ¹âº is bonded in a 4-coordinate geometry to four OÂ²â» atoms. There are a spread of Liâ€“O bond distances ranging from 1.91â€“2.19 Ã…. In the second LiÂ¹âº site, LiÂ¹âº is bonded to four OÂ²â» atoms to form LiOâ‚„ tetrahedra that share corners with four equivalent LiOâ‚„ tetrahedra and corners with four equivalent COâ‚„ tetrahedra. There are a spread of Liâ€“O bond distances ranging from 1.91â€“2.00 Ã…. In the third LiÂ¹âº site, LiÂ¹âº is bonded in a 4-coordinate geometry to four OÂ²â» atoms. There are three shorter (1.93 Ã…) and one longer (2.18 Ã…) Liâ€“O bond length. Câ´âº is bonded to four OÂ²â» atoms to form COâ‚„ tetrahedra that share corners with eight equivalent LiOâ‚„ tetrahedra. There are a spread of Câ€“O bond distances ranging from 1.41â€“1.44 Ã…. There are three inequivalent OÂ²â» sites. In the first OÂ²â» site, OÂ²â» is bonded in a 5-coordinate geometry to four LiÂ¹âº and one Câ´âº atom. In the second OÂ²â» site, OÂ²â» is bonded in a 5-coordinate geometry to four LiÂ¹âº and one Câ´âº atom. In the third OÂ²â» site, OÂ²â» is bonded in a 5-coordinate geometry to four LiÂ¹âº and one Câ´âº atom.",
  },
  {
    name: "CaEu(FeO₃)₄",
    text: "CaEu(FeOâ‚ƒ)â‚„ crystallizes in the tetragonal P4/mmm space group. Ca is bonded to twelve O atoms to form CaOâ‚â‚‚ cuboctahedra that share corners with four equivalent CaOâ‚â‚‚ cuboctahedra, corners with eight equivalent EuOâ‚â‚‚ cuboctahedra, and faces with eight equivalent FeOâ‚† octahedra. There are four shorter (2.67 Ã…) and eight longer (2.73 Ã…) Caâ€“O bond lengths. Eu is bonded to twelve O atoms to form EuOâ‚â‚‚ cuboctahedra that share corners with four equivalent EuOâ‚â‚‚ cuboctahedra, corners with eight equivalent CaOâ‚â‚‚ cuboctahedra, and faces with eight equivalent FeOâ‚† octahedra. There are eight shorter (2.64 Ã…) and four longer (2.67 Ã…) Euâ€“O bond lengths. Fe is bonded to six O atoms to form FeOâ‚† octahedra that share corners with six equivalent FeOâ‚† octahedra, faces with two equivalent CaOâ‚â‚‚ cuboctahedra, and faces with two equivalent EuOâ‚â‚‚ cuboctahedra. The corner-sharing octahedral tilt angles range from 0â€“4Â°. There are five shorter (1.89 Ã…) and one longer (1.92 Ã…) Feâ€“O bond length. There are three inequivalent O sites. In the first O site, O is bonded in a distorted linear geometry to one Ca, one Eu, and two equivalent Fe atoms. In the second O site, O is bonded in a distorted linear geometry to two equivalent Eu and two equivalent Fe atoms. In the third O site, O is bonded in a distorted square co-planar geometry to two equivalent Ca and two equivalent Fe atoms.",
  },
];

const MAX_INPUT_LENGTH = 5000;
const GUEST_LIMIT = 2;

type ActivePrediction = {
  id?: string | null;
  value: number;
  unit: string;
  confidence?: number;
  materialInput: string;
  timestamp: Date;
  properties?: Record<string, { value: number | string; unit?: string; confidence?: number }>;
};

function getValue(row: HistoryItem) {
  const legacyVal = row.output.band_gap_ev;
  if (typeof legacyVal === "number") return legacyVal;
  
  const propVal = row.output.properties?.band_gap?.value;
  if (propVal !== undefined) return Number(propVal);
  
  return 0;
}

export function BandGapPredictor() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [activePrediction, setActivePrediction] = useState<ActivePrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [predictionCount, setPredictionCount] = useState(0);

  const userEmail = session?.user?.email;
  const isGuest = !userEmail && status !== "loading";
  const isGuestLimitReached = isGuest && predictionCount >= GUEST_LIMIT;

  const loadHistory = async () => {
    if (!userEmail || status === "loading") {
      setHistory([]);
      return;
    }

    setHistoryLoading(true);
    try {
      const payload = await getPredictionHistory({ limit: 5 });
      setHistory(Array.isArray(payload.history) ? payload.history : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load prediction history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, [userEmail, status]);

  useEffect(() => {
    const storedCount = window.localStorage.getItem("prediction_count");
    const parsedCount = Number(storedCount);
    setPredictionCount(Number.isFinite(parsedCount) ? Math.max(0, parsedCount) : 0);
  }, []);

  const updatePredictionCount = (nextCount: number) => {
    window.localStorage.setItem("prediction_count", String(nextCount));
    setPredictionCount(nextCount);
  };

  const handlePredict = async () => {
    const materialInput = text.trim();
    if (!materialInput) {
      toast.error("Please enter a material description.");
      return;
    }

    if (isGuestLimitReached) {
      setErrorMessage("Login to continue with unlimited predictions.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setActivePrediction(null);

    try {
      const response = await predictBandGap(materialInput);
      setActivePrediction({
        id: response.id,
        value: response.prediction,
        unit: response.unit,
        confidence: response.confidence,
        materialInput,
        timestamp: new Date(),
        properties: response.properties,
      });

      if (isGuest) {
        updatePredictionCount(Math.min(GUEST_LIMIT, predictionCount + 1));
      } else {
        await loadHistory();
      }

      toast.success("Prediction complete.");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : error && typeof error === "object" && "message" in error
        ? String((error as { message?: string }).message)
        : String(error) || "Prediction failed.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full px-4 py-6 md:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <Card className="border-border bg-card p-4 shadow-xl backdrop-blur-xl md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-foreground">
                <History className="size-4" />
                <h2 className="font-semibold tracking-wide">Recent predictions</h2>
              </div>
              {userEmail ? (
                <Button variant="ghost" size="sm" onClick={() => router.push("/history")}>
                  View all
                </Button>
              ) : null}
            </div>

            <div className="mt-4 space-y-2">
              {historyLoading ? (
                <>
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </>
              ) : history.length > 0 ? (
                history.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      setText(entry.input_text);
                      setActivePrediction({
                        id: entry.id,
                        value: getValue(entry),
                        unit: "eV",
                        confidence: entry.output.confidence,
                        materialInput: entry.input_text,
                        timestamp: new Date(entry.created_at),
                        properties: entry.output.properties,
                      });
                      setErrorMessage(null);
                    }}
                    className="group w-full rounded-lg border border-border bg-card px-3 py-3 text-left transition hover:border-yellow-500/50 hover:bg-accent"
                  >
                    <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">{entry.input_text}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</span>
                      <span className="shrink-0 text-xs font-medium tabular-nums text-foreground">
                        {getValue(entry).toFixed(4)} eV
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-card px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {userEmail ? "Saved predictions will appear here." : "Login to save prediction history."}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </aside>

        <section className="min-w-0 space-y-6">
          <Card className="border-border bg-card p-6 shadow-xl backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <Badge variant="secondary" className="w-fit gap-1.5 bg-yellow-500/10 text-yellow-500">
                  <Sparkles className="size-3.5" />
                  AI Materials Platform
                </Badge>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                    Materials property prediction
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                    Predict band gap from natural-language crystal and coordination descriptions.
                  </p>
                </div>
              </div>
              {!userEmail && status !== "loading" ? (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-100">
                  {Math.max(0, GUEST_LIMIT - predictionCount)} guest predictions remaining
                </div>
              ) : null}
            </div>
          </Card>

          <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card className="border-border bg-card p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Material input</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Include composition, space group, local coordination, and useful structural context.
                  </p>
                </div>
                <Badge variant="outline" className="gap-1">
                  <WandSparkles className="size-3.5" />
                  Band gap
                </Badge>
              </div>

              <Textarea
                value={text}
                onChange={(event) => setText(event.target.value.slice(0, MAX_INPUT_LENGTH))}
                placeholder="Example: ZnO crystallizes in the hexagonal P6_3mc space group and forms corner-sharing ZnO4 tetrahedra."
                className="mt-4 h-[340px] overflow-y-auto rounded-lg border-border bg-muted p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/50"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">{text.length} / {MAX_INPUT_LENGTH} characters</div>
                <Button
                  onClick={handlePredict}
                  disabled={loading || isGuestLimitReached}
                  className="gap-2 bg-yellow-500 font-semibold text-black hover:bg-yellow-400 sm:min-w-40"
                >
                  {loading ? <Loader2 className="size-4 animate-spin text-black" /> : <Sparkles className="size-4 text-black" />}
                  {loading ? "Predicting" : "Predict"}
                </Button>
              </div>

              {isGuestLimitReached ? (
                <div className="mt-4 rounded-lg border border-yellow-500/30 bg-slate-950/80 p-4 text-sm text-foreground">
                  <div className="font-semibold text-foreground">Free limit reached</div>
                  <p className="mt-1 text-muted-foreground">Login to continue with unlimited predictions and saved history.</p>
                  <Button className="mt-3 bg-yellow-500 text-black hover:bg-yellow-400" onClick={() => router.push("/login")}>
                    Continue
                  </Button>
                </div>
              ) : null}

              {errorMessage ? (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div>{errorMessage}</div>
                </div>
              ) : null}
            </Card>

            <Card className="border-border bg-card p-6 shadow-xl backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-foreground">Examples</h2>
              <div className="mt-4 space-y-3">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.name}
                    type="button"
                    onClick={() => {
                      setText(example.text);
                      setActivePrediction(null);
                      setErrorMessage(null);
                      toast.info(`Loaded ${example.name}`);
                    }}
                    className="w-full rounded-lg border border-border bg-card p-4 text-left transition hover:border-yellow-500/50 hover:bg-accent"
                  >
                    <div className="text-sm font-medium text-foreground">{example.name}</div>
                    <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">{example.text}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {activePrediction ? (
            <PredictionResultCard
              predictionId={activePrediction.id}
              materialInput={activePrediction.materialInput}
              timestamp={activePrediction.timestamp}
              saved={Boolean(activePrediction.id)}
              properties={
                activePrediction.properties ?? {
                  band_gap: {
                    value: activePrediction.value,
                    unit: activePrediction.unit,
                    confidence: activePrediction.confidence,
                  },
                }
              }
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}
