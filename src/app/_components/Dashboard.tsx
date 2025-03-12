import { Box } from "@mui/material";
import ToolCard from "@/app/_components/ToolCard";

export default function Dashboard() {
    return (
        <Box
            sx={{
                display:"flex",
                padding: 2,
                borderRadius: 2,
                boxShadow: 1,
                width: "100%",
                height: "100vh",
                textDecoration: "none",
                background: "linear-gradient(to right, #a3c8f1, #cce7ff)",
                color: "inherit",
                "&:hover": {
                    boxShadow: 2,
                },
            }}
        >
            <ToolCard title={"Pdf Generator"} description={"Easy to use pdf generator for envelopes"} href={"/pdfgenerator"}/>
        </Box>

    );


}

