import { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Box, Paper, Typography} from '@mui/material';

interface Element {
    x: number;
    y: number;
    text: string;
}

interface PdfCanvasProps {
    elements: Element[];
    setElements: (elements: Element[]) => void;
}

const DraggableElement: React.FC<{ element: Element; index: number; moveElement: (index: number, x: number, y: number) => void }> = ({ element, index, moveElement }) => {
    const [, ref] = useDrag({
        type: 'ELEMENT',
        item: { index, x: element.x, y: element.y },
    });

    const [, drop] = useDrop({
        accept: 'ELEMENT',
        hover: (item: { index: number; x: number; y: number }, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset();
            if (delta) {
                const x = item.x + delta.x;
                const y = item.y + delta.y;
                moveElement(index, x, y);
            }
        },
    });

    return (
        <div ref={(node) => ref(drop(node))} style={{ position: 'absolute', left: element.x, top: element.y }}>
            <Paper elevation={3} style={{ padding: '10px' }}>
                <Typography variant="body2">{element.text}</Typography>
            </Paper>
        </div>
    );
};

const PdfCanvas: React.FC<PdfCanvasProps> = ({ elements, setElements }) => {
    const moveElement = (index: number, x: number, y: number) => {
        const newElements = [...elements];
        newElements[index] = { ...newElements[index], x, y };
        setElements(newElements);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', position: 'relative' }}>
                {elements.map((el, index) => (
                    <DraggableElement key={index} index={index} element={el} moveElement={moveElement} />
                ))}
            </div>
        </DndProvider>
    );
};

export default PdfCanvas;