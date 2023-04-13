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
      title: "I'm Feeling Lucky",
      url: "/lucky",
      exact: true,
    },
  ];

  if (auth) {
    const item = items.pop();
    items.push(
      {
        title: "My Collections",
        url: "/collections",
        exact: true,
      },
      item!
    );
  }

  return items;
};
