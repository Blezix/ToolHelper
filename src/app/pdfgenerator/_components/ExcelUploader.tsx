import { Col, Row, Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {Box} from "@mui/material";

interface SheetData {
    sheetName: string;
    data: any[];
}

const ExcelUploader: React.FC = () => {
    const [sheetData, setSheetData] = useState<SheetData[]>([]);

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

        setSheetData(filteredWorksheets);
        console.log("json:\n", JSON.stringify(filteredWorksheets), "\n\n");
    };

    const validate = () => {
        testAxiosXlsx(
            "https://docs.google.com/spreadsheets/d/1xZfgfAqpusykWKh3DkCYkexd24IWD30YXohFIXrnEeg/edit?usp=sharing"
        );
    };

    const columns = [
        {
            title: "Segment",
            dataIndex: "A",
            key: "Segment",
        },
        {
            title: "Country",
            dataIndex: "B",
            key: "Country",
        },
        {
            title: "Product",
            dataIndex: "C",
            key: "Product",
        },
        {
            title: "Units Sold",
            dataIndex: "D",
            key: "Units Sold",
        },
        {
            title: "Manufacturing Price",
            dataIndex: "E",
            key: "Manufacturing Price",
        },
        {
            title: "Sale Price",
            dataIndex: "F",
            key: "Sale Price",
        },
    ];

    useEffect(() => {
        validate();
    }, []);

    return (
        <Box sx={{
            width:"50%",
            height:"400px",
            overflowY:"scroll",
        }}>
            <Col lg={12}>
                <h3>The Data of The Uploaded Excel Sheet</h3>
            </Col>
            <Col lg={24}>
                {sheetData &&
                    sheetData.map((sheet) => (
                        <div key={sheet.sheetName}>
                            <p>{sheet.sheetName}</p>
                            <Table dataSource={sheet.data.slice(1)} columns={columns} />
                        </div>
                    ))}
            </Col>
        </Box>
    )
};

export default ExcelUploader;