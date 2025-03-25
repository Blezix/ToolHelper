import React from "react";
import { Box, Button } from "@mui/material";

interface PreviewFile {
    id: number;
    image: string;
    selected: boolean;
}

interface PreviewComponentProps {
    previewFiles: PreviewFile[];
    setPreviewFiles: React.Dispatch<React.SetStateAction<PreviewFile[]>>;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({ previewFiles, setPreviewFiles }) => {
    return (
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
    );
};

export default PreviewComponent;