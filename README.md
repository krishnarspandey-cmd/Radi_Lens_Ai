# RadiLens AI — Pneumonia Detection System

A full-stack AI platform for automated pneumonia detection from chest X-ray images.

## Architecture

```
User (Browser :5173)
  → React Frontend (Vite)
  → Spring Boot API Gateway (:8080)
  → FastAPI AI Service (:8000)
  → PyTorch ResNet18 Model
```

## Quick Start

Open **3 terminal windows** and run one command per window:

### Terminal 1 — AI Service (FastAPI)
```bash
cd ai-service
bash run.sh
# Server starts at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Terminal 2 — Backend (Spring Boot)
```bash
cd backend
bash run.sh
# Server starts at http://localhost:8080
```

### Terminal 3 — Frontend (React)
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

## Project Structure

```
Radi_Lens_Ai/
├── ai_models/
│   ├── ResNet18.pth      ← primary deployment model
│   ├── DenseNet121.pth
│   └── VGG16.pth
├── ai-service/           ← Python FastAPI + PyTorch
│   ├── main.py
│   ├── model.py
│   ├── requirements.txt
│   └── run.sh
├── backend/              ← Java Spring Boot gateway
│   ├── src/
│   └── run.sh
└── frontend/             ← React + Vite UI
    └── src/
```

## API Reference

### AI Service (port 8000)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/predict` | Predict from image file |

### Backend (port 8080)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/analyze` | Upload image for analysis |

## Tech Stack
- **Frontend**: React 19, Vite, Axios, Vanilla CSS
- **Backend**: Spring Boot 3.5, Java 25, RestTemplate
- **AI Service**: FastAPI, PyTorch 2.5, Torchvision, Pillow
- **Model**: ResNet18 (binary classifier: NORMAL / PNEUMONIA)

## Disclaimer
For research and educational purposes only. Not for clinical use. Always consult a licensed radiologist.
