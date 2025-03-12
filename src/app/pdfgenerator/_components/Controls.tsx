import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface ControlsProps {
    setEnvelopeSize: (size: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ setEnvelopeSize }) => {
    return (
        <FormControl fullWidth>
            <InputLabel>Format koperty</InputLabel>
            <Select defaultValue="C5" onChange={(e) => setEnvelopeSize(e.target.value)}>
                <MenuItem value="C5">C5 (162 × 229 mm)</MenuItem>
                <MenuItem value="C6">C6 (114 × 162 mm)</MenuItem>
            </Select>
        </FormControl>
    );
};

export default Controls;