import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    opacity: {
      lightest: number;
      lighter: number;
      light: number;
      main: number;
      dark: number;
      active: number;
      inactive: number;
    };
    lineHeight: {
      large: string;
      medium: string;
      small: string;
    };
    fontFamily: {
      primary: string;
      secondary: string;
      other: string;
    };
  }

  interface Palette {
    in_progress?: {
      main?: string;
      dark?: string;
      light?: string;
    };
    other: {
      background: {
        n1: string;
        n2: string;
        n3: string;
        n4: string;
        n5: string;
        n6: string;
        n7: string;
      };
      border: {
        d1: string;
        d2: string;
      };
      featured: {
        main: string;
        dark: string;
        light: string;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    opacity?: {
      lightest?: number;
      lighter?: number;
      light?: number;
      main?: number;
      dark?: number;
      active?: number;
      inactive?: number;
    };
    lineHeight?: {
      large?: string;
      medium?: string;
      small?: string;
    };
    fontFamily?: {
      primary?: string;
      secondary?: string;
      other?: string;
    };
  }

  interface PaletteOptions {
    in_progress?: {
      main?: string;
      dark?: string;
      light?: string;
    };
    other?: {
      background?: {
        n1?: string;
        n2?: string;
        n3?: string;
        n4?: string;
        n5?: string;
        n6?: string;
        n7?: string;
      };
      border?: {
        d1?: string;
        d2?: string;
      };
      featured?: {
        main?: string;
        dark?: string;
        light?: string;
      };
      alert?: {
        primary?: string,
        primary10?: string
      }
    };
  }
}

// add custom typography variants
declare module "@mui/material/styles" {
  interface TypographyVariants {
    hero: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    hero?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    hero: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    phantom: true;
  }
}

/** This is customized version of theme for whole application. To use Composable Finance theme add MuiThemeProvider at the top level of your app, it will set the custom styles down to the component tree.
 *  More info: Material-ui theming
 */

// create basic theme with basic design options
const baseTheme = createTheme({
  spacing: 8,
  palette: {
    background: {
      default: "#FFFFFF",
      paper: "#210317",
    },
    primary: {
      light: "#FF31B9",
      main: "#C90E8A",
      dark: "#950063",
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#FF31B9",
      main: alpha("#FFFFFF", 0.15),
      dark: alpha("#FFFFFF", 0.4),
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#E10000",
    },
    success: {
      main: "#00C60D",
    },
    info: {
      main: "#E9D100",
    },
    warning: {
      main: "#00FFFF",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.6)",
      disabled: "rgba(255, 255, 255, 0.4)",
    },
    in_progress: {
      main: "#02a4ff",
    },
    other: {
      background: {
        n1: "#070105",
        n2: "#170010",
        n3: "#210317",
        n4: "#2D041F",
        n5: "rgba(225, 0, 0, 0.1)",
        n6: "linear-gradient(180deg, rgba(18, 12, 16, 0.8) 0%, rgba(28, 0, 18, 0.8) 82.99%)",
        n7: "rgba(201, 14, 138, 0.5)",
      },
      border: {
        d1: "rgba(255, 255, 255, 0.1)",
        d2: "rgba(201, 14, 138, 0.2)",
      },
      featured: {
        main: "#00FF94",
      },
      alert: {
        primary: "#FF9900",
        primary10: "rgba(255, 153, 0, 0.1)"
      }
    },
  },
  mixins: {
    toolbar: {},
  },
  shape: {
    borderRadius: 8,
  },
  zIndex: {
    drawer: 1200,
  },
  opacity: {
    lightest: 0.03,
    lighter: 0.15,
    light: 0.2,
    main: 0.07,
    dark: 0.5,
    active: 1,
    inactive: 0.6,
  },
  lineHeight: {
    small: "120%",
    medium: "130%",
    large: "140%",
  },
  fontFamily: {
    primary: "Konnect",
    secondary: "Crimson Text",
  },
});

export default baseTheme;
