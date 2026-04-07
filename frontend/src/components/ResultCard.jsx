const SEVERITY_COLOR = { High: "#e74c3c", Moderate: "#e67e22", None: "#27ae60", Unknown: "#888" }

export default function ResultCard({ result, info, error }) {

  if (error) {
    return (
      <div style={{
        marginTop: "1.5rem", padding: "1.5rem", borderRadius: 12,
        border: "2px solid #e74c3c", background: "#fdf0f0", textAlign: "center"
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>❌</div>
        <h3 style={{ color: "#e74c3c", margin: "0 0 0.5rem" }}>Not a Plant Image</h3>
        <p style={{ color: "#555", margin: 0, fontSize: 14 }}>{error}</p>
      </div>
    )
  }

  if (!info || !result) return null

  const isHealthy      = result.disease === "normal"
  const isUncertain    = result.image_status === "uncertain"
  const severityColor  = SEVERITY_COLOR[result.severity] || "#888"

  return (
    <div style={{ marginTop: "1.5rem" }}>

      {/* ── Disease header ── */}
      <div style={{
        padding: "1.4rem", borderRadius: 12,
        border: `2px solid ${info.color}`,
        background: info.color + "12", marginBottom: "1rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ color: info.color, margin: 0, fontSize: "1.3rem" }}>
              {isHealthy ? "✅" : "⚠️"} {result.display_name || info.label}
            </h2>
            <p style={{ color: "#777", fontSize: 13, marginTop: 4, marginBottom: 0 }}>
              Pathogen: {result.pathogen || "—"}
            </p>
          </div>
          {!isHealthy && result.severity && result.severity !== "None" && (
            <span style={{
              background: severityColor + "22", color: severityColor,
              border: `1px solid ${severityColor}`, borderRadius: 20,
              padding: "3px 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
            }}>
              {result.severity} severity
            </span>
          )}
        </div>

        {/* Confidence bar */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: "#555" }}>Disease confidence</span>
            <strong style={{ color: info.color }}>{parseFloat(result.confidence).toFixed(2)}%</strong>
          </div>
          <div style={{ background: "#e0e0e0", borderRadius: 6, height: 10 }}>
            <div style={{
              width: `${result.confidence}%`, background: info.color,
              height: "100%", borderRadius: 6, transition: "width 0.8s ease"
            }} />
          </div>
        </div>

        {/* Paddy confidence */}
        {result.paddy_confidence && (
          <div style={{ marginTop: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: "#777" }}>Paddy leaf confidence</span>
              <span style={{ color: "#27ae60", fontWeight: 500 }}>{result.paddy_confidence}%</span>
            </div>
            <div style={{ background: "#e0e0e0", borderRadius: 6, height: 6 }}>
              <div style={{
                width: `${result.paddy_confidence}%`, background: "#27ae60",
                height: "100%", borderRadius: 6, transition: "width 0.8s ease"
              }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Uncertain image warning ── */}
      {isUncertain && result.warning && (
        <div style={{
          background: "#fff3e0", border: "2px solid #ff9800", borderRadius: 10,
          padding: "0.9rem 1rem", marginBottom: "1rem", fontSize: 13, color: "#7a4f00"
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>⚠️ Image Quality Warning</div>
          {result.warning}
        </div>
      )}

      {/* ── Low confidence warning ── */}
      {!isUncertain && result.warning && (
        <div style={{
          background: "#fff8e1", border: "1px solid #f9a825", borderRadius: 10,
          padding: "0.8rem 1rem", marginBottom: "1rem", fontSize: 13, color: "#7a6000"
        }}>
          ⚠️ {result.warning}
        </div>
      )}

      {/* ── Symptoms ── */}
      {result.symptoms && result.symptoms.length > 0 && !isHealthy && (
        <div style={{
          background: "#fef9f0", border: "1px solid #f0d9b0",
          borderRadius: 12, padding: "1rem 1.2rem", marginBottom: "1rem"
        }}>
          <h4 style={{ color: "#b06000", marginBottom: 8, marginTop: 0, fontSize: 14 }}>
            🔍 Symptoms
          </h4>
          {result.symptoms.map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: "#555", padding: "3px 0", display: "flex", gap: 8 }}>
              <span style={{ color: "#e67e22", flexShrink: 0 }}>•</span>{s}
            </div>
          ))}
        </div>
      )}

      {/* ── Treatment ── */}
      {result.treatment && result.treatment.length > 0 && (
        <div style={{
          background: isHealthy ? "#f0fbf0" : "#fff0f0",
          border: `1px solid ${isHealthy ? "#a8d8a8" : "#f5c0c0"}`,
          borderRadius: 12, padding: "1rem 1.2rem", marginBottom: "1rem"
        }}>
          <h4 style={{ color: isHealthy ? "#27ae60" : "#c0392b", marginBottom: 8, marginTop: 0, fontSize: 14 }}>
            {isHealthy ? "✅ Recommendations" : "💊 Treatment"}
          </h4>
          {result.treatment.map((t, i) => (
            <div key={i} style={{ fontSize: 13, color: "#555", padding: "3px 0", display: "flex", gap: 8 }}>
              <span style={{ color: isHealthy ? "#27ae60" : "#e74c3c", flexShrink: 0 }}>•</span>{t}
            </div>
          ))}
        </div>
      )}

      {/* ── Prevention ── */}
      {result.prevention && result.prevention.length > 0 && (
        <div style={{
          background: "#f0fbf0", border: "1px solid #a8d8a8",
          borderRadius: 12, padding: "1rem 1.2rem", marginBottom: "1rem"
        }}>
          <h4 style={{ color: "#27ae60", marginBottom: 8, marginTop: 0, fontSize: 14 }}>
            🛡️ Prevention
          </h4>
          {result.prevention.map((p, i) => (
            <div key={i} style={{ fontSize: 13, color: "#555", padding: "3px 0", display: "flex", gap: 8 }}>
              <span style={{ color: "#27ae60", flexShrink: 0 }}>•</span>{p}
            </div>
          ))}
        </div>
      )}

      {/* ── All scores ── */}
      <div style={{
        background: "#f9f9f9", border: "1px solid #eee",
        borderRadius: 12, padding: "1rem 1.2rem"
      }}>
        <h4 style={{ fontSize: 13, color: "#888", marginBottom: 10, marginTop: 0 }}>
          All prediction scores
        </h4>
        {Object.entries(result.all_scores)
          .sort((a, b) => b[1] - a[1])
          .map(([cls, score]) => (
            <div key={cls} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                <span style={{ color: "#555", textTransform: "capitalize" }}>
                  {cls.replace(/_/g, " ")}
                </span>
                <span style={{ color: "#333", fontWeight: 500 }}>
                  {parseFloat(score).toFixed(2)}%
                </span>
              </div>
              <div style={{ background: "#e0e0e0", borderRadius: 4, height: 7 }}>
                <div style={{
                  width: `${score}%`, background: info.color,
                  height: "100%", borderRadius: 4, transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          ))}
      </div>

    </div>
  )
}