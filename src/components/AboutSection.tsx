import { BrainCircuit, Database, Github, Linkedin, Mail, Server, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const technologies = [
  'PyTorch',
  'Hugging Face Transformers',
  'DistilRoBERTa Transfer Learning',
  'React + TailwindCSS',
  'Next.js',
  'FastAPI',
  'Supabase',
];

const learningGoals = [
  'Transformer architectures (DistilRoBERTa)',
  'Natural language preprocessing for materials',
  'Transfer learning workflows',
  'Model evaluation & fine-tuning',
  'Full-stack AI inference systems',
];

const contributors = [
  {
    name: 'Zahid Hussain',
    role: 'Frontend & Backend Dev, Database & OAuth Integration',
    linkedin: 'https://www.linkedin.com/in/zahid-hussain-b65b64390/',
    github: 'https://github.com/ZahidHussain-1007',
    email: 'zahidhussain9246@gmail.com',
  },
  {
    name: 'Lokesh',
    role: 'Research & Project Architecture Design with Model Development',
    linkedin: '#',
    github: '#',
    email: '#',
  },
  {
    name: 'Saqib',
    role: 'Model Development and FastAPI Integration',
    linkedin: '#',
    github: 'https://github.com/saqib-svg',
    email: '#',
  },
  {
    name: 'Abdul Bari',
    role: 'Model Development',
    linkedin: '#',
    github: '#',
    email: '#',
  },
  {
    name: 'Ashfaq',
    role: 'Model Development',
    linkedin: '#',
    github: '#',
    email: '#',
  }
];

const resultItems = ['Predicted Band Gap (eV)', 'Confidence score percentage', 'Material property context'];

export function AboutSection() {
  return (
    <main className="container mx-auto px-4 py-10 md:py-14">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            <BrainCircuit className="h-4 w-4 text-yellow-500" />
            AI Materials Platform
          </div>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
              LLM-Prop: Band Gap Prediction
            </h1>
            <p className="text-base leading-7 text-muted-foreground md:text-lg">
              A comprehensive deep learning project built to explore material property prediction from 
              natural language text, using modern Transformers and full-stack AI deployment.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Dataset
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              Trained on the TextEdge dataset with crystal descriptions from Robocrystallographer 
              and DFT-calculated band gaps from the Materials Project.
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Server className="h-5 w-5 text-yellow-500" />
                Model Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              Utilizes a <strong>DistilRoBERTa</strong> encoder fine-tuned with a regression head, 
              offering robust natural language understanding for scientific text.
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Database className="h-5 w-5 text-yellow-500" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              By utilizing domain-specific fine-tuning, the deployed model achieves an impressive 
              <strong> 0.3411 eV MAE</strong> on unseen validation material data.
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-7">
                The LLM-Prop platform is a deep learning application designed to accurately predict 
                the band gap of crystalline materials directly from their natural language descriptions. 
                This project was developed as a hands-on learning experience to understand the end-to-end pipeline of modern AI—from data preprocessing and Transformer training, 
                to integrating a trained PyTorch model into a Python FastAPI inference server, and finally 
                connecting it to a React frontend.
              </p>
              <p className="leading-7">
                Using our optimized model, researchers and students can bypass expensive DFT calculations 
                and receive immediate property estimates just by describing the crystal structure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                The core of this project utilizes <strong>DistilRoBERTa</strong>, a distilled version of the 
                RoBERTa language model. Instead of training from scratch, we applied 
                <em> Transfer Learning</em> to leverage its existing ability to understand complex textual patterns, 
                fine-tuning the regression head specifically for our materials dataset.
              </p>
              <div className="flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">The AI Pipeline Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p>
                When a description is entered through the React frontend, it is securely transmitted to our 
                FastAPI worker. The backend preprocesses and tokenizes the text for DistilRoBERTa. 
                The Transformer then analyzes the structural and compositional features 
                to calculate the predicted band gap via its multi-layer perceptron regression head.
              </p>
              <div>
                <p className="mb-2 text-foreground">The API returns:</p>
                <ul className="list-inside list-disc space-y-1">
                  {resultItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="font-medium text-foreground mb-1">Architecture Overview</p>
                <p className="text-xs">
                  React (Next.js) → FastAPI Inference Worker → DistilRoBERTa (PyTorch) → Supabase (History)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Learning Focus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p>
                This project served as a deep dive into practical, production-level Machine Learning engineering 
                rather than just running isolated Jupyter notebooks.
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {learningGoals.map((goal) => (
                  <li key={goal} className="rounded-md border border-border px-3 py-2 text-foreground">
                    {goal}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Contributors</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A dedicated student developer team contributed across the frontend, backend APIs, model architecture, 
              database configuration, and overall system design.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {contributors.map((contributor) => (
              <Card key={contributor.name} className="h-full border-border bg-card">
                <CardContent className="flex h-full flex-col gap-5 p-5">
                  <div className="space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-500 text-lg font-semibold text-black">
                      {contributor.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{contributor.name}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {contributor.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button asChild variant="outline" size="icon" aria-label={`${contributor.name} GitHub`}>
                      <a href={contributor.github} target="_blank" rel="noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" aria-label={`${contributor.name} LinkedIn`}>
                      <a href={contributor.linkedin} target="_blank" rel="noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" aria-label={`Email ${contributor.name}`}>
                      <a href={`mailto:${contributor.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}