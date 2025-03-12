import { Col, Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Box } from "@mui/material";

interface SheetData {
    sheetName: string;
    data: any[];
}

const ExcelUploader: React.FC = () => {
    const [sheetData, setSheetData] = useState<SheetData[]>([]);
    const [columns, setColumns] = useState<any[]>([]);

    const testAxiosXlsx = async (url: string) => {
        const options = {
            url,
            responseType: "arraybuffer" as const, // Ensure correct type for responseType
        };
        const axiosResponse = await axios(options);
        const workbook = XLSX.read(axiosResponse.data);

        const worksheets = workbook.SheetNames.map((sheetName) => {
            return {
                sheetName,
                data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
            };
        });

        // Filter to only include "Sheet1"
        const filteredWorksheets = worksheets.filter(sheet => sheet.sheetName === "Sheet1");

        if (filteredWorksheets.length > 0 && filteredWorksheets[0].data.length > 0) {
            const firstRow = filteredWorksheets[0].data[0]
            const dynamicColumns = Object.keys(firstRow).map(key => ({
                title: key,
                dataIndex: key,
                key: key,
            }));
            setColumns(dynamicColumns);
        }

        setSheetData(filteredWorksheets);
        console.log("json:\n", JSON.stringify(filteredWorksheets), "\n\n");
    };

    const validate = () => {
        testAxiosXlsx(
            "https://docs.google.com/spreadsheets/d/1xZfgfAqpusykWKh3DkCYkexd24IWD30YXohFIXrnEeg/edit?usp=sharing"
        );
    };

    useEffect(() => {
        validate();
    }, []);

    return (
        <Box sx={{
            width: "50%",
            height: "90vh",
            overflowY: "scroll"
        }}>
            <Col lg={12}>
                <h3>The Data of The Uploaded Excel Sheet</h3>
            </Col>
            <Col lg={24}>
                {sheetData &&
                    sheetData.map((sheet) => (
                        <Box sx={{
                            width: "100%",
                            height: "400px",
                            overflow: "auto"
                        }} component={'div'} key={sheet.sheetName}>
                            <Table dataSource={sheet.data.slice(1)} columns={columns} />
                        </Box>
                    ))}
            </Col>
        </Box>
    )
};

export default ExcelUploader;