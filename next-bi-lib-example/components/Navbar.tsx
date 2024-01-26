import Link from "next/link";

export const Navbar = () => {
  const navLinks = [
    {
      name: "Provide liquidity",
      path: "/provideliquidity",
    },
    {
      name: "Swap",
      path: "/swap",
    },
  ];

  return (
    <>
      <div style={{ display: "flex" }}>
        {navLinks.map((
          link: any, index: number
        ) => <div key={index} style={{ padding: "30px" }}><Link href={link.path}>{link.name}</Link></div>)}
      </div>
      ----------------------------------------------------------------------------------------------------------
    </>
  )
}