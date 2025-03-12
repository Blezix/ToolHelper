'use client'

import {Typography, AppBar, Toolbar, Box} from '@mui/material';

import PdfGenerator from "@/app/pdfgenerator/_components/PdfGenerator";
import ExcelUploader from "@/app/pdfgenerator/_components/ExcelUploader";



const PdfGeneratorPage = () => {


    return (
        <Box sx={{
            width: "100%",
            height: "100vh",
            background:"linear-gradient(to right, #fff, #d3d0d0)",
        }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Generator PDF</Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                padding: 2,
                justifyContent: "center",
                alignItems: "center",
                color: "black",
                backgroundColor: "lightgrey",
            }}>

                <PdfGenerator />
                <ExcelUploader />
            </Box>
        </Box>
    );
};

export default PdfGeneratorPage;