import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react';

export function ProcessFlow() {
  const steps = [
    {
      number: 1,
      title: "Input",
      description: "Natural language crystal structure description",
      color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
    },
    {
      number: 2,
      title: "Tokenization",
      description: "SentencePiece tokenizer converts text to token IDs",
      color: "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
    },
    {
      number: 3,
      title: "T5 Encoder",
      description: "Pretrained transformer processes tokens into embeddings",
      color: "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300"
    },
    {
      number: 4,
      title: "Regression Head",
      description: "MLP layers predict continuous band gap value",
      color: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300"
    },
    {
      number: 5,
      title: "Output",
      description: "Band gap prediction in electron volts (eV)",
      color: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-6">Prediction Pipeline</h3>
      <div className="flex flex-col md:flex-row items-center gap-4 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center gap-4 w-full md:w-auto flex-shrink-0">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-start gap-3">
                <div className={`size-10 rounded-full ${step.color} flex items-center justify-center font-bold shrink-0`}>
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="size-5 text-muted-foreground shrink-0 hidden md:block" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}