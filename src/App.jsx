import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useState } from "react";
import QRCode from "qrcode";
const Button = ({ children, style = {}, ...props }) => (
  <button
    {...props}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      ...style,
    }}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input {...props} />
);

const Textarea = (props) => (
  <textarea {...props} />
);

const Card = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);
export default function App() {
  const [size, setSize] = useState(450);
  const [titleSize, setTitleSize] = useState(65);
  const [subSize, setSubSize] = useState(60);

  const [bgColor] = useState("#ffffff");
  const [descriptions, setDescriptions] = useState("");
  const [locations, setLocations] = useState("");

  const [preview, setPreview] = useState([]);
  const [sideMode, setSideMode] = useState("none");

  const A4 = { width: 1123, height: 794 };

  const generatePreview = async (currentSide = sideMode) => {
    const descArr = descriptions.split("\n").map((d) => d.trim());
    const locArr = locations.split("\n").map((l) => l.trim());

    const maxLength = Math.max(descArr.length, locArr.length);
    const items = [];

    for (let i = 0; i < maxLength; i++) {
      const desc = descArr[i] || "";
      const text = locArr[i] || "";

      if (!desc && !text) continue;

      let codeImg = "";

      if (text) {
        try {
          codeImg = await QRCode.toDataURL(text, {
            width: 1000,
            margin: 1,
          });
        } catch (err) {
          console.error("QR generation error:", err);
        }
      }

      items.push({
        desc,
        text,
        code: codeImg,
        side: currentSide,
      });
    }

    setPreview(items);
  };
  const waitForImages = async (node) => {
    const imgs = Array.from(node.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            })
      )
    );
  };

  const generatePDF = async () => {
    await generatePreview();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const nodes = document.querySelectorAll(".print-area");
    if (nodes.length === 0) return;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      await waitForImages(node);

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    }

    pdf.save("lokacie.pdf");
  };

  return (
    <>
      <style>{`
        @media print {
          html,
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-hide {
            display: none !important;
            visibility: hidden !important;
          }

          body * {
            visibility: hidden;
          }

          .print-root {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            background: white !important;
            z-index: 999999 !important;
          }

          .print-container,
          .print-container *,
          .print-area,
          .print-area * {
            visibility: visible !important;
          }

          .print-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .print-area {
            width: 280mm !important;
            height: 195mm !important;
            overflow: hidden !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 12px !important;
            padding-top: 20px !important;
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            isolation: isolate !important;
          }

          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>

      <div className="p-6 space-y-6 bg-gray-100 min-h-screen print-root">
        <div className="flex min-h-screen bg-gray-100">
  <div
    style={{
      width: "260px",
      background: "#0f172a",
      color: "white",
      padding: "24px",
    }}
    className="print-hide"
  >
    <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
      📦 Generátor Lokácií
    </h2>

    <div style={{ marginTop: "30px" }}>
      <div style={{ padding: "12px" }}>⚙ Nastavenia</div>
      <div style={{ padding: "12px" }}>📝 Dáta</div>
      <div style={{ padding: "12px" }}>👁 Náhľad</div>
      <div style={{ padding: "12px" }}>📄 PDF Export</div>

    </div>
  </div>

  <div className="flex-1 p-6">
        <Card className="shadow-xl rounded-2xl print-hide">
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Veľkosť QR (px)
                </label>
                <Input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value) || 0)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Veľkosť horného textu
                </label>
                <Input
                  type="number"
                  value={titleSize}
                  onChange={(e) => setTitleSize(Number(e.target.value) || 0)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Veľkosť spodného textu
                </label>
                <Input
                  type="number"
                  value={subSize}
                  onChange={(e) => setSubSize(Number(e.target.value) || 0)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Strana palety
                </label>

                <select
                  value={sideMode}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setSideMode(value);
                    await generatePreview(value);
                  }}
                  className="border rounded-md h-10 px-3 bg-white"
                >
                  <option value="none">Negenerovať</option>
                  <option value="left">Ľavá strana</option>
                  <option value="right">Pravá strana</option>
                </select>
              </div>
            </div>

           <div className="flex flex-wrap gap-4 items-center">
  <Button
    onClick={async () => {
      await generatePreview();
    }}
  >
    👁 Generovať obrázky
  </Button>

  <Button
    onClick={generatePDF}
    style={{
      background: "#16a34a",
    }}
  >
    📄 Generovať PDF
  </Button>
</div>

<div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Popisy
                </label>

                <Textarea
                  className="min-h-[220px]"
                  placeholder="1 riadok = 1 A4 stránka"
                  value={descriptions}
                  onChange={(e) => setDescriptions(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Lokácie / QR
                </label>

                <Textarea
                  className="min-h-[220px]"
                  placeholder="1 riadok = 1 QR kód"
                  value={locations}
                  onChange={(e) => setLocations(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

    {preview.length > 0 && (
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "20px",
    }}
  >
    <h3>Náhľad</h3>

    {preview[0]?.code && (
      <img
        src={preview[0].code}
        alt="preview"
        style={{
          width: "200px",
          height: "200px",
        }}
      />
    )}
  </div>
)}
        <div className="space-y-8 print-container">
          {preview.map((item, i) => (
            <div
              key={i}
              className="print-area bg-white flex flex-col items-center justify-start gap-6 rounded-xl shadow-lg p-8 pt-12 print:shadow-none print:rounded-none print:p-0"
              style={{
                backgroundColor: bgColor,
                width: `${A4.width}px`,
                height: `${A4.height}px`,
                minWidth: `${A4.width}px`,
                minHeight: `${A4.height}px`,
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              {item.desc && (
                <div
                  style={{
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {item.desc}
                </div>
              )}

              {item.side !== "none" && (
                <div
                  style={{
                    width: "620px",
                    minHeight: "90px",
                    backgroundColor: "#3f3f46",
                    border: "4px solid #ffffff",
                    display: "flex",
                    flexDirection:
                      item.side === "left" ? "row" : "row-reverse",
                    alignItems: "center",
                    overflow: "hidden",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      backgroundColor: "#78716c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "54px",
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </div>

                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "42px",
                      letterSpacing: "2px",
                    }}
                  >
                    REGAL
                  </div>
                </div>
              )}

              {item.code && (
                <img
                  src={item.code}
                  alt="QR"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    objectFit: "contain",
                  }}
                />
              )}

              {item.text && (
                <div
                  style={{
                    fontSize: `${subSize}px`,
                    fontWeight: 700,
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {item.text}
                </div>
              )}
            </div>
          ))}
             </div>
      </div>
    </div>
  </div>
    </>
  );
}
