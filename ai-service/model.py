import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import numpy as np
import base64
from dotenv import load_dotenv

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
import cv2

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────
MODEL_DIR = os.getenv(
    "MODEL_DIR",
    "/Users/krishnapandey/Downloads/Radi_Lens_Ai/ai_models",
)
CLASS_NAMES = ["NORMAL", "PNEUMONIA"]
DEVICE = torch.device("cpu")  # CPU inference — no GPU required

# ── Preprocessing Pipeline ────────────────────────────────────────────────────
TRANSFORM = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

def build_resnet18(num_classes: int = 2) -> nn.Module:
    model = models.resnet18(weights=None)
    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, num_classes)
    return model

def build_densenet121(num_classes: int = 2) -> nn.Module:
    model = models.densenet121(weights=None)
    in_features = model.classifier.in_features
    model.classifier = nn.Linear(in_features, num_classes)
    return model

def build_vgg16(num_classes: int = 2) -> nn.Module:
    model = models.vgg16(weights=None)
    in_features = model.classifier[-1].in_features
    model.classifier[-1] = nn.Linear(in_features, num_classes)
    return model

def load_weights(model: nn.Module, model_path: str):
    if not os.path.exists(model_path):
        print(f"Warning: Model file not found at: {model_path}")
        return None
    state = torch.load(model_path, map_location=DEVICE, weights_only=True)
    if isinstance(state, dict) and "state_dict" in state:
        state = state["state_dict"]
    elif isinstance(state, dict) and "model_state_dict" in state:
        state = state["model_state_dict"]
    model.load_state_dict(state, strict=True)
    model.to(DEVICE)
    model.eval()
    print(f"[model] ✅ Loaded model from: {model_path}")
    return model

def load_all_models() -> dict:
    models_dict = {}
    
    m_resnet = load_weights(build_resnet18(), os.path.join(MODEL_DIR, "ResNet18.pth"))
    if m_resnet: models_dict["ResNet18"] = m_resnet
    
    m_dense = load_weights(build_densenet121(), os.path.join(MODEL_DIR, "DenseNet121.pth"))
    if m_dense: models_dict["DenseNet121"] = m_dense

    m_vgg = load_weights(build_vgg16(), os.path.join(MODEL_DIR, "VGG16.pth"))
    if m_vgg: models_dict["VGG16"] = m_vgg

    return models_dict

def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = TRANSFORM(image)
    return tensor.unsqueeze(0)

def is_valid_xray(clip_model, image_bytes: bytes) -> tuple[bool, str]:
    """
    Semantic Zero-Shot AI check to determine if an image is a Chest X-Ray.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    candidate_labels = [
        "a chest x-ray",
        "an x-ray of another body part such as a hand, arm, skull, leg, or pelvis",
        "a regular photograph, document, or non-medical image"
    ]
    
    res = clip_model(image, candidate_labels=candidate_labels)
    
    top_label = res[0]["label"]
    top_score = res[0]["score"]
    
    if top_label != "a chest x-ray":
        return False, f"INVALID_ANATOMY: The AI recognized this image as '{top_label}'. Only chest X-Rays are permitted."
        
    if top_score < 0.60:
        return False, f"INVALID_ANATOMY: Very low confidence ({int(top_score*100)}%) that this is a chest X-ray. Please upload a clearer frontal chest radiograph."

    return True, "Valid"

def predict(model: nn.Module, image_bytes: bytes) -> dict:
    tensor = preprocess_image(image_bytes)
    with torch.no_grad():
        logits = model(tensor)
        probabilities = torch.softmax(logits, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)
    
    predicted_class = CLASS_NAMES[predicted_idx.item()]
    
    # Calculate RALE score mapping based on P(Pneumonia)
    p_pneumonia = probabilities[0][1].item() * 100
    
    if p_pneumonia < 5:
        rale_score = 0
        severity = "Normal"
    elif p_pneumonia < 25:
        rale_score = 1
        severity = "Mild"
    elif p_pneumonia < 50:
        rale_score = 3
        severity = "Moderate"
    else:
        rale_score = 6
        severity = "Severe"
    
    return {
        "prediction": predicted_class,
        "confidence": round(confidence.item(), 4),
        "rale_score": rale_score,
        "severity": severity
    }

def generate_gradcam(model: nn.Module, image_bytes: bytes) -> dict:
    tensor = preprocess_image(image_bytes)
    
    img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_pil = img_pil.resize((224, 224))
    img_npy = np.array(img_pil, dtype=np.float32) / 255.0
    
    target_layers = [model.layer4[-1]]
    
    cam = GradCAM(model=model, target_layers=target_layers)
    
    grayscale_cam = cam(input_tensor=tensor, targets=None)
    grayscale_cam = grayscale_cam[0, :]
    
    visualization = show_cam_on_image(img_npy, grayscale_cam, use_rgb=True)
    vis_pil = Image.fromarray(visualization)
    
    buffered = io.BytesIO()
    vis_pil.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    res = predict(model, image_bytes)
    
    return {
        "heatmap_base64": f"data:image/png;base64,{img_str}",
        "prediction": res["prediction"],
        "confidence": res["confidence"],
        "rale_score": res["rale_score"],
        "severity": res["severity"]
    }
