export const navItems = (auth: boolean) => {
  const items = [
    {
      title: "Home",
      url: "/",
      exact: true,
    },
    {
      title: "Create",
      url: "/create",
      exact: false,
      startsWith: "/ink/",
    },
    {
      title: "Collections",
      url: "/collections",
      startsWith: "/collection",
      exact: false,
    },
    {
      title: "I'm Feeling Lucky",
      url: "/lucky",
      exact: true,
    },
  ];

  return items;
};
