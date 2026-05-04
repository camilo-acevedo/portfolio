export type StackCategory =
  | 'lang'
  | 'ml'
  | 'llm'
  | 'mlops'
  | 'cloud'
  | 'data'
  | 'viz';

export interface Tool {
  id: string;
  label: string;
  category: StackCategory;
  years: number;
  level: number;
  note: string;
  learning?: boolean;
}

export interface PositionedTool extends Tool {
  x: number;
  y: number;
}

export const TOOLS: Tool[] = [
  // lang
  { id: 'python', label: 'Python', category: 'lang', years: 5, level: 1, note: 'Primary language for everything — models, APIs, scripts.' },
  { id: 'sql', label: 'SQL', category: 'lang', years: 5, level: 0.95, note: 'Advanced — window funcs, CTEs, query optimization.' },
  { id: 'r', label: 'R', category: 'lang', years: 2, level: 0.55, note: 'Used for statistical modeling and legacy analytics.' },
  { id: 'scala', label: 'Scala', category: 'lang', years: 1, level: 0.45, note: 'Occasional for Spark jobs when Python isn\'t enough.' },
  { id: 'bash', label: 'Bash', category: 'lang', years: 4, level: 0.7, note: 'Shell scripting for glue, cron, and CI jobs.' },

  // ml
  { id: 'pytorch', label: 'PyTorch', category: 'ml', years: 3, level: 0.9, note: 'Default for deep learning — CNNs, RNNs, Transformers, GANs.' },
  { id: 'tensorflow', label: 'TensorFlow', category: 'ml', years: 3, level: 0.85, note: 'Used for production models and legacy codebases.' },
  { id: 'sklearn', label: 'scikit-learn', category: 'ml', years: 4, level: 1, note: 'Classical ML workhorse — every project starts here.' },
  { id: 'xgboost', label: 'XGBoost', category: 'ml', years: 3, level: 0.9, note: 'Go-to for tabular classification and regression.' },
  { id: 'lightgbm', label: 'LightGBM', category: 'ml', years: 2, level: 0.75, note: 'Faster alternative to XGBoost on large datasets.' },
  { id: 'optuna', label: 'Optuna', category: 'ml', years: 2, level: 0.75, note: 'Bayesian hyperparameter tuning for models.' },
  { id: 'opencv', label: 'OpenCV', category: 'ml', years: 2, level: 0.6, note: 'Image preprocessing and computer vision pipelines.' },

  // llm
  { id: 'huggingface', label: 'Hugging Face', category: 'llm', years: 2, level: 0.8, note: 'BERT, RoBERTa, sentence transformers and hosted models.' },
  { id: 'langchain', label: 'LangChain', category: 'llm', years: 1, level: 0.65, note: 'Agents, tools and retrieval chains for LLM apps.', learning: true },
  { id: 'openai', label: 'OpenAI API', category: 'llm', years: 1, level: 0.7, note: 'GPT-4 / 4o integration for enterprise workflows.' },
  { id: 'pinecone', label: 'Pinecone', category: 'llm', years: 1, level: 0.55, note: 'Managed vector DB for production RAG.', learning: true },
  { id: 'faiss', label: 'FAISS', category: 'llm', years: 1, level: 0.6, note: 'Local similarity search at scale.', learning: true },

  // mlops
  { id: 'mlflow', label: 'MLflow', category: 'mlops', years: 2, level: 0.9, note: 'Experiment tracking, model registry, deployment.' },
  { id: 'docker', label: 'Docker', category: 'mlops', years: 3, level: 0.85, note: 'Containerize everything that ships to production.' },
  { id: 'k8s', label: 'Kubernetes', category: 'mlops', years: 2, level: 0.65, note: 'Orchestration for scaled model-serving workloads.' },
  { id: 'azuredevops', label: 'Azure DevOps', category: 'mlops', years: 2, level: 0.8, note: 'CI/CD pipelines for ML model deployment.' },
  { id: 'ghactions', label: 'GitHub Actions', category: 'mlops', years: 3, level: 0.8, note: 'CI/CD when the project lives on GitHub.' },
  { id: 'wandb', label: 'Weights & Biases', category: 'mlops', years: 1, level: 0.65, note: 'Experiment tracking with richer dashboards than MLflow.' },
  { id: 'dvc', label: 'DVC', category: 'mlops', years: 1, level: 0.6, note: 'Data & model version control alongside Git.' },
  { id: 'kubeflow', label: 'Kubeflow', category: 'mlops', years: 1, level: 0.5, note: 'ML pipelines on Kubernetes for larger orgs.' },
  { id: 'evidently', label: 'Evidently', category: 'mlops', years: 1, level: 0.55, note: 'Drift and performance monitoring in production.', learning: true },

  // cloud
  { id: 'azure', label: 'Azure', category: 'cloud', years: 3, level: 0.9, note: 'Primary cloud — Azure ML, Data Factory, Synapse.' },
  { id: 'aws', label: 'AWS', category: 'cloud', years: 2, level: 0.65, note: 'SageMaker, S3, EC2 for client projects.' },
  { id: 'gcp', label: 'GCP', category: 'cloud', years: 1, level: 0.45, note: 'BigQuery and Vertex AI when the client uses Google.' },
  { id: 'databricks', label: 'Databricks', category: 'cloud', years: 2, level: 0.8, note: 'Unified analytics — notebooks, jobs, Delta Lake.' },
  { id: 'sagemaker', label: 'SageMaker', category: 'cloud', years: 1, level: 0.55, note: 'Managed ML on AWS for training and serving.' },
  { id: 'snowflake', label: 'Snowflake', category: 'cloud', years: 1, level: 0.6, note: 'Cloud warehouse when the client runs on Snowflake.' },
  { id: 'bigquery', label: 'BigQuery', category: 'cloud', years: 1, level: 0.55, note: 'Serverless analytics on GCP.' },

  // data
  { id: 'spark', label: 'Apache Spark', category: 'data', years: 2, level: 0.85, note: 'Distributed processing of 10M+ daily records.' },
  { id: 'airflow', label: 'Airflow', category: 'data', years: 2, level: 0.85, note: 'DAGs for ETL and ML training pipelines.' },
  { id: 'kafka', label: 'Kafka', category: 'data', years: 1, level: 0.55, note: 'Streaming ingestion for real-time ML.' },
  { id: 'postgres', label: 'PostgreSQL', category: 'data', years: 4, level: 0.85, note: 'Relational workhorse for features and metadata.' },
  { id: 'mongo', label: 'MongoDB', category: 'data', years: 3, level: 0.7, note: 'Document store for flexible schemas.' },
  { id: 'delta', label: 'Delta Lake', category: 'data', years: 1, level: 0.6, note: 'ACID transactions on data lakes.' },
  { id: 'pandas', label: 'Pandas', category: 'data', years: 5, level: 0.95, note: 'Day-one tool for exploration and feature work.' },
  { id: 'dbt', label: 'dbt', category: 'data', years: 1, level: 0.6, note: 'Transformations + tests + lineage — governance backbone.', learning: true },
  { id: 'ge', label: 'Great Expectations', category: 'data', years: 1, level: 0.55, note: 'Data quality checks and contracts.', learning: true },

  // viz
  { id: 'fastapi', label: 'FastAPI', category: 'viz', years: 3, level: 0.9, note: 'Async REST APIs for model serving — 50K+ req/day.' },
  { id: 'powerbi', label: 'Power BI', category: 'viz', years: 3, level: 0.85, note: 'Dashboards wired to predictive models.' },
  { id: 'tableau', label: 'Tableau', category: 'viz', years: 3, level: 0.75, note: 'Interactive analytics for business stakeholders.' },
  { id: 'streamlit', label: 'Streamlit', category: 'viz', years: 2, level: 0.75, note: 'Rapid demos and internal tools for ML models.' },
  { id: 'plotly', label: 'Plotly', category: 'viz', years: 3, level: 0.7, note: 'Interactive charts for reports and notebooks.' },
];

