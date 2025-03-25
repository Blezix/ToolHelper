import React from "react";
import * as XLSX from "xlsx";

interface FileUploadComponentProps {
    setExcelData: React.Dispatch<React.SetStateAction<any[]>>;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ setExcelData }) => {
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

    return <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />;
};

export default FileUploadComponent;