'use client'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
}

export default function ToolCard({ title, description, href }: ToolCardProps) {
    const router = useRouter();
    return (
        <Box
            component="a"
            href={href}
            onClick={(e) => {
                e.preventDefault();
                router.push(href);
            }}
            sx={{
                display: "flex",
                background:"white",
                flexDirection: "row",
                padding: 2,
                borderRadius: 2,
                height: "20%",
                width: "20%",
                boxShadow: 1,
                textDecoration: "none",
                color: "black",
                transition: "all 0.3s",
                "&:hover": {
                    boxShadow: 3,
                    transform: "scale(1.05)",
                },
            }}
        >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1,width:"90%" }}>
            <h2>{title}</h2>
            <p>{description}</p>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", width:"10%" }}>
            <PictureAsPdfIcon />
        </Box>

        </Box>

    );


}