export const EDGES: Array<[string, string]> = [
  // Python hub
  ['python', 'pytorch'],
  ['python', 'tensorflow'],
  ['python', 'sklearn'],
  ['python', 'xgboost'],
  ['python', 'lightgbm'],
  ['python', 'optuna'],
  ['python', 'opencv'],
  ['python', 'huggingface'],
  ['python', 'langchain'],
  ['python', 'openai'],
  ['python', 'mlflow'],
  ['python', 'airflow'],
  ['python', 'spark'],
  ['python', 'fastapi'],
  ['python', 'streamlit'],
  ['python', 'pandas'],
  ['python', 'plotly'],

  // ML family
  ['sklearn', 'xgboost'],
  ['sklearn', 'lightgbm'],
  ['xgboost', 'lightgbm'],
  ['sklearn', 'optuna'],
  ['pytorch', 'optuna'],
  ['pytorch', 'mlflow'],
  ['tensorflow', 'mlflow'],
  ['sklearn', 'mlflow'],
  ['pandas', 'sklearn'],
  ['pandas', 'xgboost'],

  // LLM
  ['pytorch', 'huggingface'],
  ['tensorflow', 'huggingface'],
  ['huggingface', 'langchain'],
  ['langchain', 'openai'],
  ['langchain', 'pinecone'],
  ['langchain', 'faiss'],
  ['pinecone', 'faiss'],

  // MLOps
  ['mlflow', 'docker'],
  ['mlflow', 'azuredevops'],
  ['mlflow', 'ghactions'],
  ['mlflow', 'wandb'],
  ['mlflow', 'dvc'],
  ['mlflow', 'evidently'],
  ['docker', 'k8s'],
  ['k8s', 'kubeflow'],
  ['kubeflow', 'mlflow'],
  ['docker', 'azure'],
  ['docker', 'aws'],
  ['docker', 'ghactions'],
  ['azuredevops', 'azure'],
  ['ghactions', 'bash'],
  ['wandb', 'pytorch'],
  ['wandb', 'tensorflow'],
  ['dvc', 'docker'],

  // Cloud
  ['azure', 'databricks'],
  ['aws', 'sagemaker'],
  ['azure', 'azuredevops'],
  ['databricks', 'spark'],
  ['databricks', 'delta'],
  ['sagemaker', 'pytorch'],
  ['snowflake', 'sql'],
  ['snowflake', 'dbt'],
  ['bigquery', 'sql'],
  ['bigquery', 'dbt'],
  ['bigquery', 'gcp'],

  // Data
  ['airflow', 'spark'],
  ['airflow', 'postgres'],
  ['airflow', 'mongo'],
  ['airflow', 'dbt'],
  ['airflow', 'ge'],
  ['kafka', 'spark'],
  ['spark', 'delta'],
  ['postgres', 'fastapi'],
  ['mongo', 'fastapi'],
  ['dbt', 'ge'],
  ['pandas', 'airflow'],
  ['pandas', 'plotly'],

  // SQL hub
  ['sql', 'postgres'],
  ['sql', 'mongo'],
  ['sql', 'powerbi'],
  ['sql', 'tableau'],
  ['sql', 'databricks'],

  // Scala / R
  ['scala', 'spark'],
  ['r', 'python'],
  ['r', 'plotly'],

  // Viz
  ['streamlit', 'fastapi'],
  ['streamlit', 'plotly'],
];

