'use client'

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { PDFDocument } from 'pdf-lib';
import useImage from 'use-image';
import { Stage, Layer, Text, Image } from "react-konva";
import { Box } from "@mui/material";
const PdfGenerator: React.FC = () => {
    const [image] = useImage('https://konvajs.org/assets/lion.png','anonymous');
    const [text, setText] = useState<string>('');
    const [fontSize, setFontSize] = useState(20);  // Font size state
    const StageRef = useRef<any>(null);

    const exportPDF = async () => {
        const stage = StageRef.current;
        const canvas = stage.toCanvas({pixelRatio: 4});

        // Use toBlob instead of toDataURL
        canvas.toBlob(async (blob: Blob) => {
            const imageBytes = await blob.arrayBuffer();

            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([canvas.width, canvas.height]);

            const pdfImage = await pdfDoc.embedPng(imageBytes);
            page.drawImage(pdfImage, {
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height,
            });

            const pdfBytes = await pdfDoc.save();
            const blobPDF = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blobPDF);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'generated.pdf';
            link.click();
        });
    };

    return (
        <div>
            {/* Input for text editing */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text"
            />

            {/* Slider for font size adjustment */}
            <input
                type="range"
                min="10"
                max="100"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={{ marginBottom: '10px' }}
            />

            {/* Stage and Layer for rendering text and image */}

            <Stage style={{
                backgroundColor:"white",
                width:'169mm',
                height:'114mm',
            }} width={612} height={430} ref={StageRef} drawBorder>
                <Layer style={{
                    width:'100%',
                    height:'100%',
                }}>
                    <Text
                        text={text}
                        x={50}
                        y={50}
                        fontSize={fontSize}
                        draggable
                    />
                    <Image image={image} x={50} y={100} width={100} height={100} draggable />
                </Layer>
            </Stage>

            {/* Button to change text */}
            <button onClick={() => setText('New Text')}>Change Text</button>

            {/* Button to export to PDF */}
            <button onClick={exportPDF}>Export PDF</button>
        </div>
    );
};

export default PdfGenerator;
