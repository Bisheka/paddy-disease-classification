export default function ImageUploader({ preview, onImage }) {
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) onImage(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById("file-input").click()}
      style={{
        border: "2px dashed #a0c878",
        borderRadius: 12,
        padding: "1.5rem",
        textAlign: "center",
        cursor: "pointer",
        background: preview ? "#f9f9f9" : "#f6fbf4",
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.2s"
      }}
    >
      {preview ? (
        <img
          src={preview}
          alt="preview"
          style={{ maxHeight: 260, maxWidth: "100%", borderRadius: 8 }}
        />
      ) : (
        <div>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌿</div>
          <p style={{ color: "#666", margin: 0, fontSize: 15 }}>
            Click or drag & drop a paddy leaf image
          </p>
          <p style={{ color: "#aaa", margin: "4px 0 0", fontSize: 13 }}>
            Supports JPG, PNG, WEBP
          </p>
        </div>
      )}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onImage(e.target.files[0])}
      />
    </div>
  )
}