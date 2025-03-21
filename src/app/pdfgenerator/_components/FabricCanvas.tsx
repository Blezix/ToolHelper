import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import * as XLSX from "xlsx";
import { Button, Box } from "@mui/material";
import jsPDF from "jspdf";

const CanvasEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<fabric.Canvas | null>(null);
    const [excelData, setExcelData] = useState<any[]>([]);
    const [previewFiles, setPreviewFiles] = useState<{ id: number; image: string; selected: boolean }[]>([]);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 500,
                backgroundColor: "#fff",
            });
            fabricCanvas.current = canvas;

            return () => {
                canvas.dispose();
            };
        }
    }, []);

    const removeSelected = () => {
        if (fabricCanvas.current) {
            const activeObject = fabricCanvas.current.getActiveObject();
            if (activeObject) {
                fabricCanvas.current.remove(activeObject);
                fabricCanvas.current.discardActiveObject();
                fabricCanvas.current.requestRenderAll();
            }
        }
    };

    const addText = () => {
        if (fabricCanvas.current) {
            const text = new fabric.Text("Editable Text", {
                left: 50,
                top: 50,
                fontSize: 20,
                fill: "black",
                selectable: true,
            });
            fabricCanvas.current.add(text);
        }
    };

    const addImage = (url: string) => {
        if (fabricCanvas.current) {
            fabric.Image.fromURL(url, (img) => {
                img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });
                fabricCanvas.current?.add(img);
            });
        }
    };

    const exportToPNG = () => {
        if (fabricCanvas.current) {
            const dataURL = fabricCanvas.current.toDataURL({ format: "png" });
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "canvas.png";
            link.click();
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setExcelData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const exportToPDF = () => {
        if (fabricCanvas.current) {
            const pdf = new jsPDF("landscape");
            const canvasObjects = fabricCanvas.current.getObjects();
            canvasObjects.forEach((obj, index) => {
                fabricCanvas.current?.renderAll();
                const dataURL = fabricCanvas.current?.toDataURL({ format: "png" });
                if (index > 0) pdf.addPage();
                pdf.addImage(dataURL, "PNG", 10, 10, 280, 150);
            });
            pdf.save("canvas.pdf");
        }
    };

    const generateBatchPreviews = async () => {
        if (!excelData || excelData.length === 0 || !fabricCanvas.current) return;

        let previews: { id: number; image: string; selected: boolean }[] = [];

        for (let index = 0; index < excelData.length; index++) {
            const row = excelData[index];
            const clonedCanvas = fabricCanvas.current.toJSON();

            await new Promise((resolve) => {
                fabricCanvas.current?.loadFromJSON(clonedCanvas, () => {
                    fabricCanvas.current?.getObjects().forEach((obj) => {
                        if (obj.type === "text") {
                            const match = (obj as fabric.Text).text.match(/{(.+?)}/);
                            if (match && row[match[1]]) {
                                (obj as fabric.Text).set("text", row[match[1]]);
                            }
                        }
                    });

                    fabricCanvas.current?.renderAll();
                    setTimeout(resolve, 200);
                });
            });

            const dataURL = fabricCanvas.current?.toDataURL({ format: "png" });
            previews.push({ id: index, image: dataURL, selected: false });
        }

        setPreviewFiles(previews);
    };

    const exportSelectedPDFs = () => {
        previewFiles
            .filter((file) => file.selected)
            .forEach((file, index) => {
                const pdf = new jsPDF("landscape");
                pdf.addImage(file.image, "PNG", 10, 10, 280, 150);
                pdf.save(`canvas_${index + 1}.pdf`);
            });
    };

    const addTextWithKey = (columnKey: string) => {
        if (fabricCanvas.current) {
            const text = new fabric.Text(`{${columnKey}}`, {
                left: 50,
                top: 50 + fabricCanvas.current.getObjects().length * 30,
                fontSize: 20,
                fill: "black",
                selectable: true,
            });
            fabricCanvas.current.add(text);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
            <canvas ref={canvasRef} style={{ border: "1px solid #ccc", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }} />
            <Box display="flex" gap={1}>
                <Button variant="contained" onClick={addText}>Add Text</Button>
                <Button variant="contained" onClick={() => addImage("https://via.placeholder.com/150")}>
                    Add Image
                </Button>
                {excelData.length > 0 && Object.keys(excelData[0]).map((key) => (
                    <Button key={key} onClick={() => addTextWithKey(key)}>
                        Add {key}
                    </Button>
                ))}
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                <Button variant="contained" onClick={exportToPNG}>Export PNG</Button>
                <Button variant="contained" onClick={exportToPDF}>Export PDF</Button>
                <Button variant="contained" onClick={removeSelected}>Remove Selected</Button>
                <Button variant="contained" onClick={generateBatchPreviews}>
                    Generate Previews
                </Button>
                {previewFiles.length > 0 && (
                    <Button variant="contained" onClick={exportSelectedPDFs}>
                        Export Selected PDFs
                    </Button>
                )}
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2} p={2}>
                {previewFiles.map((file, index) => (
                    <Box key={index} display="flex" flexDirection="column" alignItems="center">
                        <img src={file.image} alt={`Preview ${index + 1}`} width={150} />
                        <Button
                            variant={file.selected ? "contained" : "outlined"}
                            onClick={() =>
                                setPreviewFiles((prev) =>
                                    prev.map((f) =>
                                        f.id === file.id ? { ...f, selected: !f.selected } : f
                                    )
                                )
                            }
                        >
                            {file.selected ? "Deselect" : "Select"}
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CanvasEditor;