// Backend/seed/roadmap.seed.js
import Roadmap from "../models/roadmap.model.js";

export const seedRoadmaps = async () => {
  const count = await Roadmap.countDocuments();
  if (count > 0) {
    console.log("✅ Roadmaps already exist, skipping seed.");
    return;
  }

  const data = [
    {
      title: "Frontend Developer",
      description: "HTML, CSS, JavaScript and modern frontend frameworks to build interactive UIs.",
      category: "Frontend",
      tags: ["html","css","javascript","react"],
      steps: [
        { title: "HTML & CSS", description: "Semantics, layouts, Flexbox, Grid", resources: ["https://developer.mozilla.org/en-US/docs/Web/HTML", "https://developer.mozilla.org/en-US/docs/Web/CSS"] },
        { title: "JavaScript Basics", description: "DOM, ES6+, event handling, async", resources: ["https://javascript.info/"] },
        { title: "Build Tools & Package Managers", description: "npm, bundlers, module systems", resources: ["https://nodejs.org/en/docs/"] },
        { title: "React (or similar)", description: "Components, hooks, state management", resources: ["https://react.dev/"] },
        { title: "Routing & Data Fetching", description: "client routing, REST & GraphQL", resources: ["https://reactrouter.com/", "https://www.apollographql.com/docs/"] },
        { title: "Performance & Accessibility", description: "Lighthouse, a11y basics", resources: ["https://web.dev/"] }
      ]
    },

    {
      title: "Backend Developer (Node.js)",
      description: "Server-side development, APIs, databases and authentication.",
      category: "Backend",
      tags: ["node","express","api","mongodb"],
      steps: [
        { title: "Node.js Fundamentals", description: "Event loop, modules, streams", resources: ["https://nodejs.org/en/docs/"] },
        { title: "Express.js", description: "Routing, middleware, error handling", resources: ["https://expressjs.com/"] },
        { title: "Databases", description: "MongoDB (NoSQL) or SQL", resources: ["https://www.mongodb.com/docs/", "https://www.postgresql.org/docs/"] },
        { title: "Authentication & Authorization", description: "JWT, sessions, OAuth", resources: ["https://jwt.io/", "https://oauth.net/"] },
        { title: "Testing & Validation", description: "Unit and integration tests", resources: ["https://jestjs.io/"] },
        { title: "Deployment & Monitoring", description: "Process managers, logging", resources: ["https://pm2.keymetrics.io/"] }
      ]
    },

    {
      title: "DevOps Engineer",
      description: "Infrastructure automation, CI/CD, containerization and monitoring.",
      category: "DevOps",
      tags: ["docker","ci","aws","kubernetes"],
      steps: [
        { title: "Linux & Shell", description: "CLI tools and basic scripting", resources: ["https://linuxjourney.com/"] },
        { title: "Version Control & CI", description: "Git + CI systems (GitHub Actions, Jenkins)", resources: ["https://docs.github.com/en/actions"] },
        { title: "Containers (Docker)", description: "Images, containers, registries", resources: ["https://docs.docker.com/"] },
        { title: "Orchestration (Kubernetes)", description: "Deploy, scale, services", resources: ["https://kubernetes.io/docs/home/"] },
        { title: "Infrastructure as Code", description: "Terraform/CloudFormation", resources: ["https://www.terraform.io/docs"] },
        { title: "Monitoring & Alerts", description: "Prometheus, Grafana", resources: ["https://prometheus.io/docs/"] }
      ]
    },

    {
      title: "Data Scientist",
      description: "Statistics, data wrangling, visualization and modeling.",
      category: "Data",
      tags: ["python","pandas","ml","statistics"],
      steps: [
        { title: "Python for Data", description: "NumPy, pandas basics", resources: ["https://pandas.pydata.org/docs/"] },
        { title: "Statistics & Probability", description: "Descriptive stats, hypothesis testing", resources: ["https://stattrek.com/"] },
        { title: "Data Visualization", description: "Matplotlib, Seaborn, interactive viz", resources: ["https://matplotlib.org/"] },
        { title: "Machine Learning Basics", description: "Supervised & unsupervised learning", resources: ["https://scikit-learn.org/stable/"] },
        { title: "Model Evaluation", description: "Cross-validation, metrics", resources: ["https://scikit-learn.org/stable/modules/model_evaluation.html"] },
        { title: "Deployment & Pipelines", description: "Batch/online inference, ML pipelines", resources: ["https://www.tensorflow.org/tfx"] }
      ]
    },

    {
      title: "Machine Learning / ML Engineer",
      description: "Build, train and deploy scalable ML systems.",
      category: "AI/ML",
      tags: ["ml","deep-learning","tensorflow","pytorch"],
      steps: [
        { title: "Linear Algebra & Probability", description: "Math foundations for ML", resources: ["https://www.khanacademy.org/math/linear-algebra"] },
        { title: "Core ML Algorithms", description: "Regression, trees, clustering", resources: ["https://scikit-learn.org/stable/"] },
        { title: "Deep Learning", description: "Neural networks, CNNs, RNNs", resources: ["https://www.deeplearning.ai/"] },
        { title: "Frameworks", description: "TensorFlow or PyTorch", resources: ["https://pytorch.org/","https://www.tensorflow.org/"] },
        { title: "MLOps & Deployment", description: "Serving models and monitoring", resources: ["https://www.mlflow.org/"] }
      ]
    },

    {
      title: "AI Engineer (Narrow & LLMs)",
      description: "Large language models, embeddings, prompt engineering & vector search.",
      category: "AI/LLM",
      tags: ["llm","nlp","prompt","vector-db"],
      steps: [
        { title: "NLP Basics", description: "Tokenization, embeddings, language tasks", resources: ["https://nlp.stanford.edu/"] },
        { title: "Transformer Architectures", description: "Self-attention and transformers", resources: ["https://arxiv.org/abs/1706.03762"] },
        { title: "Working with LLMs", description: "APIs, fine-tuning, safety", resources: ["https://platform.openai.com/docs/"] },
        { title: "Vector Databases", description: "Faiss, Milvus, Pinecone basics", resources: ["https://www.pinecone.io/"] },
        { title: "Productionization", description: "Latency, cost, retrievers", resources: ["https://mlflow.org/"] }
      ]
    },

    {
      title: "Android Developer",
      description: "Build native Android apps with Kotlin and Android SDK.",
      category: "Mobile",
      tags: ["android","kotlin","mobile"],
      steps: [
        { title: "Kotlin Language", description: "Syntax, coroutines", resources: ["https://kotlinlang.org/docs/home.html"] },
        { title: "Android Fundamentals", description: "Activities, fragments, layouts", resources: ["https://developer.android.com/docs"] },
        { title: "Jetpack Compose", description: "Modern UI toolkit", resources: ["https://developer.android.com/jetpack/compose"] },
        { title: "Networking & Persistence", description: "Retrofit, Room", resources: ["https://square.github.io/retrofit/"] },
        { title: "Testing & Publishing", description: "Unit/Instrumented tests, Play Store", resources: ["https://developer.android.com/studio/test"] }
      ]
    },

    {
      title: "iOS Developer",
      description: "Build native iOS apps using Swift and SwiftUI.",
      category: "Mobile",
      tags: ["ios","swift","mobile"],
      steps: [
        { title: "Swift Language", description: "Syntax, optionals, concurrency", resources: ["https://swift.org/documentation/"] },
        { title: "SwiftUI Basics", description: "Views, state, layout", resources: ["https://developer.apple.com/documentation/swiftui"] },
        { title: "UIKit & Interop", description: "Legacy UI and bridging", resources: ["https://developer.apple.com/documentation/uikit"] },
        { title: "Networking & Storage", description: "URLSession, CoreData", resources: ["https://developer.apple.com/documentation/foundation/urlsession"] },
        { title: "Testing & App Store", description: "Unit/UI tests, publishing", resources: ["https://developer.apple.com/app-store/"] }
      ]
    },

    {
      title: "Cybersecurity Engineer",
      description: "Security fundamentals, network security, pentesting and secure design.",
      category: "Security",
      tags: ["security","pentest","network"],
      steps: [
        { title: "Security Fundamentals", description: "CIA triad, threat modelling", resources: ["https://owasp.org/"] },
        { title: "Networking & Protocols", description: "TCP/IP, TLS, HTTP security", resources: ["https://www.cloudflare.com/learning/"] },
        { title: "Application Security", description: "OWASP Top 10, secure coding", resources: ["https://owasp.org/www-project-top-ten/"] },
        { title: "Pentesting Basics", description: "Recon, exploitation tools", resources: ["https://www.offensive-security.com/"] },
        { title: "Defensive Ops", description: "SIEM, monitoring, incident response", resources: ["https://www.elastic.co/observability"] }
      ]
    },

    {
      title: "Blockchain Developer",
      description: "Smart contracts, DApps, and decentralized systems.",
      category: "Blockchain",
      tags: ["blockchain","solidity","smart-contracts"],
      steps: [
        { title: "Blockchain Basics", description: "Consensus, ledgers, tokens", resources: ["https://ethereum.org/en/developers/docs/"] },
        { title: "Smart Contracts (Solidity)", description: "Writing and testing contracts", resources: ["https://docs.soliditylang.org/"] },
        { title: "Web3 Integration", description: "Web3.js, Ethers.js wallets", resources: ["https://docs.ethers.org/"] },
        { title: "Security & Audits", description: "Reentrancy, overflow issues", resources: ["https://consensys.github.io/smart-contract-best-practices/"] }
      ]
    },

    {
      title: "Game Developer",
      description: "Game design, engines, and real-time graphics.",
      category: "GameDev",
      tags: ["game","unity","unreal"],
      steps: [
        { title: "Game Design Basics", description: "Mechanics, prototyping", resources: ["https://gamecareerguide.com/"] },
        { title: "Game Engines", description: "Unity or Unreal Engine", resources: ["https://unity.com/","https://www.unrealengine.com/"] },
        { title: "Graphics & Physics", description: "Shaders, collision systems", resources: ["https://learnopengl.com/"] },
        { title: "Multiplayer Basics", description: "Networking in games", resources: ["https://mirror-networking.com/"] }
      ]
    },

    {
      title: "Cloud Engineer",
      description: "Design and operate cloud-native systems on AWS/GCP/Azure.",
      category: "Cloud",
      tags: ["aws","gcp","azure","cloud"],
      steps: [
        { title: "Cloud Fundamentals", description: "Compute, storage, networking", resources: ["https://aws.amazon.com/what-is-cloud-computing/"] },
        { title: "IAM & Security", description: "Access management and policies", resources: ["https://docs.aws.amazon.com/iam/"] },
        { title: "Serverless & Containers", description: "Lambda, FaaS, ECS/EKS", resources: ["https://aws.amazon.com/lambda/"] },
        { title: "Observability", description: "Logging, tracing, metrics", resources: ["https://opentelemetry.io/"] }
      ]
    }
  ];

  // Ensure required fields added for new schema
  const seededCreatorId = "seed";
  const prepared = data.map((r) => ({
    ...r,
    createdBy: seededCreatorId,
    isActive: true,
  }));

  await Roadmap.insertMany(prepared);
  console.log("✅ Roadmaps seeded successfully.");
};
