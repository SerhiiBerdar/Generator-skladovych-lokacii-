import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import QRCode from "qrcode";

export default function App() {
  const [size, setSize] = useState(450);
  const [titleSize, setTitleSize] = useState(65);
  const [subSize, setSubSize] = useState(60);

  const [bgColor] = useState("#ffffff");
  const [descriptions, setDescriptions] = useState("");
  const [locations, setLocations] = useState("");

  const [preview, setPreview] = useState<any[]>([]);
  const [sideMode, setSideMode] = useState("none");
  const [showFAQ, setShowFAQ] = useState(false);

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
                Generovať obrázky
              </Button>
            </div>

            <div
              className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
                showFAQ ? "w-[520px]" : "w-80"
              } shadow-2xl border border-blue-200 rounded-2xl overflow-hidden bg-blue-50 backdrop-blur`}
            >
              <button
                type="button"
                onClick={() => setShowFAQ(!showFAQ)}
                className="w-full text-left px-5 py-4 font-semibold text-blue-900 hover:bg-blue-100 transition text-lg flex items-center justify-between"
              >
                <span>FAQ / Pomoc</span>
                <span className="text-xl">{showFAQ ? "▲" : "▼"}</span>
              </button>

              {showFAQ && (
                <div className="p-6 text-sm text-blue-900 leading-7 border-t border-blue-200 bg-white max-h-[75vh] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="text-base font-bold">
                      Kompletný návod k aplikácii
                    </div>

                    <div>
                      Tento nástroj slúži na generovanie skladových lokácií,
                      QR kódov a tlačových A4 kariet.
                    </div>

                    <div>
                      <strong>Postup používania:</strong>
                    </div>

                    <div className="space-y-2 pl-2">
                      <div>1. Do poľa <strong>Popisy</strong> vlož horné názvy lokalít.</div>
                      <div>2. Do poľa <strong>Lokácie / QR</strong> vlož QR texty alebo skladové lokácie.</div>
                      <div>3. Každý riadok predstavuje 1 samostatnú A4 kartu.</div>
                      <div>4. Klikni na <strong>Generovať obrázky</strong>.</div>
                      <div>5. Pre tlač použi <strong>CTRL + P</strong>.</div>
                      <div>6. Tlač je automaticky optimalizovaná pre <strong>A4 landscape</strong>.</div>
                    </div>

                    <div>
                      <strong>Nastavenia:</strong>
                    </div>

                    <div className="space-y-2 pl-2">
                      <div><strong>Veľkosť QR</strong> → nastavuje veľkosť QR kódu.</div>
                      <div><strong>Veľkosť horného textu</strong> → veľkosť nadpisu nad QR.</div>
                      <div><strong>Veľkosť spodného textu</strong> → veľkosť textu pod QR.</div>
                      <div><strong>Strana palety</strong> → zobrazí REGAL indikátor pre ľavú alebo pravú stranu.</div>
                    </div>

                    <div>
                      <strong>Dôležité:</strong>
                    </div>

                    <div className="space-y-2 pl-2">
                      <div>• QR sa generuje automaticky po vyplnení poľa Lokácie / QR.</div>
                      <div>• Prázdne riadky sa automaticky ignorujú.</div>
                      <div>• Preview zodpovedá výslednej tlači.</div>
                    </div>
                  </div>
                </div>
              )}
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
    </>
  );
}
