import React from "react";
import { Button, Box } from "@mui/material";

interface Props {
    addText: () => void;
    exportToPNG: () => void;
    exportToPDF: () => void;
    removeSelected: () => void;
    generateBatchPreviews: () => void;
    excelData: any[];
    addTextWithKey: (columnKey: string) => void;
    previewFiles: { id: number; image: string; selected: boolean }[];
    exportSelectedPDFs: () => void;
    groupSelectedTextboxes: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToolbarComponent: React.FC<Props> = ({
                                               addText,
                                               exportToPNG,
                                               exportToPDF,
                                               removeSelected,
                                               generateBatchPreviews,
                                               excelData,
                                               addTextWithKey,
                                               previewFiles,
                                               exportSelectedPDFs,
                                               groupSelectedTextboxes,
                                               handleImageUpload
                                           }) => {
    return (
        <Box display="flex" gap={1}>
            <Button variant="contained" onClick={addText}>Add Text</Button>
            <Button variant="contained" onClick={() => document.getElementById("imageUploadInput")?.click()}>Add Image</Button>
            <input
                type="file"
                id="imageUploadInput"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageUpload}
            />
            {excelData.length > 0 && Object.keys(excelData[0]).map((key) => (
                <Button key={key} onClick={() => addTextWithKey(key)}>Add {key}</Button>
            ))}
            <Button variant="contained" onClick={exportToPNG}>Export PNG</Button>
            <Button variant="contained" onClick={exportToPDF}>Export PDF</Button>
            <Button variant="contained" onClick={removeSelected}>Remove Selected</Button>
            <Button variant="contained" onClick={generateBatchPreviews}>Generate Previews</Button>
            {previewFiles.length > 0 && (
                <Button variant="contained" onClick={exportSelectedPDFs}>Export Selected PDFs</Button>
            )}
            <Button variant="contained" onClick={groupSelectedTextboxes}>Group Selected Textboxes</Button>
        </Box>
    );
};

export default ToolbarComponent;