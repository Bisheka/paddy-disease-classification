import { useState } from 'react'
import './App.css'
import ImageUploader from './components/ImageUploader'
import ResultCard from './components/ResultCard'

const API = "http://localhost:8000"

const DISEASE_INFO = {
  bacterial_leaf_blight: {
    label: "Bacterial Leaf Blight",
    desc: "A bacterial disease that causes wilting and yellowing of leaves. Treatment includes using resistant varieties and applying copper-based fungicides if necessary.",
    color: "#d9534f"
  },
  blast: {
    label: "Rice Blast",
    desc: "A fungal disease causing diamond-shaped lesions on leaves. Managed by avoiding excessive nitrogen, using fungicides, and maintaining proper water levels.",
    color: "#f0ad4e"
  },
  brown_spot: {
    label: "Brown Spot",
    desc: "A fungal infection typically occurring in nutrient-poor soils. Can be mitigated with proper fertilization, especially nitrogen, and seed treatments.",
    color: "#8a6d3b"
  },
  normal: {
    label: "Healthy Crop",
    desc: "No disease detected. The paddy leaf appears to be in good condition. Continue maintaining standard agronomic practices.",
    color: "#5cb85c"
  }
}

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isInvalidImage, setIsInvalidImage] = useState(false)

  const handleImageUpload = async (selectedFile) => {
    if (!selectedFile) return
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
    setError(null)
    setIsInvalidImage(false)
    setLoading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch(`${API}/predict`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        // 422 = not a leaf, 400 = wrong file type
        setIsInvalidImage(true)
        setError(data.detail || "Invalid image uploaded.")
      } else {
        setResult(data)
      }

    } catch (err) {
      setIsInvalidImage(false)
      setError("Could not connect to the prediction API. Please ensure the backend is running.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setIsInvalidImage(false)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌾 Paddy Disease Detection</h1>
        <p>Upload a photo of a paddy leaf to diagnose potential diseases instantly.</p>
      </header>

      <main className="app-main">
        <ImageUploader preview={preview} onImage={handleImageUpload} />

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Analyzing leaf image...</p>
          </div>
        )}

        {/* Not a leaf error */}
        {error && isInvalidImage && (
          <div style={{
            marginTop: "1.5rem",
            padding: "1.2rem 1.5rem",
            borderRadius: 12,
            border: "2px solid #e74c3c",
            background: "#fdf0f0",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>❌</div>
            <h3 style={{ color: "#e74c3c", margin: "0 0 0.5rem" }}>
              Not a Paddy Leaf
            </h3>
            <p style={{ color: "#555", margin: 0, fontSize: 14 }}>
              {error}
            </p>
          </div>
        )}

        {/* Connection / server error */}
        {error && !isInvalidImage && (
          <div className="error-container">
            <p>{error}</p>
          </div>
        )}

        {/* Low confidence warning */}
        {result && result.warning && (
          <div style={{
            marginTop: "1rem",
            padding: "0.8rem 1rem",
            borderRadius: 8,
            background: "#fff8e1",
            border: "1px solid #f9a825",
            fontSize: 13,
            color: "#7a6000"
          }}>
            ⚠️ {result.warning}
          </div>
        )}

        {result && (
          <ResultCard
            result={result}
            info={DISEASE_INFO[result.disease] || { label: "Unknown", desc: "Unrecognized result", color: "#666" }}
          />
        )}

        {(result || error) && (
          <button className="reset-button" onClick={resetForm}>
            Analyze Another Image
          </button>
        )}
      </main>
    </div>
  )
}

export default App