'use client'

import { useState, useEffect } from 'react';
import { Typography, AppBar, Toolbar, Box } from '@mui/material';
import FabricCanvas from "@/app/pdfgenerator/_components/FabricCanvas";


const PdfGeneratorPage = () => {
    // State to store uploaded Excel data
    const [excelData, setExcelData] = useState<any[]>([]);
    // State to store column names from Excel data
    const [columns, setColumns] = useState<string[]>([]);
    // State to store selected columns for PDF generation
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

    // Update columns when excelData changes
    useEffect(() => {
        if (excelData.length > 0) {
            setColumns(Object.keys(excelData[0]));
        }
    }, [excelData]);

    return (
        <Box sx={{ width: "100%", height: "100vh", background: "linear-gradient(to right, #fff, #d3d0d0)" }}>
        <FabricCanvas></FabricCanvas>
        </Box>
    );
};

export default PdfGeneratorPage;