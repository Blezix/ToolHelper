import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import CanvasComponent from "./CanvasComponent";
import FileUploadComponent from "./FileUpload";
import ToolbarComponent from "./ToolBar";
import PreviewComponent from "./Preview";
import { fabric } from "fabric";
import jsPDF from "jspdf";

const FabricCanvas = () => {
    const fabricCanvas = useRef<fabric.Canvas | null>(null);
    const [excelData, setExcelData] = useState<any[]>([]);
    const [previewFiles, setPreviewFiles] = useState<{ id: number; image: string; selected: boolean }[]>([]);

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
            const text = new fabric.Textbox("Editable Text", {
                left: 50,
                top: 50 + fabricCanvas.current.getObjects().length * 30,
                width: 200,
                fontSize: 36,
                fill: "black",
                selectable: true,
                textAlign: "left",
                splitByGrapheme: true,
                whiteSpace: "normal",
            });
            fabricCanvas.current.add(text);
        }
    };

    const addImage = (url: string) => {
        if (fabricCanvas.current) {
            fabric.Image.fromURL(url, (img) => {
                img.set({ left: 100, top: 100, scaleX: 1, scaleY: 1 });
                fabricCanvas.current?.add(img);
            });
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && fabricCanvas.current) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataURL = e.target?.result as string;
                addImage(dataURL);
            };
            reader.readAsDataURL(file);
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

    const exportToPDF = () => {
        if (fabricCanvas.current) {
            const pdf = new jsPDF("landscape");
            const canvasObjects = fabricCanvas.current.getObjects();
            canvasObjects.forEach((obj, index) => {
                fabricCanvas.current?.renderAll();
                const dataURL = fabricCanvas.current?.toDataURL({ format: "png", multiplier: 5 });
                if (dataURL) {
                    if (index > 0) pdf.addPage();
                    pdf.addImage(dataURL, "PNG", 10, 10, 280, 150);
                }
            });
            pdf.save("canvas.pdf");
        }
    };

    const generateBatchPreviews = async () => {
        if (!excelData || excelData.length === 0) return;

        let previews = [];

        for (let index = 0; index < excelData.length; index++) {
            const row = excelData[index];

            const tempCanvas = new fabric.Canvas(null, {
                width: fabricCanvas.current?.width || 0,
                height: fabricCanvas.current?.height || 0,
                backgroundColor: "#fff",
            });

            fabricCanvas.current?.getObjects().forEach((obj) => {
                let newObj;
                if (obj.type === "textbox" && typeof obj.text === "string") {
                    const match = obj.text.match(/{(.+?)}/);
                    const newText = match ? row[match[1]] || match[1] : obj.text;

                    const adjustFontSize = (text: string, maxWidth: number, initialFontSize: number) => {
                        let fontSize = initialFontSize;
                        const textbox = new fabric.Textbox(text, {
                            width: maxWidth,
                            fontSize: fontSize,
                            whiteSpace: "normal"
                        });

                        while (textbox.width > maxWidth && fontSize > 1) {
                            fontSize -= 1;
                            textbox.set({ fontSize: fontSize });
                        }

                        return fontSize;
                    };

                    const fontSize = adjustFontSize(newText, 200, obj.fontSize || 36);

                    newObj = new fabric.Textbox(newText, {
                        left: obj.left,
                        top: obj.top,
                        fontSize: fontSize,
                        fill: obj.fill,
                        selectable: obj.selectable,
                        width: 350,
                        textAlign: "left",
                        splitByGrapheme: true,
                    });

                } else {
                    newObj = fabric.util.object.clone(obj);
                }

                tempCanvas.add(newObj);
            });

            tempCanvas.renderAll();

            await new Promise((resolve) => setTimeout(resolve, 200));

            const dataURL = tempCanvas.toDataURL({ format: "png" });
            previews.push({ id: index, image: dataURL, selected: false });

            tempCanvas.dispose();
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
            const text = new fabric.Textbox(`{${columnKey}}`, {
                left: 50,
                top: 50 + fabricCanvas.current.getObjects().length * 30,
                width: 350,
                fontSize: 36,
                fill: "black",
                selectable: true,
                textAlign: "left",
                splitByGrapheme: true,
            });

            fabricCanvas.current.add(text);

            text.on("moving", () => {
                const maxLeft = (fabricCanvas.current?.width || 0) - (text.width || 0);
                const maxTop = (fabricCanvas.current?.height || 0) - (text.height || 0);

                text.set({
                    left: Math.min(Math.max(0, text.left || 0), maxLeft),
                    top: Math.min(Math.max(0, text.top || 0), maxTop),
                });

                text.setCoords();
            });

            fabricCanvas.current.renderAll();
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
            <CanvasComponent fabricCanvas={fabricCanvas} />
            <ToolbarComponent
                addText={addText}
                exportToPNG={exportToPNG}
                exportToPDF={exportToPDF}
                removeSelected={removeSelected}
                generateBatchPreviews={generateBatchPreviews}
                excelData={excelData}
                addTextWithKey={addTextWithKey}
                previewFiles={previewFiles}
                exportSelectedPDFs={exportSelectedPDFs}
                handleImageUpload={handleImageUpload}
            />
            <FileUploadComponent setExcelData={setExcelData} />
            <PreviewComponent previewFiles={previewFiles} setPreviewFiles={setPreviewFiles} />
        </Box>
    );
};

export default FabricCanvas;