const CENTERS: Record<
  StackCategory,
  { x: number; y: number; radius: number; startAngle: number }
> = {
  lang: { x: 50, y: 50, radius: 11, startAngle: -Math.PI / 2 },
  ml: { x: 20, y: 26, radius: 15, startAngle: Math.PI / 4 },
  llm: { x: 50, y: 14, radius: 13, startAngle: -Math.PI / 2 },
  cloud: { x: 80, y: 26, radius: 14, startAngle: -Math.PI / 4 },
  mlops: { x: 80, y: 74, radius: 14, startAngle: Math.PI / 4 },
  data: { x: 20, y: 74, radius: 15, startAngle: -Math.PI / 4 },
  viz: { x: 50, y: 88, radius: 11, startAngle: 0 },
};

export function layoutTools(tools: Tool[]): PositionedTool[] {
  const byCat: Record<string, Tool[]> = {};
  tools.forEach((t) => {
    if (!byCat[t.category]) byCat[t.category] = [];
    byCat[t.category].push(t);
  });
  const ordered: Record<string, Tool[]> = {};
  Object.entries(byCat).forEach(([cat, list]) => {
    ordered[cat] = [...list].sort((a, b) => b.level - a.level);
  });

  return tools.map((t) => {
    const group = ordered[t.category];
    const idx = group.indexOf(t);
    const total = group.length;
    const c = CENTERS[t.category];
    const angle = c.startAngle + (idx / total) * Math.PI * 2;
    const radial = c.radius * (0.7 + (1 - t.level) * 0.3);
    return {
      ...t,
      x: c.x + Math.cos(angle) * radial,
      y: c.y + Math.sin(angle) * radial,
    };
  });
}

export function buildAdjacency(edges: Array<[string, string]>): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  edges.forEach(([a, b]) => {
    if (!map.has(a)) map.set(a, new Set());
    if (!map.has(b)) map.set(b, new Set());
    map.get(a)!.add(b);
    map.get(b)!.add(a);
  });
  return map;
}
