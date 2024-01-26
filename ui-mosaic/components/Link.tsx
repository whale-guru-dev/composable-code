import NextLink from "next/link";
import { Link as MUILink } from "@mui/material";

type LinkProps = {
  href: string;
  as?: string;
  children: React.ReactNode;
};

export function Link({ href, children, as, ...props }: LinkProps) {
  return (
    <NextLink href={href} passHref>
      <MUILink {...as} {...props}>
        {children}
      </MUILink>
    </NextLink>
  );
}
