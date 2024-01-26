import { ExpandMore } from "@mui/icons-material";
import {
  Typography,
  TextField,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  BoxProps
} from "@mui/material";

export type AccordionInputProps = {
    label?: string,
    inputLabel?: string,
    showInputLabel?: boolean,
    disabled?: boolean,
    value?: string,
    setValue?: (event: React.ChangeEvent<HTMLInputElement>) => any,
    expanded?: boolean,
    onChange?: () => any,
    valid?: boolean,
} & BoxProps;

const AccordionInput = ({
  label,
  inputLabel,
  showInputLabel,
  disabled,
  value,
  setValue,
  expanded,
  onChange,
  valid,
  ...rest
}: AccordionInputProps) => {
    return (
      <Box {...rest}>
        <Accordion
          expanded={disabled ? true : expanded}
          onChange={onChange}
        >
          <AccordionSummary disabled={disabled}
            expandIcon={<ExpandMore color="primary"/>}
          >
            <Typography color={disabled ? "text.disabled" : "primary.light"}>
              {label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
              {showInputLabel && <InputLabel variant="standard">
                      {inputLabel}
              </InputLabel>}
              <TextField variant="outlined"
                        fullWidth
                        value={value}
                        placeholder={
                          !showInputLabel && inputLabel ? `Enter ${inputLabel}` : ''
                        }
                        color={valid ? undefined : "error"}
                        disabled={disabled}
                        onChange={setValue}/>
              {!valid && <Typography mt={1.5} color="error" variant="body2">
                The specified address is not valid.
              </Typography>}
          </AccordionDetails>
        </Accordion>
      </Box>
    )
}

AccordionInput.defaultProps = {
  label: "Change destination address",
  InputLabel: "Destination address",
  showInputLabel: true,
  valid: true,
}

export default AccordionInput;
