import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Terminal } from 'lucide-react';

export function CLIDemo() {
  const cliExample = `$ python predict_bandgap.py

LLM-Prop - CLI Demo
===================

Enter crystal structure description (or 'quit' to exit):
> Si is Cubic I a=3 b=3 c=3 α=90 β=90 γ=90. Si is crystallized in a diamond structure.

Processing input...
Tokenizing text... ✓
Running T5 encoder... ✓
Computing prediction... ✓

Results:
--------
Predicted Band Gap: 1.12 eV
Confidence Score:   0.89
Processing Time:    1547 ms

Material Classification: Semiconductor
Interpretation: Small band gap suggests semiconductor properties,
                suitable for electronic applications.

Enter crystal structure description (or 'quit' to exit):
>`;

  const installExample = `# Installation
$ pip install -r requirements.txt

# Required packages:
# - transformers>=4.30.0
# - torch>=2.0.0
# - numpy>=1.24.0
# - pandas>=2.0.0
# - scikit-learn>=1.3.0

# Run prediction
$ python predict_bandgap.py --input "your crystal description"

# Batch processing from file
$ python predict_bandgap.py --batch input.txt --output predictions.csv

# Interactive mode
$ python predict_bandgap.py --interactive`;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
          <Terminal className="size-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Command Line Interface Demo</h3>
          <p className="text-sm text-muted-foreground">
            Example usage of the CLI tool for batch processing and scripting
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Badge variant="outline" className="mb-3">Installation & Usage</Badge>
          <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono whitespace-pre">
              {installExample}
            </pre>
          </div>
        </div>

        <div>
          <Badge variant="outline" className="mb-3">Interactive Session</Badge>
          <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono whitespace-pre">
              {cliExample}
            </pre>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
          <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            📦 Repository Structure
          </div>
          <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1 font-mono">
            <div>crystal-bandgap-predictor/</div>
            <div>├── data/</div>
            <div>│   ├── train.csv</div>
            <div>│   ├── val.csv</div>
            <div>│   └── test.csv</div>
            <div>├── models/</div>
            <div>│   ├── t5_encoder.py</div>
            <div>│   └── regression_head.py</div>
            <div>├── utils/</div>
            <div>│   ├── preprocessing.py</div>
            <div>│   └── evaluation.py</div>
            <div>├── train.py</div>
            <div>├── predict_bandgap.py</div>
            <div>├── requirements.txt</div>
            <div>└── README.md</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
