"use client";

import * as motion from "motion/react-client";
import { ReactNode } from "react";

interface FadeInWrapperProps {
    children: ReactNode;
}

const FadeInWrapper = ({ children }: FadeInWrapperProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default FadeInWrapper;
