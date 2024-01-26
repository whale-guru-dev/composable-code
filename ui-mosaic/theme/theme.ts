/** @format */

import { alpha, createTheme } from "@mui/material/styles";
import baseTheme from "./baseTheme";
import buttonVariants from "./builders/Button/variants";
import iconButtonVariants from "./builders/IconButton/variants";
import { baseTypograhpy } from "./builders/Typograhpy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// create main theme with custom design options for the components
const theme = createTheme(baseTheme, {
  palette: {
    action: {
      active: baseTheme.palette.text.primary,
      hover: baseTheme.palette.text.primary,
      // hoverOpacity: 1,
      selected: alpha(baseTheme.palette.primary.main, baseTheme.opacity.light),
      selectedOpacity: 0.2,
      disabled: alpha(baseTheme.palette.text.primary, 1),
      disabledBackground: alpha(
        baseTheme.palette.text.primary,
        baseTheme.opacity.main
      ),
      disabledOpacity: baseTheme.opacity.main,
      focus: alpha(baseTheme.palette.text.primary, 1),
    },
  },

  // customize typography
  typography: baseTypograhpy(baseTheme),

  // customize with mui classes
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: baseTheme.palette.text.primary,
          backgroundColor: baseTheme.palette.other.background.n3,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          fontSize: "16px",
          "*::-webkit-scrollbar": {
            width: "0.4em",
          },
          "*::-webkit-scrollbar-track": {
            "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
            outline: "1px solid slategrey",
            borderRadius: 8,
          },
        },
      },
    },
    // customize typography
    MuiTypography: {
      // The default props to change
      defaultProps: {
        variant: "body2",
      },
    },
    MuiButtonBase: {
      // The default props to change
      defaultProps: {
        disableRipple: true, // No more ripple
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
        IconComponent: KeyboardArrowDownIcon,
      },

      styleOverrides: {
        select: {
          padding: baseTheme.spacing(1.7, 3),
          height: "1.4375em",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 64,
          height: 32,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(32px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: baseTheme.palette.primary.main,
                opacity: 1,
                border: 0,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              border: "1px solid",
              borderColor: "white",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color:
                baseTheme.palette.mode === "light"
                  ? baseTheme.palette.grey[100]
                  : baseTheme.palette.grey[600],
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: baseTheme.palette.mode === "light" ? 0.7 : 0.3,
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 24,
            height: 24,
            margin: 2,
          },
          "& .MuiSwitch-track": {
            borderRadius: 16,
            backgroundColor: "transparent",
            border: "1px solid",
            borderColor: baseTheme.palette.text.secondary,
            opacity: 1,
            transition: baseTheme.transitions.create(["background-color"], {
              duration: 400,
            }),
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#1c0012", 0.1),
          backgroundImage: `linear-gradient(to bottom, ${alpha(
            "#120c10",
            0.1
          )} 100%, ${alpha("#1c0012", 0.1)} 17%)`,
        },
      },
    },
    MuiButton: {
      // default style overrides
      styleOverrides: {
        root: {
          borderRadius: baseTheme.shape.borderRadius,
          color: baseTheme.palette.text.primary,
          textTransform: "none",
          lineHeight: baseTheme.lineHeight.large,
        },
      },
      // The default props to change
      defaultProps: {
        variant: "outlined",
      },
      // customize the button variants
      variants: buttonVariants(baseTheme),
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: baseTheme.shape.borderRadius,
        },
      },
      // The default props to change
      defaultProps: {
        color: "primary",
      },
      variants: iconButtonVariants(baseTheme),
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: baseTheme.shape.borderRadius,
        },
      },
      // The default props to change
      defaultProps: {
        variant: "outlined",
      },
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            background: "transparent",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: alpha(baseTheme.palette.common.white, 0.12),
          },
        },
      ],
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderRadius: baseTheme.shape.borderRadius,
          padding: baseTheme.spacing(4, 4, 1),
          [baseTheme.breakpoints.down("sm")]: {
            padding: baseTheme.spacing(4, 0.5, 1),
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          borderRadius: baseTheme.shape.borderRadius,
          padding: baseTheme.spacing(1, 4, 2),
          [baseTheme.breakpoints.down("sm")]: {
            padding: baseTheme.spacing(1, 0.5, 2),
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          borderRadius: baseTheme.shape.borderRadius,
          padding: baseTheme.spacing(2, 4, 4),
          [baseTheme.breakpoints.down("sm")]: {
            padding: baseTheme.spacing(2, 0.5, 4),
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: baseTheme.palette.text.secondary,
          "&:hover": {
            backgroundColor: "transparent !important",
          },
          "&.Mui-disabled": {
            color: baseTheme.palette.text.disabled,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(32px)",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: baseTheme.palette.text.secondary,
          fontSize: "1rem",
        },
        label: {
          "&.Mui-disabled": {
            color: baseTheme.palette.text.disabled,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          boxShadow: "none",
          zIndex: baseTheme.zIndex.drawer + 1,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          textAlign: "center",
          fontSize: "1rem",
          lineHeight: baseTheme.lineHeight.large,
          alignItems: "center",
        },
        root: {
          border: `1px solid ${alpha(
            baseTheme.palette.common.white,
            baseTheme.opacity.lighter
          )}`,
          "&:before": {
            borderWidth: "0 !important",
          },
          "&.Mui-disabled": {
            backgroundColor: baseTheme.palette.other.border.d1,
          },
        },
      },
      variants: [
        {
          props: { color: "error" },
          style: {
            borderColor: baseTheme.palette.error.main,
            input: {
              color: baseTheme.palette.error.main,
            },
          },
        },
      ],
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: baseTheme.palette.background.default,
          color: baseTheme.palette.other.background.n2,
          padding: baseTheme.spacing(3),
          maxWidth: 500,
          fontSize: 16,
          lineHeight: "160%",
        },
        arrow: {
          color: baseTheme.palette.background.default,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "2rem",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: alpha(baseTheme.palette.primary.dark, 0.07),
            "& .MuiOutlinedInput-notchedOutline": {
              // borderColor: alpha(baseTheme.palette.text.primary, baseTheme.opacity.light)
              borderWidth: 0,
            },
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            // borderColor: alpha(baseTheme.palette.text.primary, baseTheme.opacity.light)
            borderWidth: 0,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            // borderColor: alpha(baseTheme.palette.text.primary, baseTheme.opacity.light),
            borderWidth: 0,
          },
          "&:hover": {
            borderColor: baseTheme.palette.primary.main,
          },
          "&.Mui-focused": {
            borderColor: baseTheme.palette.primary.main,
          },
        },
        notchedOutline: {
          // borderColor: `${alpha(baseTheme.palette.text.primary, baseTheme.opacity.light)} !important`,
          borderRadius: baseTheme.shape.borderRadius,
        },
      },
      variants: [
        {
          props: { size: "large" },
          style: {
            input: {
              padding: baseTheme.spacing(2.25),
              [baseTheme.breakpoints.down("sm")]: {
                padding: baseTheme.spacing(2.125),
              },
            },
          },
        },
        {
          props: { size: "medium" },
          style: {
            input: {
              padding: baseTheme.spacing(1.875),
              [baseTheme.breakpoints.down("sm")]: {
                padding: baseTheme.spacing(1.75),
              },
            },
          },
        },
        {
          props: { size: "small" },
          style: {
            input: {
              padding: baseTheme.spacing(1.25),
              [baseTheme.breakpoints.down("sm")]: {
                padding: baseTheme.spacing(1.125),
              },
            },
          },
        },
      ],
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          minWidth: 256,
        },
        paperAnchorDockedLeft: {
          borderRight: "none",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        page: {
          "&:hover": {
            backgroundColor: alpha(
              baseTheme.palette.text.primary,
              baseTheme.opacity.light
            ),
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          justifyContent: "center",
        },
      },
    },
    MuiInputLabel: {
      variants: [
        {
          props: { variant: "standard" },
          style: {
            color: baseTheme.palette.text.primary,
            fontSize: "1rem",
            marginBottom: baseTheme.spacing(2),
          },
        },
      ],
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          boxShadow: "none",
          "&:before": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          color: baseTheme.palette.text.primary,
          borderBottom: `2px solid ${alpha(
            baseTheme.palette.common.white,
            baseTheme.opacity.light
          )}`,
          "&.Mui-selected": {
            color: baseTheme.palette.text.primary,
          },
        },

        wrapped: {
          border: `1px solid ${alpha(
            baseTheme.palette.primary.main,
            baseTheme.opacity.dark
          )}`,
          fontSize: "1rem",
          padding: baseTheme.spacing(2, 0),
          ":hover": {
            background: alpha(
              baseTheme.palette.primary.main,
              baseTheme.opacity.lighter
            ),
          },
          "&:first-of-type": {
            borderRadius: `${baseTheme.shape.borderRadius}px 0 0 ${baseTheme.shape.borderRadius}px`,
          },

          "&:last-of-type": {
            borderRadius: `0 ${baseTheme.shape.borderRadius}px ${baseTheme.shape.borderRadius}px 0`,
          },

          "&.Mui-selected": {
            background: alpha(
              baseTheme.palette.primary.main,
              baseTheme.opacity.dark
            ),
            border: "none",
            ":hover": {
              background: alpha(
                baseTheme.palette.primary.main,
                baseTheme.opacity.inactive
              ),
            },
          },
        },
      },
    },
  },
});

export default theme;
